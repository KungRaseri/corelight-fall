import { db } from '$lib/server/db';
import { faction } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {

    const factions = await db.select().from(faction);

    return new Response(JSON.stringify(factions), {
        headers: { 'Content-Type': 'application/json' }
    });
};