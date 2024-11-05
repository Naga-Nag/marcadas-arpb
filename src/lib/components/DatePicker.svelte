<script lang="ts">
	export let fechaMarcada: string;

	function setDateAyer() {
		if (fechaMarcada !== null) {
			let tomorrow = new Date(fechaMarcada);
			tomorrow.setDate(tomorrow.getDate() - 1);
			const url = new URL(window.location.href);
			url.searchParams.set('fecha', tomorrow.toISOString().split('T')[0]);
			window.location.href = url.toString();
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}

	function setDateMañana() {
		if (fechaMarcada !== null) {
			let yesterday = new Date(fechaMarcada);
			yesterday.setDate(yesterday.getDate() + 1);
			const url = new URL(window.location.href);
			url.searchParams.set('fecha', yesterday.toISOString().split('T')[0]);
			window.location.href = url.toString();
		} else {
			// Handle the case where data.fechaMarcada is null
			// For example, you could set a default date or throw an error
		}
	}

	// Redirige cuando se selecciona una nueva fecha
	function onDateChange(event: Event) {
		const newDate = (event.target as HTMLInputElement).value;
		const url = new URL(window.location.href);
		url.searchParams.set('fecha', newDate);
		window.location.href = url.toString();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="bg:white r:10 p:5 text:center">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span
		class="font-size:20 cursor:pointer"
		on:click={setDateAyer}>◄</span
	>
	<input
		class="b:1|solid|#ccc p:5 mr:10 ml:10 w:99% r:15 w:fit-content"
		type="date"
		value={fechaMarcada}
		on:change={onDateChange}
	/>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<span class="font-size:20 cursor:pointer" on:click={setDateMañana}>►</span>
</div>
