// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			player: import('$lib/server/auth').SessionValidationResult['player'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}

export {};
