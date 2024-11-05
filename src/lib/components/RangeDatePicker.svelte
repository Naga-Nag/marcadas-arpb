<script>
    import { writable } from 'svelte/store';
  
    // Define start and end dates as writable stores
    let startDate = writable('');
    let endDate = writable('');
  
    // Optional: Ensure endDate is after startDate
    $: if (startDate && endDate && new Date($endDate) < new Date($startDate)) {
      endDate.set($startDate);
    }
  
    // Optional: Run something when the range is selected
    function handleDateChange() {
      console.log("Selected range:", $startDate, $endDate);

      
    }
  </script>
  
  
  
  <div class="date-picker color:white mt:2.5">
    <div>
      <label for="start">Inicio</label>
      <input
        type="date"
        id="start"
        bind:value={$startDate}
        on:change={handleDateChange}
      />
    </div>
    <div>
      <label for="end">Final</label>
      <input
        type="date"
        id="end"
        bind:value={$endDate}
        on:change={handleDateChange}
      />
    </div>
  </div>


  <style>
    .date-picker {
      display: flex;
      gap: 1rem;
    }

    input[type="date"] {
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  </style>