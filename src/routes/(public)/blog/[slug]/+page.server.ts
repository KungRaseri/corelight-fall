// src/routes/(public)/blog/[slug]/+page.server.ts
import { db } from '$lib/server/db';
import fs from 'fs/promises';
import path from 'path';
import { compile } from 'mdsvex';

export const load = async ({ params }) => {
    const post = await db.query.blogPost.findFirst({ where: { slug: params.slug } });
    if (!post) throw error(404, 'Not found');

    const mdPath = path.resolve('src/posts', post.markdownPath);
    const mdContent = await fs.readFile(mdPath, 'utf-8');
    const { code } = await compile(mdContent);

    return {
        post: {
            ...post,
            content: code
        }
    };
};