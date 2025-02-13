import { registerWebUser } from "$lib/server/db";
import bcrypt from "bcrypt";

export const POST = async (event) => {
    const { username, password } = await event.request.json();
    console.log("Received REGISTER event with username:", username);
    const password_hash = await bcrypt.hash(password, 10);
    try {
        const response = await registerWebUser(username, password_hash);
        return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Username already exists" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
};
