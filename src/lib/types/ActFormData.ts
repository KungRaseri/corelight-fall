import type { Act } from '$lib/server/db/types';

export type ActFormData = Omit<Act, 'id'> & {
	id: number | null;
};
