<script lang="ts">
	export let data;
	export let filteredData;
	export let sortDataBy;
	export let sortColumn;
	export let sortDirection;

	import { formatTime, getEstado } from '$lib/utils.js';
</script>

<div class="table-container">
	{#if data.error}
		<p>Hubo un error al cargar los datos: {data.error}</p>
	{:else}
		<table class="table">
			<thead>
				<tr>
					<th>
						MR
						<button
							on:click={() => sortDataBy('MR')}
							class={sortDirection === 'asc' && sortColumn === 'MR' ? 'active' : ''}>△</button
						>
						<button
							on:click={() => sortDataBy('MR')}
							class={sortDirection === 'desc' && sortColumn === 'MR' ? 'active' : ''}>▽</button
						>
					</th>
					<th>
						Nombre
						<button
							on:click={() => sortDataBy('Nombre')}
							class={sortDirection === 'asc' && sortColumn === 'Nombre' ? 'active' : ''}>△</button
						>
						<button
							on:click={() => sortDataBy('Nombre')}
							class={sortDirection === 'desc' && sortColumn === 'Nombre' ? 'active' : ''}>▽</button
						>
					</th>
					<th>Departamento</th>
					<th>Entrada</th>
					<th>Salida</th>
					<th>
						Estado
						<button
							on:click={() => sortDataBy('Estado')}
							class={sortDirection === 'asc' && sortColumn === 'Estado' ? 'active' : ''}>△</button
						>
						<button
							on:click={() => sortDataBy('Estado')}
							class={sortDirection === 'desc' && sortColumn === 'Estado' ? 'active' : ''}>▽</button
						>
					</th>
				</tr>
			</thead>
			<tbody class="bg:white overflow:scroll-y">
				{#each filteredData as persona}
					<tr
						class={!persona.Entrada && !persona.Salida
							? 'no-marcado'
							: (persona.Entrada && !persona.Salida) || (!persona.Entrada && persona.Salida)
								? 'falta-marcado'
								: ''}
					>
						<td>{persona.MR}</td>
						<td>{persona.Nombre}</td>
						<td>{persona.Departamento}</td>
						<td>{persona.Entrada ? formatTime(persona.Entrada) : ''}</td>
						<td>{persona.Salida ? formatTime(persona.Salida) : ''}</td>
						<td>{getEstado(persona)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
  .table-container {
    max-height:550px; /* Altura máxima del área de la tabla */
    overflow-y: auto;  /* Habilitar el scroll vertical */
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
    position: sticky;
    top: 0; /* Mantener el encabezado fijo en la parte superior */
    z-index: 1;
  }

  th button {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 5px;
  }

  th button.active {
    font-weight: bold;
    color: #007bff;
  }

  tr.no-marcado {
    border: 2px solid red;
  }

  tr.falta-marcado {
    border: 2px solid orange;
  }

  tbody tr {
    border-collapse: separate;
  }
</style>
