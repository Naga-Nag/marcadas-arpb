import type { RequestEvent } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";
export const authUser = async (event: RequestEvent) => {
     const session: string | undefined = event.cookies.get('userStore.token');

     if (!session) {
          return {
               status: 401,
               body: {
                    error: 'Unauthorized',
                    message: 'No user found in userStore',
               },
          };
     }

     else {
          verify(session, 'secret', (err, decoded) => {
               if (err) {
                    console.error('Error verifying token:', err);
               }
               else {
                    return {
                         status: 200,
                         body: {
                              user: decoded,
                         },
                    };
               }
          });
     }
}
