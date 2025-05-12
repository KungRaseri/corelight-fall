import { db } from '../index';
import { player, stat, region, location, faction } from '../schema';

export async function reset() {
    console.log('🔄 Resetting database...');
    await db.delete(player);
    await db.delete(stat);
    await db.delete(region);
    await db.delete(location);
    await db.delete(faction);
    console.log('✅ Database reset.');
}
