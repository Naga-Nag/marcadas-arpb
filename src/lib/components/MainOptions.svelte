<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		globalStore,
		toggleEntreFechas as TEF,
		toggleMarcadaDetalle as TMD
	} from '$lib/utils/globalStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let showEntreFechas: boolean;
	let showMarcadaDetalle: boolean;

	globalStore.subscribe(($value) => {
		showEntreFechas = $value.showEntreFechas;
		showMarcadaDetalle = $value.showMarcadaDetalle;
	});

	let menuAbierto = false;
	let omitirFinDeSemana = false; // Nuevo estado

	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}

	function toggleMarcadaDetalle() {
		dispatch('toggleMarcadaDetalle');
		TMD();
	}

	function toggleEntreFechas() {
		dispatch('toggleEntreFechas');
		TEF();
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
				<input type="checkbox" checked={showEntreFechas} on:change={toggleEntreFechas} />Entre
				Fechas
			</div>
			{#if showEntreFechas}
				<div class="flex:row ml:20"> <!-- Añade tabulación -->
					<input
						type="checkbox"
						bind:checked={omitirFinDeSemana}
					/>Omitir fin de semana
				</div>
			{/if}
			<div class="flex:row">
				<input
					type="checkbox"
					checked={showMarcadaDetalle}
					disabled={showEntreFechas}
					on:change={toggleMarcadaDetalle}
				/>Marcadas Unicas
			</div>
		</div>
	{/if}
</main>
