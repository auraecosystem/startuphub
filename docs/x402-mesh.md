# x402-mesh integration

StartupHub participates in x402-mesh/0.1 as the `startuphub` email-validation vendor.

## Server secrets

Configure these in the deployment secret manager, never in Git:

- `X402_MESH_ADMIN_TOKEN`: bearer token required by `GET /api/admin/x402-mesh/keypair`.
- `X402_MESH_PRIVATE_KEY`: Ed25519 PKCS#8 PEM used to sign referral tokens.
- `X402_MESH_PUBLIC_KEY`: raw Ed25519 public key encoded as base64url. It must match the private key.
- `X402_MESH_WALLET`: optional Base `0x` payout address used during registry registration.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: persistent registry storage. Without these, GET can use `X402_MESH_REGISTRY_JSON`, but POST registration returns `503` rather than pretending writes are durable.

The existing StartupHub public key is published in the x402-mesh registry and manifest. If the signing key is rotated, update `X402_MESH_PUBLIC_KEY` and republish the manifest/registry entry atomically.

## Keypair bootstrap

Call the admin endpoint with its bearer token:

```bash
curl -H "Authorization: Bearer $X402_MESH_ADMIN_TOKEN" \
  https://www.startuphub.ai/api/admin/x402-mesh/keypair
```

If no server key exists, the response contains a generated Ed25519 keypair. Store the private key in deployment secrets immediately; it is never written to the repository.

## Registration

Register StartupHub against the public registry with the same public key used for referral signing. Add the Base wallet only when it is a real payout address:

```bash
curl -X POST https://www.startuphub.ai/api/x402-mesh/registry \
  -H 'Content-Type: application/json' \
  -d '{
    "vendor_id":"startuphub",
    "name":"StartupHub.ai Email Validator",
    "category":"email-validation",
    "endpoint":"https://www.startuphub.ai/api/v1/email/validate",
    "public_key":"YOUR_ED25519_PUBLIC_KEY",
    "contact":"daniel@startuphub.ai",
    "wallet":"0xYOUR_BASE_ADDRESS",
    "metadata":{
      "price":{"unit":"per_call","currency":"USD","amount_cents":0},
      "quality":{"accuracy":0.95,"p95_latency_ms":250}
    }
  }'
```

## Paywall integration

The shared helper in `lib/x402-mesh.js` exposes `buildMesh402()`. When an API operation cannot proceed because payment is required, call it with the resource, category, current price and request ID, then return HTTP `402` and pass the resulting body through `setMeshHeaders()`.

The response contains the StartupHub price, peer offers discovered from the registry, and short-lived Ed25519-signed referral tokens for alternative vendors. Referral tokens expire after 15 minutes and contain no secret material.

The helper deliberately does not alter an existing API route automatically: the payment boundary must be inserted at the actual paid service handler so that authentication, idempotency, payment verification and business logic remain in one place.
