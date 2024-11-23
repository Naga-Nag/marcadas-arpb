<script lang="ts">
	import { downloadExcel } from '$lib/utils/utils';
	export let data: any;
	export let placeholder = 'Descargar Excel';
	export let className = '';
	export let filename: string;
</script>

<main>
	<button
		class="btn bg:beryl bg:rgb(0,150,105):hover transition:background-color|200ms|ease-in-out font:white {className} ml:5"
		on:click={() => downloadExcel(data, filename)}
	>
		{placeholder}
	</button>
</main>