import type { Marcada } from '$lib/types/gen';
import { writable, derived, get } from 'svelte/store';
import { getOcultarBajas } from './dataFilter';

export const globalStore = writable({
    loading: false,

    marcadaEstandar: true,
    entreFechas: false,
    omitirFinde: false,
    marcadasIntermedias: false,
    ocultarBajas: true,

    selectedDepartamento: '',
    fechaMarcada: '',
    searchText: '',
    marcadas: [] as Marcada[],
    departamentos: [] as string[],
});

export const ausentes = derived(globalStore, ($store) => {
    let marcadas = $store.marcadas;

    if ($store.marcadasIntermedias) {
        return marcadas.filter(m => m.Marcada === '');
    } else {
        return marcadas.filter(m => m.Entrada === '' && m.Salida === '');
    }
});

// Derived store to filter `marcadas` based on `searchText`
export const filteredMarcadas = derived(globalStore, ($store) => {
    const search = $store.searchText.trim().toLowerCase();
    let marcadas = $store.marcadas;

    if ($store.ocultarBajas) {
        marcadas = marcadas.filter(m => m.Activo !== "NO");
    }

    if (!search) return marcadas; // If empty, return filtered `marcadas` based on `ocultarBajas`

    return marcadas.filter(m =>
        m.Nombre.toLowerCase().includes(search) ||
        m.Departamento.toLowerCase().includes(search) ||
        m.CUIL.includes(search) || 
        m.MR.toString().includes(search)
    );
});

// Function to update search text
export function setSearchText(text: string) {
    globalStore.update(store => {
        store.searchText = text;
        return store;
    });
}

/**
 * Updates the `selectedDepartamento` in the global store.
 *
 * @param departamento - The name of the department to set as selected.
 */

export function updateSelectedDepartamento(departamento: string) {
    globalStore.update((state) => ({ ...state, selectedDepartamento: departamento }));
}

/**
 * Toggles the `marcadasIntermedias` value in the global store. If set to true, sets `marcadaEstandar` to false.
 *
 * @example
 * toggleMarcadaDetalle();
 */
export function toggleMarcadasIntermedias() {
    globalStore.update((state) => {
        const newMarcadasIntermedias = !state.marcadasIntermedias;
        return {
            ...state,
            marcadasIntermedias: newMarcadasIntermedias,
            marcadaEstandar: newMarcadasIntermedias ? false : state.marcadaEstandar
        };
    });
}

export function toggleMarcadaEstandar() {
    globalStore.update((state) => {
        const newMarcadaEstandar = !state.marcadaEstandar;
        return {
            ...state,
            marcadaEstandar: newMarcadaEstandar,
            marcadasIntermedias: newMarcadaEstandar ? false : true,
            entreFechas: newMarcadaEstandar ? false : state.entreFechas
        };
    });
}

/**
 * Toggles the `entreFechas` value in the global store. If `entreFechas` is
 * being set to `true`, `marcadasIntermedias` is also set to `true`. If
 * `entreFechas` is being set to `false`, `marcadasIntermedias` is left
 * unchanged.
 *
 * @example
 * toggleEntreFechas();
 */
export function toggleEntreFechas() {
    clearMarcadas();
    globalStore.update((state) => {
        const newentreFechas = !state.entreFechas;
        return {
            ...state,
            entreFechas: newentreFechas,
            marcadaEstandar: newentreFechas ? false : state.marcadaEstandar,
            marcadasIntermedias: newentreFechas ? true : state.marcadasIntermedias
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

export function toggleOcultarBajas() {
    globalStore.update((state) => ({ ...state, ocultarBajas: !state.ocultarBajas }));
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
    console.log('globalStore :: clearMarcadas');
    globalStore.update((state) => ({ ...state, marcadas: [] }));
}

export const getSelectedDepartamento = () => {
    let selectedDepartamento: string = '';
    globalStore.subscribe(state => selectedDepartamento = state.selectedDepartamento)();
    return selectedDepartamento;
}

export const getmarcadasIntermedias = () => {
    let marcadasIntermedias: boolean = false;
    globalStore.subscribe(state => marcadasIntermedias = state.marcadasIntermedias)();
    return marcadasIntermedias;
}

export const getentreFechas = () => {
    let entreFechas: boolean = false;
    globalStore.subscribe(state => entreFechas = state.entreFechas)();
    return entreFechas;
}

export const getOmitirFinde = () => {
    let omitirFinde: boolean = false;
    globalStore.subscribe(state => omitirFinde = state.omitirFinde)();
    return omitirFinde;
}

export function getfechaMarcada() {
    let fechaMarcada: string = '';
    globalStore.subscribe(state => fechaMarcada = state.fechaMarcada)();
    return fechaMarcada;
}

export function setFechaMarcada(fecha: string) {
    globalStore.update((state) => ({ ...state, fechaMarcada: fecha }));
}

export function getAusentes() {
    let marcadas: Marcada[] = getMarcadas();
    if (getmarcadasIntermedias()) {
        marcadas = marcadas.filter(marcada => marcada.Entrada === '' && marcada.Salida === '');
    }
    else {
        marcadas = marcadas.filter(marcada => marcada.Marcada === '');
    }
    return marcadas;
}

export function getSearchText() {
    let searchText: string = '';
    globalStore.subscribe(state => searchText = state.searchText)();
    return searchText;
}

export function clearSearchText() {
    globalStore.update((state) => ({ ...state, searchText: '' }));
}

export const getDepartamentos = () => {
    let departamentos: string[] = [];
    globalStore.subscribe(state => departamentos = state.departamentos)();
    return departamentos;
}

export const getMarcadaEstandar = () => {
    let marcadaEstandar: boolean = false;
    globalStore.subscribe(state => marcadaEstandar = state.marcadaEstandar)();
    return marcadaEstandar;
}

export function setMarcadaEstandar(marcadaEstandar: boolean) {
    globalStore.update((state) => ({ ...state, marcadaEstandar: marcadaEstandar }));
}


globalStore.subscribe(value => console.log('globalStore data :: =>', value));
