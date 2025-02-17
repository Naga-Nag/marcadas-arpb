import { formatIP } from '$lib/utils/utils';
import { fetchDepartamentos, fetchWebUser } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import {getUser} from '$lib/stores/user';



export const load: PageServerLoad = async (event) => {

    const requestIp = formatIP(event.getClientAddress()); // IP from Client Request

    console.log('MAIN :: IP Address from Client Request: ::', requestIp + ' :: ');
    const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    console.log('MAIN :: fechaMarcada: ' + defaultDate + ' :: ' + 'IPAddress: ' + requestIp);
    return {
        user: getUser(),
        departamentos: await fetchDepartamentos(),
        ipAddress: requestIp,
        fechaMarcada: defaultDate,
        marcadas: [],
    };
};

