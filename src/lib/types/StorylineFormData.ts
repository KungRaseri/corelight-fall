import type { Storyline } from '$lib/server/db/types';
import type { QuestFormData } from './QuestFormData';

export type StorylineFormData = Omit<Storyline, 'id'> & {
	id: number | null;
	quests?: QuestFormData[];
};
