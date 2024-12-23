<script lang="ts">
	export let data: any;
	import {
		BtnDescargar,
		MainOptions,
		TabsDepartamento,
		DatePicker,
		RangeDatePicker,
		LoadingIcon,
		DataTable,
		NotificationContainer
	} from '$lib/components/components';

	import {
	depAdmin,
		filtrarMarcadasFinde,
		getEstado,
		matchesFilters,
		reemplazarMarcadas
	} from '$lib/utils/utils';

	import {
		fetchMarcadaDetalle,
		fetchMarcada,
		fetchDepartamentos,
		fetchEntreFechas
	} from '$lib/utils/mainController';

	import {
		globalStore,
		updateFechaMarcada,
		setloadingData,
		setHostname,
		updateSelectedDepartamento,
		setDepartamentos
	} from '$lib/stores/global';

	import { onMount } from 'svelte';
	import type { Marcada } from '$lib/utils/types';

	// Variables para búsqueda y departamentos
	let debouncedSearchText = '';
	let registros: Marcada[] = [];
	let searchText: string = '';
	let departamentos: string[] = data.departamentos;
	setDepartamentos(departamentos);
	let hostname: string = '';
	let selectedDepartamento = data.hostname;
	let fechaMarcada = '';
	let loading: boolean = false;
	let showEntreFechas: boolean = false;
	let showMarcadaDetalle: boolean = true;
	let omitirFinDeSemana = false;

	globalStore.subscribe((value) => {
		hostname = value.hostname;
		selectedDepartamento = value.selectedDepartamento;
		fechaMarcada = value.fechaMarcada;
		loading = value.loading;
		showEntreFechas = value.showEntreFechas;
		showMarcadaDetalle = value.showMarcadaDetalle;
		omitirFinDeSemana = value.omitirFinde;
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
		registros = [];
		if (omitirFinDeSemana) {
			registros = await fetchEntreFechas(hostname, fechaInicial, fechaFinal);
			registros = filtrarMarcadasFinde(registros);
		} else {
			registros = await fetchEntreFechas(hostname, fechaInicial, fechaFinal);
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
		}
		setloadingData(false);
	}

	onMount(async () => {
		setHostname(data.hostname);
		updateSelectedDepartamento(data.hostname);
		const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		updateFechaMarcada(defaultDate);
		await fechaListener(defaultDate);
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

		<NotificationContainer />

		<!-- // ANCHOR Tabs de departamentos -->
		<!-- Esto solo se muestra si el hostname es PEAP -->

		{#if depAdmin(hostname)}
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

				{#if (depAdmin(hostname)) && selectedDepartamento === 'ARPB'}
					<BtnDescargar
						data={Ausentes}
						placeholder="Descargar Todos los Ausentes"
						filename="marcadas TD {fechaMarcada}"
					/>
				{/if}
			</div>

			<!-- // ANCHOR DataTable -->
			{#if registros.length > 0 && selectedDepartamento}
				<div>
					<DataTable
						registros={filteredData}
						on:refreshParentData={(e) =>
							(registros = reemplazarMarcadas(registros, e.detail.newItem))}
					/>
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
