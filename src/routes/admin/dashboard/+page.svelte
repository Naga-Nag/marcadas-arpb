<script lang="ts">
    import { fetchUsuarios, fetchDepartamentos } from '$lib/utils/mainController';
    import type { shortWebUser } from '$lib/types/gen';
    import Tag from '$lib/components/Tag.svelte';
    import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

    let usuarios: shortWebUser[] = [];
    let departamentos: string[] = [];
    let showRegisterForm = false;

    onMount(async () => {
        usuarios = await fetchUsuarios();
        departamentos = await fetchDepartamentos();
    });

    async function toggleDepartamento(username: string, departamento: string) {
    const formData = new URLSearchParams({ username, departamento });

    const response = await fetch('?/setDepartamentosPermitidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });

    if (!response.ok) {
        console.error('Failed to update departamentos permitidos');
        usuarios = await fetchUsuarios(); // Revert on failure
        return;
    }

    const data = await response.json();
    if (data.success) {
        usuarios = usuarios.map((user) =>
            user.username === username
                ? { ...user, departamentosPermitidos: data.departamentosPermitidos }
                : user
        );
    } else {
        console.error('Error updating:', data.message);
        usuarios = await fetchUsuarios();
    }
}

</script>

<main>
    <h1>Panel de Administrador</h1>
    <h2>Usuarios</h2>
    <button on:click={() => (showRegisterForm = !showRegisterForm)} class="btn primary-btn">
        Registrar Usuario
    </button>

    {#if showRegisterForm}
        <div class="register-form-overlay" transition:fade>
            <div class="register-form">
                <button on:click={() => (showRegisterForm = false)} class="close-button">&times;</button>
                <h3>Registrar Nuevo Usuario</h3>
                <form method="post" action="?/register">
                    <label>
                        Usuario:
                        <input type="text" name="username" required />
                    </label>
                    <label>
                        Contraseña:
                        <input type="password" name="password" required />
                    </label>
                    <label>
                        Departamento:
                        <select name="departamento" required>
                            <option value="" disabled selected>Seleccione un departamento</option>
                            {#each departamentos as departamento}
                                <option value={departamento}>{departamento}</option>
                            {/each}
                        </select>
                    </label>
                    <button class="btn primary-btn" type="submit">Registrar</button>
                </form>
            </div>
        </div>
    {/if}

    <ul class="user-list">
        {#each usuarios as usuario (usuario.username)}
            <li class="user-item" transition:slide>
                <details>
                    <summary>
                        <span>{usuario.username}</span>
                        <Tag label={usuario.departamento} color="blue" />
                        <span class="role-badge">{usuario.role}</span>
                    </summary>
                    <div class="user-details">
                        <p><strong>Username:</strong> {usuario.username}</p>
                        <p><strong>Departamento:</strong> {usuario.departamento}</p>
                        <p><strong>Rol:</strong> {usuario.role}</p>
                        <p><strong>Departamentos Permitidos:</strong> {usuario.departamentosPermitidos}</p>
                        <div class="user-actions">
                            <form method="post" action="?/deleteUser">
                                <input type="hidden" name="username" value={usuario.username} />
                                <button class="btn danger-btn" type="submit">Eliminar</button>
                            </form>
                            <form method="post" action="?/updateUser">
                                <input type="hidden" name="username" value={usuario.username} />
                                <label>
                                    Departamento:
                                    <select name="departamento" required>
                                        {#each departamentos as departamento}
                                            <option value={departamento} selected={departamento === usuario.departamento}>
                                                {departamento}
                                            </option>
                                        {/each}
                                    </select>
                                </label>
                                <label>
                                    Rol:
                                    <select name="role" required>
                                        <option value="USER" selected={usuario.role === 'USER'}>USER</option>
                                        <option value="ADMIN" selected={usuario.role === 'ADMIN'}>ADMIN</option>
                                    </select>
                                </label>
                                <button class="btn primary-btn" type="submit">Actualizar</button>
                            </form>
                            <form method="post" action="?/setDepartamentosPermitidos">
                                <input type="hidden" name="username" value={usuario.username} />
                                <label for="departamentos-permitidos-{usuario.username}">Departamentos Permitidos:</label>
                                <div id="departamentos-permitidos-{usuario.username}" class="departamentos-buttons">
                                    {#each departamentos as departamento}
                                        <button
                                            type="button"
                                            class="btn departamento-btn {usuario.departamentosPermitidos.includes(departamento) ? 'active' : ''}"
                                            on:click={() => toggleDepartamento(usuario.username, departamento)}
                                        >
                                            {departamento}
                                        </button>
                                    {/each}
                                </div>
                            </form>
                        </div>
                    </div>
                </details>
            </li>
        {/each}
    </ul>
</main>

<style>
    h1, h2 {
        text-align: center;
        color: #222;
    }

    .btn {
        padding: 10px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s, transform 0.2s;
    }

    .btn:hover {
        transform: scale(1.05);
    }

    .primary-btn {
        background-color: #007bff;
        color: white;
    }

    .primary-btn:hover {
        background-color: #0056b3;
    }

    .danger-btn {
        background-color: #dc3545;
        color: white;
    }

    .danger-btn:hover {
        background-color: #a71d2a;
    }

    .user-list {
        list-style: none;
        padding: 0;
        max-width: 800px;
        margin: auto;
    }

    .user-item {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-bottom: 12px;
        padding: 15px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }

    .user-item:hover {
        transform: scale(1.02);
    }

    .role-badge {
        background: #28a745;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 14px;
    }

    .register-form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .register-form {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        width: 420px;
        text-align: center;
        position: relative;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 22px;
        border: none;
        background: none;
        cursor: pointer;
        color: red;
    }

    .close-button:hover {
        color: darkred;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #555;
    }

    .user-actions {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    form {
        margin-bottom: 15px;
    }

    .user-details {
        margin-top: 10px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-details p {
        margin: 5px 0;
        font-size: 14px;
        color: #333;
    }

    .departamentos-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
    }

    .departamento-btn {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background-color: #f9f9f9;
        color: #333;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    .departamento-btn:hover {
        background-color: #e0e0e0;
    }

    .departamento-btn.active {
        background-color: #007bff;
        color: white;
        border-color: #0056b3;
    }

    .departamento-btn.active:hover {
        background-color: #0056b3;
    }
</style>
