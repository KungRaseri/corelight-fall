import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { character, characterFaction, faction } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		redirect(302, '/auth/login');
	}

	// Check if character exists and has completed onboarding
	const [existingCharacter] = await db
		.select()
		.from(character)
		.where(eq(character.userId, locals.user.id))
		.limit(1);

	// If character exists and has completed onboarding, redirect to game
	if (existingCharacter?.onboarding) {
		redirect(302, '/game');
	}

	// Fetch attributes and factions from your API or DB
	const [attributesRes, factionsRes] = await Promise.all([
		fetch('/api/game/attributes'),
		fetch('/api/game/factions')
	]);
	const attributes = await attributesRes.json();
	const factions = await factionsRes.json();

	// If character exists but hasn't completed onboarding (e.g., after reset),
	// fetch their existing data to pre-fill the form
	let existingFaction = null;
	if (existingCharacter) {
		const [charFaction] = await db
			.select({
				factionName: faction.name
			})
			.from(characterFaction)
			.innerJoin(faction, eq(characterFaction.factionId, faction.id))
			.where(eq(characterFaction.characterId, existingCharacter.id))
			.limit(1);
		
		existingFaction = charFaction?.factionName || null;
	}

	return { 
		attributes, 
		factions,
		existingCharacter: existingCharacter ? {
			name: existingCharacter.name,
			appearance: existingCharacter.appearance,
			faction: existingFaction
		} : null
	};
};
