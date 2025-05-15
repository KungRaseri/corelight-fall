import { db } from '../index';
import { player, stat, playerStat, region, location, faction, role, permission, rolePermission, playerRole, item, playerItem, playerEquipment } from '../schema';
import { hash } from '@node-rs/argon2';
import type { RolePermission } from '../types';
import { eq } from 'drizzle-orm';

const roles = [
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'moderator', description: 'Moderator with limite admin permissions' },
    { name: 'player', description: 'Default player role' }
];

const permissions = [
    { name: 'manage_users', description: 'Can manage users and roles' },
    { name: 'edit_content', description: 'Can edit game content' },
    { name: 'view_admin', description: 'Access to admin panel' }
];

const rolePermissions = [
    { role: 'admin', permission: 'manage_users' }, // Admin -> Manage Users
    { role: 'admin', permission: 'edit_content' }, // Admin -> Edit Content
    { role: 'admin', permission: 'view_admin' }, // Admin -> View Admin
    { role: 'moderator', permission: 'view_admin' }  // Moderator -> View Admin
];

const stats = [
    {
        name: 'Vigor',
        description: 'Physical endurance, health, and resistance to decay or exhaustion.',
        category: 'primary',
        baseValue: 10,
        scaling: 3
    },
    {
        name: 'Nerve',
        description: 'Willpower, mental resilience, and resistance to fear or corruption.',
        category: 'primary',
        baseValue: 7,
        scaling: 2
    },
    {
        name: 'Finesse',
        description: 'Precision, agility, and control, useful in both combat and delicate tasks.',
        category: 'primary',
        baseValue: 6,
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
        baseValue: 4,
        scaling: 2
    },
    {
        name: 'Sync',
        description: 'Connection to relic-tech and divine circuitry; affects relic usage and signal-based powers.',
        category: 'special',
        baseValue: 1,
        scaling: 1
    }
];

const regions = [
    { name: 'Ashen Wastes', description: 'A barren, ash-covered landscape.' },
    { name: 'Verdant Overgrowth', description: 'A dense jungle reclaimed by nature.' }
];

const locations = [
    { name: 'Cinderlight Outpost', description: 'An old watchtower', x: 12, y: 34, type: 'outpost' },
    { name: 'Ironroot Glade', description: 'A forest rich in resources', x: 22, y: 15, type: 'forest' }
];

const factions = [
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

        const dbRolePermissions = rolePermissions.map((rp) => {
            const role = dbRoles.find(r => r.name === rp.role)
            const permission = dbPermissions.find(p => p.name === rp.permission)

            if (role && permission)
                return { roleId: role.id, permissionId: permission.id }

            return null;
        }).filter((entry): entry is RolePermission => entry !== null); // Filter out nulls

        await db.insert(rolePermission).values(dbRolePermissions).onConflictDoNothing();
        console.log('✅ Roles and permissions seeded.');

        // Seed Stats
        await db.insert(stat).values(stats).onConflictDoNothing();
        console.log('✅ Stats seeded');

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
        const adminPasswordHash = await hashPassword('corelight-fall123')
        await db.insert(player).values({
            username: 'admin',
            passwordHash: adminPasswordHash,
            createdAt: new Date()
        }).onConflictDoNothing();
        const admin = await db.select().from(player).where(eq(player.username, 'admin'))
        const adminId = admin[0].id;
        console.log('✅ Admin seeded')

        const dbStats = await db.select().from(stat);

        // Seed Admin Details
        const adminStats = dbStats.map((stat) => ({
            playerId: adminId,
            statId: stat.id,
            value: stat.baseValue
        }));
        await db.insert(playerStat).values(adminStats).onConflictDoNothing()
        console.log('✅ Admin stats seeded')

        const adminRole = dbRoles.find(r => r.name === 'admin');

        if (adminRole)
            await db.insert(playerRole).values({
                playerId: adminId,
                roleId: adminRole.id
            })

        // Seed Test Player
        const passwordHash = await hashPassword('password123');
        await db.insert(player).values({
            username: 'TestPlayer',
            passwordHash,
            createdAt: new Date()
        }).onConflictDoNothing();
        const newPlayer = await db.select().from(player).where(eq(player.username, 'TestPlayer'))
        const playerId = newPlayer[0].id;
        console.log('✅ Test player seeded');

        // Seed Player Stats
        const playerStats = dbStats.map((stat) => ({
            playerId,
            statId: stat.id,
            value: stat.baseValue
        }));
        await db.insert(playerStat).values(playerStats).onConflictDoNothing();
        console.log('✅ Player stats seeded');

        console.log('🌱 Seed complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

export async function seedTestData() {
    await db.insert(item).values([
        {
            name: "Iron Helm",
            description: "Iron Helmet and all that",
            type: "helmet"
        }
    ]).onConflictDoNothing();

    const items = await db.select().from(item);

    await db.insert(playerItem).values([
        {
            playerId: 1,
            itemId: items[0].id,
            quantity: 1
        }
    ]).onConflictDoNothing()

    await db.insert(playerEquipment).values([{
        playerId: 1,
        itemId: items[0].id,
        slot: 'helmet'
    }]).onConflictDoNothing()
}