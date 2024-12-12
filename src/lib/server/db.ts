import type { Marcada, Usuario } from '$lib/utils/types';
import { formatTime } from '$lib/utils/utils';
import { differenceInMilliseconds, differenceInMinutes, format, parseISO } from 'date-fns';
import sql from 'mssql';

const sqlConfig = {
  user: Bun.env.DB_UID!,
  password: Bun.env.DB_PW!,
  database: Bun.env.DB!,
  server: Bun.env.DB_IP!,
  pool: {
    max: 20,
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
      departamento === 'PEAP' || departamento === 'IFAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDiaPEAP('${fecha}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDelDia('${departamento}', '${fecha}');`;

    request.stream = true; // Enable streaming
    request.query(query);

    // Event handler for each row
    request.on('row', (row) => {
      processRow(row);
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
      console.log("INFO || " + 'Tiempo de consulta MarcadaDelDia:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO || " + rowCount + " registros encontrados");
      resolve(); // Resolve the promise to indicate completion
    });
  });
}

/* console.log(await fetchMarcadaDelDia('TAAP', '2023-08-03' , (batch) => {console.log(batch)})); */

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
      rows.push(row[0]);
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

export async function fetchMarcadaDetalle(departamento: string, fecha: string): Promise<Array<Marcada>> {
  let startTime = new Date();
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Marcada> = [];
    const request = new sql.Request();

    // Set up the query for detailed data
    const query =
      departamento === 'PEAP' || departamento === 'IFAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDetallePEAP('${fecha}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDetalle('${departamento}', '${fecha}');`;

    request.query(query);

    request.on('row', (row) => {
      processRow(row);
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('db.ts || Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      let endTime = new Date();
      console.log("INFO || " + 'Tiempo de consulta MarcadaDetalle:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO || " + rows.length + " registros encontrados");
      resolve(rows);
    });
  });
}


export async function modUsuario(Usuario: Usuario) {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    // Foto aun no implementado
    const query = `USE ${Bun.env.DB}; UPDATE UserInfo SET 
      Name = '${Usuario.Nombre}',
      Departamento = '${Usuario.Departamento}',
      CUIL = '${Usuario.CUIL}',
      Jornada = '${Usuario.Jornada}',
      Activo = '${Usuario.Activo}'
      WHERE Userid = '${Usuario.UID}';`;

    request.query(query);

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      resolve(true);
    });
  });
}

export async function fetchMarcadaEntreFechas(departamento: string, startDate: string, endDate: string): Promise<Array<Marcada>> {
  let startTime = new Date();
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Marcada> = [];
    const request = new sql.Request();
    request.stream = true;

    const query =
      departamento === 'PEAP' || departamento === 'IFAP'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaEntreFechasPEAP('${startDate}', '${endDate}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaEntreFechas('${departamento}', '${startDate}', '${endDate}');`;

    console.log('Query fetchMarcadaEntreFechas:', query);
    request.query(query);

    request.on('row', (row) => {
      processRow(row);
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      let endTime = new Date();
      console.log("INFO || " + 'Tiempo de consulta MarcadaEntreFechas:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO || " + rows.length + " registros encontrados");
      resolve(rows);
    });
  });
}

export async function updateUsuario(MR: string, CUIL?: string, Jornada?: string, Activo?: string, Nombre?: string) {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();

    // Set up the query for detailed data
    const query = `USE ${Bun.env.DB}; UPDATE UserInfo SET 
      ${CUIL ? `CUIL = '${CUIL}',` : ''}
      ${Jornada ? `Jornada = '${Jornada}',` : ''}
      ${Activo ? `Activo = '${Activo}',` : ''}
      ${Nombre ? `Name = '${Nombre}'` : ''}
      WHERE UserCode = '${MR}';`;

    request.query(query);

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      resolve(true);
    });
  });
}

async function UserfromUID(uid: string): Promise<Record<string, any>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    request.arrayRowMode = true;
    // Set up the query for detailed data
    const query = `USE ${Bun.env.DB}; SELECT * FROM UserInfo WHERE Userid = '${uid}';`;

    request.query(query);

    request.on('row', (row) => {
      resolve(row[0]);
    });

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });
  });
}

function processRow(row: any) {
  row.Entrada = formatTime(row.Entrada);
  row.Salida = formatTime(row.Salida);
  row.Marcada = formatTime(row.Marcada);
  
  row.CUIL = row.CUIL ? row.CUIL : '';
  row.Jornada = row.Jornada ? row.Jornada : '';
  row.Activo = row.Activo ? row.Activo : '';
  return row;
}

/* console.log(await fetchMarcadaEntreFechas('PEAP', '2024-01-01', '2024-01-04')); */