import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import { desc } from 'drizzle-orm';

export const load = async () => {
	const posts = await db.select().from(blogPost).orderBy(desc(blogPost.date));

	return {
		posts: posts.map((post) => {
			return {
				...post,
				date: post.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
				createdAt: post.createdAt?.toISOString().split('T')[0], // Format date to YYYY-MM-DD
				updatedAt: post.updatedAt?.toISOString().split('T')[0] // Format date to YYYY-MM-DD
			};
		})
	};
};
