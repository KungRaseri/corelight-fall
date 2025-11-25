import { json, type RequestHandler } from '@sveltejs/kit';
import { relationshipService } from '$lib/server/services/relationshipService';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const relationships = await relationshipService.getAllNpcRelationships(locals.character.id);

		const formatted = relationships.map(r => ({
			npc: {
				id: r.npc.id,
				name: r.npc.name,
				title: r.npc.title
			},
			relationshipLevel: r.relationship.relationshipLevel ?? 0,
			status: relationshipService.getRelationshipStatus(r.relationship.relationshipLevel ?? 0),
			totalInteractions: r.relationship.totalInteractions ?? 0,
			firstMet: r.relationship.firstMeetingAt,
			lastInteraction: r.relationship.lastInteractionAt
		}));

		return json({ relationships: formatted });
	} catch (error) {
		console.error('Error fetching relationships:', error);
		return json({ error: 'Failed to fetch relationships' }, { status: 500 });
	}
};
