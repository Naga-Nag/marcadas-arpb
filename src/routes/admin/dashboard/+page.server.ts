import type { Actions, RequestEvent, ActionFailure, Redirect } from '@sveltejs/kit';
import { registerWebUser, deleteUsuario, updateUsuario, fetchWebUser, setWebUserDepaPermitidos } from '$lib/server/db';
import type { registerFormResponse } from '$lib/types/form';
import { fail, json } from '@sveltejs/kit';
import { setDepartamentos } from '$lib/stores/global';

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
          const newDepartamentosPermitidos = formData.get('departamentosPermitidos') as string;
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
          console.log('Updating user:', user);
          const result = await updateUsuario(user);

          if (!result) {
               return fail(500, { error: true, message: 'Failed to update user' });
          }

          return { success: true, message: 'User updated successfully' };
     },

     setDepartamentosPermitidos: async ({ request }: { request: Request }) => {
          const formData = await request.formData();
          const username = formData.get('username') as string;
          const departamento = formData.get('departamento') as string;
      
          if (!username || !departamento) {
              return json({ error: true, message: 'Usuario y departamento son requeridos' }, { status: 400 });
          }
      
          const user = await fetchWebUser(username);
          if (!user) {
              return json({ error: true, message: 'Usuario no encontrado' }, { status: 404 });
          }
      
          const departamentosPermitidos = new Set(user.departamentosPermitidos);
          if (departamentosPermitidos.has(departamento)) {
              departamentosPermitidos.delete(departamento);
          } else {
              departamentosPermitidos.add(departamento);
          }
      
          const result = await setWebUserDepaPermitidos(username, Array.from(departamentosPermitidos));
      
          if (!result) {
              return json({ error: true, message: 'Failed to update departamentos permitidos' }, { status: 500 });
          }
      
          return json({ success: true, departamentosPermitidos: Array.from(departamentosPermitidos) });
     }
}