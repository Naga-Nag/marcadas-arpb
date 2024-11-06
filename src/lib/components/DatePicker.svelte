<script lang="ts">
	import { fechaStore, updatefecha } from '$lib/stores/fechaStore';
	import { createEventDispatcher } from 'svelte';

	export let fechaMarcada: string = '';

	const dispatch = createEventDispatcher();

	fechaStore.subscribe(($fechas) => {
		fechaMarcada = $fechas.fechaMarcada;
	});
	
	function onCambioFecha() {
		dispatch('cambioFecha', {
			fecha: fechaMarcada
		});
	}
	function handleInputChange(e: any) {
		updatefecha(e.target.value);
		onCambioFecha();
	}

	function setDateAyer() {
		if (fechaMarcada !== null) {
			let tomorrow = new Date(fechaMarcada);
			tomorrow.setDate(tomorrow.getDate() - 1);
			updatefecha(tomorrow.toISOString().split('T')[0]);
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}

	function setDateMañana() {
		if (fechaMarcada !== null) {
			let yesterday = new Date(fechaMarcada);
			yesterday.setDate(yesterday.getDate() + 1);
			updatefecha(yesterday.toISOString().split('T')[0]);
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="bg:white r:10 p:5 text:center">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span class="font-size:20 cursor:pointer" on:click={setDateAyer}>◄</span>
	<input
		class="b:1|solid|#ccc p:5 mr:10 ml:10 w:99% r:15 w:fit-content"
		type="date"
		value={fechaMarcada}
		on:change={handleInputChange}
	/>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span class="font-size:20 cursor:pointer" on:click={setDateMañana}>►</span>
</div>
