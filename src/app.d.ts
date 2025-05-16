import type { Character } from '$lib/server/db/types';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			character: Character;
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}
}

export { };
