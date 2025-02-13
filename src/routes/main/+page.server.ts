import { formatIP, reverseDnsLookup } from '$lib/utils/utils';
import { fetchDepartamentos } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let requestIp;
    try {

        requestIp = formatIP(event.getClientAddress()); // IP from Client Request

        console.log('IP Address from Client Request: ::', requestIp + ' :: ' );
        let records: any[] = [];
        let departamentos: Record<string, any> = await fetchDepartamentos();

        console.log('[PAGESERVERLOAD] fechaMarcada: ' + defaultDate + ' || ' + 'IPAddress: ' + requestIp);
        return {
            ipAddress: requestIp,
            fechaMarcada: defaultDate,
            records,
            departamentos,
        };
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return {
            error: 'Error al cargar los datos',
            fechaMarcada: null,
            records: [],
            departamentos: [],
        };
    }
};
