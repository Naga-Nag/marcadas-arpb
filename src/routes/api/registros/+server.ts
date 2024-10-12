// src/routes/api/records/+server.ts
import { fetchMarcadaDelDia } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const fecha = url.searchParams.get('fecha') || new Date().toISOString().substring(0, 10);
    const records = await fetchMarcadaDelDia(new Date(fecha));

    return new Response(JSON.stringify({ records }), { status: 200 });
};
