import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { onboardingData } from '../../../src/lib/stores/onboarding.js';

describe('Onboarding Store', () => {
	beforeEach(() => {
		// Reset to default state before each test
		onboardingData.set({
			name: '',
			appearance: '',
			faction: '',
			attributes: {},
			tutorial: false
		});
	});

	it('should initialize with default empty values', () => {
		const data = get(onboardingData);
		expect(data.name).toBe('');
		expect(data.appearance).toBe('');
		expect(data.faction).toBe('');
		expect(data.attributes).toEqual({});
		expect(data.tutorial).toBe(false);
	});

	it('should be a writable store', () => {
		const testData = {
			name: 'Hero',
			appearance: 'Tall warrior',
			faction: 'Knights',
			attributes: { strength: 10, dexterity: 8 },
			tutorial: true
		};

		onboardingData.set(testData);
		expect(get(onboardingData)).toEqual(testData);
	});

	it('should be subscribable', () => {
		let currentData;
		const unsubscribe = onboardingData.subscribe((value) => {
			currentData = value;
		});

		expect(currentData.name).toBe('');

		onboardingData.set({
			name: 'Test Character',
			appearance: 'Test',
			faction: 'Test Faction',
			attributes: {},
			tutorial: false
		});

		expect(currentData.name).toBe('Test Character');

		unsubscribe();
	});

	describe('name field', () => {
		it('should update name field', () => {
			onboardingData.update((data) => ({ ...data, name: 'Aragorn' }));
			expect(get(onboardingData).name).toBe('Aragorn');
		});

		it('should handle empty string', () => {
			onboardingData.update((data) => ({ ...data, name: 'Test' }));
			expect(get(onboardingData).name).toBe('Test');

			onboardingData.update((data) => ({ ...data, name: '' }));
			expect(get(onboardingData).name).toBe('');
		});

		it('should handle special characters', () => {
			onboardingData.update((data) => ({ ...data, name: "O'Malley" }));
			expect(get(onboardingData).name).toBe("O'Malley");

			onboardingData.update((data) => ({ ...data, name: 'Jean-Luc' }));
			expect(get(onboardingData).name).toBe('Jean-Luc');
		});
	});

	describe('appearance field', () => {
		it('should update appearance field', () => {
			onboardingData.update((data) => ({
				...data,
				appearance: 'A tall elf with silver hair'
			}));
			expect(get(onboardingData).appearance).toBe('A tall elf with silver hair');
		});

		it('should handle long descriptions', () => {
			const longAppearance =
				'A mysterious figure cloaked in shadows, with piercing blue eyes that seem to see through all deception';
			onboardingData.update((data) => ({ ...data, appearance: longAppearance }));
			expect(get(onboardingData).appearance).toBe(longAppearance);
		});
	});

	describe('faction field', () => {
		it('should update faction field', () => {
			onboardingData.update((data) => ({ ...data, faction: 'Mages Guild' }));
			expect(get(onboardingData).faction).toBe('Mages Guild');
		});

		it('should handle different faction values', () => {
			const factions = ['Warriors', 'Mages', 'Rogues', 'Clerics'];

			for (const faction of factions) {
				onboardingData.update((data) => ({ ...data, faction }));
				expect(get(onboardingData).faction).toBe(faction);
			}
		});
	});

	describe('attributes field', () => {
		it('should update attributes object', () => {
			const attributes = {
				strength: 10,
				dexterity: 12,
				intelligence: 14,
				wisdom: 8
			};

			onboardingData.update((data) => ({ ...data, attributes }));
			expect(get(onboardingData).attributes).toEqual(attributes);
		});

		it('should handle empty attributes', () => {
			onboardingData.update((data) => ({
				...data,
				attributes: { strength: 10 }
			}));
			expect(get(onboardingData).attributes).toEqual({ strength: 10 });

			onboardingData.update((data) => ({ ...data, attributes: {} }));
			expect(get(onboardingData).attributes).toEqual({});
		});

		it('should handle partial attribute updates', () => {
			onboardingData.update((data) => ({
				...data,
				attributes: { strength: 10, dexterity: 8 }
			}));

			onboardingData.update((data) => ({
				...data,
				attributes: { ...data.attributes, intelligence: 12 }
			}));

			expect(get(onboardingData).attributes).toEqual({
				strength: 10,
				dexterity: 8,
				intelligence: 12
			});
		});
	});

	describe('tutorial field', () => {
		it('should update tutorial boolean', () => {
			onboardingData.update((data) => ({ ...data, tutorial: true }));
			expect(get(onboardingData).tutorial).toBe(true);

			onboardingData.update((data) => ({ ...data, tutorial: false }));
			expect(get(onboardingData).tutorial).toBe(false);
		});

		it('should toggle tutorial value', () => {
			expect(get(onboardingData).tutorial).toBe(false);

			onboardingData.update((data) => ({ ...data, tutorial: !data.tutorial }));
			expect(get(onboardingData).tutorial).toBe(true);

			onboardingData.update((data) => ({ ...data, tutorial: !data.tutorial }));
			expect(get(onboardingData).tutorial).toBe(false);
		});
	});

	describe('integration scenarios', () => {
		it('should handle complete character creation flow', () => {
			// Step 1: Name
			onboardingData.update((data) => ({ ...data, name: 'Thorin' }));
			expect(get(onboardingData).name).toBe('Thorin');

			// Step 2: Appearance
			onboardingData.update((data) => ({
				...data,
				appearance: 'A stout dwarf with a thick beard'
			}));
			expect(get(onboardingData).appearance).toBe('A stout dwarf with a thick beard');

			// Step 3: Faction
			onboardingData.update((data) => ({ ...data, faction: 'Mountain Clan' }));
			expect(get(onboardingData).faction).toBe('Mountain Clan');

			// Step 4: Attributes
			onboardingData.update((data) => ({
				...data,
				attributes: { strength: 16, constitution: 14, wisdom: 10 }
			}));
			expect(get(onboardingData).attributes).toEqual({
				strength: 16,
				constitution: 14,
				wisdom: 10
			});

			// Step 5: Tutorial
			onboardingData.update((data) => ({ ...data, tutorial: true }));
			expect(get(onboardingData).tutorial).toBe(true);

			// Verify complete data
			const finalData = get(onboardingData);
			expect(finalData).toEqual({
				name: 'Thorin',
				appearance: 'A stout dwarf with a thick beard',
				faction: 'Mountain Clan',
				attributes: { strength: 16, constitution: 14, wisdom: 10 },
				tutorial: true
			});
		});

		it('should handle resetting data', () => {
			// Fill with data
			onboardingData.set({
				name: 'Test',
				appearance: 'Test appearance',
				faction: 'Test faction',
				attributes: { strength: 10 },
				tutorial: true
			});

			expect(get(onboardingData).name).toBe('Test');

			// Reset
			onboardingData.set({
				name: '',
				appearance: '',
				faction: '',
				attributes: {},
				tutorial: false
			});

			const data = get(onboardingData);
			expect(data.name).toBe('');
			expect(data.appearance).toBe('');
			expect(data.faction).toBe('');
			expect(data.attributes).toEqual({});
			expect(data.tutorial).toBe(false);
		});

		it('should handle partial updates without losing other fields', () => {
			onboardingData.set({
				name: 'Hero',
				appearance: 'Brave',
				faction: 'Warriors',
				attributes: { strength: 10 },
				tutorial: false
			});

			// Update only name
			onboardingData.update((data) => ({ ...data, name: 'New Hero' }));

			const data = get(onboardingData);
			expect(data.name).toBe('New Hero');
			expect(data.appearance).toBe('Brave');
			expect(data.faction).toBe('Warriors');
			expect(data.attributes).toEqual({ strength: 10 });
			expect(data.tutorial).toBe(false);
		});

		it('should work with subscriptions during updates', () => {
			const updates: string[] = [];
			const unsubscribe = onboardingData.subscribe((data) => {
				updates.push(data.name);
			});

			// Initial empty string
			expect(updates[0]).toBe('');

			onboardingData.update((data) => ({ ...data, name: 'Step 1' }));
			expect(updates.at(-1)).toBe('Step 1');

			onboardingData.update((data) => ({ ...data, name: 'Step 2' }));
			expect(updates.at(-1)).toBe('Step 2');

			onboardingData.update((data) => ({ ...data, name: 'Final' }));
			expect(updates.at(-1)).toBe('Final');

			expect(updates.length).toBe(4); // Initial + 3 updates

			unsubscribe();
		});
	});
});
