/**
 * Seed Script for Prologue Content
 * 
 * This script seeds the database with content from Sprint 2:
 * - Two starting paths (Scavenger and Seeker)
 * - Storylines for both paths
 * - Prologue quests and objectives
 * - Initial NPCs
 * - Starter fragments
 */

import { db } from '$lib/server/db';
import {
	quest,
	questObjective,
	npc,
	fragment,
	storyline
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function seedPrologueContent() {
	console.log('🌱 Seeding prologue content...');

	// Helper function to get or create
	async function getOrCreateStoryline(storylineData: {
		title: string;
		description: string;
		tone: string;
		goals: string;
		summary: string;
		tags: string;
		factions: string;
		order: number;
		isMain: boolean;
		isActive: boolean;
		xpReward: number;
		goldReward: number;
	}) {
		const existing = await db.select().from(storyline).where(eq(storyline.title, storylineData.title)).limit(1);
		if (existing.length > 0) {
			return existing[0];
		}
		const [newStoryline] = await db.insert(storyline).values(storylineData).returning();
		return newStoryline;
	}

	// 0. Create storylines first (quests require storylineId)
	console.log('📖 Creating storylines...');
	
	const scavengerStoryline = await getOrCreateStoryline({
		title: 'The Scavenger\'s Journey',
		description: 'A tale of survival and resourcefulness in the ruins of the old world.',
		tone: 'gritty',
		goals: 'Protect Ashvale, gather resources, build community',
		summary: 'Your story as a pragmatic survivor focused on protecting your community.',
		tags: 'prologue,scavenger,survival',
		factions: 'ashvale',
		order: 1,
		isMain: true,
		isActive: true,
		xpReward: 500,
		goldReward: 200
	});

	const seekerStoryline = await getOrCreateStoryline({
		title: 'The Seeker\'s Path',
		description: 'A quest for knowledge and understanding of the ancient Luminarchs.',
		tone: 'mysterious',
		goals: 'Uncover the truth, decode mysteries, preserve knowledge',
		summary: 'Your journey as a scholar driven by curiosity and the pursuit of lost knowledge.',
		tags: 'prologue,seeker,knowledge',
		factions: 'scholars',
		order: 1,
		isMain: true,
		isActive: true,
		xpReward: 500,
		goldReward: 200
	});

	console.log(`✅ Storylines: Scavenger (${scavengerStoryline.id}), Seeker (${seekerStoryline.id})`);

	// 1. Create key NPCs from the prologue
	console.log('👥 Creating NPCs...');

	const [elara] = await db
		.insert(npc)
		.values({
			name: 'Elara Dawnshard',
			title: 'Elder of Ashvale',
			description: 'A wise and weathered leader who has guided Ashvale through decades of hardship. Her eyes hold both sorrow and determination.',
			backstory: 'Once a scholar of the Luminarchs, Elara survived the Fall and dedicated her life to protecting the remnants of humanity in Ashvale.',
			role: 'mentor',
			personality: {
				traits: ['wise', 'protective', 'burdened'],
				values: ['community', 'knowledge', 'hope'],
				fears: ['losing_people', 'corruption_spreading'],
				motivations: ['protect_ashvale', 'preserve_knowledge', 'guide_youth']
			},
			isQuestGiver: true,
			isMentor: true,
			isActive: true
		})
		.returning();

	const [kael] = await db
		.insert(npc)
		.values({
			name: 'Kael Ironfist',
			title: 'Captain of the Guard',
			description: 'A battle-scarred veteran who takes protection of Ashvale seriously. Gruff exterior hides a caring heart.',
			backstory: 'A former soldier who lost his family to corruption. Now dedicated to ensuring no one else suffers the same fate.',
			role: 'ally',
			personality: {
				traits: ['gruff', 'loyal', 'pragmatic', 'compassionate'],
				values: ['duty', 'strength', 'protection'],
				fears: ['failure', 'losing_comrades'],
				motivations: ['protect_ashvale', 'train_defenders', 'honor_fallen']
			},
			isQuestGiver: true,
			combatRole: 'tank',
			isActive: true
		})
		.returning();

	const [lyra] = await db
		.insert(npc)
		.values({
			name: 'Lyra Whisperwind',
			title: 'Archivist',
			description: 'A young scholar obsessed with pre-Fall history. Enthusiastic but reckless in pursuit of knowledge.',
			backstory: 'Born after the Fall, Lyra grew up hearing stories of the Luminarchs and became determined to uncover their secrets.',
			role: 'ally',
			personality: {
				traits: ['curious', 'enthusiastic', 'reckless', 'brilliant'],
				values: ['knowledge', 'truth', 'discovery'],
				fears: ['ignorance', 'forgotten_history'],
				motivations: ['understand_fall', 'decode_luminarch_texts', 'share_knowledge']
			},
			isQuestGiver: true,
			isRomanceable: true,
			isActive: true
		})
		.returning();

	console.log(`✅ Created NPCs: Elara (${elara.id}), Kael (${kael.id}), Lyra (${lyra.id})`);

	// 2. Create prologue quests
	console.log('📜 Creating quests...');

	// Scavenger Path: Opening Quest
	const [scavengerIntro] = await db
		.insert(quest)
		.values({
			storylineId: scavengerStoryline.id,
			title: 'Shards of Hope',
			description: 'Elder Elara has asked you to investigate strange energy readings from the Old Quarter ruins. The fragments there could provide crucial resources for Ashvale.',
			tone: 'urgent',
			goals: 'Travel to the Old Quarter ruins, Collect 3 Corelight fragments, Defeat corrupted creatures, Return to Elder Elara',
			summary: 'Your first mission for Ashvale - venture into dangerous ruins to gather precious Corelight shards.',
			tags: 'prologue,scavenger,exploration,combat',
			factions: 'ashvale',
			order: 1,
			isMain: true,
			isActive: true,
			xpReward: 100,
			goldReward: 50
		})
		.returning();

	// Seeker Path: Opening Quest
	const [seekerIntro] = await db
		.insert(quest)
		.values({
			storylineId: seekerStoryline.id,
			title: 'Echoes of the Luminarchs',
			description: 'Lyra has discovered references to a Luminarch archive in the old library. Help her decipher the texts and unlock their secrets.',
			tone: 'mysterious',
			goals: 'Meet Lyra at the Ancient Library, Examine ancient texts, Solve the Luminarch cipher, Enter the hidden archive',
			summary: 'Assist the young archivist in unlocking secrets from before the Fall.',
			tags: 'prologue,seeker,knowledge,puzzle',
			factions: 'scholars',
			order: 1,
			isMain: true,
			isActive: true,
			xpReward: 100,
			goldReward: 30
		})
		.returning();

	console.log(`✅ Created quests: ${scavengerIntro.id} (Scavenger), ${seekerIntro.id} (Seeker)`);

	// 3. Create quest objectives
	console.log('🎯 Creating quest objectives...');

	// Scavenger quest objectives
	await db.insert(questObjective).values([
		{
			questId: scavengerIntro.id,
			description: 'Travel to the Old Quarter ruins',
			type: 'reach_location',
			targetId: null, // Would be location ID once locations are seeded
			targetCount: 1,
			isOptional: false,
			order: 1
		},
		{
			questId: scavengerIntro.id,
			description: 'Collect Corelight fragments (0/3)',
			type: 'collect',
			targetId: null, // Would be item ID once items are seeded
			targetCount: 3,
			isOptional: false,
			order: 2
		},
		{
			questId: scavengerIntro.id,
			description: 'Defeat corrupted shadow beasts (0/5)',
			type: 'defeat',
			targetId: null, // Would be enemy ID once enemies are seeded
			targetCount: 5,
			isOptional: false,
			order: 3
		},
		{
			questId: scavengerIntro.id,
			description: 'Return to Elder Elara',
			type: 'talk',
			targetId: elara.id,
			targetCount: 1,
			isOptional: false,
			order: 4
		}
	]);

	// Seeker quest objectives
	await db.insert(questObjective).values([
		{
			questId: seekerIntro.id,
			description: 'Meet Lyra at the Ancient Library',
			type: 'talk',
			targetId: lyra.id,
			targetCount: 1,
			isOptional: false,
			order: 1
		},
		{
			questId: seekerIntro.id,
			description: 'Examine ancient texts (0/4)',
			type: 'interact',
			targetId: null, // Would be object ID once objects are seeded
			targetCount: 4,
			isOptional: false,
			order: 2
		},
		{
			questId: seekerIntro.id,
			description: 'Solve the Luminarch cipher',
			type: 'custom',
			targetId: null, // Would be puzzle ID once puzzles are seeded
			targetCount: 1,
			isOptional: false,
			order: 3
		},
		{
			questId: seekerIntro.id,
			description: 'Enter the hidden archive',
			type: 'reach_location',
			targetId: null, // Would be location ID once locations are seeded
			targetCount: 1,
			isOptional: false,
			order: 4
		}
	]);

	console.log(`✅ Created quest objectives: 8 total (4 per quest)`);

	// 4. Create starter fragments
	console.log('✨ Creating fragments...');

	const [emberFragment] = await db
		.insert(fragment)
		.values({
			name: 'Ember Shard',
			slug: 'ember-shard',
			type: 'standard',
			tier: 1,
			description: 'A warm fragment that pulses with inner fire. It responds to your will, ready to unleash its power.',
			loreText: 'This shard once belonged to a Luminarch of the Flame. Its warmth is a echo of the light that once filled the world.',
			discoveryLore: 'You found this fragment in the Old Quarter ruins, still warm despite centuries in darkness.',
			powerLevel: 15,
			corruptionLevel: 0,
			abilities: [
				{
					id: 'flame-bolt',
					name: 'Flame Bolt',
					description: 'Launch a bolt of fire at enemies (12 damage, 20 range)',
					type: 'active',
					cooldown: 3
				}
			],
			requiresAttunement: true,
			attunementDifficulty: 10,
			glowColor: '#ff6b35',
			isActive: true
		})
		.onConflictDoNothing()
		.returning();

	const [echoFragment] = await db
		.insert(fragment)
		.values({
			name: 'Echo Crystal',
			slug: 'echo-crystal',
			type: 'standard',
			tier: 1,
			description: 'A translucent crystal that hums with residual memories. When held, you hear whispers of the past.',
			loreText: 'Memory crystals like this were used by Luminarch scribes to record history. This one still holds fragments of knowledge.',
			discoveryLore: 'Lyra identified this as a memory storage device, though most of its contents have degraded over time.',
			powerLevel: 10,
			corruptionLevel: 0,
			abilities: [
				{
					id: 'reveal-memory',
					name: 'Reveal Memory',
					description: 'Unlock hidden memories and lore entries',
					type: 'active',
					cooldown: 0
				}
			],
			requiresAttunement: true,
			attunementDifficulty: 8,
			glowColor: '#4ecdc4',
			isActive: true
		})
		.onConflictDoNothing()
		.returning();

	// If fragments already exist, fetch them
	const emberFragmentFinal = emberFragment || (await db.select().from(fragment).where(eq(fragment.slug, 'ember-shard')))[0];
	const echoFragmentFinal = echoFragment || (await db.select().from(fragment).where(eq(fragment.slug, 'echo-crystal')))[0];

	console.log(`✅ Created fragments: ${emberFragmentFinal?.id ?? 'existing'} (Ember), ${echoFragmentFinal?.id ?? 'existing'} (Echo)`);

	console.log('✅ Prologue content seeding complete!');
	console.log('');
	console.log('Summary:');
	console.log(`  - 2 Storylines created`);
	console.log(`  - 3 NPCs created`);
	console.log(`  - 2 Main quests created`);
	console.log(`  - 8 Quest objectives created`);
	console.log(`  - 2 Fragments created`);
	console.log('');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	try {
		await seedPrologueContent();
		console.log('✅ Seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	}
}
