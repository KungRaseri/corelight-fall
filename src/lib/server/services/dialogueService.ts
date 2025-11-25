import { db } from '../db';
import {
	dialogueTree,
	dialogueNode,
	dialogueChoice,
	characterDialogueHistory,
	character,
	storyFlag,
	characterNpcRelationship
} from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Dialogue Service - Manages dialogue trees, choices, and conversation flow
 */

export interface SkillCheckResult {
	success: boolean;
	attributeUsed: string;
	roll: number;
	difficulty: number;
}

export class DialogueService {
	/**
	 * Get a dialogue tree with its root node
	 */
	async getDialogueTree(treeId: number, characterId: number) {
		const [tree] = await db
			.select()
			.from(dialogueTree)
			.where(and(eq(dialogueTree.id, treeId), eq(dialogueTree.isActive, true)));

		if (!tree) {
			throw new Error('Dialogue tree not found');
		}

		// Check availability conditions
		const canAccess = await this.checkAvailability(tree, characterId);
		if (!canAccess) {
			throw new Error('Dialogue not available');
		}

		// Get root node
		if (!tree.rootNodeId) {
			throw new Error('Dialogue tree has no root node');
		}

		const rootNode = await this.getNode(tree.rootNodeId);

		// Get or create history
		const history = await this.getOrCreateHistory(treeId, characterId);

		return {
			tree,
			rootNode,
			history
		};
	}

	/**
	 * Get a specific dialogue node with its choices
	 */
	async getNode(nodeId: number) {
		const [node] = await db
			.select()
			.from(dialogueNode)
			.where(eq(dialogueNode.id, nodeId));

		if (!node) {
			throw new Error('Dialogue node not found');
		}

		// Get choices for this node
		const choices = await db
			.select()
			.from(dialogueChoice)
			.where(eq(dialogueChoice.nodeId, nodeId))
			.orderBy(dialogueChoice.order);

		return {
			node,
			choices
		};
	}

	/**
	 * Check if a dialogue tree is available for a character
	 */
	async checkAvailability(tree: typeof dialogueTree.$inferSelect, characterId: number): Promise<boolean> {
		if (!tree.availableWhen) {
			return true; // No conditions, always available
		}

		const conditions = tree.availableWhen as {
			flags?: { name: string; value: boolean | number | string }[];
			questStatus?: { questId: number; status: string[] }[];
			relationshipLevel?: { npcId: number; minLevel: number }[];
			actNumber?: number;
		};

		// Check flags
		if (conditions.flags) {
			for (const flagReq of conditions.flags) {
				const [flag] = await db
					.select()
					.from(storyFlag)
					.where(
						and(
							eq(storyFlag.characterId, characterId),
							eq(storyFlag.flagName, flagReq.name)
						)
					);

				if (!flag) return false;

				// Check value matches
				let matches = false;
				if (flag.flagType === 'boolean' && typeof flagReq.value === 'boolean') {
					matches = flag.booleanValue === flagReq.value;
				} else if (flag.flagType === 'integer' && typeof flagReq.value === 'number') {
					matches = flag.integerValue === flagReq.value;
				} else if (flag.flagType === 'text' && typeof flagReq.value === 'string') {
					matches = flag.textValue === flagReq.value;
				}

				if (!matches) return false;
			}
		}

		// Check relationship levels
		if (conditions.relationshipLevel) {
			for (const relReq of conditions.relationshipLevel) {
				const [relationship] = await db
					.select()
					.from(characterNpcRelationship)
					.where(
						and(
							eq(characterNpcRelationship.characterId, characterId),
							eq(characterNpcRelationship.npcId, relReq.npcId)
						)
					);

				if (!relationship || relationship.relationshipLevel < relReq.minLevel) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Make a dialogue choice
	 */
	async makeChoice(
		characterId: number,
		treeId: number,
		nodeId: number,
		choiceId: number
	) {
		const [choice] = await db
			.select()
			.from(dialogueChoice)
			.where(eq(dialogueChoice.id, choiceId));

		if (!choice) {
			throw new Error('Choice not found');
		}

		if (choice.nodeId !== nodeId) {
			throw new Error('Choice does not belong to this node');
		}

		// Check if choice requires flags
		if (choice.requiresFlags) {
			const flags = choice.requiresFlags as { name: string; value: boolean | number | string }[];
			for (const flagReq of flags) {
				const [flag] = await db
					.select()
					.from(storyFlag)
					.where(
						and(
							eq(storyFlag.characterId, characterId),
							eq(storyFlag.flagName, flagReq.name)
						)
					);

				if (!flag) {
					throw new Error(`Missing required flag: ${flagReq.name}`);
				}
			}
		}

		// Perform skill check if required
		let skillCheckResult: SkillCheckResult | null = null;
		let nextNodeId = choice.nextNodeId;

		if (choice.skillCheckDifficulty && choice.attributeCheck) {
			const attrCheck = choice.attributeCheck as {
				attribute: string;
				difficulty: number;
			};

			skillCheckResult = await this.performSkillCheck(
				characterId,
				attrCheck.attribute,
				choice.skillCheckDifficulty
			);

			// If failed and there's a failure path, use it
			if (!skillCheckResult.success && choice.failureNodeId) {
				nextNodeId = choice.failureNodeId;
			}
		}

		// Apply consequences
		if (choice.consequence) {
			await this.applyConsequences(characterId, choice.consequence);
		}

		// Record choice in history
		await this.recordChoice(characterId, treeId, nodeId, choiceId, skillCheckResult?.success);

		// Get next node if it exists
		let nextNode = null;
		if (nextNodeId) {
			nextNode = await this.getNode(nextNodeId);

			// Update history with new node
			await this.updateCurrentNode(characterId, treeId, nextNodeId);

			// Apply node consequences if any
			if (nextNode.node.onReach) {
				await this.applyConsequences(characterId, nextNode.node.onReach);
			}
		} else {
			// No next node, dialogue is complete
			await this.completeDialogue(characterId, treeId);
		}

		return {
			choice,
			skillCheckResult,
			nextNode,
			isComplete: !nextNode
		};
	}

	/**
	 * Perform a skill check
	 */
	async performSkillCheck(
		characterId: number,
		attribute: string,
		difficulty: number
	): Promise<SkillCheckResult> {
		const [char] = await db
			.select()
			.from(character)
			.where(eq(character.id, characterId));

		if (!char) {
			throw new Error('Character not found');
		}

		// Simple d20 + attribute modifier
		const roll = Math.floor(Math.random() * 20) + 1;
		
		// Get attribute value (simplified - would need to query characterAttribute table)
		const attributeValue = 10; // Placeholder - should query actual attribute
		const modifier = Math.floor((attributeValue - 10) / 2);
		
		const total = roll + modifier;
		const success = total >= difficulty;

		return {
			success,
			attributeUsed: attribute,
			roll: total,
			difficulty
		};
	}

	/**
	 * Apply dialogue/choice consequences
	 */
	async applyConsequences(characterId: number, consequences: any) {
		const conseq = consequences as {
			setFlags?: { name: string; value: boolean | number | string }[];
			giveItems?: number[];
			removeItems?: number[];
			giveXp?: number;
			giveGold?: number;
			relationshipChange?: { npcId: number; change: number };
			factionChange?: { factionId: number; change: number };
		};

		// Set flags
		if (conseq.setFlags) {
			for (const flag of conseq.setFlags) {
				await this.setFlag(characterId, flag.name, flag.value);
			}
		}

		// Award XP/Gold
		if (conseq.giveXp || conseq.giveGold) {
			const [char] = await db
				.select()
				.from(character)
				.where(eq(character.id, characterId));

			if (char) {
				await db
					.update(character)
					.set({
						xp: char.xp + (conseq.giveXp || 0),
						gold: char.gold + (conseq.giveGold || 0)
					})
					.where(eq(character.id, characterId));
			}
		}

		// Update NPC relationship
		if (conseq.relationshipChange) {
			await this.updateRelationship(
				characterId,
				conseq.relationshipChange.npcId,
				conseq.relationshipChange.change
			);
		}
	}

	/**
	 * Set a story flag
	 */
	async setFlag(characterId: number, flagName: string, value: boolean | number | string) {
		const flagType = typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'integer' : 'text';

		await db
			.insert(storyFlag)
			.values({
				characterId,
				flagName,
				flagType,
				booleanValue: typeof value === 'boolean' ? value : null,
				integerValue: typeof value === 'number' ? value : null,
				textValue: typeof value === 'string' ? value : null,
				setAt: new Date()
			});
	}

	/**
	 * Update NPC relationship
	 */
	async updateRelationship(characterId: number, npcId: number, change: number) {
		const [existing] = await db
			.select()
			.from(characterNpcRelationship)
			.where(
				and(
					eq(characterNpcRelationship.characterId, characterId),
					eq(characterNpcRelationship.npcId, npcId)
				)
			);

		if (existing) {
			const newLevel = Math.max(0, Math.min(100, existing.relationshipLevel + change));
			
			await db
				.update(characterNpcRelationship)
				.set({
					relationshipLevel: newLevel,
					lastInteractionAt: new Date(),
					totalInteractions: existing.totalInteractions + 1
				})
				.where(eq(characterNpcRelationship.id, existing.id));
		}
	}

	/**
	 * Get or create dialogue history
	 */
	async getOrCreateHistory(treeId: number, characterId: number) {
		const [existing] = await db
			.select()
			.from(characterDialogueHistory)
			.where(
				and(
					eq(characterDialogueHistory.characterId, characterId),
					eq(characterDialogueHistory.dialogueTreeId, treeId)
				)
			);

		if (existing) {
			return existing;
		}

		const [newHistory] = await db
			.insert(characterDialogueHistory)
			.values({
				characterId,
				dialogueTreeId: treeId,
				choicesMade: [],
				flagsSet: [],
				startedAt: new Date()
			})
			.returning();

		return newHistory;
	}

	/**
	 * Record a choice in dialogue history
	 */
	async recordChoice(
		characterId: number,
		treeId: number,
		nodeId: number,
		choiceId: number,
		skillCheckPassed?: boolean
	) {
		const [history] = await db
			.select()
			.from(characterDialogueHistory)
			.where(
				and(
					eq(characterDialogueHistory.characterId, characterId),
					eq(characterDialogueHistory.dialogueTreeId, treeId)
				)
			);

		if (!history) {
			throw new Error('Dialogue history not found');
		}

		const choices = history.choicesMade as {
			nodeId: number;
			choiceId: number;
			choiceText: string;
			timestamp: string;
			skillCheckPassed?: boolean;
		}[];

		const [choice] = await db
			.select()
			.from(dialogueChoice)
			.where(eq(dialogueChoice.id, choiceId));

		choices.push({
			nodeId,
			choiceId,
			choiceText: choice?.choiceText || '',
			timestamp: new Date().toISOString(),
			skillCheckPassed
		});

		await db
			.update(characterDialogueHistory)
			.set({
				choicesMade: choices
			})
			.where(eq(characterDialogueHistory.id, history.id));
	}

	/**
	 * Update current node in history
	 */
	async updateCurrentNode(characterId: number, treeId: number, nodeId: number) {
		await db
			.update(characterDialogueHistory)
			.set({
				lastNodeId: nodeId
			})
			.where(
				and(
					eq(characterDialogueHistory.characterId, characterId),
					eq(characterDialogueHistory.dialogueTreeId, treeId)
				)
			);
	}

	/**
	 * Complete a dialogue
	 */
	async completeDialogue(characterId: number, treeId: number) {
		const [history] = await db
			.select()
			.from(characterDialogueHistory)
			.where(
				and(
					eq(characterDialogueHistory.characterId, characterId),
					eq(characterDialogueHistory.dialogueTreeId, treeId)
				)
			);

		if (!history) return;

		await db
			.update(characterDialogueHistory)
			.set({
				isCompleted: true,
				completedAt: new Date(),
				timesCompleted: history.timesCompleted + 1
			})
			.where(eq(characterDialogueHistory.id, history.id));
	}
}

export const dialogueService = new DialogueService();
