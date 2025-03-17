import { redirect } from "@sveltejs/kit";

export const load = async ( { cookies }) => {
     cookies.delete('token', { path: '/' , secure: false});
     return redirect(303, '/login');
};