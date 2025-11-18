import { db } from '$lib/server/db';
import { encounter } from '$lib/server/db/schema/story/encounter';
import type { NewEncounter, Encounter } from '$lib/server/db/types';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	requireAdmin(locals);
	const encounters = await db.select().from(encounter).orderBy(desc(encounter.id));
	return json(encounters);
};

export const POST = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();

	const newEncounter: NewEncounter = {
		questId: data.questId,
		title: data.title,
		description: data.description,
		type: data.type,
		tone: data.tone,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isActive: data.isActive,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const result = await db.insert(encounter).values(newEncounter).returning();
	return json({ success: true, encounter: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<Encounter> = {
		questId: data.questId,
		title: data.title,
		description: data.description,
		type: data.type,
		tone: data.tone,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isActive: data.isActive,
		updatedAt: new Date()
	};

	const result = await db.update(encounter).set(updateData).where(eq(encounter.id, data.id)).returning();
	return json({ success: true, encounter: result[0] });
};
