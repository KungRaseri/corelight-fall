import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import LocationDetails from '../../../../src/lib/components/gameplay/LocationDetails.svelte';

describe('LocationDetails Component', () => {
	it('should render location name', () => {
		const location = {
			name: 'The Dark Forest',
			description: 'A mysterious forest shrouded in darkness.'
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText('The Dark Forest')).toBeTruthy();
	});

	it('should render location description', () => {
		const location = {
			name: 'Castle Gate',
			description: 'An imposing stone gate guards the castle entrance.'
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText('An imposing stone gate guards the castle entrance.')).toBeTruthy();
	});

	it('should render default description when description is null', () => {
		const location = {
			name: 'Empty Room',
			description: null
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText('No description available.')).toBeTruthy();
	});

	it('should render default description when description is undefined', () => {
		const location = {
			name: 'Unknown Place'
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText('No description available.')).toBeTruthy();
	});

	it('should render close button', () => {
		const location = {
			name: 'Test Location',
			description: 'Test description'
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
	});

	it('should call onclose callback when close button is clicked', async () => {
		const user = userEvent.setup();
		const onclose = vi.fn();
		const location = {
			name: 'Test Location',
			description: 'Test description'
		};

		render(LocationDetails, { selectedLocation: location, onclose });

		const closeButton = screen.getByRole('button', { name: 'Close' });
		await user.click(closeButton);

		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('should not throw when close is clicked without onclose callback', async () => {
		const user = userEvent.setup();
		const location = {
			name: 'Test Location',
			description: 'Test description'
		};

		render(LocationDetails, { selectedLocation: location });

		const closeButton = screen.getByRole('button', { name: 'Close' });
		
		// Should not throw
		await expect(user.click(closeButton)).resolves.not.toThrow();
	});

	it('should render modal overlay', () => {
		const location = {
			name: 'Test Location',
			description: 'Test description'
		};

		const { container } = render(LocationDetails, { selectedLocation: location });

		// Check for the overlay div with specific classes
		const overlay = container.querySelector('.fixed.inset-0');
		expect(overlay).toBeTruthy();
	});

	it('should handle long descriptions', () => {
		const longDescription =
			'This is a very long description that goes on and on describing the location in great detail. It contains many words and sentences that provide a rich narrative experience for the player.';

		const location = {
			name: 'Verbose Place',
			description: longDescription
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText(longDescription)).toBeTruthy();
	});

	it('should handle special characters in name and description', () => {
		const location = {
			name: "O'Malley's Tavern",
			description: 'A cozy tavern with "the best" ale in town!'
		};

		render(LocationDetails, { selectedLocation: location });

		expect(screen.getByText("O'Malley's Tavern")).toBeTruthy();
		expect(screen.getByText('A cozy tavern with "the best" ale in town!')).toBeTruthy();
	});
});
