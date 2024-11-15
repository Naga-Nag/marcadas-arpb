<!-- 
	events: fechaDefinida 
-->

<script lang="ts">
	import { writable } from 'svelte/store';
	import { createEventDispatcher, onMount } from 'svelte';
	import { updateFechaMarcada } from '$lib/globalStore';

	export let fechaMarcada = writable('');
	const dispatch = createEventDispatcher();

	function handleDateChange(e: any) {
		console.log('DatePicker fecha definida:', e.target.value);
		updateFechaMarcada(e.target.value);
		dispatch('fechaDefinida', {
			fecha: e.target.value
		});
	}

	function setDateAyer() {
		if (fechaMarcada !== null) {
			let ayer = new Date($fechaMarcada);
			ayer.setDate(ayer.getDate() - 1);
			$fechaMarcada = ayer.toISOString().split('T')[0];

			updateFechaMarcada($fechaMarcada);

			dispatch('fechaDefinida', {
				fecha: ayer.toISOString().split('T')[0]
			});
		}
	}

	function setDateMañana() {
		if (fechaMarcada !== null) {
			let mañana = new Date($fechaMarcada);
			mañana.setDate(mañana.getDate() + 1);
			$fechaMarcada = mañana.toISOString().split('T')[0];

			updateFechaMarcada($fechaMarcada);

			dispatch('fechaDefinida', {
				fecha: mañana.toISOString().split('T')[0]
			});
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
		bind:value={$fechaMarcada}
		on:change={handleDateChange}
	/>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span class="font-size:20 cursor:pointer" on:click={setDateMañana}>►</span>
</div>
