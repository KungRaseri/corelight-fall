import { json, type RequestHandler } from '@sveltejs/kit';
import { questService } from '$lib/server/services/questService';

export const POST: RequestHandler = async ({ locals, params }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const questId = Number.parseInt(params.questId, 10);
	if (Number.isNaN(questId)) {
		return json({ error: 'Invalid quest ID' }, { status: 400 });
	}

	try {
		// Check prerequisites
		const canStart = await questService.checkPrerequisites(locals.character.id, questId);
		
		if (!canStart.met) {
			return json({ 
				error: 'Prerequisites not met',
				missing: canStart.missing 
			}, { status: 400 });
		}

		// Start the quest
		const questState = await questService.startQuest(locals.character.id, questId);

		return json({
			success: true,
			questState
		});
	} catch (error) {
		console.error('Error starting quest:', error);
		return json({ error: 'Failed to start quest' }, { status: 500 });
	}
};
