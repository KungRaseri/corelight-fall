/**
 * Clean up duplicate quests, storylines, and NPCs
 * Run this script manually if you have duplicates in your database
 */

import 'dotenv/config';
import { db } from './src/lib/server/db/index.js';
import { sql } from 'drizzle-orm';

async function cleanupDuplicates() {
	console.log('🧹 Cleaning up duplicate records...\n');

	try {
		// Delete duplicate quests (keep only the one with lowest ID)
		console.log('Removing duplicate quests...');
		await db.execute(sql`
			DELETE FROM quest
			WHERE id NOT IN (
				SELECT MIN(id)
				FROM quest
				GROUP BY title
			)
		`);
		console.log('✅ Duplicate quests removed\n');

		// Delete duplicate storylines
		console.log('Removing duplicate storylines...');
		await db.execute(sql`
			DELETE FROM storyline
			WHERE id NOT IN (
				SELECT MIN(id)
				FROM storyline
				GROUP BY title
			)
		`);
		console.log('✅ Duplicate storylines removed\n');

		// Delete duplicate NPCs
		console.log('Removing duplicate NPCs...');
		await db.execute(sql`
			DELETE FROM npc
			WHERE id NOT IN (
				SELECT MIN(id)
				FROM npc
				GROUP BY name
			)
		`);
		console.log('✅ Duplicate NPCs removed\n');

		// Count remaining records
		const questCount = await db.execute(sql`SELECT COUNT(*) FROM quest`);
		const storylineCount = await db.execute(sql`SELECT COUNT(*) FROM storyline`);
		const npcCount = await db.execute(sql`SELECT COUNT(*) FROM npc`);

		console.log('📊 Final counts:');
		console.log(`   Quests: ${questCount.rows[0].count}`);
		console.log(`   Storylines: ${storylineCount.rows[0].count}`);
		console.log(`   NPCs: ${npcCount.rows[0].count}`);

		console.log('\n✅ Cleanup complete!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Cleanup failed:', error);
		process.exit(1);
	}
}

cleanupDuplicates();
