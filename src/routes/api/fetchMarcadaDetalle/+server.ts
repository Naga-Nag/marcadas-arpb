
import { fetchMarcadaDetalle } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { departamento, fecha} = await request.json();
        console.log('POST || Buscando registros para: ', departamento, fecha);

        let registros: Array<Record<string, any>> = [];

        if (fecha !== '' ) {
            registros = await fetchMarcadaDetalle(departamento, fecha);
        } else {
            throw new Error('Los parametros de fechas son invalidos');
        }
        return json(registros);
    } catch (error) {
        console.error('Error descargando registros:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
