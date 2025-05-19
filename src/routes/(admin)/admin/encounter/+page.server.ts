import { db } from '$lib/server/db';
import { quest } from '$lib/server/db/schema';
import { encounter } from '$lib/server/db/schema/story/encounter';

export const load = async () => {
    const encounters = await db.select().from(encounter);
    const quests = await db.select().from(quest)
    
    return { encounters, quests };
};