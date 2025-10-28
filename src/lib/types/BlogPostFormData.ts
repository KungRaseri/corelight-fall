import type { BlogPost } from '$lib/server/db/types';

export type BlogPostFormData = Omit<BlogPost, 'id'> & {
	id: number | null;
};
