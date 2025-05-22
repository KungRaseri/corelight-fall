import { db } from '$lib/server/db';
import { storyline } from '$lib/server/db/schema/story/storyline';
import { requireAdmin } from '$lib/utils/requireAdmin';

export const load = async ({ locals }) => {
    requireAdmin(locals);
    const storylines = await db.select().from(storyline);
    return { storylines };
};