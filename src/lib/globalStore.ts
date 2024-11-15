import { writable } from 'svelte/store';

export const globalStore = writable({
    loading: false,
    showEntreFechas: false,
    selectedDepartamento: '',
    fechaMarcada:'',
});

export function updateSelectedDepartamento(departamento: string) {
    globalStore.update((state) => ({ ...state, selectedDepartamento: departamento }));
}

export function updateFechaMarcada(fecha: string) {
    globalStore.update((state) => ({ ...state, fechaMarcada: fecha }));
}

export function toggleEntreFechas() {
    globalStore.update((state) => ({ ...state, showEntreFechas: !state.showEntreFechas }));
}

export function setloadingData(loading: boolean) {
    globalStore.update((state) => ({...state, loading: loading}));
}

globalStore.subscribe(value => console.log('globalStore data:', value));
