import { formatIP } from '$lib/utils/utils';
import { fetchDepartamentos, fetchWebUser } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import {getUser, isAdmin} from '$lib/stores/user';
import { setMarcadas } from '$lib/stores/global';



export const load: PageServerLoad = async (event) => {

    const requestIp = formatIP(event.getClientAddress()); // IP from Client Request

    console.log('MAIN :: IP Address from Client Request: ::', requestIp + ' :: ');
    const defaultDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    console.log('MAIN :: fechaMarcada: ' + defaultDate + ' :: ' + 'IPAddress: ' + requestIp);

    const user = getUser();
    const departamentos = await fetchDepartamentos();

    if (isAdmin(user)) {
        /**FIXME - Tira error pero anda */
        user.departamentosPermitidos = departamentos.map(departamento => departamento); // assuming 'name' is the string property you need
	}
    return {
        user,
        departamentos,
        ipAddress: requestIp,
        fechaMarcada: defaultDate,
        marcadas: [],
    };
};

