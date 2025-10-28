import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { item } from '$lib/server/db/schema/gameplay/item';
import { characterEquipment, characterItem } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, parent }) => {
	if (!locals.user) {
		return { status: 401, error: new Error('Unauthorized') };
	}

	const { character } = await parent();

	if (!character) {
		throw new Error('Character not found');
	}

	// Fetch the character's inventory with item details
	const inventory = await db
		.select({
			characterId: characterItem.characterId,
			itemId: characterItem.itemId,
			quantity: characterItem.quantity,
			slot: characterEquipment.slot,
			name: item.name,
			type: item.type,
			description: item.description
		})
		.from(characterItem)
		.innerJoin(item, eq(characterItem.itemId, item.id))
		.leftJoin(
			characterEquipment,
			eq(characterItem.characterId, character.id) && eq(characterItem.itemId, item.id)
		)
		.where(eq(characterItem.characterId, character.id));

	return {
		inventory,
		inventorySlots: ['helmet', 'chest', 'legs', 'feet', 'hands', 'weapon', 'offhand', 'accessory']
	};
};
