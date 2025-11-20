import { describe, it, expect } from 'vitest';
import { performSkillCheck, formatSkillCheckResult } from '$lib/utils/skillCheck';

describe('Skill Check Utilities', () => {
	describe('performSkillCheck', () => {
		it('should return a skill check result object', () => {
			const result = performSkillCheck(10, 15);
			
			expect(result).toHaveProperty('roll');
			expect(result).toHaveProperty('modifier');
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('dc');
			expect(result).toHaveProperty('success');
		});

		it('should calculate modifier correctly', () => {
			const result = performSkillCheck(10, 15);
			expect(result.modifier).toBe(0); // 10 is average, modifier should be 0

			const result2 = performSkillCheck(15, 15);
			expect(result2.modifier).toBeGreaterThan(0); // 15 should have positive modifier
		});

		it('should calculate total as roll + modifier', () => {
			const result = performSkillCheck(12, 15);
			expect(result.total).toBe(result.roll + result.modifier);
		});

		it('should mark success when total >= DC', () => {
			// Mock Math.random to control the roll
			const originalRandom = Math.random;
			Math.random = () => 0.99; // Will roll 20 (critical success)

			const result = performSkillCheck(10, 15);
			expect(result.success).toBe(true);

			Math.random = originalRandom;
		});

		it('should mark failure when total < DC', () => {
			const originalRandom = Math.random;
			Math.random = () => 0.01; // Will roll 1 (critical failure)

			const result = performSkillCheck(5, 20);
			expect(result.success).toBe(false);

			Math.random = originalRandom;
		});

		it('should always succeed on natural 20', () => {
			const originalRandom = Math.random;
			Math.random = () => 0.99; // Will roll 20

			const result = performSkillCheck(1, 99);
			expect(result.roll).toBe(20);
			expect(result.success).toBe(true); // Should succeed despite impossible DC

			Math.random = originalRandom;
		});

		it('should always fail on natural 1', () => {
			const originalRandom = Math.random;
			Math.random = () => 0.01; // Will roll 1

			const result = performSkillCheck(20, 5);
			expect(result.roll).toBe(1);
			expect(result.success).toBe(false); // Should fail despite high modifier

			Math.random = originalRandom;
		});

		it('should generate rolls between 1 and 20', () => {
			for (let i = 0; i < 100; i++) {
				const result = performSkillCheck(10, 15);
				expect(result.roll).toBeGreaterThanOrEqual(1);
				expect(result.roll).toBeLessThanOrEqual(20);
			}
		});
	});

	describe('formatSkillCheckResult', () => {
		it('should format skill check result with attribute name', () => {
			const result = {
				roll: 15,
				modifier: 3,
				total: 18,
				dc: 15,
				success: true
			};

			const formatted = formatSkillCheckResult(result, 'Strength');
			expect(formatted).toContain('15');
			expect(formatted).toContain('3');
			expect(formatted).toContain('18');
			expect(formatted).toContain('Strength');
		});

		it('should indicate success', () => {
			const result = {
				roll: 15,
				modifier: 3,
				total: 18,
				dc: 15,
				success: true
			};

			const formatted = formatSkillCheckResult(result, 'Dexterity');
			expect(formatted.toLowerCase()).toMatch(/success|passed|succeeded/i);
		});

		it('should indicate failure', () => {
			const result = {
				roll: 5,
				modifier: 1,
				total: 6,
				dc: 15,
				success: false
			};

			const formatted = formatSkillCheckResult(result, 'Intelligence');
			expect(formatted.toLowerCase()).toMatch(/fail|failed/i);
		});

		it('should handle critical success (natural 20)', () => {
			const result = {
				roll: 20,
				modifier: 2,
				total: 22,
				dc: 15,
				success: true
			};

			const formatted = formatSkillCheckResult(result, 'Charisma');
			expect(formatted.toLowerCase()).toMatch(/critical|natural 20/i);
		});

		it('should handle critical failure (natural 1)', () => {
			const result = {
				roll: 1,
				modifier: 5,
				total: 6,
				dc: 10,
				success: false
			};

			const formatted = formatSkillCheckResult(result, 'Wisdom');
			expect(formatted.toLowerCase()).toMatch(/critical|natural 1/i);
		});
	});
});
