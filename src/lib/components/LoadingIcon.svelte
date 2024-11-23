<script>
	import { globalStore } from '$lib/utils/globalStore';
	$: loading = false;

	globalStore.subscribe((value) => {
		loading = value.loading;
	});
</script>

{#if loading}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src="/loading.gif" width="40" height="40" class="mt:16 mr:10 ml:10">
{/if}

<style>
</style>
