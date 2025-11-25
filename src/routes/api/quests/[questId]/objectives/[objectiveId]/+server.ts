import { json, type RequestHandler } from '@sveltejs/kit';
import { questService } from '$lib/server/services/questService';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const questId = Number.parseInt(params.questId, 10);
	const objectiveId = Number.parseInt(params.objectiveId, 10);

	if (Number.isNaN(questId) || Number.isNaN(objectiveId)) {
		return json({ error: 'Invalid quest or objective ID' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const { progress } = body;

		const result = await questService.completeObjective(
			locals.character.id,
			questId,
			objectiveId,
			progress
		);

		return json(result);
	} catch (error) {
		console.error('Error completing objective:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to complete objective' 
		}, { status: 500 });
	}
};
