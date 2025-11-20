import { db } from '$lib/server/db';
import { playerStoryProgress, storyline, quest, encounter } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, 'Not authenticated');
	}

	const { arcChoice } = await request.json();

	if (!arcChoice || !['trust', 'investigate'].includes(arcChoice)) {
		error(400, 'Invalid arc choice');
	}

	// For now, both choices lead to the same main storyline
	// In the future, you could create different storylines based on the choice
	// and filter storylines where storyline.arcPath = arcChoice

	// Get the main storyline (The Dying Light)
	const mainStoryline = (
		await db
			.select()
			.from(storyline)
			.where(eq(storyline.isMain, true))
			.limit(1)
	)[0];

	if (!mainStoryline) {
		error(500, 'Main storyline not found');
	}

	// Get the first quest of the storyline
	const firstQuest = (
		await db
			.select()
			.from(quest)
			.where(eq(quest.storylineId, mainStoryline.id))
			.orderBy(quest.order)
			.limit(1)
	)[0];

	if (!firstQuest) {
		error(500, 'First quest not found');
	}

	// Get the first encounter of the quest
	const firstEncounter = (
		await db
			.select()
			.from(encounter)
			.where(eq(encounter.questId, firstQuest.id))
			.orderBy(encounter.order)
			.limit(1)
	)[0];

	if (!firstEncounter) {
		error(500, 'First encounter not found');
	}

	// Check if progress exists
	const existing = (
		await db
			.select()
			.from(playerStoryProgress)
			.where(eq(playerStoryProgress.userId, locals.user.id))
			.limit(1)
	)[0];

	if (existing) {
		// Update progress to main story with the chosen arc
		await db
			.update(playerStoryProgress)
			.set({
				storylineId: mainStoryline.id,
				questId: firstQuest.id,
				encounterId: firstEncounter.id,
				introStage: 'main_story',
				updatedAt: new Date()
			})
			.where(eq(playerStoryProgress.userId, locals.user.id));
	} else {
		// Create new progress
		await db.insert(playerStoryProgress).values({
			userId: locals.user.id,
			storylineId: mainStoryline.id,
			questId: firstQuest.id,
			encounterId: firstEncounter.id,
			introStage: 'main_story',
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	return json({ success: true, arcChoice });
};
