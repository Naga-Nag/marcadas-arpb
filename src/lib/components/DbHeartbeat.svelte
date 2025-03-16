<script lang="ts">
	import { heartbeat } from '$lib/utils/mainController.js';
	import { onMount } from 'svelte';
	let connected: boolean = false;

	onMount(() => {
          heartbeat().then((result) => {
            connected = result;
          });
     });
     
	$: (async () => {
		while (true) {
			connected = await heartbeat();
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	})();
</script>

<div class={`heartbeat ${connected ? 'connected' : 'paused'}`} />

<style>
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
