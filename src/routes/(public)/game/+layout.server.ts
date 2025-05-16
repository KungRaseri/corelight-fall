import { db } from "$lib/server/db";
import { attribute, character, characterAttribute } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "../$types";


export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { status: 401, error: new Error('Unauthorized') };
    }

    const characterData = (await db
        .select()
        .from(character)
        .where(eq(character.userId, locals.user.id)))[0];

    if (!characterData) {
        return { status: 302, redirect: '/onboarding' };
    }

    const attributes = await db
        .select({
            attribute: {
                id: attribute.id,
                name: attribute.name,
                description: attribute.description,
                category: attribute.category,
                baseValue: attribute.baseValue,
                scaling: attribute.scaling,
            },
            characterAttribute: {
                characterId: characterAttribute.characterId,
                attributeId: characterAttribute.attributeId,
                value: characterAttribute.value
            }
        })
        .from(characterAttribute)
        .innerJoin(attribute, eq(characterAttribute.attributeId, attribute.id))
        .where(eq(characterAttribute.characterId, characterData.id));

    return { user: locals.user, character: characterData, attributes };
}