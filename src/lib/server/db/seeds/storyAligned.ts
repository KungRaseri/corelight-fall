/**
 * Updated Prologue Seed - Aligned with Story Documentation
 * 
 * This replaces the current prologue implementation to match the story in story/02-prologue/
 * 
 * Story Flow:
 * 1. Prologue (Linear): Awakening → Escape → Path Choice
 * 2. Act 1 Scavenger Path: 5 quests with Forgewalkers
 * 3. Act 1 Seeker Path: 5 quests with Conclave
 * 4. Convergence: Both paths meet at "The Calling"
 */

import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import {
	quest,
	npc,
	fragment,
	storyline
} from '$lib/server/db/schema';

export async function seedStoryAlignedContent() {
	console.log('🌱 Seeding story-aligned prologue content...');

	// ============================================================================
	// PROLOGUE STORYLINE (All Players)
	// ============================================================================
	
	console.log('📖 Creating Prologue storyline...');
	
	// Check if prologue already exists
	const existingPrologue = await db
		.select()
		.from(storyline)
		.where(eq(storyline.title, 'The Awakening'))
		.limit(1);
	
	let prologueStoryline = existingPrologue[0];
	
	if (!prologueStoryline) {
		const [newPrologue] = await db
			.insert(storyline)
			.values({
				title: 'The Awakening',
				description: 'You wake up buried in rubble with no memory of how you got there. A mysterious Corelight fragment pulses nearby, and danger is closing in.',
				tone: 'mysterious, tense, survival',
				goals: 'Escape the ruins, Discover your identity, Make first major choice',
				summary: 'The prologue experience where all players begin their journey.',
				tags: 'prologue,awakening,introduction,tutorial',
				factions: 'none',
				order: 0, // Before Act 1
				isMain: true,
				isActive: true,
				xpReward: 300,
				goldReward: 100
			})
			.returning();
		prologueStoryline = newPrologue;
	}

	console.log(`✅ ${existingPrologue.length > 0 ? 'Found existing' : 'Created'} Prologue storyline: ${prologueStoryline.id}`);

	// ============================================================================
	// KEY NPCs
	// ============================================================================
	
	console.log('👥 Creating key NPCs...');

	// Ravenwood - The Guide (appears in prologue)
	const existingRavenwood = await db.select().from(npc).where(eq(npc.name, 'Ravenwood')).limit(1);
	let ravenwood = existingRavenwood[0];
	
	if (!ravenwood) {
		const [newRavenwood] = await db
			.insert(npc)
			.values({
				name: 'Ravenwood',
				title: 'Free Drifter',
				description: 'A scarred survivor in patchwork armor. He\'s been tracking your Navigator Fragment and offers cryptic guidance.',
				backstory: 'An experienced Drifter who has survived by trusting no one completely. He has connections to multiple factions but belongs to none.',
				role: 'mentor',
				personality: {
					traits: ['pragmatic', 'mysterious', 'worldly', 'cautious'],
					values: ['freedom', 'survival', 'knowledge'],
					fears: ['entrapment', 'corruption'],
					motivations: ['find_truth', 'maintain_independence', 'help_worthy_souls']
				},
				isQuestGiver: true,
				isMentor: true,
				isActive: true
			})
			.returning();
		ravenwood = newRavenwood;
	}

	// Torren Blackforge - Scavenger Path Mentor
	const existingTorren = await db.select().from(npc).where(eq(npc.name, 'Torren Blackforge')).limit(1);
	let torren = existingTorren[0];
	
	if (!torren) {
		const [newTorren] = await db
			.insert(npc)
			.values({
				name: 'Torren Blackforge',
				title: 'Lead Engineer',
				description: 'A scarred veteran engineer who runs the Forgewalker salvage operations. Harsh but fair.',
				backstory: 'Lost his family in the Fall. Dedicated his life to rebuilding civilization through technology and pragmatic survival.',
				role: 'mentor',
				personality: {
					traits: ['harsh', 'pragmatic', 'skilled', 'fair', 'protective'],
					values: ['self_reliance', 'technology', 'results'],
					fears: ['weakness', 'sentimentality', 'loss'],
					motivations: ['rebuild_civilization', 'protect_forgewalkers', 'prove_worth']
				},
				isQuestGiver: true,
				isMentor: true,
				combatRole: 'tank',
				isActive: true
			})
			.returning();
		torren = newTorren;
	}

	// Sister Aria Lightbringer - Seeker Path Mentor
	const existingAria = await db.select().from(npc).where(eq(npc.name, 'Sister Aria Lightbringer')).limit(1);
	let aria = existingAria[0];
	
	if (!aria) {
		const [newAria] = await db
			.insert(npc)
			.values({
				name: 'Sister Aria Lightbringer',
				title: 'Conclave Cleric',
				description: 'A genuinely kind and compassionate cleric who welcomes you to the Conclave without question.',
				backstory: 'A true believer in the Luminarchs who has dedicated her life to helping others and preserving faith.',
				role: 'mentor',
				personality: {
					traits: ['kind', 'faithful', 'hopeful', 'protective', 'questioning'],
					values: ['compassion', 'community', 'faith', 'truth'],
					fears: ['losing_faith', 'failing_others', 'discovering_lies'],
					motivations: ['help_survivors', 'restore_light', 'find_truth']
				},
				isQuestGiver: true,
				isMentor: true,
				isRomanceable: true,
				combatRole: 'healer',
				isActive: true
			})
			.returning();
		aria = newAria;
	}

	console.log(`✅ NPCs: Ravenwood (${ravenwood.id}), Torren (${torren.id}), Aria (${aria.id})`);

	// ============================================================================
	// PROLOGUE QUESTS (Linear Sequence)
	// ============================================================================
	
	console.log('📜 Creating Prologue quests...');

	// Helper function to get or create quest
	async function getOrCreateQuest(questData: {
		storylineId: number;
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
		prerequisiteQuestIds: number[];
		xpReward: number;
		goldReward: number;
	}) {
		const existing = await db.select().from(quest).where(eq(quest.title, questData.title)).limit(1);
		if (existing.length > 0) {
			return existing[0];
		}
		const [newQuest] = await db.insert(quest).values(questData).returning();
		return newQuest;
	}

	// Quest 1: Buried (Tutorial)
	const quest1 = await getOrCreateQuest({
		storylineId: prologueStoryline.id,
		title: 'Buried',
		description: 'You wake up trapped under rubble in complete darkness. Your first challenge: survive and escape.',
		tone: 'tense, claustrophobic',
		goals: 'Free yourself from debris, Find a light source, Discover the glowing fragment',
		summary: 'The opening tutorial where players learn basic movement, interaction, and skill checks.',
		tags: 'prologue,tutorial,awakening,survival',
		factions: 'none',
		order: 1,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [],
		xpReward: 50,
		goldReward: 0
	});

	// Quest 2: The Fragment
	const quest2 = await getOrCreateQuest({
		storylineId: prologueStoryline.id,
		title: 'The Fragment',
		description: 'A mysterious blue crystal pulses with inner light. When you touch it, visions flood your mind - memories that aren\'t yours.',
		tone: 'mysterious, revelatory',
		goals: 'Decide whether to take the fragment, Experience visions, Search for clues about your identity',
		summary: 'Discovery of the Navigator Fragment and the first hints about the player\'s mysterious past.',
		tags: 'prologue,fragment,visions,mystery',
		factions: 'none',
		order: 2,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [quest1.id],
		xpReward: 75,
		goldReward: 0
	});

	// Quest 3: First Blood
	const quest3 = await getOrCreateQuest({
		storylineId: prologueStoryline.id,
		title: 'First Blood',
		description: 'Something moves in the darkness - a Hollowed, a human consumed by Corruption. Your first real combat encounter.',
		tone: 'terrifying, desperate',
		goals: 'Survive the Hollowed encounter, Learn basic combat, Loot supplies',
		summary: 'Combat tutorial and introduction to the Corruption\'s horrifying effects.',
		tags: 'prologue,combat,tutorial,corruption',
		factions: 'none',
		order: 3,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [quest2.id],
		xpReward: 100,
		goldReward: 15
	});

	// Quest 4: The Stranger's Choice
	const quest4 = await getOrCreateQuest({
		storylineId: prologueStoryline.id,
		title: 'The Stranger\'s Choice',
		description: 'Ravenwood, a Free Drifter, has tracked your fragment to this location. He could be ally or enemy - the choice is yours.',
		tone: 'tense, pivotal',
		goals: 'Navigate first major dialogue, Make choice about the fragment, Escape the approaching Hollowed',
		summary: 'Introduction to the dialogue system and first meaningful NPC interaction.',
		tags: 'prologue,dialogue,choice,npc',
		factions: 'drifter',
		order: 4,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [quest3.id],
		xpReward: 75,
		goldReward: 0
	});

	// Quest 5: Two Paths Diverge
	await getOrCreateQuest({
		storylineId: prologueStoryline.id,
		title: 'Two Paths Diverge',
		description: 'Ravenwood brings you to a crossroads and offers a choice: join the Forgewalkers, seek the Conclave, or travel as a Free Drifter.',
		tone: 'momentous, decision',
		goals: 'Learn about the factions, Make your path choice, Begin your journey',
		summary: 'The pivotal choice that determines the player\'s Act 1 experience - Scavenger or Seeker path.',
		tags: 'prologue,choice,path_selection,pivotal',
		factions: 'forgewalker,conclave,drifter',
		order: 5,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [quest4.id],
		xpReward: 0, // No reward - leads to path selection
		goldReward: 0
	});

	console.log(`✅ Created 5 Prologue quests`);

	// ============================================================================
	// NAVIGATOR FRAGMENT
	// ============================================================================
	
	console.log('✨ Creating Navigator Fragment...');

	const existingFragment = await db.select().from(fragment).where(eq(fragment.slug, 'navigator_fragment')).limit(1);
	let navigatorFragment = existingFragment[0];
	
	if (!navigatorFragment) {
		const [newFragment] = await db
			.insert(fragment)
			.values({
				slug: 'navigator_fragment',
				name: 'Navigator Fragment',
				type: 'navigator',
				tier: 5, // Prime tier
				description: 'A crystalline shard that pulses with inner light. Unlike other fragments, this one seems aware, responsive to your thoughts.',
				loreText: 'Navigator Fragments were used by the Luminarchs to coordinate the Corelight network. Only three were ever created. This one has chosen you.',
				powerLevel: 50,
				corruptionLevel: 0,
				requiresAttunement: true,
				attunementDifficulty: 25,
				glowColor: '#4FC3F7',
				abilities: [
					{
						id: '1',
						name: 'Fragment Sense',
						description: 'Detect nearby Corelight fragments within 100 meters',
						type: 'passive' as const
					},
					{
						id: '2',
						name: 'Shared Vision',
						description: 'Experience visions and memories connected to other fragments',
						type: 'active' as const,
						cooldown: 60
					}
				],
				foundByCharacterId: null, // Will be assigned to player
				canBeTradedOrSold: false,
				isActive: true
			})
			.returning();
		navigatorFragment = newFragment;
	}

	console.log(`✅ ${existingFragment.length > 0 ? 'Found existing' : 'Created'} Navigator Fragment: ${navigatorFragment.id}`);

	// ============================================================================
	// SUMMARY
	// ============================================================================
	
	console.log('\n📊 Story-Aligned Content Summary:');
	console.log('   Prologue Storyline: The Awakening');
	console.log('   Prologue Quests: 5 (linear sequence)');
	console.log('   Key NPCs: 3 (Ravenwood, Torren, Aria)');
	console.log('   Navigator Fragment: 1 (player starting item)');
	console.log('\n✅ Story alignment complete!');
	console.log('\nNext Steps:');
	console.log('   1. Create encounters for each prologue quest');
	console.log('   2. Create dialogue trees for NPC interactions');
	console.log('   3. Update quest chains to use prologue completion as prerequisite');
}
