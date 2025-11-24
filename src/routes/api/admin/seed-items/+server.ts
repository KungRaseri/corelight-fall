import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { item } from '$lib/server/db/schema';
import { allItems } from '$lib/server/db/seeds/items.seed';
import { requireAdmin } from '$lib/utils/requireAdmin';

export const POST: RequestHandler = async ({ locals }) => {
	// Check if user is admin (throws error if not)
	await requireAdmin(locals);

	try {
		console.log('🌱 Starting item seeding...');
		console.log(`📦 Seeding ${allItems.length} items...`);

		// Insert all items (skip if already exists)
		await db.insert(item).values(allItems).onConflictDoNothing();

		console.log('✅ Item seeding complete!');

		return json({
			success: true,
			message: `Successfully seeded ${allItems.length} items`,
			itemCount: allItems.length
		});
	} catch (error) {
		console.error('❌ Item seeding failed:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred'
			},
			{ status: 500 }
		);
	}
};
