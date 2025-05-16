// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			character: import('$lib/server/auth').SessionValidationResult['character'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}

export { };
