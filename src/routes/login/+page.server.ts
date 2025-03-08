import type { Actions, RequestEvent, ActionFailure, Redirect } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { loginFormResponse, registerFormResponse } from '$lib/types/form';
import { loginWebUser, registerWebUser } from '$lib/server/db';
import { verify } from 'jsonwebtoken';

//* Redirecciona a la pagina principal si el token es valido */
export async function load({ cookies }: RequestEvent) {
     const token = cookies.get('token');
     if (token && Bun.env.JWT_SECRET && verify(token, Bun.env.JWT_SECRET)) {
          return redirect(303, '/');
     }
     else {
          cookies.delete('token', { path: '/' });
          return;
     }
}


export const actions: Actions = {
     login: async ({ cookies, request }: RequestEvent): Promise<loginFormResponse | ActionFailure<loginFormResponse> | Redirect> => {
          const formData = await request.formData();
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;

          const data = await loginWebUser(username, password);
          if ('error' in data) {
               return { status: 401, error: true, message: 'Unauthorized' };
          }

          cookies.set('token', data.token, { path: '/' });

          throw redirect(303, '/');
     },

     register: async ({ request }: RequestEvent): Promise<registerFormResponse | ActionFailure<registerFormResponse> | Redirect> => {
          const formData = await request.formData();
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;
          const role = 'USER' /* formData.get('role') as string */;
          const departamento = formData.get('departamento') as string;

          const data = await registerWebUser(username, password, role, departamento);

          if (!data) {
               return { status: 401, error: true, message: 'Unauthorized' };
          }
          else {
               const result: registerFormResponse = { error: false, message: 'Usuario registrado con exito' };
               return result;
          }
     }
}