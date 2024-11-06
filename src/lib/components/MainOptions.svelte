<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	
	export let menuEntreFechas = false;
	let menuAbierto = false;
	function toggleMenu() {
		menuAbierto = !menuAbierto;
		/* dispatch('menuEntreFechas', {
			entreFechas: !menuEntreFechas
		}); */
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
			class="bg:white r:5 p:10 b:1|solid|#ccc d:flex position:absolute z:2 box-shadow:5|5|5|gray-70"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<input type="checkbox" value={menuEntreFechas} on:change={toggleMenu} />Entre Fechas
		</div>
	{/if}
</main>
