import { verify, type JwtPayload } from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { fetchWebUser } from '$lib/server/db';
import { setUser } from '$lib/stores/user';

const protectedPaths = ['/', '/api', '/credits'];


export const handle = async ({ event, resolve }) => {
    if (!protectedPaths.includes(event.url.pathname)) {
        return resolve(event);
    }

    console.log("HOOKS :: Accessing protected path: ", event.url.pathname);
    const token = event.cookies.get('token');

    let decodedUser: JwtPayload | null = null;
    try {
        decodedUser = token && Bun.env.JWT_SECRET ? verify(token, Bun.env.JWT_SECRET) as JwtPayload : null;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                console.log("HOOKS :: Token expired, cleaning cookie");
                event.cookies.delete('token', { path: '/' });
                throw redirect(303, '/login');
            } else if (error.name === 'JsonWebTokenError') {
                console.log("HOOKS :: Token is invalid, cleaning cookie");
                event.cookies.delete('token', { path: '/' });
                throw redirect(303, '/login');
            }
        }
    }

    console.log("HOOKS :: Decoded User: ", decodedUser);

    if (token && Bun.env.JWT_SECRET && decodedUser && typeof decodedUser !== 'string') {
        console.log("HOOKS :: Token is valid, resolving");
        const user = await fetchWebUser(decodedUser.username);
        setUser(user);
        return resolve(event);
    } else {
        event.cookies.delete('token', { path: '/' });
        throw redirect(303, '/login');
    }
};