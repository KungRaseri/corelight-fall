import { pgTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const blogPost = pgTable('blog_post', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 128 }).notNull().unique(),
	title: varchar('title', { length: 256 }).notNull(),
	summary: text('summary').notNull(),
	date: timestamp('date', { withTimezone: true }).notNull(),
	author: varchar('author', { length: 128 }).notNull(),
	markdown: text('markdown').notNull(), // Store markdown content directly
	tags: text('tags'), // comma-separated or JSON string
	published: boolean('published').notNull().default(true),
	coverImage: varchar('cover_image', { length: 256 }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});
