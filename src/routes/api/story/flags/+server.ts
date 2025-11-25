import { json, type RequestHandler } from '@sveltejs/kit';
import { storyFlagService } from '$lib/server/services/storyFlagService';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const flags = await storyFlagService.getAllFlags(locals.character.id);

		return json({ flags });
	} catch (error) {
		console.error('Error fetching story flags:', error);
		return json({ error: 'Failed to fetch story flags' }, { status: 500 });
	}
};
