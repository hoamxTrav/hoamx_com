module.exports = async function (context, req) {
  const ipHeader = req.headers["x-forwarded-for"] || req.headers["x-client-ip"] || "";
  const ip = (ipHeader || req.ip || "").toString().split(",")[0].trim();
  const ts = new Date().toISOString();
  context.log(`visit from ${ip} @ ${ts}`);
  context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: { ok: true, ip, ts } };
};
