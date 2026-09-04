const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeypair, validateVendor, validateWallet } = require("../lib/x402-mesh");

test("generates an Ed25519 keypair with a raw 32-byte public key", () => {
  const keypair = generateKeypair();
  assert.match(keypair.public_key, /^[A-Za-z0-9_-]{43}$/);
  assert.match(keypair.private_key, /BEGIN PRIVATE KEY/);
});

test("validates Base wallet addresses", () => {
  assert.equal(validateWallet("0x0000000000000000000000000000000000000000"), true);
  assert.equal(validateWallet("not-a-wallet"), false);
});

test("validates mesh vendor registrations", () => {
  const vendor = {
    vendor_id: "startuphub",
    name: "StartupHub.ai Email Validator",
    category: "email-validation",
    endpoint: "https://www.startuphub.ai/api/v1/email/validate",
    public_key: generateKeypair().public_key,
    contact: "daniel@startuphub.ai",
    wallet: "0x0000000000000000000000000000000000000000",
  };
  assert.deepEqual(validateVendor(vendor), vendor);
});
