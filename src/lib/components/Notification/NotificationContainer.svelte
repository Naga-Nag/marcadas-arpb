<script lang="ts">
    import { notifications } from '$lib/stores/notifications';
	import Notification from './Notification.svelte';
    import type { Notification as NotificationItem} from '$lib/types/types';

    let notificationList: NotificationItem[] = [];
    notifications.subscribe((list) => (notificationList = list));
</script>

<div class="notification-container">
    {#each notificationList as notification (notification.id)}
        <Notification
            id={notification.id}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            type={notification.type}
        />
    {/each}
</div>

<style>
    .notification-container {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px; /* Add spacing between notifications */
    }
</style>
