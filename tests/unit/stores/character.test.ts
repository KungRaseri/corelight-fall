import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { character, setCharacterAttributes } from '$lib/stores/character';

describe('Character Store', () => {
	beforeEach(() => {
		// Reset character store before each test
		character.set({
			id: 1,
			name: 'Test Character',
			level: 1,
			xp: 0,
			hp: 100,
			maxHp: 100,
			gold: 0,
			userId: 1,
			appearance: 'Test appearance',
			background: null,
			factionId: null,
			tutorial: false,
			onboarding: true,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	});

	it('should initialize with default character', () => {
		const char = get(character);
		expect(char).toBeDefined();
		expect(char.name).toBe('Test Character');
		expect(char.level).toBe(1);
	});

	it('should update character when set is called', () => {
		character.set({
			id: 2,
			name: 'New Character',
			level: 5,
			xp: 1000,
			hp: 150,
			maxHp: 150,
			gold: 500,
			userId: 1,
			appearance: 'New appearance',
			background: null,
			factionId: null,
			tutorial: false,
			onboarding: true,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		const char = get(character);
		expect(char.name).toBe('New Character');
		expect(char.level).toBe(5);
		expect(char.xp).toBe(1000);
		expect(char.gold).toBe(500);
	});

	it('should be subscribable', () => {
		let currentCharacter;
		const unsubscribe = character.subscribe((value) => {
			currentCharacter = value;
		});

		expect(currentCharacter).toBeDefined();
		expect(currentCharacter.name).toBe('Test Character');

		unsubscribe();
	});

	it('setCharacterAttributes should handle attribute data', () => {
		const attributes = [
			{ name: 'Strength', value: 10, category: 'primary' },
			{ name: 'Dexterity', value: 8, category: 'primary' },
			{ name: 'Intelligence', value: 12, category: 'primary' }
		];

		// This should not throw an error
		expect(() => setCharacterAttributes(attributes)).not.toThrow();
	});
});
