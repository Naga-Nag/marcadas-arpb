import { writable } from 'svelte/store';

export const globalStore = writable({
    showEntreFechas: false,
    selectedDepartamento: '',
});

export function updateSelectedDepartamento(departamento: string) {
    globalStore.update((state) => ({ ...state, selectedDepartamento: departamento }));
}

export function toggleEntreFechas() {
    globalStore.update((state) => ({ ...state, showEntreFechas: !state.showEntreFechas }));
}


globalStore.subscribe(value => console.log('globalStore data:', value));
