import sql from 'mssql';

const sqlConfig = {
  user: Bun.env.DB_UID!,
  password: Bun.env.DB_PW!,
  database: Bun.env.DB!,
  server: Bun.env.DB_IP!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function fetchPresentismoData() {
  try {
    await sql.connect(sqlConfig);

    const result = await sql.query('SELECT * FROM Presentismo');

    // Handle potential circular references or complex data structures
    const sanitizedData = JSON.parse(JSON.stringify(result.recordset));
    return sanitizedData;
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}

export default fetchPresentismoData;