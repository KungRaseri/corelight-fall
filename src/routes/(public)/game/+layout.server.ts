import { db } from '$lib/server/db';
import {
	attribute,
	character,
	characterAttribute,
	choice,
	encounter,
	playerStoryProgress,
	quest,
	storyline
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import type { ChoiceFormData } from '$lib/types/ChoiceFormData';

/**
 * Game Layout Server Load
 * 
 * This loader ensures players are always in the correct state:
 * 
 * 1. Authentication Check - Redirect to login if not authenticated
 * 2. Character Check - Redirect to onboarding if no character exists
 * 3. Onboarding Check - Redirect to onboarding if character.onboarding = false
 * 4. Progress Initialization - Create progress record if none exists
 * 5. Progress Loading - Load current storyline, quest, and encounter
 * 
 * Intro Stage Flow:
 * - null → 'tutorial_complete' → 'world_intro' → 'story_prologue' → 'arc_choice' → 'main_story'
 * 
 * This ensures players always land on the correct step when visiting /game
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	// Step 1: Ensure user is authenticated
	if (!locals.user) {
		redirect(302, '/auth/login');
	}

	// Step 2: Check if character exists
	const characterData = (
		await db.select().from(character).where(eq(character.userId, locals.user.id))
	)[0];

	if (!characterData) {
		// No character - redirect to onboarding to create one
		redirect(302, '/onboarding');
	}

	// Step 3: Check if character has completed onboarding
	if (!characterData.onboarding) {
		// Character exists but hasn't completed onboarding - send them back to finish
		redirect(302, '/onboarding');
	}

	// Step 4: Character is valid and onboarding complete - continue to game

	const attributes = await db
		.select({
			attribute: {
				id: attribute.id,
				name: attribute.name,
				description: attribute.description,
				category: attribute.category,
				baseValue: attribute.baseValue,
				scaling: attribute.scaling
			},
			characterAttribute: {
				characterId: characterAttribute.characterId,
				attributeId: characterAttribute.attributeId,
				value: characterAttribute.value
			}
		})
		.from(characterAttribute)
		.innerJoin(attribute, eq(characterAttribute.attributeId, attribute.id))
		.where(eq(characterAttribute.characterId, characterData.id));

	// 1. Fetch all storylines
	const storylines = await db.select().from(storyline);

	// 2. Fetch player progress
	let progress = (
		await db
			.select()
			.from(playerStoryProgress)
			.where(eq(playerStoryProgress.userId, locals.user.id))
			.limit(1)
	)[0];

	// 3. If no progress exists, initialize with first storyline
	if (!progress && storylines.length > 0) {
		const firstStoryline = storylines[0];
		const firstQuest = (
			await db
				.select()
				.from(quest)
				.where(eq(quest.storylineId, firstStoryline.id))
				.orderBy(quest.order)
				.limit(1)
		)[0];

		const firstEncounter = firstQuest
			? (
					await db
						.select()
						.from(encounter)
						.where(eq(encounter.questId, firstQuest.id))
						.orderBy(encounter.order)
						.limit(1)
			  )[0]
			: null;

		// Create initial progress record
		[progress] = await db
			.insert(playerStoryProgress)
			.values({
				userId: locals.user.id,
				storylineId: firstStoryline.id,
				questId: firstQuest?.id ?? null,
				encounterId: firstEncounter?.id ?? null,
				choiceId: null,
				introStage: null, // Will show tutorial_complete stage first
				updatedAt: new Date()
			})
			.returning();
	}

	let currentStoryline,
		currentQuest,
		currentEncounter,
		availableChoices: ChoiceFormData[] = [];

	if (progress) {
		// 4. Fetch current storyline, quest, encounter, and choices based on progress
		if (progress.storylineId) {
			currentStoryline = (
				await db.select().from(storyline).where(eq(storyline.id, progress.storylineId))
			)[0];
		}

		if (progress.questId) {
			currentQuest = (
				await db.select().from(quest).where(eq(quest.id, progress.questId))
			)[0];
		}

		if (progress.encounterId) {
			currentEncounter = (
				await db.select().from(encounter).where(eq(encounter.id, progress.encounterId))
			)[0];

			// Fetch available choices for current encounter
			availableChoices = await db
				.select()
				.from(choice)
				.where(eq(choice.encounterId, progress.encounterId));
		}
	}

	return {
		user: locals.user,
		character: characterData,
		attributes,
		scene: {},
		storylines,
		currentStoryline,
		currentQuest,
		currentEncounter,
		availableChoices,
		introStage: progress?.introStage ?? null
	};
};
