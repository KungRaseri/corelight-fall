import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { dialog } from './dialog';

export const dialogOption = pgTable('dialog_option', {
	id: serial('id').primaryKey(),
	dialogId: integer('dialog_id').references(() => dialog.id),
	text: text('text').notNull(),
	nextDialogId: integer('next_dialog_id').references(() => dialog.id)
});
