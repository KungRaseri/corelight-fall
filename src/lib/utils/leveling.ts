/**
 * Character Leveling System
 * 
 * Handles XP calculations, level requirements, and level-up rewards
 */

export const LEVELING_CONFIG = {
	MAX_LEVEL: 50,
	BASE_XP_REQUIREMENT: 100,
	XP_SCALING_FACTOR: 1.5,
	
	// Rewards per level
	ATTRIBUTE_POINTS_PER_LEVEL: 3,
	HP_INCREASE_PER_LEVEL: 10,
	GOLD_BONUS_PER_LEVEL: 50,
} as const;

/**
 * Calculate XP required to reach a specific level
 */
export function getXpRequiredForLevel(level: number): number {
	if (level <= 1) return 0;
	
	const { BASE_XP_REQUIREMENT, XP_SCALING_FACTOR } = LEVELING_CONFIG;
	
	// Formula: baseXP * (scalingFactor ^ (level - 2))
	// Level 2: 100 * (1.5 ^ 0) = 100
	// Level 3: 100 * (1.5 ^ 1) = 150
	// Level 4: 100 * (1.5 ^ 2) = 225
	// Level 5: 100 * (1.5 ^ 3) = 338
	return Math.floor(BASE_XP_REQUIREMENT * Math.pow(XP_SCALING_FACTOR, level - 2));
}

/**
 * Calculate total XP needed from level 1 to target level
 */
export function getTotalXpForLevel(level: number): number {
	let totalXp = 0;
	for (let i = 2; i <= level; i++) {
		totalXp += getXpRequiredForLevel(i);
	}
	return totalXp;
}

/**
 * Calculate what level a character should be based on total XP
 */
export function getLevelFromXp(xp: number): number {
	let level = 1;
	let totalXpNeeded = 0;
	
	while (level < LEVELING_CONFIG.MAX_LEVEL) {
		const xpForNextLevel = getXpRequiredForLevel(level + 1);
		if (totalXpNeeded + xpForNextLevel > xp) {
			break;
		}
		totalXpNeeded += xpForNextLevel;
		level++;
	}
	
	return level;
}

/**
 * Calculate XP progress to next level (0-1)
 */
export function getXpProgress(currentXp: number, currentLevel: number): number {
	const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
	const xpRequiredForNextLevel = getXpRequiredForLevel(currentLevel + 1);
	
	if (xpRequiredForNextLevel === 0) return 1; // Max level
	
	const xpIntoCurrentLevel = currentXp - totalXpForCurrentLevel;
	return Math.min(1, Math.max(0, xpIntoCurrentLevel / xpRequiredForNextLevel));
}

/**
 * Check if character can level up and return new level
 */
export function checkLevelUp(currentXp: number, currentLevel: number): {
	canLevelUp: boolean;
	newLevel: number;
	levelsGained: number;
} {
	const newLevel = getLevelFromXp(currentXp);
	const canLevelUp = newLevel > currentLevel;
	const levelsGained = newLevel - currentLevel;
	
	return { canLevelUp, newLevel, levelsGained };
}

/**
 * Calculate rewards for leveling up
 */
export function getLevelUpRewards(levelsGained: number): {
	attributePoints: number;
	maxHpIncrease: number;
	goldBonus: number;
} {
	const { ATTRIBUTE_POINTS_PER_LEVEL, HP_INCREASE_PER_LEVEL, GOLD_BONUS_PER_LEVEL } = LEVELING_CONFIG;
	
	return {
		attributePoints: ATTRIBUTE_POINTS_PER_LEVEL * levelsGained,
		maxHpIncrease: HP_INCREASE_PER_LEVEL * levelsGained,
		goldBonus: GOLD_BONUS_PER_LEVEL * levelsGained,
	};
}

/**
 * Format XP for display (e.g., "1,234 / 2,000 XP")
 */
export function formatXp(currentXp: number, currentLevel: number): string {
	const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
	const xpRequiredForNextLevel = getXpRequiredForLevel(currentLevel + 1);
	
	if (currentLevel >= LEVELING_CONFIG.MAX_LEVEL) {
		return `${currentXp.toLocaleString()} XP (Max Level)`;
	}
	
	const xpIntoCurrentLevel = currentXp - totalXpForCurrentLevel;
	return `${xpIntoCurrentLevel.toLocaleString()} / ${xpRequiredForNextLevel.toLocaleString()} XP`;
}
