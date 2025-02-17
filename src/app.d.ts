declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: { username: string; role: string; departamento: string; departamentosPermitidos: string[];};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
