import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import CharacterStats from '../../../../src/lib/components/character/CharacterStats.svelte';

describe('CharacterStats Component', () => {
	const mockCharacter = {
		name: 'Test Hero',
		level: 5,
		xp: 1200,
		hp: 80,
		maxHp: 100,
		gold: 500
	};

	it('should render character name and level', () => {
		render(CharacterStats, {
			props: { character: mockCharacter }
		});

		expect(screen.getByText('Test Hero')).toBeInTheDocument();
		expect(screen.getByText(/Level 5/i)).toBeInTheDocument();
	});

	it('should display gold amount', () => {
		render(CharacterStats, {
			props: { character: mockCharacter }
		});

		expect(screen.getByText('500')).toBeInTheDocument();
	});

	it('should display HP correctly', () => {
		render(CharacterStats, {
			props: { character: mockCharacter, showDetails: true }
		});

		expect(screen.getByText('80 / 100')).toBeInTheDocument();
	});

	it('should show health bar when showDetails is true', () => {
		render(CharacterStats, {
			props: { character: mockCharacter, showDetails: true }
		});

		expect(screen.getByText('Health')).toBeInTheDocument();
		expect(screen.getByText('Experience')).toBeInTheDocument();
	});

	it('should hide details when showDetails is false', () => {
		render(CharacterStats, {
			props: { character: mockCharacter, showDetails: false }
		});

		expect(screen.queryByText('Health')).not.toBeInTheDocument();
		expect(screen.queryByText('Experience')).not.toBeInTheDocument();
	});

	it('should show MAX badge for max level character', () => {
		const maxLevelChar = { ...mockCharacter, level: 50 };
		render(CharacterStats, {
			props: { character: maxLevelChar, showDetails: true }
		});

		expect(screen.getByText('MAX')).toBeInTheDocument();
		expect(screen.getByText('Maximum level reached!')).toBeInTheDocument();
	});

	it('should format large gold amounts with commas', () => {
		const richCharacter = { ...mockCharacter, gold: 1000000 };
		render(CharacterStats, {
			props: { character: richCharacter }
		});

		expect(screen.getByText('1,000,000')).toBeInTheDocument();
	});

	it('should calculate HP percentage correctly', () => {
		const lowHpCharacter = { ...mockCharacter, hp: 25, maxHp: 100 };
		const { container } = render(CharacterStats, {
			props: { character: lowHpCharacter, showDetails: true }
		});

		// HP bar should be at 25% width
		const hpBar = container.querySelector('.bg-gradient-to-r.from-error-500');
		expect(hpBar).toHaveStyle({ width: '25%' });
	});
});
