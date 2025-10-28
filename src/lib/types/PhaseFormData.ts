import type { Phase } from '$lib/server/db/types';

export type PhaseFormData = Omit<Phase, 'id'> & {
	id: number | null;
};
