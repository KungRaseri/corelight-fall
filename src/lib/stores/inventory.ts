import type { CharacterItemWithDetails } from '$lib/types/CharacterItemWithDetails';
import { writable } from 'svelte/store';

export const characterItems = writable<CharacterItemWithDetails[]>([]);
export const characterEquipment = writable<Record<string, CharacterItemWithDetails | null>>({});

export async function equipItem(characterId: number, itemId: number, slot: string) {
	try {
		const response = await fetch('/api/game/inventory/equip', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ characterId, itemId, slot })
		});
		if (!response.ok) throw new Error('Failed to equip item');
		return await response.json();
	} catch (error) {
		console.error('Error equipping item:', error);
		return { error: 'Failed to equip item' };
	}
}

export async function unequipItem(characterId: number, slot: string) {
	try {
		const response = await fetch('/api/game/inventory/unequip', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ characterId, slot })
		});
		if (!response.ok) throw new Error('Failed to unequip item');
		return await response.json();
	} catch (error) {
		console.error('Error unequipping item:', error);
		return { error: 'Failed to unequip item' };
	}
}
