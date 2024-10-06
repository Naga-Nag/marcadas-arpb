<script lang="ts">
    import { downloadCSV } from '$lib/utils';
    export let data: any;
</script>

<main>
    <button class="r:10 p:10 mt:12 bg:beryl font:white font:bold"
		on:click={() => downloadCSV(data)}>
        Descargar CSV
	</button>
</main>