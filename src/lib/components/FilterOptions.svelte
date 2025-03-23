<script lang="ts">
	import { fade } from 'svelte/transition';
	import Tooltip from './tooltip.svelte';
	import { createEventDispatcher } from 'svelte';
	import { dataFilter, toggleOcultarBajas } from '$lib/stores/dataFilter';

	const dispatch = createEventDispatcher();

	let menuAbierto = false;

	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}

     let ocultarBajas: boolean;
     dataFilter.subscribe(($value) => {
         ocultarBajas = $value.ocultarBajas;
     })

</script>

<main on:mouseleave={() => (menuAbierto = false)}>
	<button class="bg:transparent b:unset mr:10" on:click={toggleMenu}>
		{#if menuAbierto}
			<span class="font-size:25 bg:white p:5 r:10"><img  class="w:25 h:25" src="filtro.png" alt=""></span>
		{:else}
			<span class="font-size:25"><img class="w:25 h:25" src="filtro.png" alt=""></span>
		{/if}
	</button>

	{#if menuAbierto}
		<div
			class="bg:white r:5 p:10 b:1|solid|#ccc d:flex position:absolute z:2 box-shadow:5|5|5|gray-70 flex:col"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<div class="flex:row">
                    <input type="checkbox" bind:checked={ocultarBajas} on:change={toggleOcultarBajas} />Mostrar Bajas
               </div>
		</div>
	{/if}
</main>
