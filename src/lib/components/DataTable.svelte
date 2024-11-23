<script lang="ts">
	import type { Marcada } from '$lib/utils/types';
	import { sortTime, sortString, sortNumber, sortEstado } from '$lib/utils/utils';
	import { createTable, Subscribe, Render } from 'svelte-headless-table';
	import {
		addHiddenColumns,
		addPagination,
		addSortBy,
		addGroupBy
	} from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import { globalStore } from '$lib/utils/globalStore';

	export let registros: Array<Marcada>;

	let showMarcadaDetalle: boolean;
	let showEntreFechas: boolean;
	globalStore.subscribe(($value) => {
		showMarcadaDetalle = $value.showMarcadaDetalle;
		showEntreFechas = $value.showEntreFechas;
	});

	const dataToDisplay = writable(registros);

	const table = createTable(dataToDisplay, {
		page: addPagination(),
		hideCols: addHiddenColumns(),
		group: addGroupBy({}),
		sort: addSortBy({
			serverSide: true,
			toggleOrder: ['asc', 'desc'],
			initialSortKeys: [{ id: 'Estado', order: 'asc' }]
		})
	});

	const columns = table.createColumns([
		table.column({ header: 'MR', accessor: 'MR' }),
		table.column({ header: 'CUIL', accessor: 'CUIL' }),
		table.column({ header: 'DNI', accessor: 'DNI' }),
		table.column({ header: 'Nombre', accessor: 'Nombre' }),
		table.column({ header: 'Departamento', accessor: 'Departamento' }),
		table.column({ header: 'Marcada', accessor: 'Marcada' }),
		table.column({ header: 'Entrada', accessor: 'Entrada' }),
		table.column({ header: 'Salida', accessor: 'Salida' }),
		table.column({ header: 'Estado', accessor: 'Estado' }),
		table.column({ header: 'Jornada', accessor: 'JORNADA' }),
		table.column({ header: 'En Actividad', accessor: 'ACTIVO' })
		/* table.column({ header: 'VARBIN', accessor: 'Info'}) */
	]);

	const { flatColumns, headerRows, pageRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;

	$pageSize = 40;

	const { hiddenColumnIds } = pluginStates.hideCols;
	const ids = flatColumns.map((c) => c.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, false]));

	$: {
		hideForId.Entrada = showMarcadaDetalle;
		hideForId.Salida = showMarcadaDetalle;
		hideForId.Estado = showMarcadaDetalle;

		hideForId.Marcada = !showMarcadaDetalle;

		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([, hide]) => hide)
			.map(([id]) => id);
	}

	function handleScroll(event: Event) {
		const element = event.target as HTMLElement;
		if (element.scrollTop + element.clientHeight >= element.scrollHeight - 100 && $hasNextPage) {
			$pageSize += 20;
		}
	}

	function toggleSortOrder(sortOrder: 'asc' | 'desc' | undefined, sortCol: string) {
		console.log('DataTable: toggleSortOrder', sortOrder, sortCol);

		if (sortCol === 'Entrada' || sortCol === 'Salida' || sortCol === 'Marcada') {
			registros = registros.sort((a, b) => sortTime(a[sortCol], b[sortCol], sortOrder));
		} else if (sortCol === 'Estado') {
			registros = registros.sort((a, b) => {
				return sortEstado(a, b, sortOrder);
			});
		} else if (sortCol === 'MR' || sortCol === 'CUIL' || sortCol === 'DNI') {
			registros = registros.sort((a, b) => sortNumber(a, b, sortOrder));
		} else if (sortCol === 'Departamento' || sortCol === 'Nombre') {
			registros = registros.sort((a, b) => sortString(a[sortCol], b[sortCol], sortOrder));
		}

		dataToDisplay.set([...registros]); // Force update with sorted array
	}

	$: dataToDisplay.set(registros);
	toggleSortOrder('asc', 'Estado');
</script>

<!-- {#each ids as id}
  <div>
    <input id="hide-{id}" type="checkbox" bind:checked={hideForId[id]} />
    <label for="hide-{id}">{id}</label>
  </div>
{/each} -->

<div class="table-container" on:scroll={handleScroll}>
	<table {...$tableAttrs} class="table">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<th
									{...attrs}
									on:click={(event) => {
										props.sort.toggle(event);
									}}
									on:click={() => {
										//INFO: Solo asi puedo ver prop.sort una vez actualizado
										toggleSortOrder(props.sort.order, cell.id);
									}}
								>
									<Render of={cell.render()} />
									{#if props.sort.order === 'desc'}
										▼
									{:else if props.sort.order === 'asc'}
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
			{#each $pageRows as row (row.id)}
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
		min-height: 550px;
		max-height: 550px;
		overflow-y: auto;
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
		top: 0;
		z-index: 1;
	}
</style>
