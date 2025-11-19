import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema/blog/blogPost';
import type { NewBlogPost, BlogPost } from '$lib/server/db/types';
import { requireAdmin } from '$lib/utils/requireAdmin';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET = async ({ locals }) => {
	await requireAdmin(locals);
	const posts = await db.select().from(blogPost).orderBy(desc(blogPost.date));
	return json(posts);
};

export const POST = async ({ locals, request }) => {
	await requireAdmin(locals);
	const data = await request.json();

	// Create a properly typed insert object
	const newPost: NewBlogPost = {
		title: data.title,
		markdown: data.markdown,
		summary: data.summary,
		slug: data.slug,
		author: data.author,
		tags: data.tags,
		published: data.published,
		coverImage: data.coverImage,
		date: new Date(data.date),
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const result = await db.insert(blogPost).values(newPost).returning();
	return json({ success: true, post: result[0] });
};

export const PUT = async ({ locals, request }) => {
	await requireAdmin(locals);
	const data = await request.json();
	
	const updateData: Partial<BlogPost> = {
		title: data.title,
		markdown: data.markdown,
		summary: data.summary,
		slug: data.slug,
		author: data.author,
		tags: data.tags,
		published: data.published,
		coverImage: data.coverImage,
		date: new Date(data.date),
		updatedAt: new Date()
	};

	const result = await db.update(blogPost).set(updateData).where(eq(blogPost.id, data.id)).returning();
	return json({ success: true, post: result[0] });
};

