import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { facility } from './facility';
import { resource } from '../gameplay/resource';

export const facilityUpgrade = pgTable('facility_upgrade', {
    id: serial('id').primaryKey(),
    facilityId: integer('facility_id').references(() => facility.id),
    level: integer('level').notNull(),
    costGold: integer('cost_gold'),
    costResourceId: integer('cost_resource_id').references(() => resource.id),
    costResourceAmount: integer('cost_resource_amount'),
    effectDescription: text('effect_description')
});
