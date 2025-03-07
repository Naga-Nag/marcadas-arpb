<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
	let activeTab = 'login';
</script>

<main>
<div class="container">
	<div class="tabs">
		<button
			class:active-tab={activeTab === 'login'}
			on:click={() => (activeTab = 'login')}
		>
			Ingresar
		</button>
		<button
			class:active-tab={activeTab === 'register'}
			on:click={() => (activeTab = 'register')}
		>
			Registrarse
		</button>
	</div>

	{#if activeTab === 'login'}
		<form use:enhance method="post" action="?/login">
			<div class="form-item">
				<label for="username">Usuario<sup><small class="required">*</small></sup></label>
				<input value={form?.username ?? ''} id="username" type="text" name="username" required />
			</div>
			<div class="form-item">
				<label for="password">Contraseña<sup><small class="required">*</small></sup></label>
				<input id="password" type="password" name="password" required />
			</div>
			<div class="form-item">
				{#if form?.error}
					<small>{form?.message}</small>
				{/if}
			</div>
			<div class="form-item">
				<button type="submit">Ingresar</button>
			</div>
		</form>
	{:else}
		<form use:enhance method="post" action="?/register">
			<div class="form-item">
				<label for="username">Usuario<sup><small class="required">*</small></sup></label>
				<input id="username" type="text" name="username" required />
			</div>
			<div class="form-item">
				<label for="password">Contraseña<sup><small class="required">*</small></sup></label>
				<input id="password" type="password" name="password" required />
			</div>
			<div class="form-item">
				<label for="departamento">Departamento<sup><small class="required">*</small></sup></label>
				<input id="departamento" type="text" name="departamento" required />
			</div>
			<div class="form-item">
				<button type="submit">Registrarse</button>
			</div>
		</form>
	{/if}
</div>
</main>
<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 95vh;
		margin: 0;
	}

	.container {
		max-width: 400px;
		width: 100%;
		background-color: #444;
		padding: 2em;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.tabs {
		display: flex;
		justify-content: center;
		margin-bottom: 1em;
	}

	button {
		margin: 0 0.5em;
		padding: 0.5em 1em;
		background-color: #FFF;
		border: none;
		border-radius: 5px;
		transition: all 0.3s ease-in;
	}

	button:hover {
		cursor: pointer;
		background-color: #4d4c4c;
		color: #FFF;
	}

	.active-tab {
		background-color: #4d4c4c;
		color: #FFF;
	}

	.form-item {
		color: #FFF;
		margin-bottom: 0.5em;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	label {
		padding-right: 0.5em;
	}

	.required {
		padding-left: 0.5em;
		color: #ff0000;
	}
</style>

