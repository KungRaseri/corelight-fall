/**
 * Reward System Utilities
 * 
 * Helper functions for awarding XP and gold from game content
 */

/**
 * Award rewards to a character
 */
export async function awardRewards(params: {
	xpGained: number;
	goldGained: number;
	source: string;
}): Promise<{
	success: boolean;
	character?: any;
	rewards?: any;
	levelUp?: any;
	error?: string;
}> {
	try {
		const response = await fetch('/api/game/award-rewards', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return { success: false, error: errorData.error || 'Failed to award rewards' };
		}

		return await response.json();
	} catch (error) {
		console.error('Error awarding rewards:', error);
		return { success: false, error: 'Network error' };
	}
}

/**
 * Award rewards from completing an encounter
 */
export async function awardEncounterRewards(encounter: {
	id: number;
	title: string;
	xpReward: number;
	goldReward: number;
}) {
	return awardRewards({
		xpGained: encounter.xpReward,
		goldGained: encounter.goldReward,
		source: `encounter:${encounter.id}:${encounter.title}`,
	});
}

/**
 * Award rewards from completing a quest
 */
export async function awardQuestRewards(quest: {
	id: number;
	title: string;
	xpReward: number;
	goldReward: number;
}) {
	return awardRewards({
		xpGained: quest.xpReward,
		goldGained: quest.goldReward,
		source: `quest:${quest.id}:${quest.title}`,
	});
}

/**
 * Award rewards from completing a storyline
 */
export async function awardStorylineRewards(storyline: {
	id: number;
	title: string;
	xpReward: number;
	goldReward: number;
}) {
	return awardRewards({
		xpGained: storyline.xpReward,
		goldGained: storyline.goldReward,
		source: `storyline:${storyline.id}:${storyline.title}`,
	});
}
