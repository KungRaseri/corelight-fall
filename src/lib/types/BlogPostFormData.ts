export type BlogPostFormData = {
    id: number | null,
    title: string,
    slug: string,
    summary: string,
    date: string,
    author: string,
    markdown: string,
    tags: string | null,
    published: boolean,
    coverImage: string | null,
    createdAt: string,
    updatedAt: string
};
