import { fetchDepartamentos } from '$lib/server/db';


import { json } from '@sveltejs/kit';


export async function GET() {
    try {
        //TODO: implementar departamento
        console.log('GET || Departamentos');
        let registros = await fetchDepartamentos();
        return json(registros);
    } catch (error) {
        console.error('Error descargando registros:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
