import { db } from '$lib/server/db';
import { faction } from '$lib/server/db/schema';
import { requireSession } from '$lib/utils/requireSession';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
    requireSession(locals);
    const factions = await db.select().from(faction);

    return json(factions);
};