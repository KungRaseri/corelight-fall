import { seedDatabase } from '$lib/server/db/seeds/seed';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
    requireAdmin(locals);
    try {
        await seedDatabase();
        return json({ message: 'Database seeded successfully.' });
    } catch (error) {
        console.error('Database action failed:', error);
        return json({ message: 'Database operation failed.' }, { status: 500 });
    }
};
