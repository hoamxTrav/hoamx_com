const sql = require("mssql");

module.exports = async function (context, req) {
  try {
    const { firstName, email, hoaName, boardRole, source } = req.body || {};
    if(!email) return (context.res = { status: 400, body: "email required" });

    const cfg = {
      connectionString: process.env.SQL_CONN_STRING
    };
    const pool = await sql.connect(cfg);
    await pool.request()
      .input("FirstName", sql.NVarChar(100), firstName || null)
      .input("Email",     sql.NVarChar(320), email)
      .input("HoaName",   sql.NVarChar(200), hoaName || null)
      .input("BoardRole", sql.NVarChar(100), boardRole || null)
      .input("Source",    sql.NVarChar(50),  source || "StaticWeb")
      .query(`
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='DemoRequests')
          CREATE TABLE dbo.DemoRequests(
            Id INT IDENTITY(1,1) PRIMARY KEY,
            FirstName NVARCHAR(100),
            Email NVARCHAR(320) NOT NULL,
            HoaName NVARCHAR(200),
            BoardRole NVARCHAR(100),
            Source NVARCHAR(50),
            CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
          );
        INSERT INTO dbo.DemoRequests(FirstName,Email,HoaName,BoardRole,Source)
        VALUES(@FirstName,@Email,@HoaName,@BoardRole,@Source);
      `);

    context.res = { status: 200, jsonBody: { ok:true } };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, body: "server error" };
  } finally {
    sql.close();
  }
};
