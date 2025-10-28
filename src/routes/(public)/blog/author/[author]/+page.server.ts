import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import { desc, eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const posts = await db
		.select()
		.from(blogPost)
		.where(eq(blogPost.author, params.author))
		.orderBy(desc(blogPost.date));
	return { posts, author: params.author };
};
