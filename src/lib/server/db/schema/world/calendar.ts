import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const calendarEvent = pgTable('calendar_event', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	triggerTime: timestamp('trigger_time')
});
