import { db } from '$lib/server/db';
import { stat } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async () => {
    const stats = await db.select().from(stat);

    return new Response(JSON.stringify(stats), {
        headers: { 'Content-Type': 'application/json' }
    });
};