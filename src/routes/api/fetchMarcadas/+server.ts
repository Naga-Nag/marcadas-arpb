import { fetchMarcadaDelDia } from '$lib/server/db';

export async function POST({ request }) {
	try {
		const { departamento, fechaMarcada } = await request.json();

		// Validate input
		if (!departamento || !fechaMarcada) {
			throw new Error('Parámetros inválidos: departamento o fechaMarcada no definidos');
		}

		console.log('POST || Streaming registros para:', departamento, fechaMarcada);

		// Create a readable stream
		const stream = new ReadableStream({
			async start(controller) {
				try {
					// Fetch data in batches
					await fetchMarcadaDelDia(departamento, fechaMarcada, (batch) => {
						// Send each batch to the stream
						controller.enqueue(JSON.stringify(batch) + '\n');
					});

					// Close the stream when done
					controller.close();
				} catch (err) {
					console.error('Error streaming registros:', err);
					controller.error(err);
				}
			}
		});

		// Return the streaming response
		return new Response(stream, {
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
