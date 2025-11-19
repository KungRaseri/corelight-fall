import { resetDatabase } from '$lib/server/db/seeds/reset';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);
	try {
		await resetDatabase();
		return json({ message: 'Database reset successfully.' });
	} catch (error) {
		console.error('Database action failed:', error);
		return json({ message: 'Database operation failed.' }, { status: 500 });
	}
};

