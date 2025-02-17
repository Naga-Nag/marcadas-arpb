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
		filtrarMarcadasFinde,
		getEstado,
		matchesFilters,
		reemplazarMarcadas
	} from '$lib/utils/utils';

	import { fetchMarcadaDetalle, fetchMarcada, fetchEntreFechas, logout } from '$lib/utils/mainController';

	import {
		globalStore,
		updateFechaMarcada,
		setloadingData,
		updateSelectedDepartamento
	} from '$lib/stores/global';
	import { onMount } from 'svelte';
	import type { Marcada} from '$lib/types/gen';
	import { isAdmin } from '$lib/stores/user';

	let user = data.user;

	// Variables para búsqueda y departamentos
	let debouncedSearchText = '';
	let registros: Marcada[] = [];
	let searchText: string = '';
	let fechaMarcada = '';
	let loading: boolean = false;
	let showEntreFechas: boolean = false;
	let showMarcadaDetalle: boolean = true;
	let omitirFinDeSemana = false;
	let selectedDepartamento = '';

	console.log('MAIN :: user => ', user);

	updateSelectedDepartamento(user.departamento);

	globalStore.subscribe((value) => {
		selectedDepartamento = value.selectedDepartamento;
		fechaMarcada = value.fechaMarcada;
		loading = value.loading;
		showEntreFechas = value.showEntreFechas;
		showMarcadaDetalle = value.showMarcadaDetalle;
		omitirFinDeSemana = value.omitirFinde;
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
		//TODO Pasar esta funcion a los endpoints, para no reiterar el codigo
		setloadingData(true);
		registros = [];
		if (omitirFinDeSemana) {
			registros = await fetchEntreFechas(user.departamento, fechaInicial, fechaFinal);
			registros = filtrarMarcadasFinde(registros);
		} else {
			registros = await fetchEntreFechas(user.departamento, fechaInicial, fechaFinal);
		}
		setloadingData(false);
	}

	async function fechaListener(fechaMarcada: string) {
		setloadingData(true);

		registros = []; // Clear previous records

		try {
			if (showMarcadaDetalle) {
				registros = await fetchMarcadaDetalle(user.departamento, fechaMarcada);
			} else {
				await fetchMarcada(user.departamento, fechaMarcada, (batch) => {
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

	//TODO Limpiar onMount
	onMount(async () => {
		const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		updateFechaMarcada(defaultDate);
		await fechaListener(defaultDate);
	});
</script>

<body>
	<main class="main shadow:8|8|3|blue min-h:93vh">
		<div class="d:flex flex:row justify-content:space-between">
			<button on:click={logout}>Logout</button>
			<h1 class="text:center bg:white r:10 p:10 w:fit-content shadow:4|4|3|gray-70">
				Presentismo - {user.departamento}
			</h1>

			<a href="/aut" class="font-size:9">👻</a>
		</div>

		<NotificationContainer />

		<!-- // ANCHOR Tabs de departamentos -->
		<!-- Esto solo se muestra si es admin el departamento es PEAP -->
		{#if isAdmin(user) || user.departamento === 'PEAP'}
			<div class="d:flex flex:row justify-content:space-between">
				<TabsDepartamento departamentos={user.departamentosPermitidos} bind:selectedDepartamento />
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

				{#if isAdmin(user) && selectedDepartamento === 'ARPB'}
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
						editable={isAdmin(user)}
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
