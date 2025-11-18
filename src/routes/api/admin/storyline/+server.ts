import { db } from '$lib/server/db';
import { storyline } from '$lib/server/db/schema/story/storyline';
import type { NewStoryline, Storyline } from '$lib/server/db/types';
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

	const newStoryline: NewStoryline = {
		title: data.title,
		description: data.description,
		isActive: data.isActive,
		phaseId: data.phaseId,
		tone: data.tone,
		goals: data.goals,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isMain: data.isMain,
		coverImage: data.coverImage,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const result = await db.insert(storyline).values(newStoryline).returning();
	return json({ success: true, storyline: result[0] });
};

export const PUT = async ({ locals, request }) => {
	requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<Storyline> = {
		title: data.title,
		description: data.description,
		isActive: data.isActive,
		phaseId: data.phaseId,
		tone: data.tone,
		goals: data.goals,
		summary: data.summary,
		tags: data.tags,
		factions: data.factions,
		order: data.order,
		isMain: data.isMain,
		coverImage: data.coverImage,
		updatedAt: new Date()
	};

	const result = await db.update(storyline).set(updateData).where(eq(storyline.id, data.id)).returning();
	return json({ success: true, storyline: result[0] });
};
