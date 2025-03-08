
import { fetchMarcadaDelDia } from '$lib/server/db';

export async function POST({ request }) {
	try {
		const { departamento, fecha } = await request.json();

		// Validate input
		if (!departamento || !fecha) {
			throw new Error('Parámetros inválidos: departamento o fechaMarcada no definidos');
		}

		console.log('fetchMarcada :: Buscando registros para:', departamento, fecha);

		// Fetch records
		const stream = await fetchMarcadaDelDia(departamento, fecha);

		// Return the streaming response
		return new Response(JSON.stringify(stream), {
			headers: {
				'Content-Type': 'application/json',
				'Transfer-Encoding': 'chunked'
			}
		});
	} catch (error) {
		console.error('Error procesando POST:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to fetch records' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
