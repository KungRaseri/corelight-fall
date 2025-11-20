/**
 * Skill Check System
 * 
 * Handles attribute-based skill checks with d20 rolls
 */

export interface SkillCheckResult {
	success: boolean;
	roll: number;
	modifier: number;
	total: number;
	dc: number;
	criticalSuccess: boolean;
	criticalFailure: boolean;
}

/**
 * Perform a skill check
 * @param attributeValue - The character's attribute value
 * @param dc - Difficulty Class (target number)
 * @returns SkillCheckResult with roll details
 */
export function performSkillCheck(attributeValue: number, dc: number): SkillCheckResult {
	// Roll d20
	const roll = Math.floor(Math.random() * 20) + 1;
	
	// Calculate modifier from attribute (attribute value gives +1 per point above 0)
	const modifier = attributeValue;
	
	// Calculate total
	const total = roll + modifier;
	
	// Determine success
	const success = total >= dc;
	
	// Check for critical success (natural 20) or critical failure (natural 1)
	const criticalSuccess = roll === 20;
	const criticalFailure = roll === 1;
	
	return {
		success,
		roll,
		modifier,
		total,
		dc,
		criticalSuccess,
		criticalFailure
	};
}

/**
 * Format skill check result for display
 */
export function formatSkillCheckResult(result: SkillCheckResult, attributeName: string): string {
	const emoji = result.success ? '✅' : '❌';
	const critEmoji = result.criticalSuccess ? '🎯' : result.criticalFailure ? '💥' : '';
	
	return `${emoji} ${critEmoji} ${attributeName} Check: Rolled ${result.roll} + ${result.modifier} = ${result.total} vs DC ${result.dc}`;
}
