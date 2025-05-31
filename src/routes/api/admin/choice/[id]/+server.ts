import { db } from '$lib/server/db';
import { choice } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params }) => {
    const id = Number(params.id);
    if (!id) {
        return new Response('Invalid choice id', { status: 400 });
    }
    await db.delete(choice).where(eq(choice.id, id));
    return new Response('Deleted', { status: 200 });
};