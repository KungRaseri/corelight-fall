import { resetDatabase } from '$lib/server/db/seeds/reset';
import { seedDatabase } from '$lib/server/db/seeds/seed';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);
	try {
		await resetDatabase();
		await seedDatabase();
		return json({ message: 'Database reset and seeded successfully.' });
	} catch (error) {
		console.error('Database reset and seed failed:', error);
		return json({ message: 'Database operation failed.' }, { status: 500 });
	}
};
