import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async () => {
    const posts = await db.select().from(blogPost).orderBy(desc(blogPost.date));
    return json(posts);
};

export const POST = async ({ request }) => {
    const data = await request.json();
    console.log('Received data:', data);

    delete data.id;

    data.date = new Date(data.date); // Convert to Date object
    data.createdAt = new Date(); // Convert to Date object
    data.updatedAt = new Date(); // Convert to Date object

    const result = await db.insert(blogPost).values(data).returning();
    return json({ success: true, post: result[0] });
};

export const PUT = async ({ request }) => {
    const data = await request.json();
    data.date = new Date(data.date); // Convert to Date object
    data.createdAt = new Date(data.createdAt); // Convert to Date object
    data.updatedAt = new Date(data.updatedAt); // Convert to Date object

    const { id, ...rest } = data;
    const result = await db.update(blogPost).set(rest).where(eq(blogPost.id, id)).returning();
    return json({ success: true, post: result[0] });
};