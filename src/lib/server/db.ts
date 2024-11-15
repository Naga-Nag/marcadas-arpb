import { formatTime, fromHex, getDepartamentoHost } from '$lib/utils';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import sql from 'mssql';

const sqlConfig = {
  user: Bun.env.DB_UID!,
  password: Bun.env.DB_PW!,
  database: Bun.env.DB!,
  server: Bun.env.DB_IP!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 3000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  stream: true,  // Enable streaming
};

/* let socket = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) { },
    open(ws) { },
    close(ws, code, reason) { },
    drain(ws) { },
  },
}); */

export async function fetchMarcadaDelDia(departamento: string, fecha: string): Promise<Array<Record<string, any>>> { 
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();
        // Set up the query based on the department host
    const query =
      departamento === 'PEAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDiaPEAP('${fecha}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDia('${departamento}', '${fecha}');`;

    request.query(query);

    // Event handler para cada fila
    request.on('row', (row) => {
      row.Entrada = formatTime(row.Entrada);
      row.Salida = formatTime(row.Salida);

      let Info = fromHex(row.Info);
      row.Info = fromHex(row.Info)
      row.CUIL = Info[0];
      row.DNI = Info[1];
      if (Info[0] != undefined) { row.CUIL = Info[0] } else { row.CUIL = '' }
      if (Info[1] != undefined) { row.DNI = Info[1] } else { row.DNI = '' }
      if (Info[2] != undefined) { row.JORNADA = Info[2] + ' horas' } else { row.JORNADA = '' }
      if (Info[3] != undefined) { row.ACTIVO = Info[3] } else { row.ACTIVO = '' }
      rows.push(row); // Acumulamos las filas
    });

    // Manejo de errores
    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    // Finalizamos al completar
    request.on('done', () => {
      const sanitizedData = JSON.parse(JSON.stringify(rows));
      resolve(sanitizedData);
    });
  });
}

/* console.log(await fetchMarcadaDelDia('PEAP','2023-08-03')); */

export async function fetchDepartamentos(): Promise<Array<Record<string, any>>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();
    request.arrayRowMode = true;

    // Define and execute the query
    const query = `USE ${Bun.env.DB}; SELECT DeptName FROM Dept;`;
    request.query(query);

    request.on('row', (row) => {
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      resolve(rows);
    });
  });
}

export async function fetchMarcadaDetalle(uid: number, fecha: Date) {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();

    // Set up the query for detailed data
    const query = `USE ${Bun.env.DB}; SELECT * FROM dbo.MarcadaDetalle(${uid}, '${fecha.toISOString().substring(0, 10)}');`;
    request.query(query);

    request.on('row', (row) => {
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      // Process rows with filtering logic for time differences
      const resultCurado = [];
      for (let i = 0; i < rows.length; i++) {
        const currentRecord = rows[i];

        // Always add the last record
        if (i === rows.length - 1) {
          resultCurado.push(currentRecord);
          continue;
        }

        const nextRecord = rows[i + 1];
        const timeDiff = differenceInMinutes(parseISO(nextRecord.Marcada), parseISO(currentRecord.Marcada));

        // Skip records within 5 minutes of each other
        if (timeDiff >= 5) {
          resultCurado.push(currentRecord);
        }
      }

      resolve(resultCurado);
    });
  });
}

export async function fetchMarcadaEntreFechas(departamento: string, startDate: string, endDate: string): Promise<Array<Record<string, any>>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();
    request.stream = true;

    const query =
      departamento === 'PEAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaEntreFechasPEAP('${startDate}', '${endDate}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaEntreFechas('${departamento}', '${startDate}', '${endDate}');`;

    console.log('Query fetchMarcadaEntreFechas:', query);
    request.query(query);

    request.on('row', (row) => {
      row.Marcada = formatTime(row.Marcada);
      let Info = fromHex(row.Info);
      row.Info = fromHex(row.Info)
      row.CUIL = Info[0];
      row.DNI = Info[1];
      if (Info[0] != undefined) { row.CUIL = Info[0] } else { row.CUIL = '' }
      if (Info[1] != undefined) { row.DNI = Info[1] } else { row.DNI = '' }
      if (Info[2] != undefined) { row.JORNADA = Info[2] + ' horas' } else { row.JORNADA = '' }
      if (Info[3] != undefined) { row.ACTIVO = Info[3] } else { row.ACTIVO = '' }
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      const sanitizedData = JSON.parse(JSON.stringify(rows));
      resolve(sanitizedData);
    });
  });
}

/* console.log(await fetchMarcadaEntreFechas('PEAP', '2024-01-01', '2024-01-04')); */