import { formatTime, fromHex, getDepartamentoHost } from '$lib/utils';
import { differenceInMilliseconds, differenceInMinutes, format, parseISO } from 'date-fns';
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


export async function fetchMarcadaDelDia(
  departamento: string,
  fecha: string,
  onBatch: (batch: Array<Record<string, any>>) => void
): Promise<void> {
  let startTime = new Date();
  let rowCount = 0;
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();

    // Set up the query based on the department host
    const query =
      departamento === 'PEAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDetallePEAP('${fecha}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDiaDetalle('${departamento}', '${fecha}');`;

    request.stream = true; // Enable streaming
    request.query(query);

    // Event handler for each row
    request.on('row', (row) => {
      // Process the row (e.g., formatting)
      row.Entrada = formatTime(row.Entrada);
      row.Salida = formatTime(row.Salida);
      row.Marcada = formatTime(row.Marcada);
      const Info = fromHex(row.Info);
      row.CUIL = Info[0] ?? '';
      row.DNI = Info[1] ?? '';
      row.JORNADA = Info[2] ? `${Info[2]} horas` : '';
      row.ACTIVO = Info[3] ?? '';

      rows.push(row);

      // Send the batch when it reaches 20 rows
      if (rows.length === 20) {
        onBatch([...rows]); // Send a copy of the batch
        rowCount += rows.length;
        rows.length = 0; // Clear rows array for the next batch
      }
    });

    // Error handler
    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    // Completion handler
    request.on('done', () => {
      // Send any remaining rows
      if (rows.length > 0) {
        onBatch([...rows]);
      }
      let endTime = new Date();
      console.log("INFO || "+'Tiempo de consulta MarcadaDelDia:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO || "+rowCount + " registros encontrados");
      resolve(); // Resolve the promise to indicate completion
    });
  });
}

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
  let startTime = new Date();
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
      let endTime = new Date();
      console.log("INFO || "+'Tiempo de consulta MarcadaEntreFechas:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO || "+ rows.length + " registros encontrados");
      resolve(sanitizedData);
    });
  });
}

/* console.log(await fetchMarcadaEntreFechas('PEAP', '2024-01-01', '2024-01-04')); */