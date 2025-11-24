import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const item = pgTable('item', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	type: text('type').notNull(), // weapon, armor, accessory, relic, consumable, quest, currency
	subtype: text('subtype'), // one-handed, two-handed, ranged, head, chest, etc.
	description: text('description'),
	rarity: text('rarity').notNull().default('common'), // common, uncommon, rare, epic, legendary
	
	// Equipment stats
	damage: integer('damage').default(0), // For weapons
	armor: integer('armor').default(0), // For armor
	
	// Attribute bonuses
	vigorBonus: integer('vigor_bonus').default(0),
	nerveBonus: integer('nerve_bonus').default(0),
	finesseBonus: integer('finesse_bonus').default(0),
	ingenuityBonus: integer('ingenuity_bonus').default(0),
	presenceBonus: integer('presence_bonus').default(0),
	guileBonus: integer('guile_bonus').default(0),
	syncBonus: integer('sync_bonus').default(0),
	
	// Requirements
	levelRequirement: integer('level_requirement').default(1),
	vigorRequirement: integer('vigor_requirement').default(0),
	nerveRequirement: integer('nerve_requirement').default(0),
	finesseRequirement: integer('finesse_requirement').default(0),
	ingenuityRequirement: integer('ingenuity_requirement').default(0),
	presenceRequirement: integer('presence_requirement').default(0),
	guileRequirement: integer('guile_requirement').default(0),
	syncRequirement: integer('sync_requirement').default(0),
	
	// Economic
	value: integer('value').default(0), // Base gold value
	sellValue: integer('sell_value').default(0), // How much you can sell it for
	
	// Consumable properties
	hpRestore: integer('hp_restore').default(0), // For healing items
	usable: boolean('usable').default(false), // Can be used from inventory
	consumable: boolean('consumable').default(false), // Destroyed on use
	
	// Durability (optional feature)
	maxDurability: integer('max_durability').default(100),
	
	// Metadata
	lore: text('lore'), // Flavor text/backstory
	iconPath: text('icon_path'), // Path to item icon image
	stackable: boolean('stackable').default(false), // Can stack in inventory
	maxStack: integer('max_stack').default(1)
});
