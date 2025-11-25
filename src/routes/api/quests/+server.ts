import { json, type RequestHandler } from '@sveltejs/kit';
import { questService } from '$lib/server/services/questService';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const quests = await questService.getCharacterQuests(locals.character.id);

		return json({ quests });
	} catch (error) {
		console.error('Error fetching quests:', error);
		return json({ error: 'Failed to fetch quests' }, { status: 500 });
	}
};
