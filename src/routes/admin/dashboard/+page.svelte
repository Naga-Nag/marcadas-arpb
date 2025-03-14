<script lang="ts">
	import {
		fetchUsuarios,
		createUsuario,
		updateUsuario,
		deleteUsuario,
		fetchDepartamentos
	} from '$lib/utils/mainController';
	import type { shortWebUser } from '$lib/types/gen';

	let usuarios: shortWebUser[] = [];
	let selectedUsuario: shortWebUser | null = null;
	let departamentosPermitidos: string[] = [];
	let departamentos = [];

	fetchDepartamentos().then((data) => (departamentos = data));

	async function loadUsuarios() {
		usuarios = await fetchUsuarios();
	}

	async function createNewUsuario(
		username: string,
		role: string,
		departamento: string,
		departamentosPermitidos: string[]
	) {
		const newUsuario = {
			username,
			role,
			departamento,
			departamentosPermitidos
		};
		await createUsuario(newUsuario);
		loadUsuarios();
	}
</script>

<main></main>
