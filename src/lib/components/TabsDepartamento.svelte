<script lang="ts">
	export let departamentos: {DeptName: string}[];
    export let selectedDepartamento: {DeptName: string};
	export let hostname;
</script>

{#if hostname === 'PEAP'}
	<div class="d:flex mb:10 mt:10 overflow-x:auto overflow:visible">
		{#each departamentos as departamento}
			<button
				class="btn ml:5"
				on:click={() => (selectedDepartamento = departamento)}
				class:selected={selectedDepartamento === departamento}
			>
				{departamento.DeptName}
			</button>
		{/each}
	</div>
{/if}
