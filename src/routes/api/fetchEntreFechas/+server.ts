
import { fetchMarcadaEntreFechas } from '$lib/server/db';
import { setloadingData } from '$lib/stores/global.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { departamento, fechaInicial, fechaFinal } = await request.json();
        console.log('API /fetchEntreFechas :: Buscando rango de registros para: ', departamento, fechaInicial, fechaFinal);

        let registros = [];

        if (fechaInicial !== '' && fechaFinal !== '') {
            setloadingData(true);
            registros = await fetchMarcadaEntreFechas(departamento, fechaInicial, fechaFinal);
        } else {
            setloadingData(false);
            throw new Error('Los parametros de fechas son invalidos');
        }
        return json(registros);
    } catch (error) {
        console.error('API /fetchEntreFechas :: Error descargando registros:', error);
        setloadingData(false);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}
