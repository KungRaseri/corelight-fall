/**
 * Seed Script for Prologue Content
 * 
 * This script seeds the database with content from Sprint 2:
 * - Two starting paths (Scavenger and Seeker)
 * - Prologue quests and objectives
 * - Initial NPCs
 * - Starter dialogue trees
 * - Fragment discoveries
 * - Story flags
 */

import { db } from '$lib/server/db';
import {
	path,
	quest,
	questObjective,
	npc,
	fragment
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function seedPrologueContent() {
	console.log('🌱 Seeding prologue content...');

	// 1. Create the two starting paths
	console.log('📍 Creating paths...');
	
	const [scavengerPath] = await db
		.insert(path)
		.values({
			name: 'The Scavenger',
			slug: 'scavenger',
			description: 'A pragmatic survivor focused on protecting your community. You scavenge the ruins for resources, defend against threats, and build networks of trust.',
			startingLocation: 'Ashvale',
			thematicFocus: 'survival',
			flavorText: 'The ruins hold secrets worth risking your life for. Every shard of Corelight is a piece of hope for your people.',
			questlineStart: null, // Will link after quests are created
			requiredLevel: 1,
			isStartingPath: true,
			isActive: true
		})
		.returning();

	const [seekerPath] = await db
		.insert(path)
		.values({
			name: 'The Seeker',
			slug: 'seeker',
			description: 'A scholar driven by curiosity and the pursuit of lost knowledge. You study ancient texts, decode Luminarch mysteries, and piece together the truth of the Fall.',
			startingLocation: 'Ashvale',
			thematicFocus: 'knowledge',
			flavorText: 'Knowledge is power. Understanding what caused the Fall is the only way to prevent it from happening again.',
			questlineStart: null, // Will link after quests are created
			requiredLevel: 1,
			isStartingPath: true,
			isActive: true
		})
		.returning();

	console.log(`✅ Created paths: ${scavengerPath.id} (Scavenger), ${seekerPath.id} (Seeker)`);

	// 2. Create key NPCs from the prologue
	console.log('👥 Creating NPCs...');

	const [elara] = await db
		.insert(npc)
		.values({
			name: 'Elara Dawnshard',
			slug: 'elara-dawnshard',
			title: 'Elder of Ashvale',
			description: 'A wise and weathered leader who has guided Ashvale through decades of hardship. Her eyes hold both sorrow and determination.',
			locationId: null, // Ashvale location ID to be added
			personality: 'Wise, protective, burdened by responsibility',
			appearance: 'Silver-haired woman in worn but dignified robes, bearing a small fragment around her neck',
			role: 'mentor',
			isRomanceable: false,
			faction: null,
			relationshipSettings: {
				initialTrust: 70,
				canBecome: ['ally', 'mentor']
			},
			questsGiven: [],
			dialogueTrees: [],
			isActive: true
		})
		.returning();

	const [kael] = await db
		.insert(npc)
		.values({
			name: 'Kael Ironfist',
			slug: 'kael-ironfist',
			title: 'Captain of the Guard',
			description: 'A battle-scarred veteran who takes protection of Ashvale seriously. Gruff exterior hides a caring heart.',
			locationId: null,
			personality: 'Gruff, loyal, pragmatic, secretly compassionate',
			appearance: 'Tall, muscular man with a scarred face and heavy armor. Carries a fragment-enhanced blade.',
			role: 'ally',
			isRomanceable: false,
			faction: null,
			relationshipSettings: {
				initialTrust: 50,
				canBecome: ['ally', 'friend']
			},
			questsGiven: [],
			dialogueTrees: [],
			isActive: true
		})
		.returning();

	const [lyra] = await db
		.insert(npc)
		.values({
			name: 'Lyra Whisperwind',
			slug: 'lyra-whisperwind',
			title: 'Archivist',
			description: 'A young scholar obsessed with pre-Fall history. Enthusiastic but reckless in pursuit of knowledge.',
			locationId: null,
			personality: 'Curious, enthusiastic, reckless, brilliant',
			appearance: 'Young woman with ink-stained fingers, surrounded by books and scrolls. Wears spectacles.',
			role: 'ally',
			isRomanceable: true,
			faction: null,
			relationshipSettings: {
				initialTrust: 60,
				canBecome: ['ally', 'friend', 'romance']
			},
			questsGiven: [],
			dialogueTrees: [],
			isActive: true
		})
		.returning();

	console.log(`✅ Created NPCs: Elara (${elara.id}), Kael (${kael.id}), Lyra (${lyra.id})`);

	// 3. Create prologue quests
	console.log('📜 Creating quests...');

	// Scavenger Path: Opening Quest
	const [scavengerIntro] = await db
		.insert(quest)
		.values({
			name: 'Shards of Hope',
			slug: 'shards-of-hope',
			description: 'Elder Elara has asked you to investigate strange energy readings from the Old Quarter ruins. The fragments there could provide crucial resources for Ashvale.',
			category: 'main_story',
			actNumber: 1,
			chapter: 1,
			questGiver: elara.id,
			location: 'Old Quarter Ruins',
			objectives: 'Investigate the ruins, collect 3 Corelight fragments, defeat corrupted creatures',
			rewards: {
				xp: 100,
				gold: 50,
				items: [],
				reputation: [{ faction: 'ashvale', amount: 10 }]
			},
			prerequisites: {
				pathRequired: scavengerPath.id
			},
			estimatedDuration: 20,
			difficulty: 1,
			requiredLevel: 1,
			isRepeatable: false,
			nextQuests: [],
			isActive: true
		})
		.returning();

	// Create objectives for Scavenger intro quest
	await db.insert(questObjective).values([
		{
			questId: scavengerIntro.id,
			objectiveOrder: 1,
			description: 'Travel to the Old Quarter ruins',
			objectiveType: 'reach_location',
			targetType: 'location',
			targetIdentifier: 'old-quarter-ruins',
			requiredCount: 1,
			isOptional: false
		},
		{
			questId: scavengerIntro.id,
			objectiveOrder: 2,
			description: 'Collect Corelight fragments (0/3)',
			objectiveType: 'collect',
			targetType: 'item',
			targetIdentifier: 'corelight-fragment',
			requiredCount: 3,
			isOptional: false
		},
		{
			questId: scavengerIntro.id,
			objectiveOrder: 3,
			description: 'Defeat corrupted shadow beasts (0/5)',
			objectiveType: 'defeat',
			targetType: 'enemy',
			targetIdentifier: 'shadow-beast',
			requiredCount: 5,
			isOptional: false
		},
		{
			questId: scavengerIntro.id,
			objectiveOrder: 4,
			description: 'Return to Elder Elara',
			objectiveType: 'talk',
			targetType: 'npc',
			targetIdentifier: elara.slug,
			requiredCount: 1,
			isOptional: false
		}
	]);

	// Seeker Path: Opening Quest
	const [seekerIntro] = await db
		.insert(quest)
		.values({
			name: 'Echoes of the Luminarchs',
			slug: 'echoes-of-luminarchs',
			description: 'Lyra has discovered references to a Luminarch archive in the old library. Help her decipher the texts and unlock their secrets.',
			category: 'main_story',
			actNumber: 1,
			chapter: 1,
			questGiver: lyra.id,
			location: 'Ancient Library',
			objectives: 'Study ancient texts, solve cipher puzzles, discover hidden archive',
			rewards: {
				xp: 100,
				gold: 30,
				items: [],
				reputation: [{ faction: 'scholars', amount: 15 }]
			},
			prerequisites: {
				pathRequired: seekerPath.id
			},
			estimatedDuration: 25,
			difficulty: 1,
			requiredLevel: 1,
			isRepeatable: false,
			nextQuests: [],
			isActive: true
		})
		.returning();

	// Create objectives for Seeker intro quest
	await db.insert(questObjective).values([
		{
			questId: seekerIntro.id,
			objectiveOrder: 1,
			description: 'Meet Lyra at the Ancient Library',
			objectiveType: 'talk',
			targetType: 'npc',
			targetIdentifier: lyra.slug,
			requiredCount: 1,
			isOptional: false
		},
		{
			questId: seekerIntro.id,
			objectiveOrder: 2,
			description: 'Examine ancient texts (0/4)',
			objectiveType: 'interact',
			targetType: 'object',
			targetIdentifier: 'ancient-text',
			requiredCount: 4,
			isOptional: false
		},
		{
			questId: seekerIntro.id,
			objectiveOrder: 3,
			description: 'Solve the Luminarch cipher',
			objectiveType: 'custom',
			targetType: 'puzzle',
			targetIdentifier: 'luminarch-cipher',
			requiredCount: 1,
			isOptional: false
		},
		{
			questId: seekerIntro.id,
			objectiveOrder: 4,
			description: 'Enter the hidden archive',
			objectiveType: 'reach_location',
			targetType: 'location',
			targetIdentifier: 'hidden-archive',
			requiredCount: 1,
			isOptional: false
		}
	]);

	// Update paths with their starting quests
	await db.update(path).set({ questlineStart: scavengerIntro.id }).where(eq(path.id, scavengerPath.id));
	await db.update(path).set({ questlineStart: seekerIntro.id }).where(eq(path.id, seekerPath.id));

	console.log(`✅ Created quests: ${scavengerIntro.id} (Scavenger), ${seekerIntro.id} (Seeker)`);

	// 4. Create starter fragments
	console.log('✨ Creating fragments...');

	const [emberFragment] = await db
		.insert(fragment)
		.values({
			name: 'Ember Shard',
			slug: 'ember-shard',
			type: 'offensive',
			tier: 1,
			description: 'A warm fragment that pulses with inner fire. It responds to your will, ready to unleash its power.',
			loreText: 'This shard once belonged to a Luminarch of the Flame. Its warmth is a echo of the light that once filled the world.',
			discoveryLore: 'You found this fragment in the Old Quarter ruins, still warm despite centuries in darkness.',
			powerLevel: 15,
			corruptionLevel: 0,
			abilities: {
				primary: {
					name: 'Flame Bolt',
					description: 'Launch a bolt of fire at enemies',
					damage: 12,
					range: 20,
					cost: { type: 'energy', amount: 10 }
				}
			},
			visionCount: 2,
			isActive: true
		})
		.returning();

	const [echoFragment] = await db
		.insert(fragment)
		.values({
			name: 'Echo Crystal',
			slug: 'echo-crystal',
			type: 'utility',
			tier: 1,
			description: 'A translucent crystal that hums with residual memories. When held, you hear whispers of the past.',
			loreText: 'Memory crystals like this were used by Luminarch scribes to record history. This one still holds fragments of knowledge.',
			discoveryLore: 'Lyra identified this as a memory storage device, though most of its contents have degraded over time.',
			powerLevel: 10,
			corruptionLevel: 0,
			abilities: {
				primary: {
					name: 'Reveal Memory',
					description: 'Unlock hidden memories and lore',
					effect: 'knowledge',
					cost: { type: 'focus', amount: 15 }
				}
			},
			visionCount: 3,
			isActive: true
		})
		.returning();

	console.log(`✅ Created fragments: ${emberFragment.id} (Ember), ${echoFragment.id} (Echo)`);

	console.log('✅ Prologue content seeding complete!');
	console.log('');
	console.log('Summary:');
	console.log(`  - 2 Paths created`);
	console.log(`  - 3 NPCs created`);
	console.log(`  - 2 Main quests created`);
	console.log(`  - 8 Quest objectives created`);
	console.log(`  - 2 Fragments created`);
	console.log('');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedPrologueContent()
		.then(() => {
			console.log('✅ Seeding completed successfully!');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Seeding failed:', error);
			process.exit(1);
		});
}
