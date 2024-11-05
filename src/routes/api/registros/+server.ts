// src/routes/api/records/+server.ts
import { fetchMarcadaDelDia, fetchMarcadaDetalle, fetchMarcadaEntreFechas } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const fecha = url.searchParams.get('fecha') || new Date().toISOString().substring(0, 10);
    const records = await fetchMarcadaDelDia(new Date(fecha));

    return new Response(JSON.stringify({ records }), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
    const requestBody = await request.json();
    const startDate = requestBody.startDate;
    const endDate = requestBody.endDate;
  
    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Missing start or end date' }), { status: 400 });
    }
  
    try {
      const records = await fetchMarcadaEntreFechas(new Date(startDate), new Date(endDate));
      return new Response(JSON.stringify({ records }), { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
    }
  };