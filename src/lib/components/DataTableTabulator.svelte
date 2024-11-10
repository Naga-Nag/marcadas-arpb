<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import { onMount } from 'svelte';
  import { sortTime } from '$lib/utils';

  let data: any = [];
  let tableComponent: HTMLElement;

  
  async function fechaListener(fechaMarcada: string): Promise<Record<string, any>> {
    let url = `/api/fetchMarcadas/`;
    let payload = { fechaMarcada };
    try {
      console.log('Fetching data... MarcadaDelDia:', fechaMarcada);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        data = await response.json();
      } else {
        console.error('Error fetching data:', response.json());
        return {};
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    return {};
  }

  let columns: any = [
    { title: 'CUIL', field: 'CUIL' },
    { title: 'DNI', field: 'DNI' },
    { title: 'MR', field: 'MR' },
    { title: 'Nombre', field: 'Nombre' },
    { title: 'Departamento', field: 'Departamento' },
    { title: 'Entrada', field: 'Entrada', sorter:"date", sorterParams:{
    format:"yyyy-MM-dd",
    alignEmptyValues:"top",
}},
    { title: 'Salida', field: 'Salida' },
    
  ];

  onMount(async () => {
    await fechaListener('2023-08-03');
    new Tabulator(tableComponent, {
      
      data: data, // link data to table
      reactiveData: true, // enable data reactivity
      columns: columns, // define table columns
      progressiveLoad:"scroll",
      paginationSize:20,
      
    });
  });
</script>

<div bind:this={tableComponent}></div>

<svelte:head>
  <link
    href="https://unpkg.com/tabulator-tables@4.9.1/dist/css/tabulator.min.css"
    rel="stylesheet"
  />
</svelte:head>