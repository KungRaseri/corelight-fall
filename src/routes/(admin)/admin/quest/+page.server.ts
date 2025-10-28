import { db } from '$lib/server/db';
import { quest } from '$lib/server/db/schema/story/quest';

export const load = async () => {
	const quests = await db.select().from(quest);
	return { quests };
};
