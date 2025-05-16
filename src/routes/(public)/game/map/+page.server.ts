import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { characterLocation } from '$lib/server/db/schema/map/characterLocation';
import { location } from '$lib/server/db/schema/map/location';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { status: 401, error: new Error('Unauthorized') };
    }

    const characterLoc = await db.select().from(characterLocation).where(eq(characterLocation.characterId, locals.character.id));
    const locations = await db.select().from(location);

    return {
        currentLocation: characterLoc,
        locations: locations,
    };
};
