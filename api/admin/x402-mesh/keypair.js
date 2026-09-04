const { generateKeypair, getPublicKey } = require("../../../lib/x402-mesh");

function authorized(req) {
  const expected = process.env.X402_MESH_ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.authorization || "";
  return header === `Bearer ${expected}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!authorized(req)) return res.status(401).json({ error: "unauthorized" });

  if (process.env.X402_MESH_PRIVATE_KEY) {
    return res.status(200).json({
      protocol: "x402-mesh/0.1",
      algorithm: "Ed25519",
      public_key: getPublicKey(),
      private_key_configured: true,
      message: "Signing key is configured in server-side environment storage; the private key is never returned.",
    });
  }

  const keypair = generateKeypair();
  return res.status(200).json({
    protocol: "x402-mesh/0.1",
    algorithm: "Ed25519",
    public_key: keypair.public_key,
    private_key: keypair.private_key,
    next_step: "Store the private_key as X402_MESH_PRIVATE_KEY and public_key as X402_MESH_PUBLIC_KEY in the deployment secret manager. Do not commit either value.",
  });
};
