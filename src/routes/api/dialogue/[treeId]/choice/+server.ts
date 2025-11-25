import { json, type RequestHandler } from '@sveltejs/kit';
import { dialogueService } from '$lib/server/services/dialogueService';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const treeId = Number.parseInt(params.treeId, 10);
	if (Number.isNaN(treeId)) {
		return json({ error: 'Invalid dialogue tree ID' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const { choiceId } = body;

		if (!choiceId || Number.isNaN(Number(choiceId))) {
			return json({ error: 'Choice ID is required' }, { status: 400 });
		}

		const result = await dialogueService.makeChoice(
			locals.character.id,
			treeId,
			Number(choiceId)
		);

		return json(result);
	} catch (error) {
		console.error('Error making dialogue choice:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to process choice' 
		}, { status: 500 });
	}
};
