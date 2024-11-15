// /src/routes/api/fetchRecords/[fecha].ts
import { fetchMarcadaDelDia } from '$lib/server/db';
import { setloadingData } from '$lib/globalStore.js';

import {json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { departamento, fechaMarcada } = await request.json();
		if (departamento === undefined || departamento === null || departamento === '') {
			throw new Error('Departamento no definido')
		}
		if (fechaMarcada === null) {
			throw new Error('Fecha para la marcada no definida')
		}
		console.log('POST || Buscando registros para:', departamento, fechaMarcada);

		let registros = [];

		// Logic to handle different date scenarios
		if (fechaMarcada !== '') {
			// Fetch records for a single date (fechaMarcada)
			registros = await fetchMarcadaDelDia(departamento, fechaMarcada);
		} else {
			return json({ error: 'Los parametros de fechas son invalidos' }, { status: 400 });
		}
		
		return json(registros);
	} catch (error) {
		console.error('Error descargando registros:', error);
		return json({ error: 'Failed to fetch records' }, { status: 500 });
	}
}