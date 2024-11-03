import { getDepartamentoHost } from '$lib/utils';
import { differenceInMinutes, parseISO } from 'date-fns';
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
    
    if (getDepartamentoHost() === 'PEAP') {
      var result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT * FROM MarcadaDelDiaPEAP('" + fecha.toISOString().substring(0, 10) + "');");
    }
    else {
      result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT * FROM dbo.MarcadaDelDia('" + getDepartamentoHost() + "', '" + fecha.toISOString().substring(0, 10) + "');");
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
    var result = await sql.query("USE " + Bun.env.DB + ";" + "SELECT DeptName FROM Dept;");
    return result.recordset;
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}

export async function fetchMarcadaDetalle(uid: number, fecha: Date) {
  try {
    await sql.connect(sqlConfig);

    // Consulta a la base de datos
    var result = await sql.query("USE " + Bun.env.DB + ";" +
      "SELECT * FROM dbo.MarcadaDetalle(" + uid + ", '" + fecha.toISOString().substring(0, 10) + "');");

    const data = result.recordset;
    if (!data.length) return [];

    const sanitizedData = JSON.parse(JSON.stringify(data));

    // Inicializamos la variable que guardará el resultado final
    const resultCurado = [];

    for (let i = 0; i < sanitizedData.length; i++) {
      const currentRecord = sanitizedData[i];

      // Siempre añadir el último registro
      if (i === sanitizedData.length - 1) {
        resultCurado.push(currentRecord);
        continue;
      }

      const nextRecord = sanitizedData[i + 1];

      // Calculamos la diferencia en minutos entre el registro actual y el siguiente
      const timeDiff = differenceInMinutes(parseISO(nextRecord.Marcada), parseISO(currentRecord.Marcada));

      // Si la diferencia de tiempo es menor a 5 minutos, se ignora el registro actual y no se añade
      if (timeDiff >= 5) {
        resultCurado.push(currentRecord);
      }
    }

    return resultCurado;

  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
}