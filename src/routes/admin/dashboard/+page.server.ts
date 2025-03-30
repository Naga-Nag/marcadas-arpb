import type { Actions, RequestEvent, ActionFailure, Redirect } from '@sveltejs/kit';
import { registerWebUser, deleteUsuario, updateUsuario, fetchWebUser } from '$lib/server/db';
import type { registerFormResponse } from '$lib/types/form';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
     register: async ({ request }: RequestEvent): Promise<registerFormResponse | ActionFailure<registerFormResponse> | Redirect> => {
          const formData = await request.formData();
          const username = formData.get('username') as string;
          const password = formData.get('password') as string;
          const role = 'USER' /* formData.get('role') as string */;
          const departamento = formData.get('departamento') as string;

          const data = await registerWebUser(username, password, role, departamento);

          if (!data) {
               return { status: 401, error: true, message: 'No se recibio respuesta de la base de datos' };
          }
          else {
               const result: registerFormResponse = { error: false, message: 'Usuario registrado con exito' };
               return result;
          }
     },

     deleteUser: async ({ request }: { request: Request }) => {
          const formData = await request.formData();
          const username = formData.get('username') as string;

          if (!username) {
               return fail(400, { error: true, message: 'Username is required' });
          }

          const result = await deleteUsuario(username);

          if (!result) {
               return fail(500, { error: true, message: 'Failed to delete user' });
          }

          return { success: true, message: 'User deleted successfully' };
     },

     updateUser: async ({ request }: { request: Request }) => {
          const formData = await request.formData();
          const username = formData.get('username') as string;
          const newDepartamento = formData.get('departamento') as string;
          const newRole = formData.get('role') as string;

          if (!username || !newDepartamento || !newRole) {
               return fail(400, { error: true, message: 'All fields (username, departamento, role) are required' });
          }

          const user = await fetchWebUser(username);

          if (!user) {
               return fail(404, { error: true, message: 'User not found' });
          }

          user.departamento = newDepartamento;
          user.role = newRole;

          // Update user
          const result = await updateUsuario(user);

          if (!result) {
               return fail(500, { error: true, message: 'Failed to update user' });
          }

          return { success: true, message: 'User updated successfully' };
     }
}