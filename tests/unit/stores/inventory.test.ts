import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
	characterItems,
	characterEquipment,
	equipItem,
	unequipItem
} from '../../../src/lib/stores/inventory.js';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Inventory Store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Suppress console.error during tests
		vi.spyOn(console, 'error').mockImplementation(() => {});

		// Reset stores
		characterItems.set([]);
		characterEquipment.set({});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('characterItems store', () => {
		it('should initialize as empty array', () => {
			const items = get(characterItems);
			expect(Array.isArray(items)).toBe(true);
			expect(items.length).toBe(0);
		});

		it('should allow setting items', () => {
			const items = [
				{
					id: 1,
					characterId: 1,
					itemId: 10,
					quantity: 5,
					item: { id: 10, name: 'Potion', description: 'Healing potion' }
				}
			];

			characterItems.set(items);

			const currentItems = get(characterItems);
			expect(currentItems).toEqual(items);
			expect(currentItems.length).toBe(1);
		});

		it('should be subscribable', () => {
			let currentItems;
			const unsubscribe = characterItems.subscribe((value) => {
				currentItems = value;
			});

			expect(Array.isArray(currentItems)).toBe(true);
			unsubscribe();
		});
	});

	describe('characterEquipment store', () => {
		it('should initialize as empty object', () => {
			const equipment = get(characterEquipment);
			expect(typeof equipment).toBe('object');
			expect(Object.keys(equipment).length).toBe(0);
		});

		it('should allow setting equipment', () => {
			const equipment = {
				weapon: {
					id: 1,
					characterId: 1,
					itemId: 100,
					quantity: 1,
					item: { id: 100, name: 'Sword', description: 'Steel sword' }
				}
			};

			characterEquipment.set(equipment);

			const currentEquipment = get(characterEquipment);
			expect(currentEquipment).toEqual(equipment);
		});
	});

	describe('equipItem', () => {
		it('should successfully equip an item', async () => {
			const mockResponse = {
				item: { id: 50, name: 'Helmet' },
				slot: 'helmet'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await equipItem(1, 50, 'helmet');

			expect(result.item).toBeDefined();
			expect(mockFetch).toHaveBeenCalledWith('/api/game/inventory/equip', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ characterId: 1, itemId: 50, slot: 'helmet' })
			});
		});

		it('should handle API error responses', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false
			});

			const result = await equipItem(1, 999, 'weapon');

			expect(result.error).toBe('Failed to equip item');
		});

		it('should handle network errors', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network failure'));

			const result = await equipItem(1, 50, 'helmet');

			expect(result.error).toBe('Failed to equip item');
			expect(console.error).toHaveBeenCalled();
		});

		it('should send correct payload for different slots', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ item: {}, slot: 'armor' })
			});

			await equipItem(5, 100, 'armor');

			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/inventory/equip',
				expect.objectContaining({
					body: JSON.stringify({ characterId: 5, itemId: 100, slot: 'armor' })
				})
			);
		});
	});

	describe('unequipItem', () => {
		it('should successfully unequip an item', async () => {
			const mockResponse = {
				success: true
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await unequipItem(1, 'weapon');

			expect(result.success).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith('/api/game/inventory/unequip', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ characterId: 1, slot: 'weapon' })
			});
		});

		it('should handle API error responses', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false
			});

			const result = await unequipItem(1, 'helmet');

			expect(result.error).toBe('Failed to unequip item');
		});

		it('should handle network errors', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Connection lost'));

			const result = await unequipItem(1, 'armor');

			expect(result.error).toBe('Failed to unequip item');
			expect(console.error).toHaveBeenCalled();
		});

		it('should send correct payload for different slots', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});

			await unequipItem(3, 'boots');

			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/inventory/unequip',
				expect.objectContaining({
					body: JSON.stringify({ characterId: 3, slot: 'boots' })
				})
			);
		});
	});

	describe('integration scenarios', () => {
		it('should handle equip and unequip sequence', async () => {
			// Equip item
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ item: {}, slot: 'weapon' })
			});

			const equipResult = await equipItem(1, 100, 'weapon');
			expect(equipResult.item).toBeDefined();

			// Unequip item
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});

			const unequipResult = await unequipItem(1, 'weapon');
			expect(unequipResult.success).toBe(true);
		});

		it('should handle multiple equipment operations', async () => {
			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ item: {}, slot: 'weapon' })
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ item: {}, slot: 'armor' })
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ item: {}, slot: 'helmet' })
				});

			await equipItem(1, 100, 'weapon');
			await equipItem(1, 200, 'armor');
			await equipItem(1, 300, 'helmet');

			expect(mockFetch).toHaveBeenCalledTimes(3);
		});
	});
});
