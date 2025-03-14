import { fetchUsuarios } from '$lib/server/db';
import { createUsuario } from '$lib/server/db';
import { updateUsuario } from '$lib/server/db';
import { deleteUsuario } from '$lib/server/db';

export async function GET() {
     return {
          body: await fetchUsuarios()
     };
}

export async function POST({ request }: { request: Request }) {
     const usuario = await request.json();
     return {
          body: await createUsuario(usuario)
     };
}

export async function PUT({ request }: { request: Request }) {
     const usuario = await request.json();
     return {
          body: await updateUsuario(usuario)
     };
}

export async function DELETE({ params }: { params: { username: string } }) {
     const username = params.username;
     return {
          body: await deleteUsuario(username)
     };
}