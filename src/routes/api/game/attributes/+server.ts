import { db } from '$lib/server/db';
import { attribute } from '$lib/server/db/schema';
import { requireSession } from '$lib/utils/requireSession';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	requireSession(locals);
	const attributes = await db.select().from(attribute);

	return json(attributes);
};
