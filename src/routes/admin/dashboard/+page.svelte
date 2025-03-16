<script lang="ts">
	import {
		fetchUsuarios,
		createUsuario,
		updateUsuario,
		deleteUsuario,
		fetchDepartamentos
	} from '$lib/utils/mainController';
	import type { shortWebUser } from '$lib/types/gen';
	import { onMount } from 'svelte';

	let usuarios: shortWebUser[] = [];
	let selectedUsuario: shortWebUser | null = null;
	let departamentosPermitidos: string[] = [];
	let departamentos: string[] = [];

	onMount(async () => {
		usuarios = await fetchUsuarios();
		departamentos = await fetchDepartamentos();
	});
</script>

<main>
	<h1>Panel de Administrador</h1>
	<h2>Usuarios</h2>
	<ul class="user-list">
		{#each usuarios as usuario}
			<li class="user-item">
				<span>{usuario.username}</span>
				<span>{usuario.departamento}</span>
				<span>{usuario.role}</span>
				<span>{usuario.departamentosPermitidos}</span>
				<div>
					<button on:click={() => (selectedUsuario = usuario)}>Editar</button>
					<button on:click={() => deleteUsuario(usuario.username)}>Eliminar</button>
				</div>
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
		display: flex;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.user-item button {
		margin-left: 10px;
	}

	.user-item:hover {
		background-color: #f9f9f9;
	}
</style>
