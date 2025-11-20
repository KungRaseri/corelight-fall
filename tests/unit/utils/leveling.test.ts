import { describe, it, expect } from 'vitest';
import { checkLevelUp, getLevelUpRewards, getXpProgress, formatXp, LEVELING_CONFIG } from '$lib/utils/leveling';

describe('Leveling Utilities', () => {
	describe('checkLevelUp', () => {
		it('should detect when player can level up', () => {
			const result = checkLevelUp(100, 1);
			expect(result.canLevelUp).toBe(true);
			expect(result.newLevel).toBe(2);
			expect(result.levelsGained).toBe(1);
		});

		it('should not level up when XP is insufficient', () => {
			const result = checkLevelUp(50, 1);
			expect(result.canLevelUp).toBe(false);
			expect(result.newLevel).toBe(1);
			expect(result.levelsGained).toBe(0);
		});

		it('should handle multiple level ups', () => {
			const result = checkLevelUp(500, 1);
			expect(result.canLevelUp).toBe(true);
			expect(result.levelsGained).toBeGreaterThan(1);
		});

		it('should cap at max level', () => {
			const result = checkLevelUp(999999, LEVELING_CONFIG.MAX_LEVEL);
			expect(result.newLevel).toBe(LEVELING_CONFIG.MAX_LEVEL);
			expect(result.canLevelUp).toBe(false);
		});

		it('should handle level 2 threshold correctly', () => {
			const result1 = checkLevelUp(99, 1);
			expect(result1.canLevelUp).toBe(false);

			const result2 = checkLevelUp(100, 1);
			expect(result2.canLevelUp).toBe(true);
			expect(result2.newLevel).toBe(2);
		});
	});

	describe('getLevelUpRewards', () => {
		it('should return rewards for single level up', () => {
			const rewards = getLevelUpRewards(1);
			expect(rewards).toHaveProperty('attributePoints');
			expect(rewards).toHaveProperty('maxHpIncrease');
			expect(rewards).toHaveProperty('goldBonus');
			expect(rewards.attributePoints).toBeGreaterThan(0);
		});

		it('should scale rewards for multiple levels', () => {
			const rewards1 = getLevelUpRewards(1);
			const rewards3 = getLevelUpRewards(3);
			
			expect(rewards3.attributePoints).toBeGreaterThan(rewards1.attributePoints);
			expect(rewards3.maxHpIncrease).toBeGreaterThan(rewards1.maxHpIncrease);
			expect(rewards3.goldBonus).toBeGreaterThan(rewards1.goldBonus);
		});

		it('should handle 0 levels gracefully', () => {
			const rewards = getLevelUpRewards(0);
			expect(rewards.attributePoints).toBe(0);
			expect(rewards.maxHpIncrease).toBe(0);
			expect(rewards.goldBonus).toBe(0);
		});
	});

	describe('getXpProgress', () => {
		it('should return progress as decimal between 0 and 1', () => {
			const progress = getXpProgress(50, 1);
			expect(progress).toBeGreaterThanOrEqual(0);
			expect(progress).toBeLessThanOrEqual(1);
		});

		it('should return 1 when at level threshold', () => {
			const progress = getXpProgress(100, 1);
			expect(progress).toBe(1);
		});

		it('should return 0 when at level start', () => {
			const progress = getXpProgress(0, 1);
			expect(progress).toBe(0);
		});

		it('should return 0.5 when halfway to next level', () => {
			const progress = getXpProgress(50, 1);
			expect(progress).toBeCloseTo(0.5, 1);
		});
	});

	describe('formatXp', () => {
		it('should format XP as "current / required"', () => {
			const formatted = formatXp(50, 1);
			expect(formatted).toMatch(/\d+ \/ \d+/);
		});

		it('should show correct values for level 1', () => {
			const formatted = formatXp(75, 1);
			expect(formatted).toContain('75');
			expect(formatted).toContain('100');
		});

		it('should handle max level', () => {
			const formatted = formatXp(999999, LEVELING_CONFIG.MAX_LEVEL);
			expect(formatted).toBeTruthy();
		});
	});

	describe('LEVELING_CONFIG', () => {
		it('should have valid configuration values', () => {
			expect(LEVELING_CONFIG.MAX_LEVEL).toBeGreaterThan(0);
			expect(LEVELING_CONFIG.BASE_XP_REQUIRED).toBeGreaterThan(0);
			expect(LEVELING_CONFIG.XP_MULTIPLIER).toBeGreaterThan(1);
		});

		it('should have reward configuration', () => {
			expect(LEVELING_CONFIG).toHaveProperty('ATTRIBUTE_POINTS_PER_LEVEL');
			expect(LEVELING_CONFIG).toHaveProperty('HP_INCREASE_PER_LEVEL');
			expect(LEVELING_CONFIG).toHaveProperty('GOLD_BONUS_PER_LEVEL');
		});
	});
});
