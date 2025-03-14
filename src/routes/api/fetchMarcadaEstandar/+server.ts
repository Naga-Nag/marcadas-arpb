
import { fetchMarcadaEstandar } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { departamento, fecha} = await request.json();
        let marcadas: Array<Record<string, any>> = [];

        if (fecha !== '' && departamento !== '') {
            console.log('POST || Buscando marcadas para: ', departamento, fecha);
            marcadas = await fetchMarcadaEstandar(departamento, fecha);
        } else {
            throw new Error('Los parametros de fechas son invalidos');
        }
        return json(marcadas);
    } catch (error) {
        console.error('Error descargando marcadas:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
