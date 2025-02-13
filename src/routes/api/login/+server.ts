import { loginWebUser } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const POST = async (event) => {
	const { username, password } = await event.request.json();
    let password_hash = await bcrypt.hash(password, 10);
	try {
		const response = await loginWebUser(username, password);
		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid username or password' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
