import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import WorldIntroduction from '../../../../src/lib/components/game/WorldIntroduction.svelte';

describe('WorldIntroduction Component', () => {
	it('should render introduction text', () => {
		render(WorldIntroduction, {
			props: {
				onContinue: vi.fn()
			}
		});

		// Check for key phrases in the introduction
		expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
	});

	it('should have a continue button', () => {
		render(WorldIntroduction, {
			props: {
				onContinue: vi.fn()
			}
		});

		const continueButton = screen.getByRole('button', { name: /continue/i });
		expect(continueButton).toBeInTheDocument();
	});

	it('should call onContinue when continue button is clicked', async () => {
		const user = userEvent.setup();
		const onContinue = vi.fn();

		render(WorldIntroduction, {
			props: { onContinue }
		});

		const continueButton = screen.getByRole('button', { name: /continue/i });
		await user.click(continueButton);

		expect(onContinue).toHaveBeenCalledTimes(1);
	});

	it('should be accessible with proper semantic HTML', () => {
		const { container } = render(WorldIntroduction, {
			props: {
				onContinue: vi.fn()
			}
		});

		// Should have proper heading structure
		const headings = container.querySelectorAll('h1, h2, h3');
		expect(headings.length).toBeGreaterThan(0);
	});
});
