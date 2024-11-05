import { writable } from 'svelte/store';

export const tabStore = writable({
  selDepa: '',
});

export function updateDepaTab(depa: string) {
  tabStore.update((state) => ({ ...state, selDepa: depa }));
}