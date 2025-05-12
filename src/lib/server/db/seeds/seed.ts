import { db } from '../index';
import { player, stat, playerStat, region, location, faction, role, permission, rolePermission } from '../schema';
import { hash } from '@node-rs/argon2';

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
    { roleId: 1, permissionId: 1 }, // Admin -> Manage Users
    { roleId: 1, permissionId: 2 }, // Admin -> Edit Content
    { roleId: 1, permissionId: 3 }, // Admin -> View Admin
    { roleId: 2, permissionId: 3 }  // Moderator -> View Admin
];

const stats = [
    { name: 'Strength', description: 'Physical power', category: 'primary', baseValue: 5, scaling: 2 },
    { name: 'Agility', description: 'Speed and evasion', category: 'primary', baseValue: 5, scaling: 2 },
    { name: 'Endurance', description: 'Health and stamina', category: 'primary', baseValue: 10, scaling: 3 },
    { name: 'Intelligence', description: 'Magic power', category: 'primary', baseValue: 5, scaling: 2 },
    { name: 'Willpower', description: 'Mental strength', category: 'primary', baseValue: 5, scaling: 2 },
    { name: 'Luck', description: 'Critical chance', category: 'special', baseValue: 1, scaling: 1 }
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
        const dbRoles = await db.select().from(role);

        // Seed Roles and Permissions
        await db.insert(role).values(roles);
        const dbPermissions = await db.select().from(permission);

        await db.insert(permission).values(permissions);

        const dbRolePermissions = await db.select().from(rolePermission);

        await db.insert(rolePermission).values(rolePermissions);
        console.log('✅ Roles and permissions seeded.');

        // Seed Stats
        await db.insert(stat).values(stats);
        console.log('✅ Stats seeded');

        // Seed Regions
        await db.insert(region).values(regions);
        console.log('✅ Regions seeded');

        // Seed Locations
        await db.insert(location).values(locations);
        console.log('✅ Locations seeded');

        // Seed Factions
        await db.insert(faction).values(factions);
        console.log('✅ Factions seeded');

        // Seed Test Player
        const passwordHash = await hashPassword('password123');
        const [newPlayer] = await db.insert(player).values({
            username: 'TestPlayer',
            passwordHash,
            createdAt: new Date()
        }).returning();
        const playerId = newPlayer.id;
        console.log('✅ Test player seeded');

        // Seed Player Stats
        const playerStats = stats.map((stat, index) => ({
            playerId,
            statId: index + 1,
            value: stat.baseValue
        }));
        await db.insert(playerStat).values(playerStats);
        console.log('✅ Player stats seeded');

        console.log('🌱 Seed complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed().catch((reason) => {
    console.log(reason);
});