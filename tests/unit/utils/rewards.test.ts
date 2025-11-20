import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	awardRewards,
	awardEncounterRewards,
	awardQuestRewards,
	awardStorylineRewards
} from '../../../src/lib/utils/rewards';

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Rewards System', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Suppress console.error during tests
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('awardRewards', () => {
		it('should successfully award rewards', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 1500, gold: 250 },
				rewards: { xpGained: 500, goldGained: 100 },
				levelUp: null
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await awardRewards({
				xpGained: 500,
				goldGained: 100,
				source: 'test-source'
			});

			expect(result.success).toBe(true);
			expect(result.character).toBeDefined();
			expect(result.rewards).toBeDefined();
			expect(mockFetch).toHaveBeenCalledWith('/api/game/award-rewards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					xpGained: 500,
					goldGained: 100,
					source: 'test-source'
				})
			});
		});

		it('should handle level up on rewards', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 2500, gold: 500, level: 5 },
				rewards: { xpGained: 1000, goldGained: 200 },
				levelUp: { newLevel: 5, attributePoints: 2 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await awardRewards({
				xpGained: 1000,
				goldGained: 200,
				source: 'quest-completion'
			});

			expect(result.success).toBe(true);
			expect(result.levelUp).toBeDefined();
			expect(result.levelUp?.newLevel).toBe(5);
			expect(result.levelUp?.attributePoints).toBe(2);
		});

		it('should handle API error responses', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({ error: 'Character not found' })
			});

			const result = await awardRewards({
				xpGained: 100,
				goldGained: 50,
				source: 'test'
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe('Character not found');
		});

		it('should handle API error without error message', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({})
			});

			const result = await awardRewards({
				xpGained: 100,
				goldGained: 50,
				source: 'test'
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe('Failed to award rewards');
		});

		it('should handle network errors', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network failure'));

			const result = await awardRewards({
				xpGained: 100,
				goldGained: 50,
				source: 'test'
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe('Network error');
			expect(console.error).toHaveBeenCalled();
		});

		it('should handle zero rewards', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 1000, gold: 100 },
				rewards: { xpGained: 0, goldGained: 0 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await awardRewards({
				xpGained: 0,
				goldGained: 0,
				source: 'no-rewards-encounter'
			});

			expect(result.success).toBe(true);
			expect(result.rewards?.xpGained).toBe(0);
			expect(result.rewards?.goldGained).toBe(0);
		});

		it('should handle large reward values', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 999999, gold: 999999 },
				rewards: { xpGained: 999999, goldGained: 999999 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await awardRewards({
				xpGained: 999999,
				goldGained: 999999,
				source: 'epic-reward'
			});

			expect(result.success).toBe(true);
			expect(result.rewards?.xpGained).toBe(999999);
		});
	});

	describe('awardEncounterRewards', () => {
		it('should award rewards from encounter', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 1200, gold: 150 },
				rewards: { xpGained: 200, goldGained: 50 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const encounter = {
				id: 42,
				title: 'Goblin Ambush',
				xpReward: 200,
				goldReward: 50
			};

			const result = await awardEncounterRewards(encounter);

			expect(result.success).toBe(true);
			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/award-rewards',
				expect.objectContaining({
					body: JSON.stringify({
						xpGained: 200,
						goldGained: 50,
						source: 'encounter:42:Goblin Ambush'
					})
				})
			);
		});

		it('should handle encounter with special characters in title', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});

			const encounter = {
				id: 1,
				title: "Dragon's Lair: The Final Battle!",
				xpReward: 1000,
				goldReward: 500
			};

			await awardEncounterRewards(encounter);

			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/award-rewards',
				expect.objectContaining({
					body: JSON.stringify({
						xpGained: 1000,
						goldGained: 500,
						source: "encounter:1:Dragon's Lair: The Final Battle!"
					})
				})
			);
		});

		it('should handle encounter errors', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({ error: 'Encounter already completed' })
			});

			const encounter = {
				id: 99,
				title: 'Already Done',
				xpReward: 100,
				goldReward: 25
			};

			const result = await awardEncounterRewards(encounter);

			expect(result.success).toBe(false);
			expect(result.error).toBe('Encounter already completed');
		});
	});

	describe('awardQuestRewards', () => {
		it('should award rewards from quest', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 2500, gold: 300 },
				rewards: { xpGained: 1500, goldGained: 200 },
				levelUp: { newLevel: 3 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const quest = {
				id: 7,
				title: 'The Lost Artifact',
				xpReward: 1500,
				goldReward: 200
			};

			const result = await awardQuestRewards(quest);

			expect(result.success).toBe(true);
			expect(result.levelUp).toBeDefined();
			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/award-rewards',
				expect.objectContaining({
					body: JSON.stringify({
						xpGained: 1500,
						goldGained: 200,
						source: 'quest:7:The Lost Artifact'
					})
				})
			);
		});

		it('should handle quest with long title', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ success: true })
			});

			const quest = {
				id: 123,
				title: 'A Very Long Quest Title That Describes an Epic Journey Across Multiple Lands',
				xpReward: 500,
				goldReward: 100
			};

			await awardQuestRewards(quest);

			const calls = mockFetch.mock.calls[0];
			const body = JSON.parse(calls[1].body);
			expect(body.source).toContain('quest:123:A Very Long Quest Title');
		});

		it('should handle quest network error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			const quest = {
				id: 1,
				title: 'Failed Quest',
				xpReward: 100,
				goldReward: 50
			};

			const result = await awardQuestRewards(quest);

			expect(result.success).toBe(false);
			expect(result.error).toBe('Network error');
		});
	});

	describe('awardStorylineRewards', () => {
		it('should award rewards from storyline', async () => {
			const mockResponse = {
				success: true,
				character: { id: 1, xp: 5000, gold: 1000 },
				rewards: { xpGained: 3000, goldGained: 750 },
				levelUp: { newLevel: 10, attributePoints: 5 }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const storyline = {
				id: 3,
				title: 'The Corelight Saga',
				xpReward: 3000,
				goldReward: 750
			};

			const result = await awardStorylineRewards(storyline);

			expect(result.success).toBe(true);
			expect(result.levelUp?.newLevel).toBe(10);
			expect(result.levelUp?.attributePoints).toBe(5);
			expect(mockFetch).toHaveBeenCalledWith(
				'/api/game/award-rewards',
				expect.objectContaining({
					body: JSON.stringify({
						xpGained: 3000,
						goldGained: 750,
						source: 'storyline:3:The Corelight Saga'
					})
				})
			);
		});

		it('should handle storyline completion error', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({ error: 'Storyline prerequisites not met' })
			});

			const storyline = {
				id: 99,
				title: 'Locked Story',
				xpReward: 500,
				goldReward: 100
			};

			const result = await awardStorylineRewards(storyline);

			expect(result.success).toBe(false);
			expect(result.error).toBe('Storyline prerequisites not met');
		});

		it('should handle storyline with minimal rewards', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					rewards: { xpGained: 1, goldGained: 1 }
				})
			});

			const storyline = {
				id: 1,
				title: 'Tutorial Story',
				xpReward: 1,
				goldReward: 1
			};

			const result = await awardStorylineRewards(storyline);

			expect(result.success).toBe(true);
		});
	});

	describe('integration scenarios', () => {
		it('should handle multiple sequential reward calls', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ success: true })
			});

			await awardEncounterRewards({ id: 1, title: 'E1', xpReward: 100, goldReward: 50 });
			await awardEncounterRewards({ id: 2, title: 'E2', xpReward: 150, goldReward: 75 });
			await awardQuestRewards({ id: 1, title: 'Q1', xpReward: 500, goldReward: 200 });

			expect(mockFetch).toHaveBeenCalledTimes(3);
		});

		it('should maintain correct source format for all reward types', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ success: true })
			});

			await awardEncounterRewards({ id: 1, title: 'E', xpReward: 100, goldReward: 50 });
			await awardQuestRewards({ id: 2, title: 'Q', xpReward: 200, goldReward: 100 });
			await awardStorylineRewards({ id: 3, title: 'S', xpReward: 300, goldReward: 150 });

			const calls = mockFetch.mock.calls;
			const sources = calls.map((call) => JSON.parse(call[1].body).source);

			expect(sources[0]).toMatch(/^encounter:\d+:/);
			expect(sources[1]).toMatch(/^quest:\d+:/);
			expect(sources[2]).toMatch(/^storyline:\d+:/);
		});
	});
});
