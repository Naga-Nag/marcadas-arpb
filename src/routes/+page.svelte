<script lang="ts">
	export let data: any;
	import {
		BtnDescargar,
		MainOptions,
		TabsDepartamento,
		DatePicker,
		RangeDatePicker,
		LoadingIcon,
		DataTable
	} from '$lib/components/components';

	import { getEstado, matchesFilters } from '$lib/utils/utils';
	import { fetchMarcadaDetalle, fetchMarcada } from '$lib/utils/mainController';
	import {
		globalStore,
		updateFechaMarcada,
		setloadingData,
		setHostname
	} from '$lib/utils/globalStore';
	import { onMount } from 'svelte';
	import type { Marcada } from '$lib/utils/types';

	// Variables para búsqueda y departamentos
	let debouncedSearchText = '';
	let registros: Marcada[] = [];
	let searchText: string = '';
	let departamentos: string[] = [];
	let hostname: string;
	let selectedDepartamento: string = '';
	let fechaMarcada = '';
	let loading: boolean = false;
	let showEntreFechas: boolean = false;
	let showMarcadaDetalle: boolean = true;

	globalStore.subscribe((value) => {
		selectedDepartamento = value.selectedDepartamento;
		fechaMarcada = value.fechaMarcada;
		loading = value.loading;
		showEntreFechas = value.showEntreFechas;
		showMarcadaDetalle = value.showMarcadaDetalle;
		hostname = value.hostname;
	});

	let timeout: ReturnType<typeof setTimeout>;
	$: {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			searchText = debouncedSearchText;
		}, 50); // *ms debounce
	}
	//ANCHOR - Datos Filtrados
	// Computamos los datos filtrados en función del departamento seleccionado, el texto de búsqueda y la ordenación

	$: filteredData = registros
		.filter((marcada) => matchesFilters(marcada, searchText, selectedDepartamento))
		.map((marcada) => ({
			...marcada,
			Estado: getEstado(marcada)
		}));

	$: Ausentes = registros.filter((marcada) => {
		if (showMarcadaDetalle) {
			return !marcada.Marcada;
		} else {
			return !marcada.Entrada || !marcada.Salida;
		}
	});

	$: AusentesDepartamento = registros.filter((marcada) => {
		if (marcada.Departamento === selectedDepartamento) {
			if (showMarcadaDetalle) {
				return !marcada.Marcada;
			} else {
				return !marcada.Entrada || !marcada.Salida;
			}
		}
		return false;
	});

	async function rangoFechalistener(fechaInicial: string, fechaFinal: string) {
		setloadingData(true);
		let url = `/api/fetchEntreFechas/`;
		let payload = { departamento: hostname, fechaInicial, fechaFinal };
		try {
			console.log('Fetching data... MarcadaEntreFechas:', fechaInicial, fechaFinal);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			if (response.ok) {
				registros = await response.json();
			} else {
				console.error('Error fetching data:', await response.json());
			}
		} catch (error) {
			console.error('Fetch error:', error);
		}
		setloadingData(false);
	}

	async function fechaListener(fechaMarcada: string) {
		setloadingData(true);

		registros = []; // Clear previous records

		try {
			if (showMarcadaDetalle) {
				registros = await fetchMarcadaDetalle(hostname, fechaMarcada);
			} else {
				await fetchMarcada(hostname, fechaMarcada, (batch) => {
					registros = [...registros, ...batch]; // Update registros incrementally
				});
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error fetching data:', error.message);
			} else {
				console.error('Unknown error:', error);
			}
		} finally {
		}
		setloadingData(false);
	}

	onMount(async () => {
		setHostname(data.hostname);
		const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		updateFechaMarcada(defaultDate);
		await fechaListener(defaultDate);
		selectedDepartamento = data.hostname;
	});
</script>

<body>
	<main class="main shadow:8|8|3|blue min-h:93vh">
		<div class="d:flex flex:row justify-content:space-between">
			<h1 class="text:center bg:white r:10 p:10 w:fit-content shadow:4|4|3|gray-70">
				Presentismo - {data.hostname}
			</h1>

			<a href="/aut" class="font-size:9">👻</a>
		</div>

		<!-- // ANCHOR Tabs de departamentos -->
		<!-- Esto solo se muestra si el hostname es PEAP -->

		{#if data.hostname === 'PEAP'}
			<div class="d:flex flex:row justify-content:space-between">
				<TabsDepartamento {departamentos} bind:selectedDepartamento />
			</div>
		{/if}

		{#if selectedDepartamento}
			<!-- // ANCHOR Input buscar por MR -->
			<input
				type="text"
				placeholder="Buscar por nombre o MR"
				bind:value={debouncedSearchText}
				class="b:1|solid|#ccc mb:10 p:8 w:99% r:4"
			/>

			<!-- // ANCHOR DatePicker y Botones de exportacion -->

			<div class="d:flex mb:10">
				<span> </span>
				<MainOptions
					on:toggleMarcadaDetalle={() => {
						registros = [];
						fechaListener(fechaMarcada);
					}}
					on:toggleEntreFechas={() => {
						registros = [];
						if (showEntreFechas) {
							fechaListener(fechaMarcada);
						}
					}}
				/>
				<span></span>

				{#if showEntreFechas}
					<RangeDatePicker
						on:rangoFechaDefinido={(e) =>
							rangoFechalistener(e.detail.fechaInicial, e.detail.fechaFinal)}
					/>
				{:else}
					<DatePicker on:fechaDefinida={(e) => fechaListener(e.detail.fecha)} />
				{/if}

				<BtnDescargar
					data={filteredData}
					placeholder="Descargar Vista Actual"
					filename="marcadas VA - {selectedDepartamento} {fechaMarcada}"
				/>
				<BtnDescargar
					data={AusentesDepartamento}
					placeholder="Descargar Ausentes del Departamento"
					filename="marcadas AD - {selectedDepartamento} {fechaMarcada}"
				/>

				{#if data.hostname === 'PEAP' && selectedDepartamento === 'ARPB'}
					<BtnDescargar
						data={Ausentes}
						placeholder="Descargar Todos los Ausentes"
						filename="marcadas TD {fechaMarcada}"
					/>
				{/if}
			</div>

			<!-- // ANCHOR Tabla de datos filtrados -->
			{#if registros.length > 0 && selectedDepartamento}
				<div>
					<DataTable registros={filteredData} />
				</div>
				<!-- Cuenta de registros -->
				<div class="d:flex flex:col">
					<p class="font-size:18 bg:white r:10 p:10 w:fit-content">
						{#if selectedDepartamento === 'ARPB'}
						Total Ausentes: {Ausentes.length}
						{:else}
						Total Ausentes: {AusentesDepartamento.length}
						{/if}
					</p>
				</div>
			{:else}
				<div class="d:flex flex:col justify-content:center align-items:center">
					<LoadingIcon />
				</div>
			{/if}
		{/if}
	</main>
</body>

<style>
</style>
