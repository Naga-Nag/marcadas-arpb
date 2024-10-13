import { getDepartamentoHost } from '$lib/utils';
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


export async function fetchMarcadaDelDia(fecha: Date) {
  try {
    await sql.connect(sqlConfig);
    /* if (Bun.env.build === 'dev') {
      fecha = new Date('2023-09-25');
    } */

    var result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT * FROM dbo.MarcadaDelDia('" + getDepartamentoHost() + "', '" + fecha.toISOString().substring(0, 10) + "');");

    if (getDepartamentoHost() === 'PEAP') {
      result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT * FROM MarcadaDelDiaPEAP('" + fecha.toISOString().substring(0, 10) + "');");
    }

    // Handle potential circular references or complex data structures
    const sanitizedData = JSON.parse(JSON.stringify(result.recordset));
    return sanitizedData;
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}

export async function getDepartamentos() {
  try {
    var result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT DeptName FROM Dept WHERE DeptName != 'ARPB';");
    return result.recordset;
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}