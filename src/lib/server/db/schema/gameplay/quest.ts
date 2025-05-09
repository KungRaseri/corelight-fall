import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const quest = pgTable('quest', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    rewardEXP: integer('reward_exp').default(0),
    rewardGold: integer('reward_gold').default(0)
});
