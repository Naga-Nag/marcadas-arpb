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

	import { filtrarMarcadasFinde, reemplazarMarcadas } from '$lib/utils/utils';

	import {
		fetchMarcada,
		fetchEntreFechas,
		logout
	} from '$lib/utils/mainController';

	import {
		globalStore,
		filteredMarcadas,
		ausentes,
		updateSelectedDepartamento,
		clearMarcadas,
		getAusentes,
		setFechaMarcada
	} from '$lib/stores/global';
	import { onMount } from 'svelte';
	import type { Marcada } from '$lib/types/gen';
	import { isAdmin } from '$lib/stores/user';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let user = data.user;

	let registros: Marcada[] = [];
	let fechaMarcada = '';
	let entreFechas: boolean = false;
	let marcadasIntermedias: boolean = true;
	let omitirFinDeSemana = false;
	let selectedDepartamento = '';

	$: totalAusentes = $ausentes.length;

	console.log('MAIN :: user => ', user);

	
	$: registros = $filteredMarcadas; // Dynamically update when filteredMarcadas changes
	globalStore.subscribe((value) => {
		selectedDepartamento = value.selectedDepartamento;
		fechaMarcada = value.fechaMarcada;
		entreFechas = value.entreFechas;
		marcadasIntermedias = value.marcadasIntermedias;
		omitirFinDeSemana = value.omitirFinde;
	});

	//ANCHOR - Datos Filtrados
	// Computamos los datos filtrados en función del departamento seleccionado, el texto de búsqueda y la ordenación
	async function rangoFechalistener(fechaInicial: string, fechaFinal: string) {
		if (omitirFinDeSemana) {
			await fetchEntreFechas(user.departamento, fechaInicial, fechaFinal);
			filtrarMarcadasFinde(registros);
		} else {
			await fetchEntreFechas(user.departamento, fechaInicial, fechaFinal);
		}
	}

	async function fechaListener(fechaMarcada: string) {
		try {
			await fetchMarcada(selectedDepartamento, fechaMarcada);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error fetching data:', error.message);
			} else {
				console.error('Unknown error:', error);
			}
		}
	}

	onMount(async () => {
		const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		setFechaMarcada(defaultDate);
		updateSelectedDepartamento(user.departamento);
		await fechaListener(defaultDate);
	});
</script>

<body>
	<main class="main shadow:8|8|3|blue min-h:93vh">
		<div class="d:flex flex:row justify-content:space-between">
			<button on:click={logout} class="btn">Salir</button>
			<h1 class="text:center bg:white r:10 p:10 w:fit-content shadow:4|4|3|gray-70">
				Marcadas - {user.departamento}
			</h1>

			<a href="/credits" class="font-size:9">👻</a>
		</div>

		<NotificationContainer />

		<!-- // ANCHOR Tabs de departamentos -->
		<!-- Esto solo se muestra si es admin o el departamento es PEAP -->
		{#if user.departamentosPermitidos.length > 1 || isAdmin(user)}
			<div class="d:flex flex:row justify-content:space-between">
				<TabsDepartamento
					departamentos={user.departamentosPermitidos}
					bind:selectedDepartamento
				/>
			</div>
		{/if}

		{#if selectedDepartamento}
			<!-- // ANCHOR DatePicker y Botones de exportacion -->

			<div class="d:flex mb:10">
				<span> </span>
				<MainOptions
					on:toggleMarcadaDetalle={() => fechaListener(fechaMarcada)}
					on:toggleEntreFechas={() => {
						if (entreFechas) {
							console.log('entreFechas => '+entreFechas);
							fechaListener(fechaMarcada);
						}
					}}
					on:toggleOmitirFinde={() => {
						fechaListener(fechaMarcada);
					}}
					on:toggleMarcadaEstandar={() => {
						fechaListener(fechaMarcada);
					}}
				/>
				<span></span>

				{#if entreFechas}
					<RangeDatePicker
						on:rangoFechaDefinido={(e) =>
							rangoFechalistener(e.detail.fechaInicial, e.detail.fechaFinal)}
					/>
				{:else}
					<DatePicker on:fechaDefinida={(e) => fechaListener(e.detail.fecha)} />
				{/if}

				<BtnDescargar
					data={() => registros}
					placeholder="Descargar Vista Actual"
					filename="marcadas VA - {selectedDepartamento} {fechaMarcada}"
				/>
				<BtnDescargar
					data={() => $ausentes}
					placeholder="Descargar Ausentes"
					filename={`marcadas AD - ${selectedDepartamento} ${fechaMarcada}`}
				/>


			</div>

			<div>
				<SearchBar />
			</div>

			<!-- // ANCHOR DataTable -->
			{#if registros.length > 0 && selectedDepartamento}
				<div>
					<DataTable
						editable={isAdmin(user)} 
						marcadas={registros}
						
					/>
				</div>

				<!-- Contador de registros totales -->
				<div class="d:flex flex:col">
					<p class="font-size:18 bg:white r:10 p:10 w:fit-content">
						Total Ausentes: {totalAusentes}
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

