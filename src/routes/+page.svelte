<script lang="ts">
	export let data;
	import DlCsv from '$lib/components/DlCsv.svelte';
	// Guardamos los registros originales
	let originalData = data.records;
	// Variable para almacenar el texto de búsqueda
	let searchText = '';
	// Computamos los datos filtrados en función del texto de búsqueda
	$: filteredData = originalData.filter(
		(persona: { Nombre: string; Departamento: string; MR: number }) =>
			persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
			persona.Departamento.toLowerCase().includes(searchText.toLowerCase()) ||
			persona.MR.toString().includes(searchText)
	);
</script>

<main class="font-family:Comfortaa bg:rgb(51,87,155) r:12 p:12|15|20">
	<h1 class="text:center bg:white r:10 p:10 w:fit-content">
		Presentismo - {data.hostname}
	</h1>
	<!-- Campo de búsqueda -->
	<input
		type="text"
		placeholder="Buscar por nombre, departamento o MR"
		bind:value={searchText}
		class="search-input"
	/>

	<div>
		<table>
			<thead class="font:bold">
				<tr>
					<th>MR</th>
					<th>Nombre</th>
					<th>Departamento</th>
					<th>Marcada de Ayer</th>
					<th>Marcada de Hoy</th>
				</tr>
			</thead>
			<tbody class="font:bold bg:white">
				{#each filteredData as persona}
					<tr>
						<td>{persona.MR}</td>
						<td>{persona.Nombre}</td>
						<td>{persona.Departamento}</td>
						<td>{persona.MarcadaDeAyer}</td>
						<td>{persona.MarcadaDeHoy}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<DlCsv data={data.records} />
</main>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #ccc;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f4f4f4;
	}

	.search-input {
		margin-bottom: 10px;
		padding: 8px;
		width: 99%;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
