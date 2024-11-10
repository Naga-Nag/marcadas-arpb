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

export async function fetchMarcadaDelDia(
  fecha: string,
  sortColumn: string = 'Estado', // Default sort column
  sortOrder: 'asc' | 'desc' | undefined = 'asc' // Default order
): Promise<Array<Record<string, any>>> {

  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();

    // Modificamos el CASE en el ORDER BY para respetar el sortOrder de Estado
    const estadoOrder = sortOrder === 'desc'
      ? `CASE Estado 
           WHEN 'Completo' THEN 1 
           WHEN 'Incompleto' THEN 2 
           WHEN 'Ausente' THEN 3 
           ELSE 4 
         END`
      : `CASE Estado 
           WHEN 'Ausente' THEN 1 
           WHEN 'Incompleto' THEN 2 
           WHEN 'Completo' THEN 3 
           ELSE 4 
         END`;

    const orderByClause = sortColumn !== 'Estado' && sortOrder
      ? `, CASE WHEN ${sortColumn} IS NULL THEN 1 ELSE 0 END, ${sortColumn} ${sortOrder}`
      : '';

    const query = getDepartamentoHost() === 'PEAP'
      ? `USE ${Bun.env.DB}; 
          SELECT * 
          FROM MarcadaDelDiaPEAP('${fecha}') 
          ORDER BY ${estadoOrder}${orderByClause}`
      : `USE ${Bun.env.DB}; 
          SELECT * 
          FROM MarcadaDelDia('${getDepartamentoHost()}', '${fecha}') 
          ORDER BY ${estadoOrder}${orderByClause}`;

    request.query(query);

    // Event handler para cada fila
    request.on('row', (row) => {
      row.Entrada = formatTime(row.Entrada);
      row.Salida = formatTime(row.Salida);
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

/* console.log(await fetchMarcadaDelDia('2023-08-03', 'Estado', 'asc')); */

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