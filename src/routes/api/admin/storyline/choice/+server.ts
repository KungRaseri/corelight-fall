import { db } from '$lib/server/db';
import { playerStoryProgress, quest, encounter, choice } from '$lib/server/db/schema';
import type { NewPlayerStoryProgress } from '$lib/server/db/types';
import { requireSession } from '$lib/utils/requireSession.js';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
	requireSession(locals);
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}
	const body = await request.json();

	if (body.storylineId) {
		// Start new storyline: set to first quest/encounter
		const firstQuest = (
			await db
				.select()
				.from(quest)
				.where(eq(quest.storylineId, body.storylineId))
				.orderBy(quest.order)
				.limit(1)
		)[0];
		const firstEncounter = (
			await db
				.select()
				.from(encounter)
				.where(eq(encounter.questId, firstQuest.id))
				.orderBy(encounter.order)
				.limit(1)
		)[0];
		
		const newProgress: NewPlayerStoryProgress = {
			userId: locals.user.id,
			storylineId: body.storylineId,
			questId: firstQuest.id,
			encounterId: firstEncounter.id,
			choiceId: null,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		
		await db
			.insert(playerStoryProgress)
			.values(newProgress)
			.onConflictDoUpdate({
				target: [playerStoryProgress.userId],
				set: {
					storylineId: body.storylineId,
					questId: firstQuest.id,
					encounterId: firstEncounter.id
				}
			});
		return new Response('OK');
	}

	if (body.choiceId) {
		// Progress based on choice
		const selectedChoice = (await db.select().from(choice).where(eq(choice.id, body.choiceId)))[0];
		let nextEncounterId = selectedChoice.nextEncounterId;
		let nextQuestId = null; // if you support quest jumps
		if (!nextEncounterId) {
			// End of quest or story
			return new Response('END');
		}
		if (!nextQuestId) {
			// Stay in current quest
			const progress = (
				await db
					.select()
					.from(playerStoryProgress)
					.where(eq(playerStoryProgress.userId, locals.user.id))
			)[0];
			nextQuestId = progress.questId;
		}

		await db
			.update(playerStoryProgress)
			.set({
				questId: nextQuestId,
				encounterId: nextEncounterId
			})
			.where(eq(playerStoryProgress.userId, locals.user.id));
		return new Response('OK');
	}

	return new Response('Invalid', { status: 400 });
};
