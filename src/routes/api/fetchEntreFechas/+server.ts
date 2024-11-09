// /src/routes/api/fetchRecords/[fecha].ts
import { fetchMarcadaEntreFechas } from '$lib/server/db';


import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { fechaInicial, fechaFinal } = await request.json();
        console.log('POST || Fetching records for fechaMarcadaEntreFechas:', fechaInicial, fechaFinal);

        let registros = [];

        if (fechaInicial !== '' && fechaFinal !== '') {
            registros = await fetchMarcadaEntreFechas(fechaInicial, fechaFinal);
        } else {
            return json({ error: 'Los parametros de fechas son invalidos' }, { status: 400 });
        }
        return json(registros);
    } catch (error) {
        console.error('Error fetching data:', error);
        return json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}