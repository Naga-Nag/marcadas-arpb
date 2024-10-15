<script lang="ts">
    export let data;
    export let filteredData;
    export let sortDataBy;
    export let sortColumn;
    export let sortDirection;

    import { formatTime, getEstado } from '$lib/utils.js';

  </script>
  
  {#if data.error}
    <p>Hubo un error al cargar los datos: {data.error}</p>
  {:else}
    <table class="w:100% border:collapse">
      <thead>
        <tr>
          <th>
            MR
            <button
              on:click={() => sortDataBy('MR')}
              class={sortDirection === 'asc' && sortColumn === 'MR' ? 'active' : ''}>△</button>
            <button
              on:click={() => sortDataBy('MR')}
              class={sortDirection === 'desc' && sortColumn === 'MR' ? 'active' : ''}>▽</button>
          </th>
          <th>
            Nombre
            <button
              on:click={() => sortDataBy('Nombre')}
              class={sortDirection === 'asc' && sortColumn === 'Nombre' ? 'active' : ''}>△</button>
            <button
              on:click={() => sortDataBy('Nombre')}
              class={sortDirection === 'desc' && sortColumn === 'Nombre' ? 'active' : ''}>▽</button>
          </th>
          <th>Departamento</th>
          <th>Entrada</th>
          <th>Salida</th>
          <th>
            Estado
            <button
              on:click={() => sortDataBy('Estado')}
              class={sortDirection === 'asc' && sortColumn === 'Estado' ? 'active' : ''}>△</button>
            <button
              on:click={() => sortDataBy('Estado')}
              class={sortDirection === 'desc' && sortColumn === 'Estado' ? 'active' : ''}>▽</button>
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
  
  <style>
    th,
    td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
  
    th {
      background-color: #f4f4f4;
      position: relative;
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
  
    td {
      padding: 8px;
    }
  
    tr {
      border-collapse: separate;
    }
  
    th,
    td {
      border: 1px solid #ccc;
    }
  </style>
  