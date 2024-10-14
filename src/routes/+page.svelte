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

	function getEstado(persona: { Entrada: any; Salida: any }) {
		if (persona.Entrada && persona.Salida) {
			return 'Completa';
		} else if (persona.Entrada && !persona.Salida) {
			return 'Falta salida';
		} else if (!persona.Entrada && persona.Salida) {
			return 'Falta entrada';
		} else {
			return 'No marcada';
		}
	}

	// Computamos los datos filtrados en función del departamento seleccionado, el texto de búsqueda y la ordenación
	$: filteredData = data.records
		.filter((persona: { Nombre: string; Departamento: string; MR: number }) => {
			// Si el hostname es PEAP, filtramos por departamento, si no, ignoramos el departamento
			if (data.hostname === 'PEAP') {
				return (
					persona.Departamento === selectedDepartamento.DeptName &&
					(persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
						persona.MR.toString().includes(searchText))
				);
			} else {
				// Si no es PEAP, solo filtramos por el texto de búsqueda
				return (
					persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
					persona.MR.toString().includes(searchText)
				);
			}
		})
		.map((persona: { Entrada: string; Salida: string }) => ({
			...persona,
			Estado: getEstado(persona)
		}))
		.sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
			const valA = a[sortColumn as keyof typeof a];
			const valB = b[sortColumn as keyof typeof b];

			if (typeof valA === 'string' && typeof valB === 'string') {
				return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
			} else if (typeof valA === 'number' && typeof valB === 'number') {
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

	function filterAusentesDepartamento() {
		return data.records.filter(
			(persona: { Departamento: string; Entrada: any; Salida: any }) =>
				persona.Departamento === selectedDepartamento.DeptName &&
				(!persona.Entrada || !persona.Salida)
		);
	}
</script>

<body>
	<main class="main shadow:8|8|3|blue">
		<div class="d:flex flex:row justify-content:space-between">
			<h1 class="text:center bg:white r:10 p:10 w:fit-content shadow:4|4|3|gray-70">
				Presentismo - {data.hostname}
			</h1>
			<a href="/aut" class="font-size:9">👻</a>
		</div>

		<!-- Tabs de departamentos -->
		{#if data.hostname === 'PEAP'}
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
			class="b:1|solid|#ccc mb:10 p:8 w:99% r:4"
		/>

		<!-- DatePicker y Botones para exportar datos -->
		<div class="d:flex">
			<input
				type="date"
				value={data.fechaMarcada}
				on:change={onDateChange}
				class="b:1|solid|#ccc mb:10 p:8 mr:10 w:99% r:15 w:fit-content"
			/>
			<DlCsv data={filteredData} placeholder="Descargar Vista Actual" />
			<DlCsv
				data={filterAusentesDepartamento()}
				placeholder="Descargar Ausentes del Departamento"
			/>
			{#if data.hostname === 'PEAP'}
				<DlCsv data={filterAusentes()} placeholder="Descargar Todos los Ausentes" />
			{/if}
		</div>

		<!-- Tabla de datos filtrados -->
		{#if data.error}
			<p>Hubo un error al cargar los datos: {data.error}</p>
		{:else}
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
								class={sortDirection === 'desc' && sortColumn === 'Nombre' ? 'active' : ''}
								>▽</button
							>
						</th>
						<th>Departamento</th>
						<th>Entrada</th>
						<th>Salida</th>
						<th>
							Estado
							<button
								on:click={() => sortDataBy('Estado')}
								class={sortDirection === 'asc' && sortColumn === 'Estado' ? 'active' : ''}
							>
								△
							</button>
							<button
								on:click={() => sortDataBy('Estado')}
								class={sortDirection === 'desc' && sortColumn === 'Estado' ? 'active' : ''}
							>
								▽
							</button>
						</th>
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
							<td>{persona.Entrada ? persona.Entrada.toString().padStart(5, '0') : ''}</td>
							<td>{persona.Salida ? persona.Salida.toString().padStart(5, '0') : ''}</td>
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
		{/if}
	</main>
</body>

<style>
	body {
		background: linear-gradient(-180deg, #306cce, #2eb7e9);
		background-size: 200% 200%;
	}
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
