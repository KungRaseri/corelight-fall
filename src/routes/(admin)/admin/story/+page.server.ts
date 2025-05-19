import { db } from '$lib/server/db';
import { storyline } from '$lib/server/db/schema';

export const load = async () => {
    const storylines = await db.select().from(storyline);

    return { storylines };
};