import { seedTestData } from '$lib/server/db/seeds/seed';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);
	try {
		await seedTestData();
		return json({ message: 'Database seeded successfully.' });
	} catch (error) {
		console.error('Database action failed:', error);
		return json({ message: 'Database operation failed.' }, { status: 500 });
	}
};

