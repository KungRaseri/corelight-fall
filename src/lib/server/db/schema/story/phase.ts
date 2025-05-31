import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { act } from './act';


export const phase = pgTable('phase', {
    id: serial('id').primaryKey(),
    actId: integer('act_id').references(() => act.id).notNull(),
    title: text('title').notNull(), // e.g., "PHASE 1"
    order: integer('order').default(0).notNull()
});
