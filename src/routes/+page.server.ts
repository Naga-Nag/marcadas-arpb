import { fetchMarcadaDelDia, getDepartamentos } from '$lib/server/db';
import { getDepartamentoHost } from '$lib/utils';
import type { PageServerLoad } from './$types';
import { globalStore } from '$lib/stores/globalStore';

export const load: PageServerLoad = async () => {
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    try {
        // Fetch initial data for the default date (yesterday)
        let records = await fetchMarcadaDelDia(new Date(defaultDate));
        const departamentos = await getDepartamentos();
        return {
            fechaMarcada: defaultDate,
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
