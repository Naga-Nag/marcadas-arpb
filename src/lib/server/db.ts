import type { Marcada, shortWebUser, Usuario } from '$lib/types/gen';
import { formatTime } from '$lib/utils/utils';
import { differenceInMilliseconds, differenceInMinutes, format, parseISO } from 'date-fns';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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


/**
 * Fetches MarcadaDelDia records from the database, streaming them to the provided
 * onBatch callback in batches of 20 records. The callback is called with a copy of
 * the batch array, which is then cleared for the next batch.
 *
 * @param {string} departamento - The department name to fetch records for
 * @param {string} fecha - The date to fetch records for in ISO 8601 format
 * @param {function} onBatch - The callback to call with each batch of records
 * @returns {Promise<void>} A promise that resolves when all records have been
 *   processed
 */
export async function fetchMarcadaDelDia(
  departamento: string,
  fecha: string,
  onBatch: (batch: Array<Record<string, any>>) => void
): Promise<void> {
  let startTime = new Date();
  let rowCount = 0;
  await sql.connect(sqlConfig);

  return new Promise(async (resolve, reject) => {
    const rows: Array<Record<string, any>> = [];
    const request = new sql.Request();

    // Set up the query based on the department host
    const query =
      departamento === 'ARPB'
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
      console.log("INFO db :: " + 'Tiempo de consulta MarcadaDelDia:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO db :: " + rowCount + " registros encontrados");
      resolve(); // Resolve the promise to indicate completion
    });
  });
}

/* console.log(await fetchMarcadaDelDia('TAAP', '2023-08-03' , (batch) => {console.log(batch)})); */

/**
 * Fetches an array of department names from the database.
 * @returns {Promise<Array<Record<string, any>>>} A promise that resolves to an array of department names.
 */
export async function fetchDepartamentos(): Promise<Array<Record<string, any>>> {
  await sql.connect(sqlConfig);

  return new Promise(async (resolve, reject) => {
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

/**
 * Fetches an array of detailed user records for a given department and date.
 * @param {string} departamento The department name.
 * @param {string} fecha The date in 'YYYY-MM-DD' format.
 * @returns {Promise<Array<Marcada>>} A promise that resolves to an array of detailed user records.
 */
export async function fetchMarcadaDetalle(departamento: string, fecha: string): Promise<Array<Marcada>> {
  let startTime = new Date();
  await sql.connect(sqlConfig);

  return new Promise(async (resolve, reject) => {
    const rows: Array<Marcada> = [];
    const request = new sql.Request();

    // Set up the query for detailed data
    const query =
      departamento === 'ARPB'
        ? `USE ${Bun.env.DB}; SELECT * FROM MarcadaDetallePEAP('${fecha}');`
        : `USE ${Bun.env.DB}; SELECT * FROM MarcadaDetalle('${departamento}', '${fecha}');`;

    request.query(query);

    request.on('row', (row) => {
      processRow(row);
      rows.push(row);
    });

    request.on('error', (err) => {
      console.error('db.ts db :: Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      let endTime = new Date();
      console.log("INFO db :: " + 'Tiempo de consulta MarcadaDetalle:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO db :: " + rows.length + " registros encontrados");
      resolve(rows);
    });
  });
}


/**
 * Modifica un usuario en la base de datos.
 * @param {Usuario} Usuario El objeto con los datos del usuario a modificar.
 * @returns {Promise<boolean>} Un promise que se resuelve a true si se modifico correctamente, o rechaza con un error si hubo un problema.
 */
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

/**
 * Fetches an array of Marcada records from the database between two dates.
 * @param {string} departamento - The department name to fetch records for.
 * @param {string} startDate - The start date to fetch records from, in ISO 8601 format.
 * @param {string} endDate - The end date to fetch records to, in ISO 8601 format.
 * @returns {Promise<Array<Marcada>>} A promise that resolves to an array of Marcada records.
 */
export async function fetchMarcadaEntreFechas(departamento: string, startDate: string, endDate: string): Promise<Array<Marcada>> {
  let startTime = new Date();
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const rows: Array<Marcada> = [];
    const request = new sql.Request();
    request.stream = true;

    const query =
      departamento === 'ARPB'
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
      console.log("INFO db :: " + 'Tiempo de consulta MarcadaEntreFechas:', differenceInMilliseconds(endTime, startTime) + 'ms');
      console.log("INFO db :: " + rows.length + " registros encontrados");
      resolve(rows);
    });
  });
}

/**
 * Updates a user in the database using the information from a Marcada record.
 * @param {Marcada} marcadaRow The Marcada record to update the user with.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful.
 */
export async function updateUsuarioFromMarcada(marcadaRow: Marcada) {
  await sql.connect(sqlConfig);

  return new Promise(async (resolve, reject) => {
    const request = new sql.Request();

    // Set up the query for detailed data
    const { UID, MR, CUIL, Jornada, Activo, Nombre, Departamento } = marcadaRow;
    let Deptid = await DeptIDfromDepartamento(Departamento);

    const query = `USE ${Bun.env.DB}; UPDATE UserInfo SET
      ${MR ? `UserCode = '${MR}',` : ''}
      ${CUIL ? `CUIL = '${CUIL}',` : ''}
      ${Jornada ? `Jornada = '${Jornada}',` : ''}
      ${Activo ? `Activo = '${Activo}',` : ''}
      ${Nombre ? `Name = '${Nombre}'` : ''}
      ${Departamento ? `, Deptid = '${Deptid}'` : ''}
      WHERE Userid = '${UID}';`;

    request.query(query);

    console.log('db.ts :: Query updateUsuarioFromMarcada:', query);

    request.on('error', (err) => {
      console.error('Error fetching data:', err);
      reject(err);
    });

    request.on('done', () => {
      resolve(true);
    });
  });
}

/**
 * Fetches a user record from the database given its Userid.
 * @param {string} uid The Userid of the user to fetch.
 * @returns {Promise<Record<string, any>>} A promise that resolves to the user record.
 */
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

async function DepartamentofromDeptid(deptid: string): Promise<Record<string, any>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    request.arrayRowMode = true;
    // Set up the query for detailed data
    const query = `USE ${Bun.env.DB}; SELECT DeptName FROM Dept WHERE Deptid = '${deptid}';`;

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

async function DeptIDfromDepartamento(departamento: string): Promise<Record<string, any>> {
  await sql.connect(sqlConfig);

  return new Promise((resolve, reject) => {
    const request = new sql.Request();
    request.arrayRowMode = true;
    // Set up the query for detailed data
    const query = `USE ${Bun.env.DB}; SELECT Deptid FROM Dept WHERE DeptName = '${departamento}';`;

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

/**
 * Processes a row of data to format it properly for display in a Svelte component.
 * @param {any} row The row of data to process.
 * @returns {any} The processed row of data.
 */
function processRow(row: any) {
  row.Entrada = formatTime(row.Entrada);
  row.Salida = formatTime(row.Salida);
  row.Marcada = formatTime(row.Marcada);

  row.MR = row.MR ? row.MR : '';
  row.CUIL = row.CUIL ? row.CUIL : '';
  row.Jornada = row.Jornada ? row.Jornada : '';
  row.Activo = (row.Activo === null) ? 'No definido' : (row.Activo) ? 'SI' : 'NO';
  return row;
}

/* console.log(await fetchMarcadaEntreFechas('PEAP', '2024-01-01', '2024-01-04')); */

/**
 * Registers a new user in the database.
 * @param {string} username The username for the new user.
 * @param {string} password The plaintext password for the new user.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully
 * registered.
 */
export async function registerWebUser(username: string, password: string, role: string, departamento: string) {
  const password_hash = await bcrypt.hash(password, 10);

  try {
    await sql.connect(sqlConfig);
    console.log("DB :: registerWebUser:", username, role, departamento);

    return new Promise((resolve, reject) => {
      const request = new sql.Request();

      // Parameterized query to prevent SQL injection
      const query = `
        INSERT INTO dbo.WebUsers (username, password, role, departamento, departamentosPermitidos) 
        VALUES (@username, @password_hash, @role, @departamento, @departamento);
      `;

      request.input("username", sql.VarChar, username);
      request.input("password_hash", sql.VarChar, password_hash);
      request.input("role", sql.VarChar, role);
      request.input("departamento", sql.VarChar, departamento);

      request.query(query);

      request.on("done", () => {
        resolve(true);
      });

      request.on("error", (err) => {
        console.error("DB :: registerWebUser: SQL Error:", err);
      });
    });

  } catch (err) {
    console.error("Error in registerWebUser:", err);
    throw new Error("Registration failed");
  }
}

/**
 * Authenticates a web user by verifying the provided username and password.
 * If successful, generates a JSON Web Token (JWT) for the user.
 *
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The plaintext password of the user.
 * @returns {Promise<string | { token: string; }>} A promise that resolves to an object containing
 * a JWT token if authentication is successful, or rejects with an error message if authentication fails.
 */
import type { WebUser } from '$lib/types/gen';
export async function loginWebUser(username: string, password: string): Promise<WebUser | { error: string }> {
  try {
    await sql.connect(sqlConfig);
    console.log("DB :: loginWebUser:", username, password);

    return new Promise((resolve, reject) => {
      const request = new sql.Request();

      request.input("username", sql.VarChar, username);
      const query = "SELECT * FROM dbo.WebUsers WHERE username = @username;";

      let userFound = false;

      request.query(query);

      request.on("row", async (row) => {
        console.log("DB :: loginWebUser row:", row);
        userFound = true;

        try {
          const isPasswordValid = await bcrypt.compare(password, row.password);
          if (!isPasswordValid) {
            console.warn("DB :: loginWebUser: Invalid password");
            return reject(new Error("Invalid password"));
          }

          if (!Bun.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
          }

          const token = jwt.sign({ username }, Bun.env.JWT_SECRET, { expiresIn: "1h" });
          console.log("DB :: loginWebUser: JWT issued");


          //** Esta sentencia envia la informacion del objeto usuario al endpoint */
          //**
          // ? Me conviene mandar esta informacion? o mandar solamente un success o algo asi y luego mandar la info del user con fetchUser sin ningun secreto*/
          resolve({
            id: row.id,
            username: row.username,
            password: row.password,
            role: row.role,
            departamento: row.departamento,
            departamentosPermitidos: row.departamentosPermitidos,
            token: token
          });
        } catch (error) {
          console.error("Error comparing passwords:", error);
          reject(error);
        }
      });

      request.on("done", () => {
        if (!userFound) {
          console.warn("DB :: loginWebUser: User not found");
          reject(new Error("User not found"));
        }
      });

      request.on("error", (err) => {
        console.error("DB :: loginWebUser: SQL Error:", err);
        reject(err);
      });
    });

  } catch (err) {
    console.error("Error in loginWebUser:", err);
    throw new Error("Authentication failed");
  }
}

export async function fetchWebUser(username: string): Promise<shortWebUser> {
  try {
    await sql.connect(sqlConfig);
    console.log("DB :: fetchWebUser:", username);

    return new Promise((resolve, reject) => {
      const request = new sql.Request();

      request.input("username", sql.VarChar, username);
      const query = "SELECT username, role, departamento, departamentosPermitidos FROM dbo.WebUsers WHERE username = @username;";

      request.query(query);

      request.on("row", (row) => {
        console.log("DB :: fetchWebUser row:", row);
        resolve(row);
      });

      request.on("error", (err) => {
        console.error("DB :: fetchWebUser: SQL Error:", err);
        reject(err);
      });
    });

  } catch (err) {
    console.error("Error in fetchWebUser:", err);
    throw new Error("Error fetching user");
  }
}

export async function setWebUserDepaPermitidos(username: string, depaPermitidos: string[]) {
  try {
    await sql.connect(sqlConfig);
    console.log("DB :: setWebUserDepaPermitidos:", username, depaPermitidos);

    return new Promise((resolve, reject) => {
      const request = new sql.Request();

      request.input("username", sql.VarChar, username);
      request.input("depaPermitidos", sql.VarChar, depaPermitidos);
      const query = "UPDATE dbo.WebUsers SET departamentosPermitidos = @depaPermitidos WHERE username = @username;";

      request.query(query);

      request.on("done", () => {
        resolve(true);
      });

      request.on("error", (err) => {
        console.error("DB :: setWebUserDepaPermitidos: SQL Error:", err);
        reject(err);
      });
    });

  } catch (err) {
    console.error("Error in setWebUserDepaPermitidos:", err);
    throw new Error("Error updating user");
  }
}
