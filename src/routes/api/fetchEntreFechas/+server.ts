
import { fetchMarcadaEntreFechas } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { departamento, fechaInicial, fechaFinal } = await request.json();
        console.log('POST || Buscando rango de registros para: ', departamento, fechaInicial, fechaFinal);

        let registros = [];

        if (fechaInicial !== '' && fechaFinal !== '') {
            registros = await fetchMarcadaEntreFechas(departamento, fechaInicial, fechaFinal);
        } else {
            throw new Error('Los parametros de fechas son invalidos');
        }
        return json(registros);
    } catch (error) {
        console.error('Error descargando registros:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
