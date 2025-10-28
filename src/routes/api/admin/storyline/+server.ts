import { db } from '$lib/server/db';
import { storyline } from '$lib/server/db/schema/story/storyline';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireAdmin(locals);
	const storylines = await db.select().from(storyline).orderBy(desc(storyline.createdAt));
	return json(storylines);
};

export const POST = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();

	delete data.id;

	data.createdAt = new Date();
	data.updatedAt = new Date();

	const result = await db.insert(storyline).values(data).returning();
	return json({ success: true, storyline: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	data.createdAt = new Date(data.createdAt);
	data.updatedAt = new Date();

	const { id, ...rest } = data;
	const result = await db.update(storyline).set(rest).where(eq(storyline.id, id)).returning();
	return json({ success: true, storyline: result[0] });
};
