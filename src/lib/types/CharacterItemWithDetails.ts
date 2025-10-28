export type CharacterItemWithDetails = {
	itemId: number;
	characterId: number;
	name: string;
	description: string | null;
	type: string | null;
	slot: string | null;
	quantity: number;
};
