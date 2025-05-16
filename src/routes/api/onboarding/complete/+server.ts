import { db } from '$lib/server/db';
import { faction, characterFaction, characterAttribute, attribute } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    const stats = await db.select().from(attribute);
    const factions = await db.select().from(faction);

    stats.forEach(async (attribute) => {
        await db.insert(characterAttribute).values({
            characterId: locals.character.id,
            attributeId: attribute.id,
            value: data.attributes[attribute.name] || 0
        });
    });

    factions.forEach(async (faction) => {
        await db.insert(characterFaction).values({
            characterId: locals.character.id,
            factionId: data.factions[faction.name] || 0,
            reputation: 100
        });
    });

    // For now, just echo back the data
    return json({ success: true, data });
};