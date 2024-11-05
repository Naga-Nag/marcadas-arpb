<script lang="ts">
	export let data: any;
	import BtnDescargar from '$lib/components/BtnDescargar.svelte';
	import TabsDepartamento from '$lib/components/TabsDepartamento.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import RangeDatePicker from '$lib/components/RangeDatePicker.svelte';

	import { getEstado } from '$lib/utils.js';

	// Variables para búsqueda y departamentos
	let registros = data.records;
	let searchText = '';
	let departamentos: string[] = data.departamentos
		.map((depto: { DeptName: string }) => depto.DeptName)
		.sort((a: string, b: string) => a.localeCompare(b));
	let selectedDepartamento: string = data.hostname ?? '';

	// Buscar el departamento que coincida con el hostname
	if (data.hostname) {
		selectedDepartamento = departamentos.find((depto) => depto === data.hostname) ?? '';
	}

	// Computamos los datos filtrados en función del departamento seleccionado, el texto de búsqueda y la ordenación
	$: filteredData = registros
		.filter((persona: { Nombre: string; Departamento: string; MR: number }) => {
			// Si el hostname es PEAP, filtramos por departamento, si no, ignoramos el departamento
			if (data.hostname === 'PEAP') {
				if (selectedDepartamento === 'ARPB') {
					return (
						persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
						persona.MR.toString().includes(searchText)
					);
				} else {
					return (
						persona.Departamento === selectedDepartamento &&
						(persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
							persona.MR.toString().includes(searchText))
					);
				}
			} else {
				// Si no es PEAP, solo filtramos por el texto de búsqueda
				return (
					(persona.Departamento === selectedDepartamento &&
						persona.Nombre.toLowerCase().includes(searchText.toLowerCase())) ||
					persona.MR.toString().includes(searchText)
				);
			}
		}) //Agregamos estado a cada marcada
		.map((persona: { Entrada: string; Salida: string }) => ({
			...persona,
			Estado: getEstado(persona)
		}));

	$: filteredAusentesDepartamento = filterAusentesDepartamento(selectedDepartamento);

	// Redirige cuando se selecciona una nueva fecha
	function onDateChange(event: Event) {
		const newDate = (event.target as HTMLInputElement).value;
		const url = new URL(window.location.href);
		url.searchParams.set('fecha', newDate);
		window.location.href = url.toString();
	}

	function setDateAyer() {
		if (data.fechaMarcada !== null) {
			let tomorrow = new Date(data.fechaMarcada);
			tomorrow.setDate(tomorrow.getDate() - 1);
			const url = new URL(window.location.href);
			url.searchParams.set('fecha', tomorrow.toISOString().split('T')[0]);
			window.location.href = url.toString();
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}

	function setDateMañana() {
		if (data.fechaMarcada !== null) {
			let yesterday = new Date(data.fechaMarcada);
			yesterday.setDate(yesterday.getDate() + 1);
			const url = new URL(window.location.href);
			url.searchParams.set('fecha', yesterday.toISOString().split('T')[0]);
			window.location.href = url.toString();
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}

	function filterAusentes() {
		return data.records.filter(
			(persona: { Entrada: any; Salida: any }) => !persona.Entrada || !persona.Salida
		);
	}

	function filterAusentesDepartamento(dep: String) {
		let datos = data.records.filter(
			(persona: { Departamento: string; Entrada: any; Salida: any }) =>
				persona.Departamento === selectedDepartamento && (!persona.Entrada || !persona.Salida)
		);
		return datos;
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
			<TabsDepartamento {departamentos} bind:selectedDepartamento />
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
			
			<RangeDatePicker></RangeDatePicker>

			<BtnDescargar
				data={filteredData}
				placeholder="Descargar Vista Actual"
				filename="marcadas VA - {selectedDepartamento} {data.fechaMarcada}"
			/>
			<BtnDescargar
				data={filteredAusentesDepartamento}
				placeholder="Descargar Ausentes del Departamento"
				filename="marcadas AD - {selectedDepartamento} {data.fechaMarcada}"
			/>
			{#if data.hostname === 'PEAP'}
				<BtnDescargar
					data={filterAusentes()}
					placeholder="Descargar Todos los Ausentes"
					filename="marcadas TD {data.fechaMarcada}"
				/>
			{/if}
		</div>

		<!-- Tabla de datos filtrados -->
		<DataTable registros={filteredData} />

		<!-- Cuenta de registros -->
		<div class="d:flex flex:col">
			<p class="font-size:18 bg:white r:10 p:10 w:fit-content">
				Total Ausentes: {filterAusentesDepartamento(selectedDepartamento).length}
			</p>
		</div>
	</main>
</body>

<style>
	body {
		background: linear-gradient(-180deg, #306cce, #2eb7e9);
		background-size: 200% 200%;
	}
</style>
