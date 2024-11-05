<script lang="ts">
	import { fade } from 'svelte/transition';

	export let toggleEntreFechas = () => {};

	let isMenuOpen = false;
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	
</script>

<button class="bg:transparent b:unset mr:10" on:click={toggleMenu}>
	{#if isMenuOpen}
	<span class="font-size:25 bg:white p:5 r:10">⚙️</span>
	{:else}
	<span class="font-size:25">⚙️</span>
	{/if}
	
</button>

{#if isMenuOpen}
	<div
		class="bg:white r:5 p:10 b:1|solid|#ccc d:flex position:absolute mt:5vh z:2 box-shadow:5|5|5|gray-70"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
	<input type="checkbox" on:change={toggleEntreFechas}>Entre Fechas
	</div>
{/if}
