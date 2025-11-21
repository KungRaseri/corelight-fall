import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import CharacterAttributes from '../../../../src/lib/components/gameplay/CharacterAttributes.svelte';
import { characterAttributes } from '../../../../src/lib/stores/character';
import type { Attribute, CharacterAttribute } from '../../../../src/lib/server/db/types';

// Helper functions to create test data with all required fields
function createAttribute(overrides: Partial<Attribute> = {}): Attribute {
	return {
		id: 1,
		name: 'Test Attribute',
		description: 'Test description',
		category: 'Test',
		baseValue: 5,
		scaling: 1,
		...overrides
	};
}

function createCharacterAttribute(
	overrides: Partial<CharacterAttribute> = {}
): CharacterAttribute {
	return {
		characterId: 1,
		attributeId: 1,
		value: 10,
		...overrides
	};
}

describe('CharacterAttributes Component', () => {
	beforeEach(() => {
		characterAttributes.set([]);
	});

	it('should render the component title', () => {
		render(CharacterAttributes);
		const title = document.querySelector('h2');
		expect(title).toBeInTheDocument();
		expect(title?.textContent).toBe('Character Attributes');
	});

	it('should show empty state when no attributes are available', () => {
		render(CharacterAttributes);
		const emptyMessage = document.querySelector('p');
		expect(emptyMessage).toBeInTheDocument();
		expect(emptyMessage?.textContent).toBe('No attributes available.');
	});

	it('should render attributes from the store', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Strength' }),
				characterAttribute: createCharacterAttribute({ value: 15 })
			}
		];

		characterAttributes.set(testData);
		render(CharacterAttributes);

		const strengthCell = document.querySelector('td');
		expect(strengthCell).toBeInTheDocument();
		expect(strengthCell?.textContent).toContain('Strength');
	});

	it('should render multiple attributes', () => {
		const testData = [
			{
				attribute: createAttribute({ id: 1, name: 'Strength' }),
				characterAttribute: createCharacterAttribute({ attributeId: 1, value: 15 })
			},
			{
				attribute: createAttribute({ id: 2, name: 'Dexterity' }),
				characterAttribute: createCharacterAttribute({ attributeId: 2, value: 12 })
			},
			{
				attribute: createAttribute({ id: 3, name: 'Intelligence' }),
				characterAttribute: createCharacterAttribute({ attributeId: 3, value: 18 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const rows = container.querySelectorAll('tbody tr');
		expect(rows.length).toBe(3);
	});

	it('should render table headers', () => {
		characterAttributes.set([
			{
				attribute: createAttribute(),
				characterAttribute: createCharacterAttribute()
			}
		]);

		const { container } = render(CharacterAttributes);
		const headers = container.querySelectorAll('th');

		expect(headers.length).toBe(2);
		expect(headers[0].textContent).toBe('Attribute');
		expect(headers[1].textContent).toBe('Value');
	});

	it('should display attribute descriptions in tooltips', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Wisdom', description: 'Mental acuity and perception' }),
				characterAttribute: createCharacterAttribute({ value: 14 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const tooltip = container.querySelector('span span');
		expect(tooltip).toBeInTheDocument();
		expect(tooltip?.textContent).toBe('Mental acuity and perception');
	});

	it('should display attribute values', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Charisma' }),
				characterAttribute: createCharacterAttribute({ value: 20 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const valueCells = container.querySelectorAll('tbody td:nth-child(2)');
		expect(valueCells[0].textContent).toBe('20');
	});

	it('should handle zero values', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Empty Stat' }),
				characterAttribute: createCharacterAttribute({ value: 0 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const valueCells = container.querySelectorAll('tbody td:nth-child(2)');
		expect(valueCells[0].textContent).toBe('0');
	});

	it('should handle large values', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Power Level' }),
				characterAttribute: createCharacterAttribute({ value: 9999 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const valueCells = container.querySelectorAll('tbody td:nth-child(2)');
		expect(valueCells[0].textContent).toBe('9999');
	});

	it('should handle negative values', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Debt' }),
				characterAttribute: createCharacterAttribute({ value: -5 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const valueCells = container.querySelectorAll('tbody td:nth-child(2)');
		expect(valueCells[0].textContent).toBe('-5');
	});

	it('should apply alternating row colors', () => {
		const testData = [
			{
				attribute: createAttribute({ id: 1, name: 'Attr1' }),
				characterAttribute: createCharacterAttribute({ value: 10 })
			},
			{
				attribute: createAttribute({ id: 2, name: 'Attr2' }),
				characterAttribute: createCharacterAttribute({ value: 11 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const rows = container.querySelectorAll('tbody tr');
		expect(rows[0]).toHaveClass('bg-surface-700');
		expect(rows[1]).toHaveClass('bg-surface-800');
	});

	it('should render info icon for each attribute', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'TestAttr' }),
				characterAttribute: createCharacterAttribute({ value: 5 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const infoIcon = container.querySelector('svg');
		expect(infoIcon).toBeInTheDocument();
	});

	it('should handle special characters in attribute names', () => {
		const testData = [
			{
				attribute: createAttribute({ name: "Test's Attr & More" }),
				characterAttribute: createCharacterAttribute({ value: 7 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const nameCell = container.querySelector('tbody td');
		expect(nameCell?.textContent).toContain("Test's Attr & More");
	});

	it('should handle long attribute names', () => {
		const testData = [
			{
				attribute: createAttribute({ name: 'Super Long Attribute Name That Goes On Forever' }),
				characterAttribute: createCharacterAttribute({ value: 15 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const nameCell = container.querySelector('tbody td');
		expect(nameCell?.textContent).toContain('Super Long Attribute Name That Goes On Forever');
	});

	it('should handle long descriptions', () => {
		const longDesc =
			'This is a very long description that describes the attribute in great detail with lots of words';

		const testData = [
			{
				attribute: createAttribute({ description: longDesc }),
				characterAttribute: createCharacterAttribute({ value: 10 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const tooltip = container.querySelector('span span');
		expect(tooltip?.textContent).toBe(longDesc);
	});

	it('should handle null descriptions', () => {
		const testData = [
			{
				attribute: createAttribute({ description: null as any }),
				characterAttribute: createCharacterAttribute({ value: 8 })
			}
		];

		characterAttributes.set(testData);
		const { container } = render(CharacterAttributes);

		const tooltip = container.querySelector('span span');
		expect(tooltip).toBeInTheDocument();
	});

	it('should update when store changes', async () => {
		const { container } = render(CharacterAttributes);

		// Initially empty
		let emptyMessage = container.querySelector('p');
		expect(emptyMessage?.textContent).toBe('No attributes available.');

		// Add attribute
		characterAttributes.set([
			{
				attribute: createAttribute({ name: 'New Attr' }),
				characterAttribute: createCharacterAttribute({ value: 12 })
			}
		]);

		// Wait for DOM update
		await new Promise((resolve) => setTimeout(resolve, 100));

		const nameCell = container.querySelector('tbody td');
		expect(nameCell).toBeInTheDocument();
		if (nameCell) {
			expect(nameCell.textContent).toContain('New Attr');
		}
	});
});
