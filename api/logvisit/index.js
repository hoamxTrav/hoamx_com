module.exports = async function (context, req) {
  const ip = (req.headers["x-forwarded-for"] || req.headers["x-client-ip"] || req.ip || "").split(",")[0].trim();
  const ts = new Date().toISOString();
  // TODO: persist to SQL (see submitTrial) or Table Storage if preferred
  context.log(`visit from ${ip} @ ${ts}`);
  context.res = { status: 200, jsonBody: { ok: true, ip, ts } };
};
