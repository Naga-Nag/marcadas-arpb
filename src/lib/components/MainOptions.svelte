<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		globalStore,
		toggleEntreFechas as TEF,
		toggleMarcadasIntermedias as TMI,
		toggleOmitirFinde as TOF,
		toggleMarcadaEstandar as TME,
		toggleMarcadasIntermedias,
		toggleOcultarBajas,
	} from '$lib/stores/global';
	import Tooltip from './tooltip.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let entreFechas: boolean;
	let marcadasIntermedias: boolean;
	let marcadaEstandar: boolean;

	let ocultarBajas: boolean;
	let omitirFinde: boolean;

	globalStore.subscribe(($value) => {
		entreFechas = $value.entreFechas;
		marcadasIntermedias = $value.marcadasIntermedias;
		marcadaEstandar = $value.marcadaEstandar;
		omitirFinde = $value.omitirFinde;
		ocultarBajas = $value.ocultarBajas;
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
		<span class="font-size:25 p:5 r:10 {menuAbierto ? 'rotate' : 'rotate-back'}">⚙️</span>
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
				<Tooltip text="Todas las marcadas del día">
					<input
						type="checkbox"
						checked={marcadasIntermedias}
						disabled={entreFechas}
						on:change={toggleMarcadasIntermedias}
					/>Marcadas Intermedias
				</Tooltip>
			</div>

			<div class="flex:row">
				<input type="checkbox" bind:checked={ocultarBajas} on:change={toggleOcultarBajas} />Ocultar Personal Inactivo
			</div>
		</div>
	{/if}
</main>

<style>
	.rotate {
		animation: rotate 0.3s ease-in-out forwards;
	}
	.rotate-back {
		animation: rotate-back 0.3s ease-in-out forwards;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(180deg);
		}
	}

	@keyframes rotate-back {
		from {
			transform: rotate(180deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
</style>
