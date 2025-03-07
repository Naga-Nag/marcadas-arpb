import { registerWebUser } from "$lib/server/db";
import bcrypt from "bcrypt";

export const POST = async (event) => {
    const { username, password, role, departamento } = await event.request.json();
    console.log("Received REGISTER event with username:", username);
    const password_hash = await bcrypt.hash(password, 10);
    try {
        const response = await registerWebUser(username, password_hash, role, departamento);
        return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "El usuario ya existe" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
};
