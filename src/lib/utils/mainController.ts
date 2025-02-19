import { goto } from "$app/navigation";
import { globalStore } from "$lib/stores/global";
import { clearUser } from "$lib/stores/user";
import type { Marcada } from "../types/gen";

let showMarcadaDetalle: boolean;

globalStore.subscribe((value) => {
    showMarcadaDetalle = value.showMarcadaDetalle;
});

export async function fetchMarcada(
    departamento: string,
    fecha: string,
    onBatch?: (batch: Array<Marcada>) => void
): Promise<Array<Marcada>> {
    const response = await fetch('/api/fetchMarcada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fecha })
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = ''; // Buffer to accumulate chunks
    const registros: Array<Marcada> = []; // Final array of records

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Process the buffer for complete JSON batches
        let boundaryIndex;
        while ((boundaryIndex = buffer.indexOf('\n')) >= 0) {
            const chunk = buffer.slice(0, boundaryIndex).trim(); // Extract one batch
            buffer = buffer.slice(boundaryIndex + 1); // Remove processed batch

            if (chunk) {
                try {
                    const batch = JSON.parse(chunk); // Parse the JSON batch
                    registros.push(...batch); // Add to the final array

                    // Call the callback with the batch if provided
                    if (onBatch) {
                        onBatch(batch);
                    }
                } catch (err) {
                    console.error('Failed to parse JSON batch:', err, chunk);
                }
            }
        }
    }

    // Handle any leftover data in the buffer
    if (buffer.trim()) {
        try {
            const batch = JSON.parse(buffer.trim());
            registros.push(...batch);

            // Call the callback with the final batch if provided
            if (onBatch) {
                onBatch(batch);
            }
        } catch (err) {
            console.error('Failed to parse final JSON batch:', err, buffer);
        }
    }

    // Return the accumulated records
    return registros;
}


/* console.log(await fetchMarcada('TAAP', '2023-08-03' , (batch) => {console.log(batch)})); */

export async function fetchMarcadaDetalle(departamento: string, fecha: string): Promise<Array<Marcada>> {
    if (departamento === '' || fecha === '') {
        throw new Error('Los parametros de fechas son invalidos :: Departamento: ' + departamento + '::' + ' Fecha: ' + fecha);
    }
    const response = await fetch('/api/fetchMarcadaDetalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fecha })
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }
    return response.json();
}

export async function fetchEntreFechas(departamento: string, fechaInicial: string, fechaFinal: string): Promise<Array<Marcada>> {
    const response = await fetch('/api/fetchEntreFechas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fechaInicial, fechaFinal })
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }
    return response.json();
}

export async function fetchDepartamentos(): Promise<Array<string>> {
    const response = await fetch('/api/fetchDepartamentos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok || !response.body) {
        throw new Error('Failed to fetch records');
    }
    return response.json();
}

/**
 * Actualiza un usuario en la base de datos a partir de una fila de Marcada
 * @param {Marcada} marcadaRow La fila de Marcada con los datos del usuario a actualizar
 * @returns {Promise<void>} Un promise que se resuelve si la actualizaci n fue exitosa, o rechaza con un error si hubo un problema
 */
export async function updateUsuarioFromMarcada(marcadaRow: Marcada) {
    const response = await fetch('/api/updateUsuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marcadaRow)
    });

    if (!response.ok) {
        throw new Error('mainController :: Error al actualizar usuario');
    }
    else {
        console.log('mainController :: Usuario actualizado con exito', marcadaRow);
    }
}

/**
 * Handles a login request by making a POST request to the /api/login endpoint.
 * If the login is successful, sets the user state to the logged-in user and
 * redirects to either the admin page (if the user is an admin) or the main page.
 * If the login fails, returns an error message.
 * @param {string} username The username of the user attempting to log in.
 * @param {string} password The plaintext password of the user.
 * @returns {Promise<{success: boolean, error?: string}>} A promise that resolves
 * to an object containing a success flag and an optional error message.
 */
export async function handleLogin(username: string, password: string): Promise<{ success: boolean, error?: string }> {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const { token, role, departamento } = await response.json();


        //DEBUG
        console.log(token, role);


        if (role === 'ADMIN') {
            goto('/admin'); // Redirect to admin page
        }
        else {
            console.log('Redirecting to main page');
            goto('/main'); // Redirect to main page
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Handles a registration request by making a POST request to the /api/register endpoint.
 * If the registration is successful, clears the username and password fields and returns
 * a success flag. If the registration fails, returns an error message.
 * @param {string} registerUsername The username of the user attempting to register.
 * @param {string} registerPassword The plaintext password of the user.
 * @param {string} departamento The department name to register the user for.
 * @returns {Promise<{success: boolean, error?: string}>} A promise that resolves
 * to an object containing a success flag and an optional error message.
 */
export async function handleRegister(registerUsername: string, registerPassword: string, departamento: string): Promise<{ success: boolean, error?: string }> {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: registerUsername, password: registerPassword, role: 'USER', departamento }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        registerUsername = '';
        registerPassword = '';
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function logout() {
    clearUser();
    goto('/logout');
}