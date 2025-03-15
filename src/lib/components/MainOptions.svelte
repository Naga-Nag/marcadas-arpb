<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		globalStore,
		toggleEntreFechas as TEF,
		toggleMarcadasIntermedias as TMI,
		toggleOmitirFinde as TOF,
		toggleMarcadaEstandar as TME,
		toggleMarcadasIntermedias
	} from '$lib/stores/global';
	import Tooltip from './tooltip.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let entreFechas: boolean;
	let marcadasIntermedias: boolean;
	let marcadaEstandar: boolean;

	let omitirFinde: boolean;

	globalStore.subscribe(($value) => {
		entreFechas = $value.entreFechas;
		marcadasIntermedias = $value.marcadasIntermedias;
		marcadaEstandar = $value.marcadaEstandar;
		omitirFinde = $value.omitirFinde;
	});

	let menuAbierto = false;

	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}

	function toggleMarcadaDetalle() {
		TMI();
		dispatch('toggleMarcadaDetalle');
	}

	function toggleEntreFechas() {
		TEF();
		dispatch('toggleEntreFechas');
	}

	function toggleOmitirFinde() {
		TOF();
		dispatch('toggleOmitirFinde');
	}

	function toggleMarcadaEstandar() {
		TME();
		dispatch('toggleMarcadaEstandar');
	}
</script>

<main on:mouseleave={() => (menuAbierto = false)}>
	<button class="bg:transparent b:unset mr:10" on:click={toggleMenu}>
		{#if menuAbierto}
			<span class="font-size:25 bg:white p:5 r:10">⚙️</span>
		{:else}
			<span class="font-size:25">⚙️</span>
		{/if}
	</button>

	{#if menuAbierto}
		<div
			class="bg:white r:5 p:10 b:1|solid|#ccc d:flex position:absolute z:2 box-shadow:5|5|5|gray-70 flex:col"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<div class="flex:row">
				<Tooltip text="Salida de Ayer / Entrada de Hoy"
					><input type="checkbox" checked={marcadaEstandar} on:change={toggleMarcadaEstandar} />
					Marcada Estandar</Tooltip
				>
			</div>

			<div class="flex:row">
				<input type="checkbox" checked={entreFechas} on:change={toggleEntreFechas} />Entre Fechas
			</div>
			{#if entreFechas}
				<div class="flex:row ml:20">
					<input type="checkbox" bind:checked={omitirFinde} on:change={toggleOmitirFinde} />Omitir
					fin de semana
				</div>
			{/if}
			<div class="flex:row">
				<input
					type="checkbox"
					checked={marcadasIntermedias}
					disabled={entreFechas}
					on:change={toggleMarcadasIntermedias}
				/>Marcadas Intermedias
			</div>
		</div>
	{/if}
</main>
