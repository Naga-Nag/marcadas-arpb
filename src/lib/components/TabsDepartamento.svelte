<script lang="ts">
	export let departamentos: string[];
	export let selectedDepartamento: string;
	
	
	import { updateSelectedDepartamento} from '$lib/stores/global';
	import { onMount } from 'svelte';

	function selectDepartamento(departamento: string) {
		if (selectedDepartamento !== departamento) {
			selectedDepartamento = departamento;
			updateSelectedDepartamento(departamento);
		}
	}

	departamentos.sort((a, b) => {
		if (a === 'ARPB') {
			return -1; // 'ARPB' should come first
		}
		if (b === 'ARPB') {
			return 1; // 'ARPB' should come first
		}
		return a.localeCompare(b); // Sort the remaining elements alphabetically
	});

	async function getDepartamentos() {
		let res = await fetch('/api/fetchDepartamentos/');
		return res.json()
	}

	onMount(async () => {
		departamentos = await getDepartamentos();
	});
	
</script>

<div
	class="d:flex mb:10 mt:10 p:5|5|5|5 overflow-x:auto size:6::scrollbar bg:gray/.2::scrollbar-thumb"
>
	{#each departamentos as departamento}
		<button
			class="btn ml:5"
			on:click={() => selectDepartamento(departamento)}
			class:selected={selectedDepartamento === departamento}
		>
			{departamento}
		</button>
	{/each}
</div>

<style>
	.selected {
		outline: 3px solid #30ce5d;
		background-color: #30ce5d;
		transition: outline 0.3s linear;
	}
</style>
