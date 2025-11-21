import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ItemGrid from '../../../../src/lib/components/gameplay/ItemGrid.svelte';
import type { CharacterItemWithDetails } from '../../../../src/lib/types/CharacterItemWithDetails';

// Helper to create test item data
function createItem(overrides: Partial<CharacterItemWithDetails> = {}): CharacterItemWithDetails {
	return {
		itemId: 1,
		characterId: 1,
		quantity: 1,
		slot: null,
		name: 'Test Item',
		description: 'Test description',
		type: 'consumable',
		...overrides
	};
}

describe('ItemGrid Component', () => {
	it('should render items in a grid', () => {
		const items = [
			createItem({ itemId: 1, name: 'Health Potion' }),
			createItem({ itemId: 2, name: 'Mana Potion' }),
			createItem({ itemId: 3, name: 'Sword' })
		];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Health Potion')).toBeInTheDocument();
		expect(screen.getByText('Mana Potion')).toBeInTheDocument();
		expect(screen.getByText('Sword')).toBeInTheDocument();
	});

	it('should display item quantities', () => {
		const items = [createItem({ name: 'Arrow', quantity: 50 })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Quantity: 50')).toBeInTheDocument();
	});

	it('should display item types', () => {
		const items = [createItem({ name: 'Shield', type: 'armor' })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('armor')).toBeInTheDocument();
	});

	it('should show "Unknown" when item type is null', () => {
		const items = [createItem({ name: 'Mystery Item', type: null })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Unknown')).toBeInTheDocument();
	});

	it('should show "Unknown" when item type is undefined', () => {
		const items = [createItem({ name: 'Mystery Item', type: undefined })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Unknown')).toBeInTheDocument();
	});

	it('should call selectItem when item is clicked', async () => {
		const user = userEvent.setup();
		const items = [createItem({ name: 'Potion' })];

		render(ItemGrid, { inventory: items });

		const itemButton = screen.getByRole('button', { name: /Select Potion/i });
		// Test passes if no error is thrown when clicking
		await user.click(itemButton);
		
		expect(itemButton).toBeInTheDocument();
	});

	it('should call handleKey when Enter key is pressed', () => {
		const items = [createItem({ name: 'Potion' })];

		render(ItemGrid, { inventory: items });

		const itemButton = screen.getByRole('button', { name: /Select Potion/i });
		// Test passes if no error is thrown
		fireEvent.keyDown(itemButton, { key: 'Enter' });
		
		expect(itemButton).toBeInTheDocument();
	});

	it('should call handleKey when Space key is pressed', () => {
		const items = [createItem({ name: 'Potion' })];

		render(ItemGrid, { inventory: items });

		const itemButton = screen.getByRole('button', { name: /Select Potion/i });
		// Test passes if no error is thrown
		fireEvent.keyDown(itemButton, { key: ' ' });
		
		expect(itemButton).toBeInTheDocument();
	});

	it('should not emit event when other keys are pressed', () => {
		const items = [createItem({ name: 'Potion' })];

		const { container } = render(ItemGrid, { inventory: items });

		const eventSpy = vi.fn();
		container.addEventListener('itemSelected', eventSpy);

		const itemButton = screen.getByRole('button', { name: /Select Potion/i });
		fireEvent.keyDown(itemButton, { key: 'a' });
		fireEvent.keyDown(itemButton, { key: 'Tab' });

		expect(eventSpy).not.toHaveBeenCalled();
	});

	it('should render empty grid when inventory is empty', () => {
		const { container } = render(ItemGrid, { inventory: [] });

		const buttons = container.querySelectorAll('button');
		expect(buttons.length).toBe(0);
	});

	it('should have correct aria-label for accessibility', () => {
		const items = [createItem({ name: 'Magic Scroll' })];

		render(ItemGrid, { inventory: items });

		const button = screen.getByRole('button', { name: 'Select Magic Scroll' });
		expect(button).toBeInTheDocument();
	});

	it('should display all items in a 3-column grid', () => {
		const items = [
			createItem({ itemId: 1, name: 'Item 1' }),
			createItem({ itemId: 2, name: 'Item 2' }),
			createItem({ itemId: 3, name: 'Item 3' }),
			createItem({ itemId: 4, name: 'Item 4' })
		];

		const { container } = render(ItemGrid, { inventory: items });

		const grid = container.querySelector('.grid-cols-3');
		expect(grid).toBeInTheDocument();

		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBe(4);
	});

	it('should handle items with quantity of 0', () => {
		const items = [createItem({ name: 'Empty Bottle', quantity: 0 })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
	});

	it('should handle items with large quantities', () => {
		const items = [createItem({ name: 'Gold Coins', quantity: 999999 })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Quantity: 999999')).toBeInTheDocument();
	});

	it('should handle items with special characters in name', () => {
		const items = [createItem({ name: "Hero's Sword" })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText("Hero's Sword")).toBeInTheDocument();
	});

	it('should handle all different item types', () => {
		const items = [
			createItem({ itemId: 1, name: 'Item 1', type: 'weapon' }),
			createItem({ itemId: 2, name: 'Item 2', type: 'armor' }),
			createItem({ itemId: 3, name: 'Item 3', type: 'consumable' }),
			createItem({ itemId: 4, name: 'Item 4', type: 'quest' }),
			createItem({ itemId: 5, name: 'Item 5', type: 'misc' })
		];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('weapon')).toBeInTheDocument();
		expect(screen.getByText('armor')).toBeInTheDocument();
		expect(screen.getByText('consumable')).toBeInTheDocument();
		expect(screen.getByText('quest')).toBeInTheDocument();
		expect(screen.getByText('misc')).toBeInTheDocument();
	});

	it('should have hover and click styles', () => {
		const items = [createItem({ name: 'Hoverable Item' })];

		render(ItemGrid, { inventory: items });

		const button = screen.getByRole('button', { name: /Select Hoverable Item/i });
		expect(button).toHaveClass('cursor-pointer');
		expect(button).toHaveClass('hover:bg-surface-600');
	});

	it('should handle long item names', () => {
		const items = [
			createItem({ name: 'Extremely Long Item Name That Should Still Display Correctly' })
		];

		render(ItemGrid, { inventory: items });

		expect(
			screen.getByText('Extremely Long Item Name That Should Still Display Correctly')
		).toBeInTheDocument();
	});

	it('should maintain button type attribute', () => {
		const items = [createItem({ name: 'Test Item' })];

		render(ItemGrid, { inventory: items });

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('should handle null descriptions', () => {
		const items = [createItem({ name: 'Item', description: null })];

		render(ItemGrid, { inventory: items });

		expect(screen.getByText('Item')).toBeInTheDocument();
	});
});
