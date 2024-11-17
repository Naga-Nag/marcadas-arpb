<!-- 
	events: fechaDefinida 
-->

<script lang="ts">
	import { writable } from 'svelte/store';
	import { createEventDispatcher, onMount } from 'svelte';
	import { updateFechaMarcada } from '$lib/globalStore';
	import { globalStore } from '$lib/globalStore';


	let hoy = new Date().toISOString().split('T')[0];
	export let fechaMarcada = writable(hoy);
	
	let isloading: boolean;
	globalStore.subscribe((value) => {
		isloading = value.loading;
	});

	const dispatch = createEventDispatcher();

	function handleDateChange(e: any) {
		console.log('DatePicker fecha definida:', e.target.value);
		updateFechaMarcada(e.target.value);
		dispatch('fechaDefinida', {
			fecha: e.target.value
		});
	}

	function setDateAyer() {
		if ($fechaMarcada !== '') {
			let ayer = new Date($fechaMarcada);
			ayer.setDate(ayer.getDate() - 1);
			$fechaMarcada = ayer.toISOString().split('T')[0];

			updateFechaMarcada($fechaMarcada);

			dispatch('fechaDefinida', {
				fecha: ayer.toISOString().split('T')[0]
			});
		}
		else {
			let ayer = new Date();
			ayer.setDate(ayer.getDate() - 1);
			$fechaMarcada = ayer.toISOString().split('T')[0];

			updateFechaMarcada($fechaMarcada);

			dispatch('fechaDefinida', {
				fecha: ayer.toISOString().split('T')[0]
			});
		}
	}

	function setDateMañana() {
		if ($fechaMarcada !== '') {
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
<div class="bg:white r:10 p:5 text:center noselect">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<button class="font-size:20 nakedbtn" on:click={setDateAyer} disabled={isloading}>◄</button>
	<input
		class="b:1|solid|#ccc p:5 mr:10 ml:10 w:99% r:15 w:fit-content"
		type="date"
		bind:value={$fechaMarcada}
		on:change={handleDateChange}
	/>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<button class="font-size:20 nakedbtn" on:click={setDateMañana} disabled={isloading || $fechaMarcada === hoy}>►</button>
</div>
