import { fetchUsuarios } from '$lib/server/db';
import { createUsuario } from '$lib/server/db';
import { updateUsuario } from '$lib/server/db';
import { deleteUsuario } from '$lib/server/db';

export async function GET() {
     const usuarios = await fetchUsuarios();
     return new Response(JSON.stringify(usuarios), {
          headers: { 'Content-Type': 'application/json' }
     });
}

export async function POST({ request }: { request: Request }) {
     const usuario = await request.json();
     const body = await createUsuario(usuario);
     return new Response(JSON.stringify(body), {
          headers: { 'Content-Type': 'application/json' }
     });
}

export async function PUT({ request }: { request: Request }) {
     const usuario = await request.json();
     const body = await updateUsuario(usuario);
     return new Response(JSON.stringify(body), {
          headers: { 'Content-Type': 'application/json' }
     });
}

export async function DELETE({ params }: { params: { username: string } }) {
     const { username } = params;
     const result = await deleteUsuario(username);
 
     if (!result) {
         return new Response('Failed to delete user', { status: 500 });
     }
 
     return new Response(JSON.stringify({ success: true }), {
         headers: { 'Content-Type': 'application/json' }
     });
 }
