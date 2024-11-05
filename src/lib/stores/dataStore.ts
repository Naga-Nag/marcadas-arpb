import { writable } from 'svelte/store';

export const dataStore = writable({
  fechaMarcada: null,
  records: [],
  departamentos: [],
  hostname: null,
  error: null,
});