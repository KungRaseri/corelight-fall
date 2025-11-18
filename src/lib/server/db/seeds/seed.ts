import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import type { 
	RolePermission, 
	NewRole, 
	NewPermission, 
	NewRolePermission, 
	NewAttribute, 
	NewRegion, 
	NewLocation, 
	NewFaction, 
	NewUser, 
	NewUserRole,
	NewItem,
	NewCharacterItem,
	NewCharacterEquipment
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
	userRole
} from '../schema/index.js';
import * as schema from '../schema/index.js';

// Create database connection for seeding
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

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
			await db.insert(userRole).values(adminUserRole);
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
			await db.insert(userRole).values(testUserRole);
		}

		console.log('✅ Test user seeded');

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

// Run the seed function
try {
	await seedDatabase();
	console.log('✅ Database seeding completed successfully');
	client.end();
	process.exit(0);
} catch (error) {
	console.error('❌ Database seeding failed:', error);
	client.end();
	process.exit(1);
}
