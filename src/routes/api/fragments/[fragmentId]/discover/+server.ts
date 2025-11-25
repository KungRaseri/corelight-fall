import { json, type RequestHandler } from '@sveltejs/kit';
import { fragmentService } from '$lib/server/services/fragmentService';

export const POST: RequestHandler = async ({ locals, params }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const fragmentId = Number.parseInt(params.fragmentId, 10);
	if (Number.isNaN(fragmentId)) {
		return json({ error: 'Invalid fragment ID' }, { status: 400 });
	}

	try {
		const result = await fragmentService.discoverFragment(
			locals.character.id,
			fragmentId
		);

		return json(result);
	} catch (error) {
		console.error('Error discovering fragment:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to discover fragment' 
		}, { status: 500 });
	}
};
