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
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	await requireSession(locals);

	const data = await request.json();

	// Check if character already exists
	const [existingCharacter] = await db
		.select()
		.from(character)
		.where(eq(character.userId, locals.user!.id))
		.limit(1);

	let characterRecord;

	if (existingCharacter) {
		// Update existing character
		const [updated] = await db
			.update(character)
			.set({
				name: data.name,
				appearance: data.appearance,
				onboarding: true,
				tutorial: data.tutorial
			})
			.where(eq(character.userId, locals.user!.id))
			.returning();
		
		characterRecord = updated;

		// Delete existing attributes and faction to re-insert
		await db.delete(characterAttribute).where(eq(characterAttribute.characterId, characterRecord.id));
		await db.delete(characterFaction).where(eq(characterFaction.characterId, characterRecord.id));
	} else {
		// Create new character
		const newCharacter: NewCharacter = {
			name: data.name,
			userId: locals.user!.id,
			appearance: data.appearance,
			onboarding: true,
			tutorial: data.tutorial
		};

		const [created] = await db
			.insert(character)
			.values(newCharacter)
			.returning();
		
		characterRecord = created;
	}

	const attributes = await db.select().from(attribute);
	const factions = await db.select().from(faction);

	// Insert character attributes with proper typing
	for (const attr of attributes) {
		const newAttr: NewCharacterAttribute = {
			characterId: characterRecord.id,
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
		characterId: characterRecord.id,
		factionId: chosenFaction.id,
		reputation: 100
	};

	await db.insert(characterFaction).values(newCharacterFaction);

	return json({ success: true, data });
};
