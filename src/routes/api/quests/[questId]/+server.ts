import { json, type RequestHandler } from '@sveltejs/kit';
import { questService } from '$lib/server/services/questService';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const questId = Number.parseInt(params.questId || '', 10);
	if (Number.isNaN(questId)) {
		return json({ error: 'Invalid quest ID' }, { status: 400 });
	}

	try {
		const characterQuests = await questService.getCharacterQuests(locals.character.id);
		const questState = characterQuests.find(q => q.questId === questId);

		if (!questState) {
			return json({ error: 'Quest not found' }, { status: 404 });
		}

		return json(questState);
	} catch (error) {
		console.error('Error fetching quest:', error);
		return json({ error: 'Failed to fetch quest' }, { status: 500 });
	}
};
