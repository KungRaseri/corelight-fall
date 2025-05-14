import { writable } from 'svelte/store';

export const playerItems = writable<PlayerItemWithDetails[]>([]);
export const playerEquipment = writable<Record<string, PlayerItemWithDetails | null>>({});

export async function equipItem(itemId: number, slot: string) {
    try {
        const response = await fetch('/api/player/inventory/equip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId, slot })
        });
        if (!response.ok) throw new Error('Failed to equip item');
        return await response.json();
    } catch (error) {
        console.error('Error equipping item:', error);
        return { error: 'Failed to equip item' };
    }
}

export async function unequipItem(slot: string) {
    try {
        const response = await fetch('/api/player/inventory/unequip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot })
        });
        if (!response.ok) throw new Error('Failed to unequip item');
        return await response.json();
    } catch (error) {
        console.error('Error unequipping item:', error);
        return { error: 'Failed to unequip item' };
    }
}
