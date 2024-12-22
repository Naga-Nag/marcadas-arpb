<script lang="ts">
	import { notify } from '$lib/stores/notifications';
	import {NotificationContainer} from '$lib/components/components';

	function addNotification() {
		notify({
			id: Date.now(),
			title: 'Dynamic Notification',
			message: 'This notification was added dynamically!',
			duration: 4000,
            type: 'success'
		});
	}
</script>

<button on:click={addNotification}>Add Notification</button>

<NotificationContainer />
