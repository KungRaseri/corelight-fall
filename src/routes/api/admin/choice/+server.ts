import { db } from '$lib/server/db';
import { choice } from '$lib/server/db/schema/story/choice';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async () => {
    const choices = await db.select().from(choice).orderBy(desc(choice.id));
    return json(choices);
};

export const POST = async ({ request }) => {
    const data = await request.json();
    delete data.id;

    data.createdAt = new Date();
    data.updatedAt = new Date();

    if (data.nextEncounterId === '') delete data.nextEncounterId;

    console.log('data', data);

    const result = await db.insert(choice).values(data).returning();
    return json({ success: true, choice: result[0] });
};

export const PUT = async ({ request }) => {
    const data = await request.json();
    data.updatedAt = new Date();

    const { id, ...rest } = data;
    const result = await db.update(choice).set(rest).where(eq(choice.id, id)).returning();
    return json({ success: true, choice: result[0] });
};