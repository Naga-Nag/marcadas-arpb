<script lang="ts">
	import { heartbeat } from '$lib/utils/mainController.js';
	import { onMount } from 'svelte';

	export let connected: boolean = false;

	async function checkHeartbeat() {
		try {
			connected = await heartbeat();
		} catch (error) {
			console.error('Error during heartbeat check', error); // This will log any errors in the `heartbeat` call
		}

		// After completing the check, schedule the next check with a 5-second delay
		setTimeout(checkHeartbeat, 2000); // Recursive call with a delay
	}

	onMount(async () => {
		await checkHeartbeat(); // Start the heartbeat check when the component mounts
	});
</script>

<div class="status">
	<div class={`heartbeat ${connected ? 'connected' : 'paused'}`} />
	<span class="font-size:18">{connected ? 'Conectado a la base de datos' : 'Desconectado de la base de datos'}</span>
</div>
<br>

<style>
	.status {
		display: flex;
		align-items: center;
	}

	.heartbeat {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: red;
		animation: pulse 1s infinite;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;
		margin-right: 10px; /* Add some space between the heartbeat and the text */
	}

	.heartbeat.connected {
		background-color: green;
		box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
	}

	.heartbeat.paused {
		animation-play-state: paused;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
