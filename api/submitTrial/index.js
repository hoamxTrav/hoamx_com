const sql = require("mssql");

module.exports = async function (context, req) {
  try {
    const body = req.body || {};
    const { firstName = null, email = "", hoaName = null, boardRole = null, source = "StaticWeb" } = body;

    if (!email) {
      context.res = { status: 400, body: "email required" };
      return;
    }

    const cfg = { connectionString: process.env.SQL_CONN_STRING };
    const pool = await sql.connect(cfg);

    await pool.request()
      .input("FirstName", sql.NVarChar(100), firstName)
      .input("Email",     sql.NVarChar(320), email)
      .input("HoaName",   sql.NVarChar(200), hoaName)
      .input("BoardRole", sql.NVarChar(100), boardRole)
      .input("Source",    sql.NVarChar(50),  source)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='DemoRequests' AND schema_id = SCHEMA_ID('dbo'))
        BEGIN
          CREATE TABLE dbo.DemoRequests(
            Id INT IDENTITY(1,1) PRIMARY KEY,
            FirstName NVARCHAR(100) NULL,
            Email NVARCHAR(320) NOT NULL,
            HoaName NVARCHAR(200) NULL,
            BoardRole NVARCHAR(100) NULL,
            Source NVARCHAR(50) NULL,
            CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
          );
        END;
        INSERT INTO dbo.DemoRequests(FirstName,Email,HoaName,BoardRole,Source)
        VALUES(@FirstName,@Email,@HoaName,@BoardRole,@Source);
      `);

    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: { ok: true } };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, body: "server error" };
  } finally {
    try { await sql.close(); } catch {}
  }
};
