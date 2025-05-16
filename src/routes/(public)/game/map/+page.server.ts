import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { playerLocation } from '$lib/server/db/schema/map/characterLocation';
import { location } from '$lib/server/db/schema/map/location';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.player) {
        return { status: 401, error: new Error('Unauthorized') };
    }

    const playerLoc = await db.select().from(playerLocation).where(eq(playerLocation.playerId, locals.player.id));
    const locations = await db.select().from(location);

    return {
        currentLocation: playerLoc,
        locations: locations,
    };
};
