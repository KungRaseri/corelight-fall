import { db } from '$lib/server/db';
import { encounter } from '$lib/server/db/schema/story/encounter';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
    requireAdmin(locals);
    const encounters = await db.select().from(encounter).orderBy(desc(encounter.id));
    return json(encounters);
};

export const POST = async ({ locals, request }) => {
    requireAdmin(locals);
    const data = await request.json();
    delete data.id;

    data.createdAt = new Date();
    data.updatedAt = new Date();

    const result = await db.insert(encounter).values(data).returning();
    return json({ success: true, encounter: result[0] });
};

export const PUT = async ({ locals, request }) => {
    requireAdmin(locals);
    const data = await request.json();
    data.updatedAt = new Date();

    const { id, ...rest } = data;
    const result = await db.update(encounter).set(rest).where(eq(encounter.id, id)).returning();
    return json({ success: true, encounter: result[0] });
};