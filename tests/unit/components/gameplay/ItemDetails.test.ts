import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import ItemDetails from '../../../../src/lib/components/gameplay/ItemDetails.svelte';
import type { CharacterItemWithDetails } from '../../../../src/lib/types/CharacterItemWithDetails';

describe('ItemDetails Component', () => {
	let alertSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		// Mock globalThis.alert
		alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
	});

	afterEach(() => {
		alertSpy.mockRestore();
	});

	const createMockItem = (overrides = {}): CharacterItemWithDetails => ({
		id: 1,
		characterId: 1,
		itemId: 1,
		quantity: 1,
		slot: null,
		name: 'Health Potion',
		description: 'Restores 50 HP',
		type: 'consumable',
		...overrides
	});

	it('should render item name', () => {
		const item = createMockItem({ name: 'Magic Sword' });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Magic Sword')).toBeTruthy();
	});

	it('should render item quantity', () => {
		const item = createMockItem({ quantity: 5 });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Quantity: 5')).toBeTruthy();
	});

	it('should render item type', () => {
		const item = createMockItem({ type: 'weapon' });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Type: weapon')).toBeTruthy();
	});

	it('should render "Unknown" when type is null', () => {
		const item = createMockItem({ type: null });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Type: Unknown')).toBeTruthy();
	});

	it('should render item description', () => {
		const item = createMockItem({ description: 'A powerful healing elixir' });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Description: A powerful healing elixir')).toBeTruthy();
	});

	it('should render default description when description is null', () => {
		const item = createMockItem({ description: null });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Description: No description available')).toBeTruthy();
	});

	it('should render all three buttons', () => {
		const item = createMockItem();

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByRole('button', { name: 'Use' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Drop' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
	});

	it('should show alert when Use button is clicked', async () => {
		const user = userEvent.setup();
		const item = createMockItem({ name: 'Mana Potion' });

		render(ItemDetails, { selectedItem: item });

		const useButton = screen.getByRole('button', { name: 'Use' });
		await user.click(useButton);

		expect(alertSpy).toHaveBeenCalledWith('Using Mana Potion');
	});

	it('should show alert when Drop button is clicked', async () => {
		const user = userEvent.setup();
		const item = createMockItem({ name: 'Old Boots' });

		render(ItemDetails, { selectedItem: item });

		const dropButton = screen.getByRole('button', { name: 'Drop' });
		await user.click(dropButton);

		expect(alertSpy).toHaveBeenCalledWith('Dropped Old Boots');
	});

	it('should render modal overlay', () => {
		const item = createMockItem();

		const { container } = render(ItemDetails, { selectedItem: item });

		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toBeTruthy();
	});

	it('should handle items with special characters in name', () => {
		const item = createMockItem({ name: "Hero's Blade" });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText("Hero's Blade")).toBeTruthy();
	});

	it('should handle large quantities', () => {
		const item = createMockItem({ quantity: 9999 });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText('Quantity: 9999')).toBeTruthy();
	});

	it('should handle long descriptions', () => {
		const longDesc =
			'This is an extremely powerful artifact forged in the fires of Mount Doom by ancient wizards who sought to create the ultimate weapon against evil.';
		const item = createMockItem({ description: longDesc });

		render(ItemDetails, { selectedItem: item });

		expect(screen.getByText(`Description: ${longDesc}`)).toBeTruthy();
	});

	it('should handle all item types correctly', async () => {
		const user = userEvent.setup();
		const types = ['weapon', 'armor', 'consumable', 'quest', 'misc'];

		for (const type of types) {
			const item = createMockItem({ type, name: `Test ${type}` });
			const { unmount } = render(ItemDetails, { selectedItem: item });

			expect(screen.getByText(`Type: ${type}`)).toBeTruthy();

			// Test that buttons work for each type
			const useButton = screen.getByRole('button', { name: 'Use' });
			await user.click(useButton);
			expect(alertSpy).toHaveBeenCalledWith(`Using Test ${type}`);

			unmount();
			alertSpy.mockClear();
		}
	});
});
