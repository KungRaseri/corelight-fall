import type { User } from '$lib/server/db/types';
import type { SafeUser } from '$lib/types/SafeUser';

export function sanitizeUserData(userData: User): SafeUser {
	const { passwordHash, ...safeData } = userData;

	return safeData;
}
