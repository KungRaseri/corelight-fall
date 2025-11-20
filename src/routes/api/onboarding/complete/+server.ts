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
		console.log('[ONBOARDING] Updating existing character:', {
			id: existingCharacter.id,
			name: existingCharacter.name,
			level: existingCharacter.level,
			xp: existingCharacter.xp,
			onboarding: existingCharacter.onboarding
		});

		// Update existing character (e.g., after admin reset)
		// Reset ALL stats to starting values for a fresh start
		const [updated] = await db
			.update(character)
			.set({
				name: data.name,
				appearance: data.appearance,
				onboarding: true,
				tutorial: data.tutorial,
				// Reset stats to starting values
				level: 1,
				xp: 0,
				gold: 0,
				hp: 100,
				maxHp: 100,
				updatedAt: new Date()
			})
			.where(eq(character.userId, locals.user!.id))
			.returning();
		
		characterRecord = updated;

		console.log('[ONBOARDING] Character after update:', {
			id: characterRecord.id,
			name: characterRecord.name,
			level: characterRecord.level,
			xp: characterRecord.xp,
			onboarding: characterRecord.onboarding
		});

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
