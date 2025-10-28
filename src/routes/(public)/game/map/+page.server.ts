import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { characterLocation } from '$lib/server/db/schema/map/characterLocation';
import { location } from '$lib/server/db/schema/map/location';

export const load: PageServerLoad = async ({ parent, locals }) => {
	if (!locals.user) {
		return { status: 401, error: new Error('Unauthorized') };
	}

	const { character } = await parent();

	if (!character) {
		return { status: 404, error: new Error('Character not found') };
	}

	const characterLoc = await db
		.select()
		.from(characterLocation)
		.where(eq(characterLocation.characterId, character.id));
	const locations = await db.select().from(location);

	return {
		currentLocation: characterLoc,
		locations: locations
	};
};
