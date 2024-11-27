import { getDepartamentoHost } from '$lib/utils/utils';
import { setHostname } from '$lib/utils/globalStore';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    try {
        /* // Fetch initial data for the default date (yesterday)
        let records = await fetchMarcadaDelDia(hostname, defaultDate); */
        let records: any[] = [];
        let departamentos: Array<string> = [];
        console.log('[PAGESERVERLOAD] fechaMarcada:', defaultDate, 'hostname:', getDepartamentoHost());
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
            hostname: '',
        };
    }
};
