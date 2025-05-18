import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import { desc } from 'drizzle-orm';

export const load = async () => {
    const posts = await db.select().from(blogPost).orderBy(desc(blogPost.date));
    return { posts };
};