import { goto } from "$app/navigation";
import { setloadingData, setMarcadas, getOmitirFinde, getfechaMarcada, getmarcadasIntermedias, getMarcadaEstandar } from "$lib/stores/global";
import { clearUser } from "$lib/stores/user";
import type { Marcada, WebUser } from "../types/gen";
import { notify } from "$lib/stores/notifications";
import { filtrarMarcadasFinde } from "./utils";

export async function fetchUsuarios() {
    const response = await fetch('/api/usuarios', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}

export async function createUsuario(usuario: WebUser) {
    const response = await fetch('/api/createUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return await response.json();
}

export async function updateUsuario(usuario: any) {
    const response = await fetch('/api/updateUsuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return await response.json();
}

export async function deleteUsuario(username: string) {
    const response = await fetch(`/api/usuarios/${username}`, {
        method: 'DELETE'
    });
    return await response.json();
}

export async function fetchMarcada(departamento: string, fecha: string) {
    setloadingData(true);
    let marcadas = [];
    if (getmarcadasIntermedias()) {
        if (departamento === '' || fecha === '') {
            setloadingData(false);
            throw new Error('mainController :: Los parametros de fechas son invalidos :: Departamento: ' + departamento + '::' + ' Fecha: ' + fecha);
        }
        const response = await fetch('/api/fetchMarcadaDetalle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departamento, fecha })
        });

        if (!response.ok || !response.body) {
            notify({
                id: Date.now(),
                title: 'Error',
                message: 'Error al obtener datos de marcadas',
                type: 'error',
                duration: 3000
            });
            setloadingData(false);
            throw new Error('Failed to fetch records');
        }
        marcadas = await response.json();
    }
    else if (getMarcadaEstandar()) {
        fetchMarcadaEstandar(departamento, fecha).then((data) => {
            marcadas = data;
            setMarcadas(marcadas);
            setloadingData(false);
        });
    }
    else {
        const response = await fetch('/api/fetchMarcada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departamento, fecha })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch records');
        }
        marcadas = await response.json();
    }
    setMarcadas(marcadas);
    setloadingData(false);
}

export async function fetchEntreFechas(departamento: string, fechaInicial: string, fechaFinal: string) {
    setloadingData(true);

    const response = await fetch('/api/fetchEntreFechas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fechaInicial, fechaFinal })
    });

    if (!response.ok || !response.body) {
        setloadingData(false);
        throw new Error('Failed to fetch records');
    }
    let marcadas = await response.json();
    if (getOmitirFinde()) {
        filtrarMarcadasFinde(marcadas);
    }
    setMarcadas(marcadas);
    setloadingData(false);
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
    // Transformar el campo Activo a un valor valido
    switch (marcadaRow.Activo) {
        case 'No definido':
            marcadaRow.Activo = '';
            break;
        case 'SI':
            marcadaRow.Activo = '1';
            break;
        case 'NO':
            marcadaRow.Activo = '0';
            break;
        case 'BAJA':
            marcadaRow.Activo = '0';
            break;
        case 'baja':
            marcadaRow.Activo = '0';
            break;
    }

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
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

export async function logout() {
    clearUser();
    goto('/logout');
}

export async function fetchMarcadaEstandar(departamento: string, fecha: string) {
    const response = await fetch('/api/fetchMarcadaEstandar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departamento, fecha })
    });

    if (!response.ok) {
        throw new Error('mainController :: Marcada Estandar :: Error al obtener datos de marcadas');
    }
    return await response.json();
}

export async function heartbeat(): Promise<boolean> {
    try {
        const response = await fetch('/api/heartbeat');
        return response.json();
    } catch (error) {
        console.error('Error checking heartbeat:', error);
        return false;
    }
}
