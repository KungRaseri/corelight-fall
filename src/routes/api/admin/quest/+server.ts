import { db } from '$lib/server/db';
import { quest } from '$lib/server/db/schema/story/quest';
import type { NewQuest, Quest } from '$lib/server/db/types';
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

	const newQuest: NewQuest = {
		title: data.title,
		description: data.description,
		storylineId: data.storylineId,
		tone: data.tone,
		goals: data.goals,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isMain: data.isMain,
		isActive: data.isActive,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const result = await db.insert(quest).values(newQuest).returning();
	return json({ success: true, quest: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<Quest> = {
		title: data.title,
		description: data.description,
		storylineId: data.storylineId,
		tone: data.tone,
		goals: data.goals,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isMain: data.isMain,
		isActive: data.isActive,
		updatedAt: new Date()
	};

	const result = await db.update(quest).set(updateData).where(eq(quest.id, data.id)).returning();
	return json({ success: true, quest: result[0] });
};
