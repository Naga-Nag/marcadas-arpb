<script lang="ts">
    import {
        fetchUsuarios,
        fetchDepartamentos
    } from '$lib/utils/mainController';
    import type { shortWebUser } from '$lib/types/gen';
    import Tag from '$lib/components/Tag.svelte';
    import { onMount } from 'svelte';

    let usuarios: shortWebUser[] = [];
    let departamentos: string[] = [];
    let showRegisterForm = false;

    onMount(async () => {
        usuarios = await fetchUsuarios();
        departamentos = await fetchDepartamentos();
    });
</script>

<main>
    <h1>Panel de Administrador</h1>
    <h2>Usuarios</h2>
    <button on:click={() => (showRegisterForm = !showRegisterForm)} class="btn">
        Registrar Usuario
    </button>

    {#if showRegisterForm}
        <div class="register-form-overlay">
            <div class="register-form">
                <button on:click={() => (showRegisterForm = false)} class="close-button">X</button>
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
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    {/if}

    <ul class="user-list">
        {#each usuarios as usuario}
            <li class="user-item">
                <details>
                    <summary>
                        <span>{usuario.username}</span>
                        <Tag label={usuario.departamento} color="blue" />
                        <span>{usuario.role}</span>
                    </summary>
                    <div class="user-details">
                        <p><strong>Username:</strong> {usuario.username}</p>
                        <p><strong>Departamento:</strong> {usuario.departamento}</p>
                        <p><strong>Rol:</strong> {usuario.role}</p>
                        <p><strong>Departamentos Permitidos:</strong> {usuario.departamentosPermitidos}</p>
                        <div>
                            <form method="post" action="?/deleteUser">
                                <input type="hidden" name="username" value={usuario.username} />
                                <button type="submit">Eliminar</button>
                            </form>
                        </div>
                        <div>
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
                                    Role:
                                    <select name="role" required>
                                        <option value="USER" selected={usuario.role === 'USER'}>USER</option>
                                        <option value="ADMIN" selected={usuario.role === 'ADMIN'}>ADMIN</option>
                                    </select>
                                </label>
                                <button type="submit">Actualizar</button>
                            </form>
                        </div>
                    </div>
                </details>
            </li>
        {/each}
    </ul>
</main>

<style>
	.user-list {
		list-style: none;
		padding: 0;
	}

	.user-item {
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.user-item details {
		padding: 10px;
	}

	.user-item summary {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.user-item summary:hover {
		background-color: #fae7e7;
	}

	.user-details {
		margin-top: 10px;
		padding: 10px;
		background-color: #f5f5f5;
		border-radius: 5px;
	}

	.user-item button {
		margin-top: 10px;
		margin-right: 10px;
	}

	.register-form-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.register-form {
		position: relative;
		width: 400px;
		padding: 20px;
		background-color: #f9f9f9;
		border: 1px solid #ccc;
		border-radius: 5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.register-form form {
		display: flex;
		flex-direction: column;
	}

	.register-form label {
		margin-bottom: 10px;
	}

	.register-form button {
		margin-top: 10px;
	}

	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		color: red;
		font-size: 18px;
		cursor: pointer;
	}

	.close-button:hover {
		color: darkred;
	}
</style>
