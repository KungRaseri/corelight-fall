import { db } from '$lib/server/db';
import { quest, storyline } from '$lib/server/db/schema';

export const load = async () => {
	const storylines = await db.select().from(storyline);
	const quests = await db.select().from(quest);

	return { storylines, quests };
};
