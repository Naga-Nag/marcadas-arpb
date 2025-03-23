import { writable } from "svelte/store";

export const dataFilter = writable({
     ocultarAusentes: false,
     ocultarBajas: true
});

export const getOcultarAusentes = () => dataFilter.subscribe(state => state.ocultarAusentes)();
export const getOcultarBajas = () => {
     let ocultarBajas: boolean = false;
     const unsubscribe = dataFilter.subscribe(state => ocultarBajas = state.ocultarBajas);
     unsubscribe();
     return ocultarBajas;
};

export function setOcultarBajas(ocultarBajas: boolean) {dataFilter.update((state) => ({ ...state, ocultarBajas: ocultarBajas }));}
export function toggleOcultarBajas() {dataFilter.update((state) => ({ ...state, ocultarBajas: !state.ocultarBajas }));}

console.log('dataFilter :: ', dataFilter);