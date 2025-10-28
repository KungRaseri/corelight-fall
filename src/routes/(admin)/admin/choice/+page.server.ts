import { db } from '$lib/server/db';
import { choice } from '$lib/server/db/schema/story/choice';
import { encounter } from '$lib/server/db/schema/story/encounter';

export const load = async () => {
	const choices = await db.select().from(choice);
	const encounters = await db.select().from(encounter);
	return { choices, encounters };
};
