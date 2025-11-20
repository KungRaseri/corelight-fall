import 'dotenv/config';
import { db } from '../index.js';
import { hash } from '@node-rs/argon2';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type {
	RolePermission,
	NewRole,
	NewPermission,
	NewAttribute,
	NewRegion,
	NewLocation,
	NewFaction,
	NewUser,
	NewUserRole,
	NewItem,
	NewCharacterItem,
	NewCharacterEquipment,
	NewBlogPost,
	NewAct,
	NewPhase,
	NewStoryline,
	NewQuest,
	NewEncounter,
	NewChoice
} from '../types/index.js';
import { eq } from 'drizzle-orm';
import {
	attribute,
	characterEquipment,
	characterItem,
	faction,
	item,
	location,
	permission,
	region,
	role,
	rolePermission,
	user,
	userRole,
	blogPost,
	act,
	phase,
	storyline,
	quest,
	encounter,
	choice
} from '../schema/index.js';

const roles: NewRole[] = [
	{ name: 'admin', description: 'Administrator with full access' },
	{ name: 'moderator', description: 'Moderator with limite admin permissions' },
	{ name: 'user', description: 'Default user role' }
];

const permissions: NewPermission[] = [
	{ name: 'manage_users', description: 'Can manage users and roles' },
	{ name: 'edit_content', description: 'Can edit game content' },
	{ name: 'view_admin', description: 'Access to admin panel' }
];

const rolePermissions = [
	{ role: 'admin', permission: 'manage_users' }, // Admin -> Manage Users
	{ role: 'admin', permission: 'edit_content' }, // Admin -> Edit Content
	{ role: 'admin', permission: 'view_admin' }, // Admin -> View Admin
	{ role: 'moderator', permission: 'view_admin' } // Moderator -> View Admin
];

const attributes: NewAttribute[] = [
	{
		name: 'Vigor',
		description: 'Physical endurance, health, and resistance to decay or exhaustion.',
		category: 'primary',
		baseValue: 5,
		scaling: 3
	},
	{
		name: 'Nerve',
		description: 'Willpower, mental resilience, and resistance to fear or corruption.',
		category: 'primary',
		baseValue: 5,
		scaling: 2
	},
	{
		name: 'Finesse',
		description: 'Precision, agility, and control, useful in both combat and delicate tasks.',
		category: 'primary',
		baseValue: 5,
		scaling: 2
	},
	{
		name: 'Ingenuity',
		description: 'Intelligence, problem-solving, and interaction with ancient or arcane tech.',
		category: 'primary',
		baseValue: 5,
		scaling: 2
	},
	{
		name: 'Presence',
		description: 'Charisma, intimidation, and the ability to influence factions or NPCs.',
		category: 'primary',
		baseValue: 5,
		scaling: 2
	},
	{
		name: 'Guile',
		description: 'Cunning, stealth, and the ability to deceive or manipulate situations.',
		category: 'primary',
		baseValue: 5,
		scaling: 2
	},
	{
		name: 'Sync',
		description:
			'Connection to relic-tech and divine circuitry; affects relic usage and signal-based powers.',
		category: 'special',
		baseValue: 1,
		scaling: 1
	}
];

const regions: NewRegion[] = [
	{ name: 'Ashen Wastes', description: 'A barren, ash-covered landscape.' },
	{ name: 'Verdant Overgrowth', description: 'A dense jungle reclaimed by nature.' }
];

const locations: NewLocation[] = [
	{ name: 'Cinderlight Outpost', description: 'An old watchtower', x: 12, y: 34, type: 'outpost' },
	{
		name: 'Ironroot Glade',
		description: 'A forest rich in resources',
		x: 22,
		y: 15,
		type: 'forest'
	}
];

const factions: NewFaction[] = [
	{ name: 'Cinderlight Conclave', description: 'Fanatics seeking to reawaken the Corelight.' },
	{ name: 'Forgewalkers Union', description: 'Rebuilders focused on technology.' }
];

async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		parallelism: 1
	});
}

export async function seedDatabase() {
	console.log('🌱 Seeding initial data...');

	try {
		console.log('🌱 Seeding roles and permissions...');

		// Seed Roles and Permissions
		await db.insert(role).values(roles).onConflictDoNothing();
		await db.insert(permission).values(permissions).onConflictDoNothing();

		const dbRoles = await db.select().from(role);
		const dbPermissions = await db.select().from(permission);

		const dbRolePermissions = rolePermissions
			.map((rp) => {
				const role = dbRoles.find((r) => r.name === rp.role);
				const permission = dbPermissions.find((p) => p.name === rp.permission);

				if (role && permission) return { roleId: role.id, permissionId: permission.id };

				return null;
			})
			.filter((entry): entry is RolePermission => entry !== null); // Filter out nulls

		await db.insert(rolePermission).values(dbRolePermissions).onConflictDoNothing();
		console.log('✅ Roles and permissions seeded.');

		// Seed Attributes
		await db.insert(attribute).values(attributes).onConflictDoNothing();
		console.log('✅ Attributes seeded');

		// Seed Regions
		await db.insert(region).values(regions).onConflictDoNothing();
		console.log('✅ Regions seeded');

		// Seed Locations
		await db.insert(location).values(locations).onConflictDoNothing();
		console.log('✅ Locations seeded');

		// Seed Factions
		await db.insert(faction).values(factions).onConflictDoNothing();
		console.log('✅ Factions seeded');

		// Seed Admin
		const adminPasswordHash = await hashPassword('corelight-fall123');
		const adminUser: NewUser = {
			username: 'admin',
			passwordHash: adminPasswordHash,
			createdAt: new Date()
		};
		await db.insert(user).values(adminUser).onConflictDoNothing();
		const admin = (await db.select().from(user).where(eq(user.username, 'admin')))[0];
		console.log('✅ Admin seeded');

		const adminRole = dbRoles.find((r) => r.name === 'admin');
		const defaultRole = dbRoles.find((r) => r.name === 'user');

		if (adminRole) {
			const adminUserRole: NewUserRole = {
				userId: admin.id,
				roleId: adminRole.id
			};
			await db.insert(userRole).values(adminUserRole).onConflictDoNothing();
		}

		// Seed Test User
		const passwordHash = await hashPassword('password123');
		const testUser: NewUser = {
			username: 'TestUser',
			passwordHash,
			createdAt: new Date()
		};
		await db.insert(user).values(testUser).onConflictDoNothing();
		const newUser = await db.select().from(user).where(eq(user.username, 'TestUser'));

		if (defaultRole) {
			const testUserRole: NewUserRole = {
				userId: newUser[0].id,
				roleId: defaultRole.id
			};
			await db.insert(userRole).values(testUserRole).onConflictDoNothing();
		}

		console.log('✅ Test user seeded');

		// Seed Blog Post
		console.log('🌱 Seeding blog posts...');
		const welcomePost: NewBlogPost = {
			slug: 'welcome-to-corelight-fall',
			title: 'Welcome to Corelight Fall',
			summary: 'An introduction to the world of Corelight Fall - a dark fantasy RPG set in a world where the gods have fallen and humanity struggles to survive among the ruins.',
			date: new Date('2024-11-01'),
			author: 'Game Master',
			markdown: `# Welcome to Corelight Fall

Welcome, traveler, to a world shrouded in ash and mystery. The Corelight has fallen, the divine machines lie silent, and the remnants of humanity struggle to survive in the ruins of a once-great civilization.

## A World in Twilight

Centuries ago, the Corelight—a divine energy that powered the world—sustained vast cities, miraculous technology, and the very fabric of reality itself. Then came the Fall. The Corelight dimmed, the gods fell silent, and the world was plunged into an age of ash and decay.

Now, scattered settlements cling to existence among the ruins. Strange creatures born from corrupted divine energy roam the wastes. Ancient relics hold power beyond understanding—and terrible danger.

## Your Journey Begins

You are a survivor, forged in the crucible of this harsh new world. Whether you seek to restore the old ways, forge something new from the ashes, or simply survive another day, your choices will shape the future of this broken world.

### What Awaits You

- **Explore** the Ashen Wastes and Verdant Overgrowth, uncovering secrets of the fallen civilization
- **Master** the seven core attributes: Vigor, Nerve, Finesse, Ingenuity, Presence, Guile, and Sync
- **Navigate** faction politics between the Cinderlight Conclave and Forgewalkers Union
- **Discover** powerful relics and learn to harness their corrupted power
- **Survive** encounters with twisted creatures and hostile survivors

## Character Creation

Your character is defined by:
- **Primary Attributes**: Vigor, Nerve, Finesse, Ingenuity, Presence, and Guile
- **Sync**: Your connection to relic-tech and divine circuitry
- **Choices**: Every decision matters in this harsh world

The path ahead is dark and uncertain. But within the shadows lie opportunities for those brave—or desperate—enough to seize them.

*May the fading light guide your way.*`,
			tags: 'welcome, introduction, lore',
			published: true,
			coverImage: '/images/corelight-landscape.jpg',
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(blogPost).values([welcomePost]).onConflictDoNothing();
		console.log('✅ Blog posts seeded');

		// Seed Items
		console.log('🌱 Seeding items...');
		const items: NewItem[] = [
			{
				name: 'Healing Salve',
				type: 'consumable',
				description: 'A thick, greenish paste made from rare herbs found in the Verdant Overgrowth. Restores 50 health when applied to wounds.'
			},
			{
				name: 'Rusty Iron Sword',
				type: 'weapon',
				description: 'A weathered blade scavenged from the ruins. Its edge is dulled by time, but it can still draw blood. Basic one-handed weapon.'
			},
			{
				name: 'Leather Jerkin',
				type: 'armor',
				description: 'Worn leather armor reinforced with scraps of metal. Provides basic protection against physical attacks.'
			},
			{
				name: 'Signal Beacon',
				type: 'quest',
				description: 'A small device that pulses with faint blue light. It seems to respond to your Sync attribute, growing brighter when you focus on it.'
			},
			{
				name: 'Ration Pack',
				type: 'consumable',
				description: 'Preserved food wrapped in oiled cloth. Not appetizing, but it will keep you alive. Restores stamina.'
			},
			{
				name: 'Ancient Coin',
				type: 'currency',
				description: 'A tarnished coin bearing symbols of the old world. Accepted as currency in most settlements.'
			}
		];
		await db.insert(item).values(items).onConflictDoNothing();
		console.log('✅ Items seeded');

		// Seed Story Structure (Act -> Phase -> Storyline -> Quest -> Encounter -> Choice)
		console.log('🌱 Seeding story structure...');

		// Act I
		const actOne: NewAct = {
			title: 'ACT I: Awakening',
			order: 1
		};
		await db.insert(act).values([actOne]).onConflictDoNothing();
		const acts = await db.select().from(act);
		const actOneRecord = acts.find(a => a.title === 'ACT I: Awakening');

		if (!actOneRecord) throw new Error('Act I not created');

		// Phase 1
		const phaseOne: NewPhase = {
			actId: actOneRecord.id,
			title: 'PHASE 1: First Light',
			order: 1
		};
		await db.insert(phase).values([phaseOne]).onConflictDoNothing();
		const phases = await db.select().from(phase);
		const phaseOneRecord = phases.find(p => p.title === 'PHASE 1: First Light');

		if (!phaseOneRecord) throw new Error('Phase 1 not created');

		// Main Storyline
		const mainStoryline: NewStoryline = {
			title: 'The Dying Light',
			description: 'Your journey begins at Cinderlight Outpost, where rumors speak of a relic that could restore the Corelight—or doom what remains of humanity.',
			phaseId: phaseOneRecord.id,
			tone: 'Dark, mysterious, hopeful',
			goals: 'Discover the truth about the Signal Beacon and decide the fate of Cinderlight Outpost',
			summary: 'The main story arc following the player\'s discovery of a mysterious Signal Beacon and their involvement with the Cinderlight Conclave.',
			tags: 'main, corelight, beacon, mystery',
			factions: 'Cinderlight Conclave, Forgewalkers Union',
			order: 1,
			isMain: true,
			isActive: true,
			coverImage: '/images/dying-light.jpg',
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(storyline).values([mainStoryline]).onConflictDoNothing();
		const storylines = await db.select().from(storyline);
		const mainStorylineRecord = storylines.find(s => s.title === 'The Dying Light');

		if (!mainStorylineRecord) throw new Error('Main storyline not created');

		// Quest 1: Arrival at Cinderlight
		const quest1: NewQuest = {
			storylineId: mainStorylineRecord.id,
			title: 'Arrival at Cinderlight',
			description: 'You arrive at Cinderlight Outpost, a settlement built around the ruins of an ancient watchtower. The people here are wary of strangers, but you carry something that may change everything.',
			tone: 'Tense, mysterious',
			goals: 'Gain entry to Cinderlight Outpost and meet with Elder Cassia',
			summary: 'The player arrives at Cinderlight Outpost carrying a mysterious Signal Beacon.',
			tags: 'introduction, outpost, beacon',
			factions: 'Cinderlight Conclave',
			order: 1,
			isMain: true,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(quest).values([quest1]).onConflictDoNothing();
		const quests = await db.select().from(quest);
		const quest1Record = quests.find(q => q.title === 'Arrival at Cinderlight');

		if (!quest1Record) throw new Error('Quest 1 not created');

		// Encounter 1: The Gate Guard
		const encounter1: NewEncounter = {
			questId: quest1Record.id,
			title: 'The Gate Guard',
			description: 'A grizzled guard stands before the reinforced gates of Cinderlight Outpost. Her hand rests on her weapon as she sizes you up. Behind her, you can see the faint glow of firelight from within the settlement.',
			type: 'dialogue',
			tone: 'Suspicious, cautious',
			summary: 'First interaction with Cinderlight Outpost. The guard questions the player\'s intentions.',
			tags: 'guard, entrance, first-contact',
			factions: 'Cinderlight Conclave',
			order: 1,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(encounter).values([encounter1]).onConflictDoNothing();
		const encounters = await db.select().from(encounter);
		const encounter1Record = encounters.find(e => e.title === 'The Gate Guard');

		if (!encounter1Record) throw new Error('Encounter 1 not created');

		// Encounter 2: Meeting Elder Cassia
		const encounter2: NewEncounter = {
			questId: quest1Record.id,
			title: 'Meeting Elder Cassia',
			description: 'Elder Cassia studies the Signal Beacon with a mixture of reverence and fear. "Do you know what you carry?" she asks, her weathered fingers hovering over the pulsing device. "This is a fragment of the old world—a key to powers we barely understand."',
			type: 'dialogue',
			tone: 'Revelatory, important',
			summary: 'Elder Cassia explains the significance of the Signal Beacon and offers the player a choice.',
			tags: 'elder, beacon, revelation, choice',
			factions: 'Cinderlight Conclave',
			order: 2,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(encounter).values([encounter2]).onConflictDoNothing();
		const encounter2Record = encounters.find(e => e.title === 'Meeting Elder Cassia');

		// Encounter 3: The Path Diverges (Ending)
		const encounter3: NewEncounter = {
			questId: quest1Record.id,
			title: 'The Path Diverges',
			description: 'You have made your choice. The future of Cinderlight Outpost—and perhaps the world—now rests in your hands.',
			type: 'narrative',
			tone: 'Conclusive, momentous',
			summary: 'The conclusion of the first quest, setting up future storylines.',
			tags: 'conclusion, choice-result',
			factions: 'Cinderlight Conclave',
			order: 3,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		await db.insert(encounter).values([encounter3]).onConflictDoNothing();
		const encounter3Record = encounters.find(e => e.title === 'The Path Diverges');

		// Choices for Encounter 1
		if (encounter2Record) {
			const choice1: NewChoice = {
				encounterId: encounter1Record.id,
				text: 'Show the Signal Beacon and request entry',
				nextEncounterId: encounter2Record.id,
				outcome: 'The guard\'s eyes widen at the sight of the beacon. She immediately escorts you to Elder Cassia.',
				order: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const choice2: NewChoice = {
				encounterId: encounter1Record.id,
				text: 'Attempt to bribe the guard with Ancient Coins',
				nextEncounterId: encounter2Record.id,
				outcome: 'The guard pockets the coins and opens the gate, but warns you to keep your head down.',
				order: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const choice3: NewChoice = {
				encounterId: encounter1Record.id,
				text: 'Intimidate the guard (Presence check)',
				nextEncounterId: encounter2Record.id,
				outcome: 'Your forceful demeanor convinces the guard you\'re not someone to trifle with. She reluctantly allows entry.',
				order: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			await db.insert(choice).values([choice1, choice2, choice3]).onConflictDoNothing();
		}

		// Choices for Encounter 2
		if (encounter2Record && encounter3Record) {
			const choice4: NewChoice = {
				encounterId: encounter2Record.id,
				text: 'Agree to help the Conclave activate the beacon',
				nextEncounterId: encounter3Record.id,
				outcome: 'Elder Cassia nods gravely. "You have chosen a dangerous path, but perhaps a necessary one. We will prepare the ritual."',
				order: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const choice5: NewChoice = {
				encounterId: encounter2Record.id,
				text: 'Refuse and keep the beacon for yourself',
				nextEncounterId: encounter3Record.id,
				outcome: 'Cassia\'s expression hardens. "Then you do not understand the responsibility you bear. Leave this place—and pray you never activate it by accident."',
				order: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const choice6: NewChoice = {
				encounterId: encounter2Record.id,
				text: 'Suggest taking it to the Forgewalkers Union instead',
				nextEncounterId: encounter3Record.id,
				outcome: 'Cassia\'s face flushes with anger. "The Forgewalkers would turn this sacred artifact into a weapon! But... perhaps that is the world we live in now."',
				order: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			await db.insert(choice).values([choice4, choice5, choice6]).onConflictDoNothing();
		}

		console.log('✅ Story structure seeded');

		console.log('🌱 Seed complete!');
	} catch (error) {
		console.error('❌ Seeding failed:', error);
	}
}

export async function seedTestData() {
	const testItem: NewItem = {
		name: 'Iron Helm',
		description: 'Iron Helmet and all that',
		type: 'helmet'
	};
	await db.insert(item).values([testItem]).onConflictDoNothing();

	const items = await db.select().from(item);

	const testCharacterItem: NewCharacterItem = {
		characterId: 3,
		itemId: items[0].id,
		quantity: 1
	};
	await db.insert(characterItem).values([testCharacterItem]).onConflictDoNothing();

	const testCharacterEquipment: NewCharacterEquipment = {
		characterId: 3,
		itemId: items[0].id,
		slot: 'helmet'
	};
	await db.insert(characterEquipment).values([testCharacterEquipment]).onConflictDoNothing();
}

// Only run seed if this file is executed directly (not imported)
// Convert Windows path to proper file URL
const currentFile = fileURLToPath(import.meta.url);
const executedFile = process.argv[1];

if (currentFile === executedFile || import.meta.url === pathToFileURL(executedFile).href) {
	try {
		console.log('🌱 Starting database seeding...');
		await seedDatabase();
		console.log('✅ Database seeding completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('❌ Database seeding failed:', error);
		process.exit(1);
	}
}
