import type { Marcada } from '$lib/types/gen';
import { get, writable } from 'svelte/store';

export const globalStore = writable({
    loading: false,
    showEntreFechas: false,
    omitirFinde: false,
    showMarcadaDetalle: true,
    selectedDepartamento: '',
    fechaMarcada: '',
    marcadas: [] as Marcada[],
    departamentos: [] as string[],
});

/**
 * Updates the `selectedDepartamento` in the global store.
 *
 * @param departamento - The name of the department to set as selected.
 */

export function updateSelectedDepartamento(departamento: string) {
    globalStore.update((state) => ({ ...state, selectedDepartamento: departamento }));
}

/**
 * Toggles the `showMarcadaDetalle` value in the global store.
 *
 * @example
 * toggleMarcadaDetalle();
 */
export function toggleMarcadaDetalle() {
    globalStore.update((state) => ({ ...state, showMarcadaDetalle: !state.showMarcadaDetalle }));
}

/**
 * Toggles the `showEntreFechas` value in the global store. If `showEntreFechas` is
 * being set to `true`, `showMarcadaDetalle` is also set to `true`. If
 * `showEntreFechas` is being set to `false`, `showMarcadaDetalle` is left
 * unchanged.
 *
 * @example
 * toggleEntreFechas();
 */
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

/**
 * Toggles the `omitirFinde` value in the global store.
 *
 * @example
 * toggleOmitirFinde();
 */
export function toggleOmitirFinde() {
    globalStore.update((state) => ({ ...state, omitirFinde: !state.omitirFinde }));
}


/**
 * Updates the `loading` status in the global store.
 *
 * @param loading - A boolean indicating the loading status to set.
 * 
 * @example
 * setloadingData(true);
 */

export function setloadingData(loading: boolean) {
    globalStore.update((state) => ({ ...state, loading: loading }));
}


/**
 * Updates the `departamentos` list in the global store.
 *
 * @param departamentos - The list of department names to set in the global store.
 *
 * @example
 * setDepartamentos(['ARPB', 'IFAP']);
 */
export function setDepartamentos(departamentos: string[]) {
    globalStore.update((state) => ({ ...state, departamentos: departamentos }));
}

export function setMarcadas(marcadas: Marcada[]) {
    globalStore.update((state) => ({ ...state, marcadas: marcadas }));
}

//No es tiempo real
export function getMarcadas() {
    let marcadas: Marcada[] = [];
    globalStore.subscribe(state => marcadas = state.marcadas)();
    return marcadas;
}

export function clearMarcadas() {
    globalStore.update((state) => ({ ...state, marcadas: [] }));
}

export const getSelectedDepartamento = () => {
    let selectedDepartamento: string = '';
    globalStore.subscribe(state => selectedDepartamento = state.selectedDepartamento)();
    return selectedDepartamento;
}

export const getShowMarcadaDetalle = () => {
    let showMarcadaDetalle: boolean = false;
    globalStore.subscribe(state => showMarcadaDetalle = state.showMarcadaDetalle)();
    return showMarcadaDetalle;
}

export const getShowEntreFechas = () => {
    let showEntreFechas: boolean = false;
    globalStore.subscribe(state => showEntreFechas = state.showEntreFechas)();
    return showEntreFechas;
}

export const getOmitirFinde = () => {
    let omitirFinde: boolean = false;
    globalStore.subscribe(state => omitirFinde = state.omitirFinde)();
    return omitirFinde;
}

export const getfechaMarcada = () => {
    let fechaMarcada: string = '';
    globalStore.subscribe(state => fechaMarcada = state.fechaMarcada)();
    return fechaMarcada;
}

export function setFechaMarcada(fecha: string) {
    globalStore.update((state) => ({ ...state, fechaMarcada: fecha }));
}

export function getAusentes() {
    let marcadas: Marcada[] = getMarcadas();
    if (getShowMarcadaDetalle()) {
        marcadas = marcadas.filter(marcada => marcada.Entrada === '' && marcada.Salida === '');
    }
    else {
        marcadas = marcadas.filter(marcada => marcada.Marcada === '');
    }
    return marcadas;
}

export const getDepartamentos = () => {
    let departamentos: string[] = [];
    globalStore.subscribe(state => departamentos = state.departamentos)();
    return departamentos;
}

globalStore.subscribe(value => console.log('globalStore data :: =>', value));
