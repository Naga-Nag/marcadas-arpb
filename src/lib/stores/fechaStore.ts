import { writable } from 'svelte/store';

export const fechaStore = writable({
  fechaMarcada: '',
  fechaInicial: '',
  fechaFinal: '',
});

export function updatefecha(fecha: string) {
  fechaStore.update((state) => ({ ...state, fechaMarcada: fecha, fechaInicial: fecha, fechaFinal: fecha }));
}

export function updatefechaInicial(fechaInicial: string) {
  fechaStore.update((state) => ({ ...state, fechaInicial: fechaInicial }));
}

export function updatefechaFinal(fechaFinal: string) {
  fechaStore.update((state) => ({ ...state, fechaFinal: fechaFinal }));
}