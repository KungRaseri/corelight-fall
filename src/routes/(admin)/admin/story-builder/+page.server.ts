import { db } from '$lib/server/db';
import { storyline, act, phase } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/utils/requireAdmin';

export const load = async ({ locals }) => {
    requireAdmin(locals);
    const storylines = await db.select().from(storyline);
    const acts = await db.select().from(act);
    const phases = await db.select().from(phase);

    return { storylines, acts, phases };
};