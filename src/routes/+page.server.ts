import { fetchMarcadaDelDia, getDepartamentos } from '$lib/server/db';
import { getDepartamentoHost } from '$lib/utils';
import type { PageServerLoad } from './$types';
import { globalStore } from '$lib/stores/globalStore';

export const load: PageServerLoad = async () => {
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let defaultDateDev = '2024-02-14';
    try {
        // Fetch initial data for the default date (yesterday)
        let records = await fetchMarcadaDelDia(defaultDateDev);
        const departamentos = await getDepartamentos();
        return {
            fechaMarcada: defaultDateDev,
            records,
            departamentos,
            hostname: getDepartamentoHost(),
        };
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return {
            error: 'Error al cargar los datos',
            fechaMarcada: null,
            records: [],
            departamentos: [],
            hostname: null
        };
    }
};
