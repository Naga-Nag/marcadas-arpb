import { writable } from 'svelte/store';
import { getDepartamentoHost } from './utils';

export const globalStore = writable({
    loading: false,
    showEntreFechas: false,
    showMarcadaDetalle: true,
    selectedDepartamento: '',
    hostname: '',
    fechaMarcada:'',
});

export function updateSelectedDepartamento(departamento: string) {
    globalStore.update((state) => ({ ...state, selectedDepartamento: departamento }));
}

export function updateFechaMarcada(fecha: string) {
    globalStore.update((state) => ({ ...state, fechaMarcada: fecha }));
}

export function toggleMarcadaDetalle() {
    globalStore.update((state) => ({ ...state, showMarcadaDetalle: !state.showMarcadaDetalle }));
}

export function toggleEntreFechas() {
    globalStore.update((state) => {
        const newShowEntreFechas = !state.showEntreFechas;
        return { 
            ...state, 
            showEntreFechas: newShowEntreFechas, 
            showMarcadaDetalle: newShowEntreFechas ? true : state.showMarcadaDetalle 
        };
    });
}

export function setloadingData(loading: boolean) {
    globalStore.update((state) => ({...state, loading: loading}));
}

export function setHostname(hostname: string) {
    globalStore.update((state) => ({...state, hostname: hostname}));
}

globalStore.subscribe(value => console.log('globalStore data:', value));
