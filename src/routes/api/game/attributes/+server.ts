import { db } from '$lib/server/db';
import { attribute } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const attributes = await db.select().from(attribute);

    return json(attributes);
};