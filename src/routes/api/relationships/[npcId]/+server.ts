import { json, type RequestHandler } from '@sveltejs/kit';
import { relationshipService } from '$lib/server/services/relationshipService';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const npcId = Number.parseInt(params.npcId, 10);
	if (Number.isNaN(npcId)) {
		return json({ error: 'Invalid NPC ID' }, { status: 400 });
	}

	try {
		const relationship = await relationshipService.getNpcRelationship(
			locals.character.id,
			npcId
		);

		if (!relationship) {
			return json({ 
				npcId,
				relationshipLevel: 0,
				status: 'Neutral',
				totalInteractions: 0
			});
		}

		return json({
			npcId,
			relationshipLevel: relationship.relationshipLevel ?? 0,
			status: relationshipService.getRelationshipStatus(relationship.relationshipLevel ?? 0),
			totalInteractions: relationship.totalInteractions ?? 0,
			firstMet: relationship.firstMeetingAt,
			lastInteraction: relationship.lastInteractionAt
		});
	} catch (error) {
		console.error('Error fetching relationship:', error);
		return json({ error: 'Failed to fetch relationship' }, { status: 500 });
	}
};
