import type { Encounter } from '$lib/server/db/types';
import type { ChoiceFormData } from './ChoiceFormData';

export type EncounterFormData = Omit<Encounter, 'id' | 'questId'> & {
	id: number | null;
	questId: number | null;
	choices?: ChoiceFormData[];
};
