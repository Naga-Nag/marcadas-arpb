import { formatIP, reverseDnsLookup } from '$lib/utils/utils';
import type { PageServerLoad } from './$types';
import { fetchDepartamentos } from '$lib/server/db';
import { setDepartamentos } from '$lib/stores/global';

export const load: PageServerLoad = async (event) => {
    let defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let requestIp;
    let hostname;
    try {
        requestIp = formatIP(event.getClientAddress()); // IP from Client Request
        hostname = await reverseDnsLookup(requestIp);
        hostname = hostname.toUpperCase().substring(0, 4);

        console.log('IP Address from Client Request: ::', requestIp+' :: ' + hostname + '::');
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
