<script lang="ts">
	export let data;
	import DlCsv from '$lib/components/DlCsv.svelte';
  
	// Variables para búsqueda y departamentos
	let searchText = '';
	let departamentos = data.departamentos.sort((a, b) => a.DeptName.localeCompare(b.DeptName));
	let selectedDepartamento = departamentos[0];
  
	// Computamos los datos filtrados en función del departamento seleccionado y el texto de búsqueda
	$: filteredData = data.records.filter(
	  (persona: { Nombre: string; Departamento: string; MR: number }) =>
		persona.Departamento === selectedDepartamento.DeptName &&
		(persona.Nombre.toLowerCase().includes(searchText.toLowerCase()) ||
		  persona.MR.toString().includes(searchText))
	);
  
	// Redirige cuando se selecciona una nueva fecha
	function onDateChange(event: Event) {
	  const newDate = (event.target as HTMLInputElement).value;
	  const url = new URL(window.location.href);
	  url.searchParams.set('fecha', newDate);
	  window.location.href = url.toString();
	}
  </script>
  
  <main class="font-family:Comfortaa bg:rgb(51,87,155) r:12 p:12|15|20">
	<b>{data.fechaHoy}</b>
	<h1 class="text:center bg:white r:10 p:10 w:fit-content">
	  Presentismo - {data.hostname}
	</h1>
  
	<!-- DatePicker para seleccionar la fecha -->
	<input
	  type="date"
	  value={data.fechaHoy}
	  on:change={onDateChange}
	  class="date-picker"
	/>
  
	<!-- Tabs de departamentos -->
	{#if data.hostname === 'PEAP'}
	  <div class="tabs">
		{#each departamentos as departamento}
		  <button
			on:click={() => (selectedDepartamento = departamento)}
			class:selected={selectedDepartamento === departamento}
		  >
			{departamento.DeptName}
		  </button>
		{/each}
	  </div>
	{/if}
  
	<!-- Campo de búsqueda -->
	<input
	  type="text"
	  placeholder="Buscar por nombre o MR"
	  bind:value={searchText}
	  class="search-input"
	/>
  
	<!-- Tabla de datos filtrados -->
	<div>
	  <table>
		<thead class="font:bold">
		  <tr>
			<th>MR</th>
			<th>Nombre</th>
			<th>Departamento</th>
			<th>Salida</th>
			<th>Entrada</th>
		  </tr>
		</thead>
		<tbody class="font:bold bg:white">
		  {#each filteredData as persona}
			<tr>
			  <td>{persona.MR}</td>
			  <td>{persona.Nombre}</td>
			  <td>{persona.Departamento}</td>
			  <td>{persona.Salida}</td>
			  <td>{persona.Entrada}</td>
			</tr>
		  {/each}
		</tbody>
	  </table>
	</div>
  
	<DlCsv data={filteredData} />
  </main>
  
  <style>
	table {
	  width: 100%;
	  border-collapse: collapse;
	}
  
	th,
	td {
	  border: 1px solid #ccc;
	  padding: 8px;
	  text-align: left;
	}
  
	th {
	  background-color: #f4f4f4;
	}
  
	.search-input {
	  margin-bottom: 10px;
	  padding: 8px;
	  width: 99%;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	}
  
	.tabs {
	  display: flex;
	  margin-bottom: 10px;
	}
  
	button {
	  padding: 8px 16px;
	  margin-right: 4px;
	  cursor: pointer;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  background-color: white;
	}
  
	button.selected {
	  background-color: #007bff;
	  color: white;
	}
  
	.date-picker {
	  margin-bottom: 10px;
	  padding: 8px;
	  width: 99%;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	}
  </style>
  