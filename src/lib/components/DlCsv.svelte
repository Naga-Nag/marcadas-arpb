<script lang="ts">
    import { downloadCSV } from '$lib/utils';
    export let data: any;
    export let placeholder = 'Descargar CSV';
    export let className = '';
</script>

<main>
    <button class="btn r:10 p:10 bg:beryl bg:fade-50:hover font:white font:bold cursor:pointer {className}"
		on:click={() => downloadCSV(data)}>
        {placeholder}
	</button>
</main>