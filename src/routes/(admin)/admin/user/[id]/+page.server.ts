import { db } from '$lib/server/db';
import {
	user,
	character,
	characterAttribute,
	attribute,
	playerStoryProgress,
	storyline,
	quest,
	encounter,
	choice,
	characterItem,
	item,
	faction,
	characterFaction
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function fetchCharacterAttributes(characterId: number) {
	try {
		return await db
			.select({
				name: attribute.name,
				category: attribute.category,
				value: characterAttribute.value
			})
			.from(characterAttribute)
			.innerJoin(attribute, eq(characterAttribute.attributeId, attribute.id))
			.where(eq(characterAttribute.characterId, characterId));
	} catch (err) {
		console.error('Error fetching attributes:', err);
		return [];
	}
}

async function fetchStoryProgress(userId: number) {
	const progress = (
		await db
			.select()
			.from(playerStoryProgress)
			.where(eq(playerStoryProgress.userId, userId))
			.limit(1)
	)[0];

	if (!progress) return { progress: null, storyline: null, quest: null, encounter: null, choice: null };

	const [storyData, questData, encounterData, choiceData] = await Promise.all([
		progress.storylineId ? db.select().from(storyline).where(eq(storyline.id, progress.storylineId)).limit(1) : Promise.resolve([]),
		progress.questId ? db.select().from(quest).where(eq(quest.id, progress.questId)).limit(1) : Promise.resolve([]),
		progress.encounterId ? db.select().from(encounter).where(eq(encounter.id, progress.encounterId)).limit(1) : Promise.resolve([]),
		progress.choiceId ? db.select().from(choice).where(eq(choice.id, progress.choiceId)).limit(1) : Promise.resolve([])
	]);

	return {
		progress,
		storyline: storyData[0] || null,
		quest: questData[0] || null,
		encounter: encounterData[0] || null,
		choice: choiceData[0] || null
	};
}

async function fetchInventory(characterId: number) {
	try {
		return await db
			.select({
				itemId: item.id,
				name: item.name,
				type: item.type,
				rarity: item.rarity,
				quantity: characterItem.quantity,
				equipped: characterItem.equipped
			})
			.from(characterItem)
			.innerJoin(item, eq(characterItem.itemId, item.id))
			.where(eq(characterItem.characterId, characterId));
	} catch (err) {
		console.error('Error fetching inventory:', err);
		return [];
	}
}

async function fetchFactions(characterId: number) {
	try {
		return await db
			.select({
				name: faction.name,
				description: faction.description,
				reputation: characterFaction.reputation
			})
			.from(characterFaction)
			.innerJoin(faction, eq(characterFaction.factionId, faction.id))
			.where(eq(characterFaction.characterId, characterId));
	} catch (err) {
		console.error('Error fetching factions:', err);
		return [];
	}
}

export const load: PageServerLoad = async ({ params }) => {
	const userId = Number.parseInt(params.id);

	if (Number.isNaN(userId)) {
		error(400, 'Invalid user ID');
	}

	// Fetch user
	const userData = (await db.select().from(user).where(eq(user.id, userId)))[0];

	if (!userData) {
		error(404, 'User not found');
	}

	// Fetch character
	const characterData = (
		await db.select().from(character).where(eq(character.userId, userId))
	)[0];

	// Fetch all data in parallel if character exists
	let attributes: any[] = [];
	let inventory: any[] = [];
	let factions: any[] = [];
	
	if (characterData) {
		[attributes, inventory, factions] = await Promise.all([
			fetchCharacterAttributes(characterData.id),
			fetchInventory(characterData.id),
			fetchFactions(characterData.id)
		]);
	}

	// Fetch story progress
	const { progress, storyline: currentStoryline, quest: currentQuest, encounter: currentEncounter, choice: lastChoice } = await fetchStoryProgress(userId);

	return {
		user: {
			id: userData.id,
			username: userData.username,
			createdAt: userData.createdAt
		},
		character: characterData
			? {
					id: characterData.id,
					name: characterData.name,
					level: characterData.level,
					xp: characterData.xp,
					hp: characterData.hp,
					maxHp: characterData.maxHp,
					gold: characterData.gold,
					factionId: characterData.factionId,
					background: characterData.background,
					createdAt: characterData.createdAt
			  }
			: null,
		attributes,
		progress: progress
			? {
					introStage: progress.introStage,
					createdAt: progress.createdAt,
					updatedAt: progress.updatedAt
			  }
			: null,
		currentStoryline,
		currentQuest,
		currentEncounter,
		lastChoice,
		inventory,
		factions
	};
};
