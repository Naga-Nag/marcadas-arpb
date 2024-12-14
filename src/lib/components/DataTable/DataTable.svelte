<script lang="ts">
	import type { Marcada } from '$lib/utils/types';
	import EditableCell from '$lib/components/DataTable/EditableCell.svelte';
	import { sortTime, sortString, sortNumber, sortEstado } from '$lib/utils/utils';
	import { createTable, createRender, Subscribe, Render, type DataLabel } from 'svelte-headless-table';
	import {
		addHiddenColumns,
		addPagination,
		addSortBy,
		addGroupBy
	} from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import { globalStore } from '$lib/utils/globalStore';
	import BtnDescargar from '../BtnDescargar.svelte';
	import { updateUsuarioFromMarcada } from '$lib/utils/mainController';

	export let registros: Array<Marcada>;

	let showMarcadaDetalle: boolean;
	let showEntreFechas: boolean;
	let departamentos: string[] = [];
	globalStore.subscribe(($value) => {
		showMarcadaDetalle = $value.showMarcadaDetalle;
		showEntreFechas = $value.showEntreFechas;
		departamentos = $value.departamentos;
	});

	const dataToDisplay = writable(registros);

	const updateData = (rowId: string, columnId: string, newValue: string) => {
		console.log('updateData', JSON.stringify({ rowId, columnId, newValue }));

		if (columnId === 'Departamento') {
			if (!departamentos.includes(newValue)) {
				console.log('DataTable :: EditableCell :: Departamento no valido');
				// If newValue is not valid, refresh data to reset invalid values
				$dataToDisplay = $dataToDisplay;
				return;
			}
		}

		if (columnId === 'Activo') {
			if (['Si', 'true', 'si', '1'].includes(newValue)) {
				newValue = "1";
			}
			else if (['No', 'false', 'no', '0'].includes(newValue)) {
				newValue = "0";
			}
			else {
				console.log('DataTable :: EditableCell :: Activo no valido :: ', newValue);
				// If newValue is not valid, refresh data to reset invalid values
				$dataToDisplay = $dataToDisplay;
				return;
			}
		}

		const idx = parseInt(rowId);
		const currentItem = $dataToDisplay[idx];
		const key = columnId; // Cast as `keyof YourDataItem`
		const newItem = { ...currentItem, [key]: newValue };
		updateUsuarioFromMarcada(newItem);
		console.log('DataTable :: Mod Item :: ', newItem);
		$dataToDisplay[idx] = newItem;
		$dataToDisplay = $dataToDisplay;
	};

	const EditableCellLabel: DataLabel<Marcada> = ({ column, row, value }) =>
		createRender(EditableCell, {
			row,
			column,
			value,
			onUpdateValue: updateData
		});

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
		table.column({ header: 'MR', accessor: 'MR', cell: EditableCellLabel }),
		table.column({ header: 'CUIL', accessor: 'CUIL', cell: EditableCellLabel }),
		table.column({ header: 'Nombre', accessor: 'Nombre' }),
		table.column({ header: 'Departamento', accessor: 'Departamento', cell: EditableCellLabel }),
		table.column({ header: 'Marcada', accessor: 'Marcada' }),
		table.column({ header: 'Entrada', accessor: 'Entrada' }),
		table.column({ header: 'Salida', accessor: 'Salida' }),
		table.column({ header: 'Estado', accessor: 'Estado' }),
		table.column({ header: 'Jornada', accessor: 'Jornada', cell: EditableCellLabel }),
		table.column({ header: 'En Actividad', accessor: 'Activo', cell: EditableCellLabel })
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
		} else if (sortCol === 'MR' || sortCol === 'CUIL' /* || sortCol === 'DNI' */) {
			registros = registros.sort((a, b) =>
				sortNumber(parseInt(a[sortCol]), parseInt(b[sortCol]), sortOrder)
			);
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
		max-height: 30em;
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
