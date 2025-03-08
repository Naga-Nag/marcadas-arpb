<script>
	import { setSearchText } from '$lib/stores/global';
 
	let searchText = '';
 
	function updateSearch() {
	    setSearchText(searchText);
	}
	
 </script>
 
 <div class="search-container">
	<input
	    type="text"
	    bind:value={searchText}
	    on:input={updateSearch}
	    placeholder="Buscar por nombre, departamento, matricula o cuil..."
	    class="b:1|solid|#ccc mb:10 p:8 w:99% r:4"
	/>
 </div>
 