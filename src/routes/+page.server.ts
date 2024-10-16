import { fetchMarcadaDelDia, getDepartamentos } from '$lib/server/db'; // Asegúrate de que estas funciones estén bien definidas
import { getDepartamentoHost } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    try {
        // Obtén la fecha seleccionada desde la query (o usa la fecha de hoy como predeterminada)
        const fecha = url.searchParams.get('fecha') ||
            new Date(Date.now() - 86400000).toISOString().split('T')[0];


        // Obtén los registros y los departamentos
        const records = await fetchMarcadaDelDia(new Date(fecha));
        const departamentos = await getDepartamentos();

        return {
            fechaMarcada: fecha,
            records,
            departamentos,
            hostname: getDepartamentoHost(), // Ajusta este valor según lo que necesites
        };
    } catch (error) {
        console.log('Error al cargar los datos:', error);
        return {
            error: 'Error al cargar los datos',
            fechaMarcada: null,
            records: [],
            departamentos: [],
            hostname: null
        };
    }
};