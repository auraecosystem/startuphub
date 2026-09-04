const crypto = require("node:crypto");

const PROTOCOL = "x402-mesh/0.1";
const REGISTRY_KEY = "x402-mesh:registry";
const STARTUPHUB_VENDOR = {
  vendor_id: "startuphub",
  name: "StartupHub.ai Email Validator",
  category: "email-validation",
  endpoint: "https://www.startuphub.ai/api/v1/email/validate",
  public_key: "eDM_J-hX6KlZbxuAp77WlQe9RqloBceOjeZwKcXYMIc",
  contact: "daniel@startuphub.ai",
};
const DEFAULT_REGISTRY = {
  protocol: PROTOCOL,
  category: null,
  vendors: [STARTUPHUB_VENDOR],
};

function env(name, fallback = undefined) {
  return process.env[name] ?? fallback;
}

function publicKeyFromPrivateKey(privateKeyPem) {
  const key = crypto.createPrivateKey(privateKeyPem);
  const publicKey = crypto.createPublicKey(key).export({ type: "spki", format: "der" });
  return Buffer.from(publicKey.subarray(-32)).toString("base64url");
}

function generateKeypair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const publicDer = publicKey.export({ type: "spki", format: "der" });
  return {
    public_key: Buffer.from(publicDer.subarray(-32)).toString("base64url"),
    private_key: privateKey.export({ type: "pkcs8", format: "pem" }),
  };
}

function getPrivateKey() {
  const value = env("X402_MESH_PRIVATE_KEY");
  if (!value) throw new Error("X402_MESH_PRIVATE_KEY is not configured");
  return value.replace(/\\n/g, "\n");
}

function getPublicKey() {
  const configured = env("X402_MESH_PUBLIC_KEY");
  return configured || publicKeyFromPrivateKey(getPrivateKey());
}

function validateWallet(wallet) {
  return typeof wallet === "string" && /^0x[a-fA-F0-9]{40}$/.test(wallet);
}

function validateVendor(vendor) {
  if (!vendor || typeof vendor !== "object") throw new Error("vendor must be an object");
  for (const field of ["vendor_id", "name", "category", "endpoint", "public_key", "contact"]) {
    if (typeof vendor[field] !== "string" || vendor[field].length === 0) throw new Error(`${field} is required`);
  }
  if (!/^[a-z0-9][a-z0-9-_.]{1,63}$/.test(vendor.vendor_id)) throw new Error("vendor_id must be a lowercase slug");
  if (!/^https:\/\//.test(vendor.endpoint)) throw new Error("endpoint must use HTTPS");
  if (!/^[A-Za-z0-9_-]{43}$/.test(vendor.public_key)) throw new Error("public_key must be an Ed25519 raw public key in base64url form");
  if (vendor.wallet !== undefined && !validateWallet(vendor.wallet)) throw new Error("wallet must be a Base-compatible 0x address");
  return vendor;
}

async function kvCommand(command) {
  const url = env("UPSTASH_REDIS_REST_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`registry storage returned ${response.status}`);
  const body = await response.json();
  return body.result ?? null;
}

function staticRegistry() {
  const configured = env("X402_MESH_REGISTRY_JSON");
  if (!configured) return DEFAULT_REGISTRY;
  try {
    return JSON.parse(configured);
  } catch {
    throw new Error("X402_MESH_REGISTRY_JSON is invalid JSON");
  }
}

async function getRegistry() {
  const stored = await kvCommand(["GET", REGISTRY_KEY]);
  if (stored) return JSON.parse(stored);
  return staticRegistry();
}

async function putRegistry(registry) {
  if (!env("UPSTASH_REDIS_REST_URL") || !env("UPSTASH_REDIS_REST_TOKEN")) {
    throw new Error("Persistent registry storage is not configured; set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN");
  }
  await kvCommand(["SET", REGISTRY_KEY, JSON.stringify(registry)]);
  return registry;
}

function signCompactJws(payload) {
  const header = { alg: "EdDSA", typ: "x402-mesh-referral" };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const protectedPart = encode(header);
  const payloadPart = encode(payload);
  const signingInput = `${protectedPart}.${payloadPart}`;
  const signature = crypto.sign(null, Buffer.from(signingInput), crypto.createPrivateKey(getPrivateKey()));
  return `${signingInput}.${signature.toString("base64url")}`;
}

function peerPricelist(registry, selfVendorId, category) {
  return registry.vendors
    .filter((vendor) => vendor.vendor_id !== selfVendorId && (!category || vendor.category === category))
    .map((vendor) => ({
      vendor_id: vendor.vendor_id,
      name: vendor.name,
      category: vendor.category,
      endpoint: vendor.endpoint,
      public_key: vendor.public_key,
      wallet: vendor.wallet,
      price: vendor.metadata?.price ?? null,
      quality: vendor.metadata?.quality ?? null,
    }))
    .sort((a, b) => Number(a.price?.amount_cents ?? Number.MAX_SAFE_INTEGER) - Number(b.price?.amount_cents ?? Number.MAX_SAFE_INTEGER));
}

async function buildMesh402({ vendorId, category, resource, price, requestId }) {
  const registry = await getRegistry();
  const peers = peerPricelist(registry, vendorId, category);
  const now = Math.floor(Date.now() / 1000);
  const referrals = peers.map((peer) => ({
    vendor_id: peer.vendor_id,
    endpoint: peer.endpoint,
    token: signCompactJws({
      iss: vendorId,
      sub: "referral",
      aud: peer.vendor_id,
      category,
      resource,
      ...(requestId ? { request_id: requestId } : {}),
      iat: now,
      exp: now + 900,
    }),
  }));
  return {
    protocol: PROTOCOL,
    payment_required: true,
    vendor_id: vendorId,
    category,
    resource,
    price,
    peers,
    referrals,
  };
}

function setMeshHeaders(res, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-X402-Mesh-Protocol", PROTOCOL);
  res.setHeader("X-X402-Mesh-Referrals", Buffer.from(JSON.stringify(body.referrals || [])).toString("base64url"));
}

module.exports = {
  PROTOCOL,
  generateKeypair,
  getPublicKey,
  getPrivateKey,
  validateVendor,
  validateWallet,
  getRegistry,
  putRegistry,
  buildMesh402,
  setMeshHeaders,
};
