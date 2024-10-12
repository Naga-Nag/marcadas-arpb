<script lang="ts">
    import { downloadCSV } from '$lib/utils';
    export let data: any;
    export let placeholder = 'Descargar CSV';
    export let className = '';
</script>

<main>
    <button class="btn r:10 p:10 bg:beryl font:white font:bold {className}"
		on:click={() => downloadCSV(data)}>
        {placeholder}
	</button>
</main>