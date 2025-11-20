import { describe, it, expect, vi } from 'vitest';
import { performSkillCheck, formatSkillCheckResult } from '../../../src/lib/utils/skillCheck';

describe('Skill Check Utilities', () => {
	describe('performSkillCheck', () => {
		it('should return a skill check result object with all required properties', () => {
			const result = performSkillCheck(10, 15);
			
			expect(result).toHaveProperty('roll');
			expect(result).toHaveProperty('modifier');
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('dc');
			expect(result).toHaveProperty('success');
			expect(result).toHaveProperty('criticalSuccess');
			expect(result).toHaveProperty('criticalFailure');
		});

		it('should use attribute value as modifier', () => {
			const result = performSkillCheck(5, 15);
			expect(result.modifier).toBe(5);

			const result2 = performSkillCheck(12, 15);
			expect(result2.modifier).toBe(12);
		});

		it('should calculate total as roll + modifier', () => {
			const result = performSkillCheck(3, 15);
			expect(result.total).toBe(result.roll + result.modifier);
			expect(result.total).toBe(result.roll + 3);
		});

		it('should mark success when total >= DC', () => {
			// Mock Math.random to control the roll
			const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99); // Will roll 20

			const result = performSkillCheck(0, 15);
			expect(result.roll).toBe(20);
			expect(result.total).toBe(20); // 20 roll + 0 modifier
			expect(result.success).toBe(true);

			randomSpy.mockRestore();
		});

		it('should mark failure when total < DC', () => {
			const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.01); // Will roll 1

			const result = performSkillCheck(0, 10);
			expect(result.roll).toBe(1);
			expect(result.total).toBe(1); // 1 roll + 0 modifier
			expect(result.success).toBe(false);

			randomSpy.mockRestore();
		});

		it('should mark critical success on natural 20', () => {
			const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99); // Will roll 20

			const result = performSkillCheck(5, 15);
			expect(result.roll).toBe(20);
			expect(result.criticalSuccess).toBe(true);
			expect(result.criticalFailure).toBe(false);

			randomSpy.mockRestore();
		});

		it('should mark critical failure on natural 1', () => {
			const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.01); // Will roll 1

			const result = performSkillCheck(10, 15);
			expect(result.roll).toBe(1);
			expect(result.criticalFailure).toBe(true);
			expect(result.criticalSuccess).toBe(false);

			randomSpy.mockRestore();
		});

		it('should generate rolls between 1 and 20', () => {
			for (let i = 0; i < 100; i++) {
				const result = performSkillCheck(10, 15);
				expect(result.roll).toBeGreaterThanOrEqual(1);
				expect(result.roll).toBeLessThanOrEqual(20);
			}
		});

		it('success should depend on total vs DC, not just roll', () => {
			const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5); // Will roll 11

			// With high modifier, should succeed
			const successResult = performSkillCheck(10, 15);
			expect(successResult.roll).toBe(11);
			expect(successResult.total).toBe(21); // 11 + 10
			expect(successResult.success).toBe(true);

			// With low modifier, should fail
			const failResult = performSkillCheck(0, 15);
			expect(failResult.roll).toBe(11);
			expect(failResult.total).toBe(11); // 11 + 0
			expect(failResult.success).toBe(false);

			randomSpy.mockRestore();
		});
	});

	describe('formatSkillCheckResult', () => {
		it('should format skill check result with attribute name', () => {
			const result = {
				roll: 15,
				modifier: 3,
				total: 18,
				dc: 15,
				success: true,
				criticalSuccess: false,
				criticalFailure: false
			};

			const formatted = formatSkillCheckResult(result, 'Strength');
			expect(formatted).toContain('15');
			expect(formatted).toContain('3');
			expect(formatted).toContain('18');
			expect(formatted).toContain('Strength');
			expect(formatted).toContain('15'); // DC
		});

		it('should show success emoji when successful', () => {
			const result = {
				roll: 15,
				modifier: 3,
				total: 18,
				dc: 15,
				success: true,
				criticalSuccess: false,
				criticalFailure: false
			};

			const formatted = formatSkillCheckResult(result, 'Dexterity');
			expect(formatted).toContain('✅');
		});

		it('should show failure emoji when failed', () => {
			const result = {
				roll: 5,
				modifier: 1,
				total: 6,
				dc: 15,
				success: false,
				criticalSuccess: false,
				criticalFailure: false
			};

			const formatted = formatSkillCheckResult(result, 'Intelligence');
			expect(formatted).toContain('❌');
		});

		it('should show critical success emoji for natural 20', () => {
			const result = {
				roll: 20,
				modifier: 2,
				total: 22,
				dc: 15,
				success: true,
				criticalSuccess: true,
				criticalFailure: false
			};

			const formatted = formatSkillCheckResult(result, 'Charisma');
			expect(formatted).toContain('🎯');
		});

		it('should show critical failure emoji for natural 1', () => {
			const result = {
				roll: 1,
				modifier: 5,
				total: 6,
				dc: 10,
				success: false,
				criticalSuccess: false,
				criticalFailure: true
			};

			const formatted = formatSkillCheckResult(result, 'Wisdom');
			expect(formatted).toContain('💥');
		});
	});
});
