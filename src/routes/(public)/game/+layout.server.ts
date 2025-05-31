import { db } from "$lib/server/db";
import { attribute, character, characterAttribute, choice, encounter, playerStoryProgress, quest, storyline } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "../$types";
import type { ChoiceFormData } from "$lib/types/ChoiceFormData";


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

    // 1. Fetch all storylines
    const storylines = await db.select().from(storyline);

    // 2. Fetch player progress
    const progress = (await db
        .select()
        .from(playerStoryProgress)
        .where(eq(playerStoryProgress.userId, locals.user.id))
        .limit(1))[0];

    let currentStoryline, currentQuest, currentEncounter, availableChoices: ChoiceFormData[] = [];

    if (progress) {
        // 3. Fetch current quest, encounter, choices
        currentStoryline = (await db.select().from(storyline).where(eq(storyline.id, progress.storylineId)))[0];
        currentQuest = (await db.select().from(quest).where(eq(quest.id, progress.questId ?? -1)))[0];
        currentEncounter = (await db.select().from(encounter).where(eq(encounter.id, progress.encounterId ?? -1)))[0];
        availableChoices = await db.select().from(choice).where(eq(choice.encounterId, progress.encounterId ?? -1));
    } else if (storylines.length) {
        // 4. Default: first storyline, first quest, first encounter
        currentStoryline = storylines[0];
        currentQuest = (await db.select().from(quest).where(eq(quest.storylineId, currentStoryline.id)).orderBy(quest.order).limit(1))[0];
        currentEncounter = (await db.select().from(encounter).where(eq(encounter.questId, currentQuest.id)).orderBy(encounter.order).limit(1))[0];
        availableChoices = await db.select().from(choice).where(eq(choice.encounterId, currentEncounter.id));
    }

    return {
        user: locals.user,
        character: characterData,
        attributes,
        scene: {},
        storylines,
        currentStoryline,
        currentQuest,
        currentEncounter,
        availableChoices
    };
}