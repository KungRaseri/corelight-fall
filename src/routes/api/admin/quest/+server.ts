import { db } from '$lib/server/db';
import { quest } from '$lib/server/db/schema/story/quest';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireAdmin(locals);
	const quests = await db.select().from(quest).orderBy(desc(quest.id));
	return json(quests);
};

export const POST = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	delete data.id;

	data.createdAt = new Date();
	data.updatedAt = new Date();

	const result = await db.insert(quest).values(data).returning();
	return json({ success: true, quest: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	data.updatedAt = new Date();

	const { id, ...rest } = data;
	const result = await db.update(quest).set(rest).where(eq(quest.id, id)).returning();
	return json({ success: true, quest: result[0] });
};
