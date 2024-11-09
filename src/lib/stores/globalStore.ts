import { writable } from 'svelte/store';
import os from 'os';

export const globalStore = writable({
    showEntreFechas: false,
    selectedDepartamento: ''
});