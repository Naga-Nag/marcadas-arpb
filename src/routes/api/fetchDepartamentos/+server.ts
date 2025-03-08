
import { fetchDepartamentos } from '$lib/server/db';
import { json } from '@sveltejs/kit';


export async function GET() {
    try {
        console.log('API /fetchDepartamentos :: GET Departamentos');
        let registros = await fetchDepartamentos();
        return json(registros);
    } catch (error) {
        console.error('API /fetchDepartamentos :: Error descargando registros:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
