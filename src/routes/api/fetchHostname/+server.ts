import { getDepartamentoHost } from '$lib/utils/utils';

export async function GET({ request }) {
    try {
        const departamento = await getDepartamentoHost(request);
        return new Response(JSON.stringify({ departamento }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching departamento:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch departamento' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
