// /src/routes/api/fetchRecords/[fecha].ts
import { fetchMarcadaDelDia } from '$lib/server/db';


import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { fechaMarcada, sortColumn, sortOrder } = await request.json();
		console.log('POST || Fetching records for fechaMarcada:', fechaMarcada);

		let registros = [];

		// Logic to handle different date scenarios
		if (fechaMarcada !== '') {
			// Fetch records for a single date (fechaMarcada)
			registros = await fetchMarcadaDelDia(fechaMarcada, sortColumn, sortOrder);
		} else {
			return json({ error: 'Los parametros de fechas son invalidos' }, { status: 400 });
		}

		return json(registros);
	} catch (error) {
		console.error('Error fetching data:', error);
		return json({ error: 'Failed to fetch records' }, { status: 500 });
	}
}