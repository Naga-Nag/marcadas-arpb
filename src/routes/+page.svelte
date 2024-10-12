<script lang="ts">
	export let data;
	import DlCsv from '$lib/components/DlCsv.svelte';

	// Variables para búsqueda y departamentos
	let searchText = '';
	let departamentos = data.departamentos.sort((a, b) => a.DeptName.localeCompare(b.DeptName));
	let selectedDepartamento = departamentos[0];

	// Variables de ordenación
	let sortColumn = 'Nombre'; // Columna por la que ordenar
	let sortDirection = 'asc'; // Direccion de la ordenación: 'asc' o 'desc'

	// Función para cambiar la columna de ordenación y su dirección
	function sortDataBy(column: string) {
		if (sortColumn === column) {
			// Si ya estamos ordenando por esta columna, cambiamos la dirección
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// Si cambiamos de columna, ponemos dirección ascendente por defecto
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	// Computamos los datos filtrados en función del departamento seleccionado, el texto de búsqueda y la ordenación
	$: filteredData = data.records
		.filter(
			(persona: { Nombre: string; Departamento: string; MR: number }) =>
				persona.Departamento === selectedDepartamento.DeptName &&
				(persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
					persona.MR.toString().includes(searchText))
		)
		.sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
			const valA = a[sortColumn as keyof typeof a];
			const valB = b[sortColumn as keyof typeof b];

			if (typeof valA === 'string' && typeof valB === 'string') {
				// Comparación de strings
				return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
			} else if (typeof valA === 'number' && typeof valB === 'number') {
				// Comparación de números
				return sortDirection === 'asc' ? valA - valB : valB - valA;
			}
			return 0;
		});

	// Redirige cuando se selecciona una nueva fecha
	function onDateChange(event: Event) {
		const newDate = (event.target as HTMLInputElement).value;
		const url = new URL(window.location.href);
		url.searchParams.set('fecha', newDate);
		window.location.href = url.toString();
	}

	function filterAusentes() {
        return data.records.filter(
            (persona: { Entrada: any; Salida: any }) => !persona.Entrada || !persona.Salida
        );
    }
</script>

<main class="font-family:Comfortaa bg:rgb(51,87,155) r:12 p:12|15|20">
	<h1 class="text:center bg:white r:10 p:10 w:fit-content">
		Presentismo - {data.hostname}
	</h1>

	<!-- Tabs de departamentos -->
	{#if data.hostname === 'PEAP'}
	<DlCsv data={filterAusentes()} placeholder="Descargar Todos los Ausentes" />
		<div class="d:flex mb:10 mt:10">
			{#each departamentos as departamento}
				<button
					class="btn"
					on:click={() => (selectedDepartamento = departamento)}
					class:selected={selectedDepartamento === departamento}
				>
					{departamento.DeptName}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Campo de búsqueda -->
	<input
		type="text"
		placeholder="Buscar por nombre o MR"
		bind:value={searchText}
		class="mb:10 p:8 w:99% b:1|solid|#ccc r:4"
	/>

	<!-- DatePicker para seleccionar la fecha -->
	<input
		type="date"
		value={data.fechaMarcada}
		on:change={onDateChange}
		class="date-picker b:1px|solid|#ccc w:99% p:8 mb:10 r:15 w:fit-content"
	/>

	<!-- Tabla de datos filtrados -->
	<div>
		<table class="w:100% border:collapse">
			<thead>
				<tr>
					<th>
						MR
						<button
							on:click={() => sortDataBy('MR')}
							class={sortDirection === 'asc' && sortColumn === 'MR' ? 'active' : ''}>△</button
						>
						<button
							on:click={() => sortDataBy('MR')}
							class={sortDirection === 'desc' && sortColumn === 'MR' ? 'active' : ''}>▽</button
						>
					</th>
					<th>
						Nombre
						<button
							on:click={() => sortDataBy('Nombre')}
							class={sortDirection === 'asc' && sortColumn === 'Nombre' ? 'active' : ''}>△</button
						>
						<button
							on:click={() => sortDataBy('Nombre')}
							class={sortDirection === 'desc' && sortColumn === 'Nombre' ? 'active' : ''}>▽</button
						>
					</th>
					<th>Departamento</th>
					<th>Salida</th>
					<th>Entrada</th>
					<th>Estado</th>
				</tr>
			</thead>
			<tbody class="bg:white overflow:scroll-y">
				{#each filteredData as persona}
					<tr
						class={!persona.Entrada && !persona.Salida
							? 'no-marcado'
							: (persona.Entrada && !persona.Salida) || (!persona.Entrada && persona.Salida)
								? 'falta-marcado'
								: ''}
					>
						<td>{persona.MR}</td>
						<td>{persona.Nombre}</td>
						<td>{persona.Departamento}</td>
						<td>{persona.Salida ? persona.Salida.toString().padStart(5, '0') : ''}</td>
						<td>{persona.Entrada ? persona.Entrada.toString().padStart(5, '0') : ''}</td>
						<td>
							{#if persona.Entrada && persona.Salida}
								Ok
							{:else if persona.Entrada && !persona.Salida}
								<div class="bg:rgb(213,138,52)">Falta salida</div>
							{:else if !persona.Entrada && persona.Salida}
								<div class="bg:rgb(213,138,52)">Falta entrada</div>
							{:else}
								<div class="bg:rgb(213,85,87)">No marco</div>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="d:flex">
		<DlCsv data={filteredData} placeholder="Descargar Vista CSV"  className="mt:15" />
	</div>
</main>

<style>
	th,
	td {
		border: 1px solid #ccc;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f4f4f4;
		position: relative;
	}

	th button {
		background: none;
		border: none;
		cursor: pointer;
		margin-left: 5px;
	}

	th button.active {
		font-weight: bold;
		color: #007bff;
	}

	tr.no-marcado {
		border: 2px solid red;
	}

	tr.falta-marcado {
		border: 2px solid orange;
	}

	td {
		padding: 8px;
	}

	tr {
		border-collapse: separate;
	}

	th,
	td {
		border: 1px solid #ccc;
	}
</style>
