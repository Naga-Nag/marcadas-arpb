import { updateUsuarioFromMarcada } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function PUT({ request }) {
  const marcadaRow = await request.json();
  try {
    await updateUsuarioFromMarcada(marcadaRow);
    return json({ message: 'Usuario updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('API :: /updateUsuario :: Error updating usuario:', error);
    return json({ message: 'Error updating usuario' }, { status: 500 });
  }
}