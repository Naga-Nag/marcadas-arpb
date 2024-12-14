// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Extract the Host header from the request
    const host = event.request.headers.get('host');
    console.log('Host header:', host);

    return resolve(event);
};
