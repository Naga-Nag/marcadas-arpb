<script lang="ts">
	// Variables para búsqueda y departamentos
	let debouncedSearchText = '';
	let timeout: ReturnType<typeof setTimeout>;
	let searchText: string = '';
	$: {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			searchText = debouncedSearchText;
		}, 50); // *ms debounce
	}
</script>

<input
	type="text"
	placeholder="Buscar por nombre o MR"
	bind:value={debouncedSearchText}
	class="b:1|solid|#ccc mb:10 p:8 w:99% r:4"
/>
