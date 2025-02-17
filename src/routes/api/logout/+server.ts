import { json } from '@sveltejs/kit';

console.log("API :: /api/logout :: Login out");

export async function GET({ cookies }) {
    cookies.delete('jwt', { path: '/' });
    return json({ success: true });
}
