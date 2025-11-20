import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import TutorialHint from '../../../../src/lib/components/ui/TutorialHint.svelte';

describe('TutorialHint Component', () => {
	it('should render with title and message', () => {
		render(TutorialHint, {
			props: {
				title: 'Test Title',
				message: 'Test Message',
				onDismiss: vi.fn()
			}
		});

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test Message')).toBeInTheDocument();
	});

	it('should call onDismiss when close button is clicked', async () => {
		const user = userEvent.setup();
		const onDismiss = vi.fn();

		render(TutorialHint, {
			props: {
				title: 'Test Title',
				message: 'Test Message',
				onDismiss
			}
		});

		const dismissButton = screen.getByLabelText('Dismiss hint');
		await user.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('should render with info variant by default', () => {
		const { container } = render(TutorialHint, {
			props: {
				title: 'Info Title',
				message: 'Info Message',
				onDismiss: vi.fn()
			}
		});

		// Check for info variant styling
		const card = container.querySelector('.card');
		expect(card).toBeInTheDocument();
	});

	it('should render with tip variant', () => {
		render(TutorialHint, {
			props: {
				title: 'Tip Title',
				message: 'Tip Message',
				variant: 'tip',
				onDismiss: vi.fn()
			}
		});

		expect(screen.getByText('Tip Title')).toBeInTheDocument();
	});

	it('should render with warning variant', () => {
		render(TutorialHint, {
			props: {
				title: 'Warning Title',
				message: 'Warning Message',
				variant: 'warning',
				onDismiss: vi.fn()
			}
		});

		expect(screen.getByText('Warning Title')).toBeInTheDocument();
	});

	it('should have proper ARIA attributes', () => {
		render(TutorialHint, {
			props: {
				title: 'Accessible Title',
				message: 'Accessible Message',
				onDismiss: vi.fn()
			}
		});

		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveAttribute('aria-live', 'polite');
	});
});
