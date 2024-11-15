<script>
	import { globalStore } from '$lib/globalStore';
	let loading = false;

	globalStore.subscribe((value) => {
		loading = value.loading;
	});
</script>

{#if loading}
    <h1>Cargando datos</h1>
{/if}

<style>
	h1 {
		color: white;
		position: absolute;
		z-index: 2;
		top: 50%;
		right: 50%;
	}
</style>
