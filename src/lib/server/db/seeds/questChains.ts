/**
 * Quest Chain Seed Script
 * 
 * This script establishes quest chains and prerequisites across both starting paths
 * (Scavenger and Seeker) and their convergence into the main arc.
 * 
 * Quest Chain Structure:
 * - Prologue (linear, all players)
 * - Act 1 Scavenger Path (divergent)
 * - Act 1 Seeker Path (divergent)
 * - Act 2+ Main Arc (convergent, requires either path completion)
 */

import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { quest, storyline } from '$lib/server/db/schema';

export async function seedQuestChains() {
	console.log('⛓️ Setting up quest chains...');

	// Helper function to get or create storyline
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
		alternativePrerequisiteQuestIds?: number[];
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

	// First, let's get existing storylines
	const storylines = await db.select().from(storyline);
	const quests = await db.select().from(quest);
	
	let scavengerStoryline = storylines.find(s => s.title.includes('Scavenger'));
	let seekerStoryline = storylines.find(s => s.title.includes('Seeker'));
	
	// Create the storylines if they don't exist
	if (!scavengerStoryline) {
		scavengerStoryline = await getOrCreateStoryline({
			title: 'The Scavenger\'s Journey',
			description: 'Join the pragmatic Forgewalkers and survive through resourcefulness and strength.',
			tone: 'gritty',
			goals: 'Prove your worth, Earn respect, Master salvage, Defend the Forge',
			summary: 'The path of survival through strength and resourcefulness among the Forgewalkers.',
			tags: 'act1,scavenger,survival',
			factions: 'forgewalker',
			order: 2,
			isMain: true,
			isActive: true,
			xpReward: 1500,
			goldReward: 750
		});
	}
	
	if (!seekerStoryline) {
		seekerStoryline = await getOrCreateStoryline({
			title: 'The Seeker\'s Path',
			description: 'Find meaning and purpose with the Conclave, seeking spiritual enlightenment.',
			tone: 'spiritual',
			goals: 'Find sanctuary, Discover truth, Build faith, Defend the Sanctum',
			summary: 'The path of spiritual seeking and purpose with the Conclave.',
			tags: 'act1,seeker,faith',
			factions: 'conclave',
			order: 2,
			isMain: true,
			isActive: true,
			xpReward: 1500,
			goldReward: 750
		});
	}
	
	// Get the prologue completion quest - "Two Paths Diverge"
	const prologueCompletionQuest = quests.find(q => q.title === 'Two Paths Diverge');

	if (!scavengerStoryline || !seekerStoryline) {
		console.log('⚠️ Failed to create base storylines.');
		return;
	}
	
	if (!prologueCompletionQuest) {
		console.log('⚠️ Prologue completion quest not found. Story-aligned prologue may not be seeded yet.');
		console.log('   Act 1 paths will be immediately available (no prerequisites).');
	}

	console.log('📖 Found storylines:');
	console.log(`   - Scavenger: ${scavengerStoryline.id}`);
	console.log(`   - Seeker: ${seekerStoryline.id}`);
	if (prologueCompletionQuest) {
		console.log(`   - Prologue completion: "${prologueCompletionQuest.title}" (ID: ${prologueCompletionQuest.id})`);
	}

	// ============================================================================
	// SCAVENGER PATH QUEST CHAIN (Act 1)
	// ============================================================================
	
	console.log('\n🔨 Creating Scavenger Path quest chain...');

	// Quest 1: Prove Your Worth (Requires prologue completion)
	const scav1 = await getOrCreateQuest({
		storylineId: scavengerStoryline.id,
		title: 'Prove Your Worth',
		description: 'The Forgewalkers don\'t accept freeloaders. Torren Blackforge has assigned you a dangerous salvage run to the Rust Fields to prove you can contribute.',
		tone: 'challenging',
		goals: 'Complete salvage run, Collect 5 scrap metal, Survive corrupted encounters, Return to Torren',
		summary: 'Your first test among the Forgewalkers - survive the Rust Fields and bring back valuable scrap.',
		tags: 'act1,scavenger,combat,gathering',
		factions: 'forgewalker',
		order: 1,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: prologueCompletionQuest ? [prologueCompletionQuest.id] : [], // Requires completing prologue
		xpReward: 150,
		goldReward: 75
	});

	// Quest 2: Earning Respect (Requires Quest 1)
	const scav2 = await getOrCreateQuest({
		storylineId: scavengerStoryline.id,
		title: 'Earning Respect',
		description: 'You\'ve proven you can survive, but the Forgewalkers demand more. Take on increasingly difficult contracts to earn your place in the community.',
		tone: 'competitive',
		goals: 'Complete 3 salvage contracts, Compete with Kess "Sparkplug", Improve crafting skills, Gain Torren\'s approval',
		summary: 'Work your way up from rookie to respected scavenger through challenging contracts.',
		tags: 'act1,scavenger,contracts,crafting',
		factions: 'forgewalker',
		order: 2,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [scav1.id],
		xpReward: 200,
		goldReward: 100
	});

	// Quest 3: The Fragment Market (Requires Quest 2)
	const scav3 = await getOrCreateQuest({
		storylineId: scavengerStoryline.id,
		title: 'The Fragment Market',
		description: 'Old Copper, a mysterious merchant, reveals that Corelight fragments are highly valuable. Your Navigator Fragment catches his eye - and the attention of others.',
		tone: 'mysterious',
		goals: 'Meet Old Copper, Learn about fragment trade, Defend against thieves, Make a choice about selling',
		summary: 'Discover the dangerous world of fragment trading and make a critical decision about your Navigator Fragment.',
		tags: 'act1,scavenger,trade,choice',
		factions: 'forgewalker,merchants',
		order: 3,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [scav2.id],
		xpReward: 250,
		goldReward: 150
	});

	// Quest 4: The Deep Salvage (Requires Quest 3)
	const scav4 = await getOrCreateQuest({
		storylineId: scavengerStoryline.id,
		title: 'The Deep Salvage',
		description: 'Magistrate Venn offers you a lucrative but dangerous job - lead a team into the Deep Vault, a pre-Fall facility filled with treasure and corruption.',
		tone: 'tense',
		goals: 'Form salvage team, Navigate the Deep Vault, Recover ancient technology, Make moral choices about loot distribution',
		summary: 'Lead your first major expedition into one of the most dangerous salvage sites in the region.',
		tags: 'act1,scavenger,dungeon,leadership',
		factions: 'forgewalker',
		order: 4,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [scav3.id],
		xpReward: 300,
		goldReward: 200
	});

	// Quest 5: Attack on the Forge (Requires Quest 4) - Act 1 Finale
	const scav5 = await getOrCreateQuest({
		storylineId: scavengerStoryline.id,
		title: 'Attack on the Forge',
		description: 'A massive wave of corrupted creatures attacks the Forgewalker camp. This is your chance to prove you truly belong - or to flee and survive alone.',
		tone: 'desperate',
		goals: 'Defend the Forge, Protect civilians, Defeat corruption wave, Choose to stay or leave',
		summary: 'The climactic battle that determines your place among the Forgewalkers.',
		tags: 'act1,scavenger,combat,finale,choice',
		factions: 'forgewalker',
		order: 5,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [scav4.id],
		xpReward: 500,
		goldReward: 250
	});

	console.log(`✅ Created ${[scav1, scav2, scav3, scav4, scav5].length} Scavenger quests`);

	// ============================================================================
	// SEEKER PATH QUEST CHAIN (Act 1)
	// ============================================================================
	
	console.log('\n📿 Creating Seeker Path quest chain...');

	// Quest 1: Sanctuary (Requires prologue completion)
	const seek1 = await getOrCreateQuest({
		storylineId: seekerStoryline.id,
		title: 'Sanctuary',
		description: 'Sister Aria welcomes you to the Conclave outpost with open arms. Help the injured and learn about the community that has accepted you without question.',
		tone: 'hopeful',
		goals: 'Tour the Sanctum, Help injured survivors, Learn Conclave customs, Speak with High Luminary Daven',
		summary: 'Your first days at the Conclave - a community offering hope and purpose.',
		tags: 'act1,seeker,healing,community',
		factions: 'conclave',
		order: 1,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: prologueCompletionQuest ? [prologueCompletionQuest.id] : [],
		xpReward: 150,
		goldReward: 75
	});

	// Quest 2: Fragment Resonance (Requires Quest 1)
	const seek2 = await getOrCreateQuest({
		storylineId: seekerStoryline.id,
		title: 'Fragment Resonance',
		description: 'Your Navigator Fragment begins resonating when near the Conclave\'s sacred relic. Sister Aria believes this is divine providence - but what does it truly mean?',
		tone: 'mysterious',
		goals: 'Study fragment resonance, Experience shared vision, Research Luminarch texts, Question your purpose',
		summary: 'A mysterious connection between your fragment and the Conclave\'s relic raises profound questions.',
		tags: 'act1,seeker,mystery,lore',
		factions: 'conclave',
		order: 2,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [seek1.id],
		xpReward: 200,
		goldReward: 100
	});

	// Quest 3: The Heretic's Text (Requires Quest 2)
	const seek3 = await getOrCreateQuest({
		storylineId: seekerStoryline.id,
		title: 'The Heretic\'s Text',
		description: 'Brother Callum discovers a pre-Fall document that contradicts Conclave teachings. He trusts you with this dangerous knowledge - will you help him hide it, reveal it, or destroy it?',
		tone: 'tense',
		goals: 'Read the forbidden text, Discuss with Callum, Make a moral choice, Face consequences',
		summary: 'A forbidden document forces you to choose between truth and faith.',
		tags: 'act1,seeker,choice,morality,lore',
		factions: 'conclave',
		order: 3,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [seek2.id],
		xpReward: 250,
		goldReward: 150
	});

	// Quest 4: Trial of Faith (Requires Quest 3)
	const seek4 = await getOrCreateQuest({
		storylineId: seekerStoryline.id,
		title: 'Trial of Faith',
		description: 'High Luminary Daven sends you on a pilgrimage to recover a sacred relic from corrupted ruins. This trial will test your faith, courage, and resolve.',
		tone: 'spiritual',
		goals: 'Journey to the Old Cathedral, Face corruption alone, Recover the Sacred Chalice, Return changed',
		summary: 'A solo pilgrimage into danger to prove your devotion and worth.',
		tags: 'act1,seeker,dungeon,faith',
		factions: 'conclave',
		order: 4,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [seek3.id],
		xpReward: 300,
		goldReward: 200
	});

	// Quest 5: The Swarm (Requires Quest 4) - Act 1 Finale
	const seek5 = await getOrCreateQuest({
		storylineId: seekerStoryline.id,
		title: 'The Swarm',
		description: 'A massive corruption swarm descends on the Sanctum. Use everything you\'ve learned to defend your new home and uncover the dark secret High Luminary Daven has been hiding.',
		tone: 'dramatic',
		goals: 'Defend the Sanctum, Protect Aria and civilians, Discover Daven\'s secret, Choose faith or doubt',
		summary: 'The climactic battle reveals uncomfortable truths about the Conclave\'s leadership.',
		tags: 'act1,seeker,combat,finale,revelation',
		factions: 'conclave',
		order: 5,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [seek4.id],
		xpReward: 500,
		goldReward: 250
	});

	console.log(`✅ Created ${[seek1, seek2, seek3, seek4, seek5].length} Seeker quests`);

	// ============================================================================
	// CONVERGENCE QUEST - THE CROSSROADS (Act 1/2 Bridge)
	// ============================================================================
	
	console.log('\n🔀 Creating convergence quest...');

	// Create a new "Main Arc" storyline for post-convergence content
	const mainArcStoryline = await getOrCreateStoryline({
		title: 'The Calling - Main Arc',
		description: 'With the fragments awakening, you must navigate the dangerous convergence of factions and uncover the truth about the Fall.',
		tone: 'epic',
		goals: 'Unite factions, Collect fragments, Discover the truth, Make final choice',
		summary: 'The main story arc where both paths converge toward the ultimate truth.',
		tags: 'main,act2,convergence',
		factions: 'all',
		order: 10,
		isMain: true,
		isActive: true,
		xpReward: 2000,
		goldReward: 1000
	});

	// The Crossroads - Requires EITHER Scavenger finale OR Seeker finale
	const convergence = await getOrCreateQuest({
		storylineId: mainArcStoryline.id,
		title: 'The Crossroads',
		description: 'Your fragment is pulling you toward an ancient site where energy readings spike. When you arrive, you find members of the other faction with the same mission. Conflict seems inevitable.',
		tone: 'tense',
		goals: 'Travel to energy source, Meet opposing faction, Navigate conflict, Forge unlikely alliance',
		summary: 'The moment when both paths collide and you must choose cooperation or conflict.',
		tags: 'act2,convergence,choice,pivotal',
		factions: 'forgewalker,conclave',
		order: 1,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [], // Empty because we use alternative instead
		alternativePrerequisiteQuestIds: [scav5.id, seek5.id], // Either path works
		xpReward: 600,
		goldReward: 300
	});

	console.log(`✅ Created convergence quest: ${convergence.title}`);

	// ============================================================================
	// MAIN ARC QUEST CHAIN (Act 2)
	// ============================================================================
	
	console.log('\n🌟 Creating Main Arc quest chain...');

	// Quest 1: The Calling (Requires The Crossroads)
	const main1 = await getOrCreateQuest({
		storylineId: mainArcStoryline.id,
		title: 'The Calling',
		description: 'The fragments are awakening across the land. Your Navigator Fragment pulses with urgent energy, showing you visions of other fragment locations. The hunt begins.',
		tone: 'urgent',
		goals: 'Decode fragment visions, Plan expedition routes, Form mixed-faction team, Prepare for journey',
		summary: 'Your fragment awakens fully, revealing the locations of others and the true scope of your quest.',
		tags: 'act2,main,fragments,revelation',
		factions: 'all',
		order: 2,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [convergence.id],
		xpReward: 700,
		goldReward: 350
	});

	// Quest 2: Journey to the Crater (Requires The Calling)
	const main2 = await getOrCreateQuest({
		storylineId: mainArcStoryline.id,
		title: 'Journey to the Crater',
		description: 'Your first major expedition takes you to the Great Crater, where a Prime Fragment is said to rest. The journey will test your alliances and reveal new dangers.',
		tone: 'epic',
		goals: 'Travel through dangerous terrain, Maintain faction cooperation, Reach the Crater, Confront guardians',
		summary: 'An epic journey that cements the fragile alliance between Forgewalkers and Conclave.',
		tags: 'act2,main,journey,teamwork',
		factions: 'all',
		order: 3,
		isMain: true,
		isActive: true,
		prerequisiteQuestIds: [main1.id],
		xpReward: 800,
		goldReward: 400
	});

	console.log(`✅ Created ${[main1, main2].length} Main Arc quests`);

	// ============================================================================
	// SUMMARY
	// ============================================================================
	
	console.log('\n📊 Quest Chain Summary:');
	console.log('   Scavenger Path: 5 quests (linear chain)');
	console.log('   Seeker Path: 5 quests (linear chain)');
	console.log('   Convergence: 1 quest (requires either path)');
	console.log('   Main Arc: 2+ quests (shared progression)');
	console.log('\n✅ Quest chains established!');
}
