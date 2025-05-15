import { db } from '$lib/server/db';
import { stat } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const stats = await db.select().from(stat);

    return json(stats);
};