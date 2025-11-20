import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
	character,
	setCharacter,
	clearCharacter,
	characterAttributes,
	setCharacterAttributes,
	updateCharacterAttribute
} from '../../../src/lib/stores/character.js';

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

	describe('setCharacter', () => {
		it('should set the character value', () => {
			const newChar = {
				id: 99,
				name: 'Hero',
				level: 10,
				xp: 5000,
				hp: 200,
				maxHp: 200,
				gold: 1000,
				userId: 1,
				appearance: 'Tall warrior',
				background: 'Noble',
				factionId: 5,
				tutorial: true,
				onboarding: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setCharacter(newChar);

			const char = get(character);
			expect(char).toEqual(newChar);
			expect(char.id).toBe(99);
			expect(char.name).toBe('Hero');
			expect(char.level).toBe(10);
			expect(char.gold).toBe(1000);
		});

		it('should allow setting character to null', () => {
			setCharacter(null);

			const char = get(character);
			expect(char).toBeNull();
		});

		it('should overwrite previous character', () => {
			const firstChar = {
				id: 1,
				name: 'First',
				level: 1,
				xp: 0,
				hp: 100,
				maxHp: 100,
				gold: 0,
				userId: 1,
				appearance: '',
				background: null,
				factionId: null,
				tutorial: false,
				onboarding: true,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const secondChar = {
				id: 2,
				name: 'Second',
				level: 5,
				xp: 1000,
				hp: 150,
				maxHp: 150,
				gold: 500,
				userId: 1,
				appearance: '',
				background: null,
				factionId: null,
				tutorial: false,
				onboarding: true,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			setCharacter(firstChar);
			expect(get(character).name).toBe('First');

			setCharacter(secondChar);
			expect(get(character).name).toBe('Second');
			expect(get(character).id).toBe(2);
		});
	});

	describe('clearCharacter', () => {
		it('should set character to null', () => {
			// Ensure character is set first
			const char = {
				id: 1,
				name: 'Test',
				level: 1,
				xp: 0,
				hp: 100,
				maxHp: 100,
				gold: 0,
				userId: 1,
				appearance: '',
				background: null,
				factionId: null,
				tutorial: false,
				onboarding: true,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			setCharacter(char);
			expect(get(character)).not.toBeNull();

			clearCharacter();
			expect(get(character)).toBeNull();
		});

		it('should work when character is already null', () => {
			setCharacter(null);
			expect(() => clearCharacter()).not.toThrow();
			expect(get(character)).toBeNull();
		});
	});

	describe('characterAttributes', () => {
		it('should initialize as empty array', () => {
			const attrs = get(characterAttributes);
			expect(Array.isArray(attrs)).toBe(true);
		});

		it('should set attributes array', () => {
			const attributes = [
				{ attributeId: 1, name: 'Strength', value: 15 },
				{ attributeId: 2, name: 'Dexterity', value: 12 },
				{ attributeId: 3, name: 'Intelligence', value: 10 }
			];

			setCharacterAttributes(attributes);

			const attrs = get(characterAttributes);
			expect(attrs).toEqual(attributes);
			expect(attrs.length).toBe(3);
		});

		it('should handle empty attributes array', () => {
			setCharacterAttributes([]);
			expect(get(characterAttributes)).toEqual([]);
		});
	});

	describe('updateCharacterAttribute', () => {
		beforeEach(() => {
			// Set up initial attributes with correct structure
			const attributes = [
				{
					attribute: { id: 1, name: 'Strength', category: 'primary' },
					characterAttribute: { attributeId: 1, value: 10, characterId: 1, id: 1 }
				},
				{
					attribute: { id: 2, name: 'Dexterity', category: 'primary' },
					characterAttribute: { attributeId: 2, value: 8, characterId: 1, id: 2 }
				},
				{
					attribute: { id: 3, name: 'Intelligence', category: 'primary' },
					characterAttribute: { attributeId: 3, value: 12, characterId: 1, id: 3 }
				},
				{
					attribute: { id: 4, name: 'Wisdom', category: 'primary' },
					characterAttribute: { attributeId: 4, value: 14, characterId: 1, id: 4 }
				}
			];
			setCharacterAttributes(attributes);
		});

		it('should update existing attribute value', () => {
			updateCharacterAttribute(2, 15);

			const attrs = get(characterAttributes);
			const dexterity = attrs.find((a) => a.characterAttribute.attributeId === 2);
			expect(dexterity?.characterAttribute.value).toBe(15);
		});

		it('should not modify other attributes', () => {
			const beforeAttrs = get(characterAttributes);
			const strengthBefore = beforeAttrs.find(
				(a) => a.characterAttribute.attributeId === 1
			)?.characterAttribute.value;
			const wisdomBefore = beforeAttrs.find(
				(a) => a.characterAttribute.attributeId === 4
			)?.characterAttribute.value;

			updateCharacterAttribute(2, 20);

			const afterAttrs = get(characterAttributes);
			const strengthAfter = afterAttrs.find(
				(a) => a.characterAttribute.attributeId === 1
			)?.characterAttribute.value;
			const wisdomAfter = afterAttrs.find(
				(a) => a.characterAttribute.attributeId === 4
			)?.characterAttribute.value;

			expect(strengthAfter).toBe(strengthBefore);
			expect(wisdomAfter).toBe(wisdomBefore);
		});

		it('should handle attribute not found gracefully', () => {
			const beforeAttrs = get(characterAttributes);
			const beforeLength = beforeAttrs.length;

			// Try to update non-existent attribute
			updateCharacterAttribute(999, 100);

			const afterAttrs = get(characterAttributes);
			expect(afterAttrs.length).toBe(beforeLength);
			// No attribute should have been modified
			expect(afterAttrs).toEqual(beforeAttrs);
		});

		it('should update to zero value', () => {
			updateCharacterAttribute(1, 0);

			const attrs = get(characterAttributes);
			const strength = attrs.find((a) => a.characterAttribute.attributeId === 1);
			expect(strength?.characterAttribute.value).toBe(0);
		});

		it('should update to negative value', () => {
			updateCharacterAttribute(3, -5);

			const attrs = get(characterAttributes);
			const intelligence = attrs.find((a) => a.characterAttribute.attributeId === 3);
			expect(intelligence?.characterAttribute.value).toBe(-5);
		});

		it('should update multiple times', () => {
			updateCharacterAttribute(1, 15);
			updateCharacterAttribute(1, 20);
			updateCharacterAttribute(1, 25);

			const attrs = get(characterAttributes);
			const strength = attrs.find((a) => a.characterAttribute.attributeId === 1);
			expect(strength?.characterAttribute.value).toBe(25);
		});

		it('should work with empty attributes array', () => {
			setCharacterAttributes([]);
			expect(() => updateCharacterAttribute(1, 10)).not.toThrow();
			expect(get(characterAttributes)).toEqual([]);
		});
	});
});
