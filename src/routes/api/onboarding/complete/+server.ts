import { db } from '$lib/server/db';
import { faction, playerFaction, playerStat, stat } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.player) {
        return new Response('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    const stats = await db.select().from(stat);
    const factions = await db.select().from(faction);

    stats.forEach(async (stat) => {
        await db.insert(playerStat).values({
            playerId: locals.player.id,
            statId: stat.id,
            value: data.attributes[stat.name] || 0
        });
    });

    factions.forEach(async (faction) => {
        await db.insert(playerFaction).values({
            playerId: locals.player.id,
            factionId: data.factions[faction.name] || 0,
            reputation: 100
        });
    });

    // For now, just echo back the data
    return json({ success: true, data });
};