import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Stepper from '../../../../src/lib/components/ui/Stepper.svelte';

// Mock component for testing
const MockStepComponent = () => ({
	render: () => '<div>Step Content</div>'
});

describe('Stepper Component', () => {
	const mockSteps = [
		{ label: 'Step 1', component: MockStepComponent },
		{ label: 'Step 2', component: MockStepComponent },
		{ label: 'Step 3', component: MockStepComponent }
	];

	it('should render all step buttons', () => {
		render(Stepper, { steps: mockSteps });

		const buttons = screen.getAllByRole('button');
		// 3 step buttons + 2 navigation buttons (Previous/Next)
		expect(buttons).toHaveLength(5);
	});

	it('should start at the first step', () => {
		render(Stepper, { steps: mockSteps });

		const stepButtons = screen.getAllByRole('button').slice(0, 3); // First 3 are step buttons
		expect(stepButtons[0]).toHaveClass('preset-glass-primary');
		expect(stepButtons[1]).toHaveClass('preset-glass-surface');
		expect(stepButtons[2]).toHaveClass('preset-glass-surface');
	});

	it('should disable Previous button on first step', () => {
		render(Stepper, { steps: mockSteps });

		const prevButton = screen.getByRole('button', { name: /previous/i });
		expect(prevButton).toBeDisabled();
	});

	it('should enable Next button on first step', () => {
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		expect(nextButton).not.toBeDisabled();
	});

	it('should navigate to next step when Next button is clicked', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		await user.click(nextButton);

		const stepButtons = screen.getAllByRole('button').slice(0, 3);
		expect(stepButtons[0]).toHaveClass('preset-glass-surface');
		expect(stepButtons[1]).toHaveClass('preset-glass-primary');
		expect(stepButtons[2]).toHaveClass('preset-glass-surface');
	});

	it('should navigate to previous step when Previous button is clicked', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const prevButton = screen.getByRole('button', { name: /previous/i });

		// Go to step 2
		await user.click(nextButton);
		// Go back to step 1
		await user.click(prevButton);

		const stepButtons = screen.getAllByRole('button').slice(0, 3);
		expect(stepButtons[0]).toHaveClass('preset-glass-primary');
		expect(stepButtons[1]).toHaveClass('preset-glass-surface');
	});

	it('should disable Next button on last step', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });

		// Navigate to last step
		await user.click(nextButton); // Step 2
		await user.click(nextButton); // Step 3

		expect(nextButton).toBeDisabled();
	});

	it('should enable Previous button on last step', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const prevButton = screen.getByRole('button', { name: /previous/i });

		// Navigate to last step
		await user.click(nextButton);
		await user.click(nextButton);

		expect(prevButton).not.toBeDisabled();
	});

	it('should jump to specific step when step button is clicked', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const stepButtons = screen.getAllByRole('button').slice(0, 3);
		await user.click(stepButtons[2]); // Click step 3 button

		expect(stepButtons[0]).toHaveClass('preset-glass-surface');
		expect(stepButtons[1]).toHaveClass('preset-glass-surface');
		expect(stepButtons[2]).toHaveClass('preset-glass-primary');
	});

	it('should render step numbers correctly', () => {
		render(Stepper, { steps: mockSteps });

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('should have correct title attributes on step buttons', () => {
		render(Stepper, { steps: mockSteps });

		const stepButtons = screen.getAllByRole('button').slice(0, 3);
		expect(stepButtons[0]).toHaveAttribute('title', 'Step 1');
		expect(stepButtons[1]).toHaveAttribute('title', 'Step 2');
		expect(stepButtons[2]).toHaveAttribute('title', 'Step 3');
	});

	it('should handle single step', () => {
		const singleStep = [{ label: 'Only Step', component: MockStepComponent }];
		render(Stepper, { steps: singleStep });

		const prevButton = screen.getByRole('button', { name: /previous/i });
		const nextButton = screen.getByRole('button', { name: /next/i });

		expect(prevButton).toBeDisabled();
		expect(nextButton).toBeDisabled();
	});

	it('should handle two steps', async () => {
		const user = userEvent.setup();
		const twoSteps = [
			{ label: 'First', component: MockStepComponent },
			{ label: 'Second', component: MockStepComponent }
		];
		render(Stepper, { steps: twoSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const prevButton = screen.getByRole('button', { name: /previous/i });

		// First step: prev disabled, next enabled
		expect(prevButton).toBeDisabled();
		expect(nextButton).not.toBeDisabled();

		// Go to second step
		await user.click(nextButton);

		// Second step: prev enabled, next disabled
		expect(prevButton).not.toBeDisabled();
		expect(nextButton).toBeDisabled();
	});

	it('should navigate through all steps sequentially', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const stepButtons = screen.getAllByRole('button').slice(0, 3);

		// Start at step 1
		expect(stepButtons[0]).toHaveClass('preset-glass-primary');

		// Go to step 2
		await user.click(nextButton);
		expect(stepButtons[1]).toHaveClass('preset-glass-primary');

		// Go to step 3
		await user.click(nextButton);
		expect(stepButtons[2]).toHaveClass('preset-glass-primary');
	});

	it('should navigate backwards through all steps', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const prevButton = screen.getByRole('button', { name: /previous/i });
		const stepButtons = screen.getAllByRole('button').slice(0, 3);

		// Go to last step
		await user.click(nextButton);
		await user.click(nextButton);
		expect(stepButtons[2]).toHaveClass('preset-glass-primary');

		// Go back to step 2
		await user.click(prevButton);
		expect(stepButtons[1]).toHaveClass('preset-glass-primary');

		// Go back to step 1
		await user.click(prevButton);
		expect(stepButtons[0]).toHaveClass('preset-glass-primary');
	});

	it('should render navigation with icons', () => {
		render(Stepper, { steps: mockSteps });

		const prevButton = screen.getByRole('button', { name: /previous/i });
		const nextButton = screen.getByRole('button', { name: /next/i });

		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
	});

	it('should allow jumping from first to last step', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const stepButtons = screen.getAllByRole('button').slice(0, 3);

		// Click last step button
		await user.click(stepButtons[2]);

		expect(stepButtons[2]).toHaveClass('preset-glass-primary');
		expect(stepButtons[0]).toHaveClass('preset-glass-surface');
	});

	it('should allow jumping from last to first step', async () => {
		const user = userEvent.setup();
		render(Stepper, { steps: mockSteps });

		const nextButton = screen.getByRole('button', { name: /next/i });
		const stepButtons = screen.getAllByRole('button').slice(0, 3);

		// Navigate to last step
		await user.click(nextButton);
		await user.click(nextButton);

		// Jump back to first step
		await user.click(stepButtons[0]);

		expect(stepButtons[0]).toHaveClass('preset-glass-primary');
		expect(stepButtons[2]).toHaveClass('preset-glass-surface');
	});
});
