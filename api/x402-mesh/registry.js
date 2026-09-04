const { getRegistry, putRegistry, validateVendor } = require("../../lib/x402-mesh");

function sendError(res, status, error, message) {
  return res.status(status).json({ protocol: "x402-mesh/0.1", error, message });
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return sendError(res, 405, "method_not_allowed", "Use GET or POST");
  }

  try {
    const registry = await getRegistry();
    if (req.method === "GET") return res.status(200).json(registry);

    const vendor = validateVendor(req.body);
    const vendors = registry.vendors.filter((entry) => entry.vendor_id !== vendor.vendor_id);
    const registered = {
      ...vendor,
      registered_at: new Date().toISOString(),
    };
    vendors.push(registered);
    const next = { protocol: "x402-mesh/0.1", category: registry.category ?? null, vendors };
    await putRegistry(next);
    return res.status(201).json({ protocol: "x402-mesh/0.1", vendor: registered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "registry operation failed";
    const status = message.includes("storage is not configured") ? 503 : 400;
    return sendError(res, status, status === 503 ? "storage_unavailable" : "invalid_request", message);
  }
};
