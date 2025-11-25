import { json, type RequestHandler } from '@sveltejs/kit';
import { dialogueService } from '$lib/server/services/dialogueService';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.character) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const treeId = Number.parseInt(params.treeId, 10);
	if (Number.isNaN(treeId)) {
		return json({ error: 'Invalid dialogue tree ID' }, { status: 400 });
	}

	try {
		const tree = await dialogueService.getDialogueTree(treeId);

		if (!tree) {
			return json({ error: 'Dialogue tree not found' }, { status: 404 });
		}

		// Get starting node
		const startingNode = await dialogueService.getNode(tree.startingNodeId);

		return json({
			tree,
			currentNode: startingNode
		});
	} catch (error) {
		console.error('Error fetching dialogue:', error);
		return json({ error: 'Failed to fetch dialogue' }, { status: 500 });
	}
};
