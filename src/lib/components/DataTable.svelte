<script lang="ts">
	import type { Marcada } from '$lib/types';
	import { formatTime, compareTime } from '$lib/utils.js';
	import { createTable, Subscribe, Render } from 'svelte-headless-table';
	import { addSortBy } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import { tabStore } from '$lib/stores/selDepartamento';

	export let registros: Array<Marcada>;

	tabStore.subscribe(($tab) => {
		if ($tab.selDepa !== '') {
			console.log('selDepa:', $tab.selDepa);
			loadedItems = pageSize;
			dataToDisplay.set(registros.slice(0, loadedItems));
		}
	});

	const pageSize = 40;
	let loadedItems = pageSize; // Initial load count
	const dataToDisplay = writable(registros.slice(0, loadedItems)); // Data currently displayed

	// Update displayed data as items are loaded
	function loadMoreData() {
		if (loadedItems < registros.length) {
			loadedItems += pageSize;
			dataToDisplay.set(registros.slice(0, loadedItems));
		}
	}

	const table = createTable(dataToDisplay, {
		sort: addSortBy({
			initialSortKeys: [
				{
					id: 'Estado',
					order: 'desc'
				}
			]
		})
	});

	const columns = table.createColumns([
		table.column({ header: 'CUIL', accessor: 'CUIL' }),
		table.column({ header: 'DNI', accessor: 'DNI' }),
		table.column({ header: 'MR', accessor: 'MR' }),
		table.column({ header: 'Nombre', accessor: 'Nombre' }),
		table.column({ header: 'Departamento', accessor: 'Departamento' }),
		table.column({ header: 'Entrada', accessor: 'Entrada' }),
		table.column({ header: 'Salida', accessor: 'Salida' }),
		table.column({ header: 'Estado', accessor: 'Estado' })
/* 		,table.column({ header: 'ACTIVO', accessor: 'ACTIVO' }) */
	]);

	const { headerRows, rows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);

	// Scroll event handler
	function handleScroll(event: Event) {
		const element = event.target as HTMLElement;
		// Check if the user has scrolled near the bottom of the container
		if (element.scrollTop + element.clientHeight >= element.scrollHeight - 100) {
			loadMoreData(); // Load more data when near the bottom
		}
	}

	$: dataToDisplay.set(registros.slice(0, loadedItems));
</script>

<div class="table-container" on:scroll={handleScroll}>
	<table {...$tableAttrs} class="table">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<th {...attrs} on:click={props.sort.toggle}>
									<Render of={cell.render()} />
									{#if props.sort.order === 'asc'}
										▼
									{:else if props.sort.order === 'desc'}
										▲
									{/if}
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs} class="bg:white">
			{#each $rows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td {...attrs}>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		min-height: 550px; /* Altura mínima de la tabla */
		max-height: 550px; /* Altura máxima del área de la tabla */
		overflow-y: auto; /* Habilitar el scroll vertical */
	}

	.table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f4f4f4;
		position: sticky;
		top: 0; /* Mantener el encabezado fijo en la parte superior */
		z-index: 1;
	}

	tr.no-marcado {
		border: 2px solid red;
	}

	tr.falta-marcado {
		border: 2px solid orange;
	}

	tbody tr {
		border-collapse: separate;
	}
</style>
