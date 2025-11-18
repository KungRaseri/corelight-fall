import { db } from '$lib/server/db';
import {
	faction,
	characterFaction,
	characterAttribute,
	attribute,
	character
} from '$lib/server/db/schema';
import type { NewCharacter, NewCharacterAttribute, NewCharacterFaction } from '$lib/server/db/types';
import { requireSession } from '$lib/utils/requireSession';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	requireSession(locals);

	const data = await request.json();

	const newCharacter: NewCharacter = {
		name: data.name,
		userId: locals.user?.id ?? -1,
		appearance: data.appearance,
		onboarding: true,
		tutorial: data.tutorial
	};

	const newCharacterRecord = (
		await db
			.insert(character)
			.values(newCharacter)
			.returning()
	)[0];

	const attributes = await db.select().from(attribute);
	const factions = await db.select().from(faction);

	// Insert character attributes with proper typing
	for (const attr of attributes) {
		const newAttr: NewCharacterAttribute = {
			characterId: newCharacterRecord.id,
			attributeId: attr.id,
			value: data.attributes[attr.name] || 0
		};
		await db.insert(characterAttribute).values(newAttr);
	}

	const chosenFaction = factions.find((f) => f.name === data.faction);
	if (!chosenFaction) {
		return new Response('Faction not found', { status: 400 });
	}

	const newCharacterFaction: NewCharacterFaction = {
		characterId: newCharacterRecord.id,
		factionId: chosenFaction.id,
		reputation: 100
	};

	await db.insert(characterFaction).values(newCharacterFaction);

	return json({ success: true, data });
};
