import { writable } from 'svelte/store';

export const globalStore = writable({
    loading: false,
    showEntreFechas: false,
    omitirFinde: false,
    showMarcadaDetalle: true,
    selectedDepartamento: '',
    hostname: '',
    fechaMarcada:'',
    departamentos: [] as string[],
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

export function toggleOmitirFinde() {
    globalStore.update((state) => ({ ...state, omitirFinde: !state.omitirFinde }));
}

export function setloadingData(loading: boolean) {
    globalStore.update((state) => ({...state, loading: loading}));
}

export function setHostname(hostname: string) {
    globalStore.update((state) => ({...state, hostname: hostname}));
}

export function setDepartamentos(departamentos: string[]) {
    globalStore.update((state) => ({...state, departamentos: departamentos}));
}

globalStore.subscribe(value => console.log('globalStore data:', value));
