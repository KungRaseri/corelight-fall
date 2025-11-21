import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import LevelUpModal from '../../../../src/lib/components/character/LevelUpModal.svelte';

describe('LevelUpModal Component', () => {
	const mockLevelUpData = {
		newLevel: 5,
		levelsGained: 1,
		attributePoints: 3,
		maxHpIncrease: 10,
		goldBonus: 50
	};

	it('should not render when open is false', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: false,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.queryByText('Level Up!')).not.toBeInTheDocument();
	});

	it('should not render when levelUpData is null', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: null
		});

		expect(screen.queryByText('Level Up!')).not.toBeInTheDocument();
	});

	it('should render when open is true and levelUpData is provided', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText('Level Up!')).toBeInTheDocument();
	});

	it('should display the new level', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText(/Level 5/i)).toBeInTheDocument();
	});

	it('should display attribute points reward', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText('Attribute Points')).toBeInTheDocument();
		expect(screen.getByText('+3')).toBeInTheDocument();
	});

	it('should display max HP increase', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText('Maximum Health')).toBeInTheDocument();
		expect(screen.getByText('+10')).toBeInTheDocument();
	});

	it('should display gold bonus', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText('Gold')).toBeInTheDocument();
		expect(screen.getByText('+50')).toBeInTheDocument();
	});

	it('should call onClose when Continue button is clicked', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		const continueButton = screen.getByRole('button', { name: /continue/i });
		await user.click(continueButton);

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('should display reward descriptions', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText("Improve your character's abilities")).toBeInTheDocument();
		expect(screen.getByText('Fully healed!')).toBeInTheDocument();
		expect(screen.getByText('Bonus reward')).toBeInTheDocument();
	});

	it('should display "Rewards" section header', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		expect(screen.getByText('Rewards')).toBeInTheDocument();
	});

	it('should handle large attribute points values', () => {
		const onClose = vi.fn();
		const largeData = {
			...mockLevelUpData,
			attributePoints: 999
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: largeData
		});

		expect(screen.getByText('+999')).toBeInTheDocument();
	});

	it('should handle large HP increase values', () => {
		const onClose = vi.fn();
		const largeData = {
			...mockLevelUpData,
			maxHpIncrease: 500
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: largeData
		});

		expect(screen.getByText('+500')).toBeInTheDocument();
	});

	it('should handle large gold bonus values', () => {
		const onClose = vi.fn();
		const largeData = {
			...mockLevelUpData,
			goldBonus: 10000
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: largeData
		});

		expect(screen.getByText('+10000')).toBeInTheDocument();
	});

	it('should handle level 1 (first level up)', () => {
		const onClose = vi.fn();
		const level1Data = {
			newLevel: 1,
			levelsGained: 1,
			attributePoints: 1,
			maxHpIncrease: 5,
			goldBonus: 10
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: level1Data
		});

		expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
	});

	it('should handle very high levels', () => {
		const onClose = vi.fn();
		const highLevelData = {
			...mockLevelUpData,
			newLevel: 99
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: highLevelData
		});

		expect(screen.getByText(/Level 99/i)).toBeInTheDocument();
	});

	it('should handle zero attribute points', () => {
		const onClose = vi.fn();
		const zeroData = {
			...mockLevelUpData,
			attributePoints: 0
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: zeroData
		});

		expect(screen.getByText('+0')).toBeInTheDocument();
	});

	it('should render all reward sections', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		// Check all three reward sections are present
		const rewardSections = screen.getAllByText(/Attribute Points|Maximum Health|Gold/);
		expect(rewardSections.length).toBeGreaterThanOrEqual(3);
	});

	it('should have Continue button with correct styling', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: mockLevelUpData
		});

		const continueButton = screen.getByRole('button', { name: /continue/i });
		expect(continueButton).toHaveClass('preset-filled-primary');
		expect(continueButton).toHaveClass('w-full');
	});

	it('should handle multiple levels gained at once', () => {
		const onClose = vi.fn();
		const multiLevelData = {
			newLevel: 10,
			levelsGained: 3,
			attributePoints: 9,
			maxHpIncrease: 30,
			goldBonus: 150
		};
		render(LevelUpModal, {
			open: true,
			onClose,
			levelUpData: multiLevelData
		});

		expect(screen.getByText(/Level 10/i)).toBeInTheDocument();
		expect(screen.getByText('+9')).toBeInTheDocument();
		expect(screen.getByText('+30')).toBeInTheDocument();
		expect(screen.getByText('+150')).toBeInTheDocument();
	});

	it('should not render when both open is false and levelUpData is null', () => {
		const onClose = vi.fn();
		render(LevelUpModal, {
			open: false,
			onClose,
			levelUpData: null
		});

		expect(screen.queryByText('Level Up!')).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
	});
});
