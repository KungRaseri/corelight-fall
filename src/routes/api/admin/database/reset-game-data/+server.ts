import { resetGameData } from '$lib/server/db/seeds/reset';
import { seedDatabase } from '$lib/server/db/seeds/seed';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);
	try {
		await resetGameData();
		await seedDatabase();
		return json({ message: 'Game data reset and reseeded successfully. User accounts preserved.' });
	} catch (error) {
		console.error('Database action failed:', error);
		return json({ message: 'Database operation failed.' }, { status: 500 });
	}
};
