import { formatTime, getDepartamentoHost } from '$lib/utils';
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
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  stream: true,  // Enable streaming
};

export async function fetchMarcadaDelDia(fecha: Date): Promise<Array<Record<string, any>>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();

    // Set up the query based on the department host
    const query =
      getDepartamentoHost() === 'PEAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDiaPEAP('${fecha.toISOString().substring(0, 10)}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDia('${getDepartamentoHost()}', '${fecha.toISOString().substring(0, 10)}');`;

    request.query(query);

    // Event handler for each row
    request.on('row', (row) => {
      row.Entrada = formatTime(row.Entrada);
      row.Salida = formatTime(row.Salida);
      rows.push(row); // Accumulate rows
    });

    // Handle errors
    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    // Finalize on completion
    request.on('done', () => {
      const sanitizedData = JSON.parse(JSON.stringify(rows));
      resolve(sanitizedData);
    });
  });
}

export async function getDepartamentos(): Promise<Array<Record<string, any>>> {
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

export async function fetchMarcadaEntreFechas(startDate: string, endDate: string): Promise<Array<Record<string, any>>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();
    request.stream = true;

    const query = `USE ${Bun.env.DB}; SELECT * FROM MarcadaEntreFechas('${startDate}', '${endDate}');`;
    console.log('Query fetchMarcadaEntreFechas:', query);
    request.query(query);

    request.on('row', (row) => {
      row.Marcada = formatTime(row.Marcada);
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

/* console.log(await fetchMarcadaEntreFechas('2024-01-01', '2024-01-04')); */