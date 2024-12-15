<!-- 
	events: rangoFechaDefinido
-->

<script>
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();

	let fechaInicial = writable('');
	let fechaFinal = writable('');

	function handleDateChange() {
		console.log('RangeDatepicker selected range:', $fechaInicial, $fechaFinal);
		if ($fechaInicial !== '' && $fechaFinal !== '') {
			dispatch('rangoFechaDefinido', {
				fechaInicial: $fechaInicial,
				fechaFinal: $fechaFinal
			});
		}
	}

</script>

<div class="date-picker mt:2.5 color:white">
	<div>
		<label for="start">Inicio</label>
		<input
			type="date"
			id="start"
			bind:value={$fechaInicial}
			on:change={handleDateChange}
			class:selected-date={$fechaInicial ? 'selected' : ''}
		/>
	</div>
	<div>
		<label for="end">Final</label>
		<input
			type="date"
			id="end"
			bind:value={$fechaFinal}
			on:change={handleDateChange}
			class:selected-date={$fechaFinal ? 'selected' : ''}
		/>
	</div>
</div>

<style>
	.date-picker {
		display: flex;
		gap: 1rem;
	}

	input[type='date'] {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	input[type='date'].selected-date {
		color: #fff; /* Change text color for selected date */
		background-color: #429643; /* Change background color for selected date */
		border-color: #4caf50;
	}
</style>
