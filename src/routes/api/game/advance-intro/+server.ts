import { db } from '$lib/server/db';
import { playerStoryProgress } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, 'Not authenticated');
	}

	const { stage } = await request.json();

	if (!stage || typeof stage !== 'string') {
		error(400, 'Invalid stage');
	}

	// Valid stages: 'world_intro', 'story_prologue', 'arc_choice', 'main_story'
	const validStages = ['world_intro', 'story_prologue', 'arc_choice', 'main_story'];
	if (!validStages.includes(stage)) {
		error(400, 'Invalid intro stage');
	}

	// Check if progress record exists
	const existing = (
		await db
			.select()
			.from(playerStoryProgress)
			.where(eq(playerStoryProgress.userId, locals.user.id))
			.limit(1)
	)[0];

	if (existing) {
		// Update existing progress
		await db
			.update(playerStoryProgress)
			.set({ introStage: stage, updatedAt: new Date() })
			.where(eq(playerStoryProgress.userId, locals.user.id));
	} else {
		// Create new progress record (user hasn't started game yet)
		// Set storylineId to 1 (default) - will be updated when they choose a storyline
		await db.insert(playerStoryProgress).values({
			userId: locals.user.id,
			storylineId: 1, // Placeholder, will be updated
			introStage: stage,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	return json({ success: true });
};
