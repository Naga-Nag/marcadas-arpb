import { formatIP, reverseDnsLookup } from '$lib/utils/utils';
import { setHostname } from '$lib/utils/globalStore';
import type { PageServerLoad } from './$types';
import { fetchDepartamentos } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let requestIp;
    let hostname;
    try {
        requestIp = formatIP(event.getClientAddress()); // IP from Client Request
        console.log('IP Address from Client Request: ::', requestIp+' ::');

        hostname = await reverseDnsLookup(requestIp);
        hostname = hostname.toUpperCase().substring(0, 4);

        let records: any[] = [];
        let departamentos: Record<string, any> = await fetchDepartamentos();
        console.log('[PAGESERVERLOAD] fechaMarcada: '+defaultDate+' || '+'Hostname: '+ hostname);
        return {
            hostname,
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
