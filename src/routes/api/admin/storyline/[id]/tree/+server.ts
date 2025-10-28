import { db } from '$lib/server/db';
import { storyline } from '$lib/server/db/schema/story/storyline';
import { quest } from '$lib/server/db/schema/story/quest';
import { encounter } from '$lib/server/db/schema/story/encounter';
import { choice } from '$lib/server/db/schema/story/choice';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';

export const GET = async ({ params, locals }) => {
	requireAdmin(locals);

	const id = Number(params.id);
	if (!id) return json({ error: 'Missing storyline id' }, { status: 400 });

	// Fetch storyline
	const [storylineRow] = await db.select().from(storyline).where(eq(storyline.id, id));
	if (!storylineRow) return json({ error: 'Storyline not found' }, { status: 404 });

	// Fetch quests
	const questsRows = await db.select().from(quest).where(eq(quest.storylineId, id));

	// Fetch encounters for all quests
	const questIds = questsRows.map((q) => q.id);
	const encountersRows = questIds.length
		? await db.select().from(encounter).where(inArray(encounter.questId, questIds))
		: [];

	// Fetch choices for all encounters
	const encounterIds = encountersRows.map((e) => e.id);
	const choicesRows = encounterIds.length
		? await db.select().from(choice).where(inArray(choice.encounterId, encounterIds))
		: [];

	// Nest choices into encounters
	const encountersWithChoices = encountersRows.map((e) => ({
		...e,
		choices: choicesRows.filter((c) => c.encounterId === e.id)
	}));

	// Nest encounters into quests
	const questsWithEncounters = questsRows.map((q) => ({
		...q,
		encounters: encountersWithChoices.filter((e) => e.questId === q.id)
	}));

	// Nest quests into storyline
	const storylineTree = {
		...storylineRow,
		quests: questsWithEncounters
	};

	return json(storylineTree);
};
