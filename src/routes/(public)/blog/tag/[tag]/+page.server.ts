import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import { desc, ilike } from 'drizzle-orm';

export const load = async ({ params }) => {
    const tag = params.tag;
    // Simple LIKE search for tag in comma-separated list
    const posts = await db
        .select()
        .from(blogPost)
        .where(ilike(blogPost.tags, `%${tag}%`))
        .orderBy(desc(blogPost.date));
    return { posts, tag };
};