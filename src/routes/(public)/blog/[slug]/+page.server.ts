// src/routes/(public)/blog/[slug]/+page.server.ts
import { db } from '$lib/server/db';
import { blogPost } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    const post = (await db.select().from(blogPost).where(eq(blogPost.slug, params.slug)))[0];
    if (!post) throw error(404, 'Not found');

    // Compile markdown to HTML
    const compiled = await compile(post.markdown);
    const code = compiled?.code ?? '';

    return {
        post: {
            ...post,
            html: code
        }
    };
};