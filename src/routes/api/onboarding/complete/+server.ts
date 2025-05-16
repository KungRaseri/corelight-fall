import { db } from '$lib/server/db';
import { faction, characterFaction, characterAttribute, attribute, character } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    const newCharacter = (await db.insert(character).values({
        name: data.name,
        userId: locals.user.id,
        appearance: data.appearance,
        onboarding: true,
        tutorial: data.tutorial,
    }).returning())[0];

    const attributes = await db.select().from(attribute);
    const factions = await db.select().from(faction);

    attributes.forEach(async (attribute) => {
        await db.insert(characterAttribute).values({
            characterId: newCharacter.id,
            attributeId: attribute.id,
            value: data.attributes[attribute.name] || 0
        });
    });

    const chosenFaction = factions.find(f => f.name === data.faction);
    if (!chosenFaction) {
        return new Response('Faction not found', { status: 400 });
    }

    await db.insert(characterFaction).values({
        characterId: newCharacter.id,
        factionId: chosenFaction.id,
        reputation: 100
    });

    // For now, just echo back the data
    return json({ success: true, data });
};