// src/lib/stores/notifications.js
import { writable } from 'svelte/store';
import type { Notification } from '$lib/utils/types';

export const notifications = writable<Notification[]>([]);

// Add a new notification
export function notify({ title, message, duration = 3000, type }: Notification) {
    const id = Date.now(); // Generate a unique ID automatically
    notifications.update((current) => [...current, { id, title, message, duration, type }]);

    // Automatically remove the notification after the duration
    setTimeout(() => {
        removeNotification(id);
    }, duration);
}

// Remove a notification by ID
export function removeNotification(id: number) {
    notifications.update((current) => current.filter((notification) => notification.id !== id));
}
