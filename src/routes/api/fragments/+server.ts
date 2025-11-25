import { json, type RequestHandler } from '@sveltejs/kit';
import { fragmentService } from '$lib/server/services/fragmentService';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const fragments = await fragmentService.getCharacterFragments(locals.character.id);
		const stats = await fragmentService.getFragmentStats(locals.character.id);

		const formatted = fragments.map(f => ({
			id: f.fragment.id,
			name: f.fragment.name,
			type: f.fragment.type,
			description: f.fragment.description,
			attunementProgress: f.characterFragment.attunementProgress ?? 0,
			isAttuned: f.characterFragment.isAttuned ?? false,
			acquiredAt: f.characterFragment.acquiredAt,
			acquiredHow: f.characterFragment.acquiredHow
		}));

		return json({ 
			fragments: formatted,
			stats
		});
	} catch (error) {
		console.error('Error fetching fragments:', error);
		return json({ error: 'Failed to fetch fragments' }, { status: 500 });
	}
};
