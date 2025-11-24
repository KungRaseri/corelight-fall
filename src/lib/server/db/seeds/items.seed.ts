import type { NewItem } from '../types/index.js';

/**
 * Comprehensive item database for Corelight Fall
 * Organized by: Weapons, Armor, Accessories, Relics, Consumables
 */

// ============================================================================
// WEAPONS
// ============================================================================

export const weapons: NewItem[] = [
	// ===== STARTER WEAPONS =====
	{
		name: 'Rusty Iron Sword',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A weathered blade scavenged from the ruins. Its edge is dulled by time, but it can still draw blood.',
		rarity: 'common',
		damage: 8,
		levelRequirement: 1,
		value: 15,
		sellValue: 5,
		lore: 'Countless hands have gripped this blade. How many lives has it taken? How many more will it claim?',
		iconPath: '/items/weapons/rusty-sword.png',
		stackable: false
	},
	{
		name: 'Worn Dagger',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A small blade with a leather-wrapped handle. Light and quick, perfect for precision strikes.',
		rarity: 'common',
		damage: 6,
		finesseBonus: 1,
		levelRequirement: 1,
		value: 12,
		sellValue: 4,
		lore: 'Silent as the grave, swift as vengeance.',
		iconPath: '/items/weapons/worn-dagger.png',
		stackable: false
	},
	{
		name: 'Cracked Bow',
		type: 'weapon',
		subtype: 'ranged',
		description: 'An old hunting bow with visible cracks in the wood. Unreliable, but better than nothing.',
		rarity: 'common',
		damage: 7,
		finesseRequirement: 2,
		levelRequirement: 1,
		value: 18,
		sellValue: 6,
		lore: 'The wood groans with each draw. Will it break on the next shot?',
		iconPath: '/items/weapons/cracked-bow.png',
		stackable: false
	},
	{
		name: 'Scrap Club',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A crude weapon made from scavenged metal and wood. Heavy and brutal.',
		rarity: 'common',
		damage: 10,
		vigorRequirement: 3,
		levelRequirement: 1,
		value: 10,
		sellValue: 3,
		lore: 'Not elegant, not refined—just effective.',
		iconPath: '/items/weapons/scrap-club.png',
		stackable: false
	},

	// ===== MID-TIER WEAPONS =====
	{
		name: 'Forgewalker\'s Blade',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A well-crafted sword bearing the mark of the Forgewalkers Union. Sharp and balanced.',
		rarity: 'uncommon',
		damage: 15,
		ingenuityBonus: 1,
		levelRequirement: 5,
		vigorRequirement: 4,
		value: 120,
		sellValue: 40,
		lore: 'Forged in the heart of the Union\'s workshops, each blade a testament to human ingenuity.',
		iconPath: '/items/weapons/forgewalker-blade.png',
		stackable: false
	},
	{
		name: 'Signal Spear',
		type: 'weapon',
		subtype: 'two-handed',
		description: 'A spear with a tip made from signal-conducting metal. It hums faintly with residual energy.',
		rarity: 'uncommon',
		damage: 18,
		syncBonus: 1,
		levelRequirement: 6,
		vigorRequirement: 5,
		syncRequirement: 2,
		value: 150,
		sellValue: 50,
		lore: 'The spear sings when thrust, a mournful echo of the Corelight\'s last breath.',
		iconPath: '/items/weapons/signal-spear.png',
		stackable: false
	},
	{
		name: 'Corruption Edge',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A blade warped by corrupted divine energy. Dangerous to wield, devastating to your enemies.',
		rarity: 'rare',
		damage: 20,
		guileBonus: 2,
		nerveBonus: -1,
		levelRequirement: 8,
		finesseRequirement: 6,
		value: 200,
		sellValue: 65,
		lore: 'Those who wield corruption often become corrupted themselves. How long can you resist?',
		iconPath: '/items/weapons/corruption-edge.png',
		stackable: false
	},
	{
		name: 'Precision Crossbow',
		type: 'weapon',
		subtype: 'ranged',
		description: 'A mechanical crossbow with superior accuracy. Favored by Forgewalker scouts.',
		rarity: 'uncommon',
		damage: 16,
		finesseBonus: 2,
		ingenuityBonus: 1,
		levelRequirement: 7,
		finesseRequirement: 6,
		ingenuityRequirement: 4,
		value: 175,
		sellValue: 58,
		lore: 'Aim true, shoot once. The Union wastes nothing—not even arrows.',
		iconPath: '/items/weapons/precision-crossbow.png',
		stackable: false
	},

	// ===== HIGH-TIER WEAPONS =====
	{
		name: 'Corelight Shard Sword',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A blade forged from a fragment of the Corelight itself. It radiates holy energy and cuts through corruption like paper.',
		rarity: 'epic',
		damage: 28,
		syncBonus: 3,
		nerveBonus: 2,
		levelRequirement: 15,
		vigorRequirement: 8,
		syncRequirement: 5,
		value: 850,
		sellValue: 280,
		lore: 'When the gods fell, their light scattered. This blade holds a fragment of that divine spark.',
		iconPath: '/items/weapons/corelight-sword.png',
		stackable: false
	},
	{
		name: 'Relic Hammer',
		type: 'weapon',
		subtype: 'two-handed',
		description: 'A massive hammer powered by ancient relic-tech. Each strike releases a pulse of energy.',
		rarity: 'epic',
		damage: 35,
		vigorBonus: 3,
		ingenuityBonus: 2,
		levelRequirement: 16,
		vigorRequirement: 10,
		ingenuityRequirement: 7,
		value: 920,
		sellValue: 305,
		lore: 'The Forgewalkers built this to shatter the old world. It succeeded beyond their wildest nightmares.',
		iconPath: '/items/weapons/relic-hammer.png',
		stackable: false
	},
	{
		name: 'Void Bow',
		type: 'weapon',
		subtype: 'ranged',
		description: 'A bow crafted from void-touched materials. Its arrows seem to disappear mid-flight, only to reappear in the target.',
		rarity: 'legendary',
		damage: 32,
		finesseBonus: 4,
		guileBonus: 3,
		syncBonus: 2,
		levelRequirement: 20,
		finesseRequirement: 12,
		guileRequirement: 8,
		syncRequirement: 6,
		value: 1500,
		sellValue: 500,
		lore: 'Where do the arrows go between leaving the bow and striking flesh? Perhaps it\'s better not to know.',
		iconPath: '/items/weapons/void-bow.png',
		stackable: false
	},
	{
		name: 'Conclave Sanctifier',
		type: 'weapon',
		subtype: 'two-handed',
		description: 'The ceremonial weapon of Conclave high priests. Deals massive damage to corrupted beings.',
		rarity: 'epic',
		damage: 30,
		presenceBonus: 3,
		nerveBonus: 3,
		levelRequirement: 18,
		presenceRequirement: 10,
		nerveRequirement: 8,
		value: 1000,
		sellValue: 330,
		lore: 'Blessed by a thousand prayers, bathed in sacred oils, wielded in the name of dying gods.',
		iconPath: '/items/weapons/sanctifier.png',
		stackable: false
	},
	{
		name: 'Shadowstrike Blade',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'A blade that seems to drink in light. Perfect for ambushes and assassinations.',
		rarity: 'rare',
		damage: 22,
		finesseBonus: 2,
		guileBonus: 3,
		levelRequirement: 12,
		finesseRequirement: 8,
		guileRequirement: 7,
		value: 380,
		sellValue: 125,
		lore: 'They never see it coming. By the time they realize, it\'s already too late.',
		iconPath: '/items/weapons/shadowstrike.png',
		stackable: false
	},
	{
		name: 'Engineer\'s Multitool',
		type: 'weapon',
		subtype: 'one-handed',
		description: 'Part weapon, part tool. Not the most damaging, but incredibly versatile.',
		rarity: 'uncommon',
		damage: 12,
		ingenuityBonus: 3,
		finesseBonus: 1,
		levelRequirement: 8,
		ingenuityRequirement: 6,
		value: 160,
		sellValue: 53,
		lore: 'A Forgewalker without their tools is just another survivor. With them, they\'re unstoppable.',
		iconPath: '/items/weapons/multitool.png',
		stackable: false
	}
];

// ============================================================================
// ARMOR SETS
// ============================================================================

// ===== SCAVENGER'S SET (Light Armor) =====
export const scavengerSet: NewItem[] = [
	{
		name: 'Scavenger\'s Hood',
		type: 'armor',
		subtype: 'head',
		description: 'A worn hood with built-in goggles. Protects against ash storms and prying eyes.',
		rarity: 'uncommon',
		armor: 3,
		finesseBonus: 1,
		guileBonus: 1,
		levelRequirement: 5,
		value: 80,
		sellValue: 26,
		lore: 'In the wastes, the best protection is not being seen at all.',
		iconPath: '/items/armor/scavenger-hood.png',
		stackable: false
	},
	{
		name: 'Scavenger\'s Jerkin',
		type: 'armor',
		subtype: 'chest',
		description: 'Light leather armor with many pockets. Practical and unassuming.',
		rarity: 'uncommon',
		armor: 6,
		finesseBonus: 2,
		guileBonus: 1,
		levelRequirement: 5,
		value: 120,
		sellValue: 40,
		lore: 'Every pocket tells a story. Most of them end with "and then I stole it."',
		iconPath: '/items/armor/scavenger-jerkin.png',
		stackable: false
	},
	{
		name: 'Scavenger\'s Leggings',
		type: 'armor',
		subtype: 'legs',
		description: 'Reinforced pants designed for crawling through ruins.',
		rarity: 'uncommon',
		armor: 5,
		finesseBonus: 1,
		vigorBonus: 1,
		levelRequirement: 5,
		value: 100,
		sellValue: 33,
		lore: 'Sturdy, flexible, and covered in suspicious stains. Perfect.',
		iconPath: '/items/armor/scavenger-leggings.png',
		stackable: false
	},
	{
		name: 'Scavenger\'s Gloves',
		type: 'armor',
		subtype: 'hands',
		description: 'Fingerless gloves with padded palms. Great for climbing and lockpicking.',
		rarity: 'uncommon',
		armor: 2,
		finesseBonus: 2,
		guileBonus: 1,
		levelRequirement: 5,
		value: 70,
		sellValue: 23,
		lore: 'Dexterous fingers have opened more doors than any key.',
		iconPath: '/items/armor/scavenger-gloves.png',
		stackable: false
	},
	{
		name: 'Scavenger\'s Boots',
		type: 'armor',
		subtype: 'feet',
		description: 'Silent-soled boots perfect for sneaking. Also surprisingly comfortable.',
		rarity: 'uncommon',
		armor: 3,
		finesseBonus: 1,
		guileBonus: 2,
		levelRequirement: 5,
		value: 85,
		sellValue: 28,
		lore: 'Walk softly and carry a big... actually, just walk softly.',
		iconPath: '/items/armor/scavenger-boots.png',
		stackable: false
	}
];

// ===== CONCLAVE DEVOTEE SET (Medium Armor) =====
export const conclaveSet: NewItem[] = [
	{
		name: 'Devotee\'s Circlet',
		type: 'armor',
		subtype: 'head',
		description: 'A holy circlet bearing the symbol of the Corelight. Enhances mental fortitude.',
		rarity: 'rare',
		armor: 5,
		nerveBonus: 2,
		presenceBonus: 2,
		levelRequirement: 10,
		value: 250,
		sellValue: 83,
		lore: 'Faith is a shield against the darkness. Or so they say.',
		iconPath: '/items/armor/devotee-circlet.png',
		stackable: false
	},
	{
		name: 'Devotee\'s Robes',
		type: 'armor',
		subtype: 'chest',
		description: 'Blessed robes worn by Conclave members. Provides spiritual and physical protection.',
		rarity: 'rare',
		armor: 10,
		nerveBonus: 3,
		presenceBonus: 2,
		syncBonus: 1,
		levelRequirement: 10,
		value: 380,
		sellValue: 126,
		lore: 'Woven with threads of prayer and sanctified with tears of the faithful.',
		iconPath: '/items/armor/devotee-robes.png',
		stackable: false
	},
	{
		name: 'Devotee\'s Leggings',
		type: 'armor',
		subtype: 'legs',
		description: 'Ceremonial leg armor with protective prayer inscriptions.',
		rarity: 'rare',
		armor: 8,
		nerveBonus: 2,
		vigorBonus: 1,
		levelRequirement: 10,
		value: 280,
		sellValue: 93,
		lore: 'Each inscription a ward, each ward a hope, each hope a prayer unanswered.',
		iconPath: '/items/armor/devotee-leggings.png',
		stackable: false
	},
	{
		name: 'Devotee\'s Gauntlets',
		type: 'armor',
		subtype: 'hands',
		description: 'Blessed gauntlets that enhance the wearer\'s connection to divine energy.',
		rarity: 'rare',
		armor: 4,
		presenceBonus: 2,
		syncBonus: 2,
		levelRequirement: 10,
		value: 220,
		sellValue: 73,
		lore: 'These hands have blessed the dying and condemned the wicked.',
		iconPath: '/items/armor/devotee-gauntlets.png',
		stackable: false
	},
	{
		name: 'Devotee\'s Sandals',
		type: 'armor',
		subtype: 'feet',
		description: 'Simple sandals worn on holy pilgrimages. Deceptively protective.',
		rarity: 'rare',
		armor: 5,
		nerveBonus: 2,
		presenceBonus: 1,
		levelRequirement: 10,
		value: 200,
		sellValue: 66,
		lore: 'A thousand miles walked in service to the divine.',
		iconPath: '/items/armor/devotee-sandals.png',
		stackable: false
	}
];

// ===== FORGEWALKER SET (Heavy Armor) =====
export const forgewalkerSet: NewItem[] = [
	{
		name: 'Forgewalker\'s Helm',
		type: 'armor',
		subtype: 'head',
		description: 'A reinforced helmet with built-in optical enhancers. Pure Forgewalker engineering.',
		rarity: 'epic',
		armor: 8,
		vigorBonus: 2,
		ingenuityBonus: 2,
		levelRequirement: 15,
		value: 450,
		sellValue: 150,
		lore: 'See clearer, think sharper, survive longer. The Union way.',
		iconPath: '/items/armor/forgewalker-helm.png',
		stackable: false
	},
	{
		name: 'Forgewalker\'s Plate',
		type: 'armor',
		subtype: 'chest',
		description: 'Heavy plate armor incorporating ancient alloys and modern engineering.',
		rarity: 'epic',
		armor: 18,
		vigorBonus: 4,
		ingenuityBonus: 2,
		levelRequirement: 15,
		vigorRequirement: 10,
		value: 680,
		sellValue: 226,
		lore: 'Forged in the hottest fires, cooled with the tears of progress.',
		iconPath: '/items/armor/forgewalker-plate.png',
		stackable: false
	},
	{
		name: 'Forgewalker\'s Greaves',
		type: 'armor',
		subtype: 'legs',
		description: 'Mechanically-assisted leg armor. Provides both protection and enhanced mobility.',
		rarity: 'epic',
		armor: 14,
		vigorBonus: 3,
		ingenuityBonus: 2,
		levelRequirement: 15,
		value: 520,
		sellValue: 173,
		lore: 'Why choose between protection and speed when you can have both?',
		iconPath: '/items/armor/forgewalker-greaves.png',
		stackable: false
	},
	{
		name: 'Forgewalker\'s Gauntlets',
		type: 'armor',
		subtype: 'hands',
		description: 'Power-assisted gauntlets that enhance grip strength and precision.',
		rarity: 'epic',
		armor: 6,
		vigorBonus: 2,
		ingenuityBonus: 3,
		finesseBonus: 1,
		levelRequirement: 15,
		value: 420,
		sellValue: 140,
		lore: 'The hands that rebuilt the world.',
		iconPath: '/items/armor/forgewalker-gauntlets.png',
		stackable: false
	},
	{
		name: 'Forgewalker\'s Sabatons',
		type: 'armor',
		subtype: 'feet',
		description: 'Heavy boots with shock-absorbing soles. March through anything.',
		rarity: 'epic',
		armor: 7,
		vigorBonus: 3,
		ingenuityBonus: 1,
		levelRequirement: 15,
		value: 400,
		sellValue: 133,
		lore: 'Step by step, we rebuild. Step by step, we endure.',
		iconPath: '/items/armor/forgewalker-sabatons.png',
		stackable: false
	}
];

// ============================================================================
// ACCESSORIES
// ============================================================================

export const accessories: NewItem[] = [
	// ===== AMULETS =====
	{
		name: 'Signal Resonator',
		type: 'accessory',
		subtype: 'amulet',
		description: 'An amulet that amplifies connection to signal-based relics.',
		rarity: 'rare',
		syncBonus: 3,
		levelRequirement: 8,
		syncRequirement: 4,
		value: 320,
		sellValue: 106,
		lore: 'Worn by signal-priests of the old world. Now, just another treasure for scavengers.',
		iconPath: '/items/accessories/signal-resonator.png',
		stackable: false
	},
	{
		name: 'Ash Ward',
		type: 'accessory',
		subtype: 'amulet',
		description: 'A protective charm that wards against corruption and decay.',
		rarity: 'uncommon',
		nerveBonus: 2,
		vigorBonus: 1,
		levelRequirement: 6,
		value: 180,
		sellValue: 60,
		lore: 'The ash remembers. This ward helps you forget.',
		iconPath: '/items/accessories/ash-ward.png',
		stackable: false
	},
	{
		name: 'Wanderer\'s Luck Charm',
		type: 'accessory',
		subtype: 'amulet',
		description: 'A simple charm said to bring good fortune to travelers.',
		rarity: 'common',
		guileBonus: 1,
		finesseBonus: 1,
		levelRequirement: 3,
		value: 60,
		sellValue: 20,
		lore: 'Luck is just preparation meeting opportunity. But a little extra help never hurts.',
		iconPath: '/items/accessories/luck-charm.png',
		stackable: false
	},

	// ===== RINGS =====
	{
		name: 'Band of Vigor',
		type: 'accessory',
		subtype: 'ring',
		description: 'A sturdy iron ring that enhances physical endurance.',
		rarity: 'uncommon',
		vigorBonus: 2,
		levelRequirement: 5,
		value: 140,
		sellValue: 46,
		lore: 'Forged for warriors who refuse to fall.',
		iconPath: '/items/accessories/vigor-ring.png',
		stackable: false
	},
	{
		name: 'Ring of Guile',
		type: 'accessory',
		subtype: 'ring',
		description: 'A slim ring that enhances the wearer\'s cunning and deception.',
		rarity: 'uncommon',
		guileBonus: 2,
		finesseBonus: 1,
		levelRequirement: 6,
		value: 160,
		sellValue: 53,
		lore: 'The best lies are the ones people want to believe.',
		iconPath: '/items/accessories/guile-ring.png',
		stackable: false
	},
	{
		name: 'Sync Enhancer Ring',
		type: 'accessory',
		subtype: 'ring',
		description: 'A relic-tech ring that boosts connection to divine circuitry.',
		rarity: 'rare',
		syncBonus: 2,
		ingenuityBonus: 1,
		levelRequirement: 10,
		syncRequirement: 5,
		value: 340,
		sellValue: 113,
		lore: 'Plug in, tune up, sync out.',
		iconPath: '/items/accessories/sync-ring.png',
		stackable: false
	},
	{
		name: 'Presence Band',
		type: 'accessory',
		subtype: 'ring',
		description: 'An ornate ring that commands respect and attention.',
		rarity: 'rare',
		presenceBonus: 3,
		levelRequirement: 9,
		value: 300,
		sellValue: 100,
		lore: 'Authority is not given. It is taken.',
		iconPath: '/items/accessories/presence-ring.png',
		stackable: false
	},

	// ===== TRINKETS =====
	{
		name: 'Ancient Compass',
		type: 'accessory',
		subtype: 'trinket',
		description: 'A compass that points toward concentrations of relic energy.',
		rarity: 'rare',
		ingenuityBonus: 2,
		syncBonus: 1,
		levelRequirement: 8,
		value: 280,
		sellValue: 93,
		lore: 'Not all who wander are lost. But this helps anyway.',
		iconPath: '/items/accessories/compass.png',
		stackable: false
	},
	{
		name: 'Emergency Beacon',
		type: 'accessory',
		subtype: 'trinket',
		description: 'A personal distress beacon. Might summon help. Might summon trouble.',
		rarity: 'uncommon',
		nerveBonus: 1,
		syncBonus: 1,
		levelRequirement: 5,
		value: 150,
		sellValue: 50,
		usable: true,
		lore: 'Press once for aid. Press twice for regret.',
		iconPath: '/items/accessories/beacon.png',
		stackable: false
	},
	{
		name: 'Lucky Coin',
		type: 'accessory',
		subtype: 'trinket',
		description: 'A coin with suspiciously good outcomes. Just a coincidence... probably.',
		rarity: 'common',
		guileBonus: 1,
		levelRequirement: 1,
		value: 50,
		sellValue: 16,
		lore: 'Heads you win, tails they lose.',
		iconPath: '/items/accessories/lucky-coin.png',
		stackable: false
	}
];

// ============================================================================
// RELICS (Special Items)
// ============================================================================

export const relics: NewItem[] = [
	{
		name: 'Corelight Fragment',
		type: 'relic',
		subtype: 'divine',
		description: 'A shard of pure Corelight energy. Pulses with divine power and possibility.',
		rarity: 'legendary',
		syncBonus: 5,
		nerveBonus: 3,
		presenceBonus: 2,
		levelRequirement: 20,
		syncRequirement: 8,
		value: 2000,
		sellValue: 666,
		usable: true,
		lore: 'A fragment of creation itself. Handle with reverence—or terror.',
		iconPath: '/items/relics/corelight-fragment.png',
		stackable: false
	},
	{
		name: 'Corrupted Circuit',
		type: 'relic',
		subtype: 'corrupted',
		description: 'A piece of divine circuitry twisted by dark energy. Dangerous, but incredibly powerful.',
		rarity: 'epic',
		syncBonus: 4,
		guileBonus: 3,
		nerveBonus: -2,
		levelRequirement: 15,
		syncRequirement: 6,
		value: 800,
		sellValue: 266,
		usable: true,
		lore: 'Power always has a price. This one demands your sanity.',
		iconPath: '/items/relics/corrupted-circuit.png',
		stackable: false
	},
	{
		name: 'Signal Amplifier',
		type: 'relic',
		subtype: 'tech',
		description: 'A Forgewalker device that amplifies Sync-based abilities.',
		rarity: 'rare',
		syncBonus: 3,
		ingenuityBonus: 2,
		levelRequirement: 12,
		syncRequirement: 5,
		ingenuityRequirement: 6,
		value: 650,
		sellValue: 216,
		usable: true,
		lore: 'Turn it up to eleven. What could go wrong?',
		iconPath: '/items/relics/signal-amplifier.png',
		stackable: false
	},
	{
		name: 'Memory Core',
		type: 'relic',
		subtype: 'data',
		description: 'An intact data core from the old world. Contains vast knowledge—if you can access it.',
		rarity: 'epic',
		ingenuityBonus: 4,
		syncBonus: 2,
		levelRequirement: 14,
		ingenuityRequirement: 8,
		syncRequirement: 4,
		value: 900,
		sellValue: 300,
		usable: true,
		lore: 'The past whispers its secrets. Do you dare to listen?',
		iconPath: '/items/relics/memory-core.png',
		stackable: false
	},
	{
		name: 'Divine Capacitor',
		type: 'relic',
		subtype: 'divine',
		description: 'Stores and releases bursts of divine energy. Highly unstable.',
		rarity: 'legendary',
		syncBonus: 4,
		vigorBonus: 2,
		nerveBonus: 2,
		levelRequirement: 18,
		syncRequirement: 7,
		value: 1800,
		sellValue: 600,
		usable: true,
		lore: 'Bottled lightning. Captured divinity. Contained catastrophe.',
		iconPath: '/items/relics/divine-capacitor.png',
		stackable: false
	}
];

// ============================================================================
// CONSUMABLES
// ============================================================================

export const consumables: NewItem[] = [
	{
		name: 'Healing Salve',
		type: 'consumable',
		subtype: 'healing',
		description: 'A thick greenish paste made from rare herbs. Restores health when applied.',
		rarity: 'common',
		hpRestore: 50,
		usable: true,
		consumable: true,
		value: 25,
		sellValue: 8,
		stackable: true,
		maxStack: 10,
		lore: 'It smells terrible and stings worse. But it works.',
		iconPath: '/items/consumables/healing-salve.png'
	},
	{
		name: 'Greater Healing Potion',
		type: 'consumable',
		subtype: 'healing',
		description: 'A powerful restorative brew that rapidly heals wounds.',
		rarity: 'uncommon',
		hpRestore: 100,
		usable: true,
		consumable: true,
		value: 60,
		sellValue: 20,
		stackable: true,
		maxStack: 5,
		lore: 'Tastes like liquid sunshine. Probably isn\'t.',
		iconPath: '/items/consumables/greater-healing.png'
	},
	{
		name: 'Ration Pack',
		type: 'consumable',
		subtype: 'food',
		description: 'Preserved food wrapped in oiled cloth. Not appetizing, but sustaining.',
		rarity: 'common',
		hpRestore: 25,
		usable: true,
		consumable: true,
		value: 10,
		sellValue: 3,
		stackable: true,
		maxStack: 20,
		lore: 'Survival doesn\'t taste good. It just tastes like more.',
		iconPath: '/items/consumables/ration.png'
	},
	{
		name: 'Corruption Cleanser',
		type: 'consumable',
		subtype: 'remedy',
		description: 'Purges corruption from the body. Painful, but necessary.',
		rarity: 'rare',
		usable: true,
		consumable: true,
		value: 120,
		sellValue: 40,
		stackable: true,
		maxStack: 5,
		lore: 'The cure is almost as bad as the disease. Almost.',
		iconPath: '/items/consumables/cleanser.png'
	},
	{
		name: 'Sync Booster',
		type: 'consumable',
		subtype: 'enhancement',
		description: 'Temporarily enhances connection to divine circuitry.',
		rarity: 'uncommon',
		syncBonus: 2, // Temporary boost
		usable: true,
		consumable: true,
		value: 80,
		sellValue: 26,
		stackable: true,
		maxStack: 5,
		lore: 'Plug in, power up, burn out. The cycle continues.',
		iconPath: '/items/consumables/sync-booster.png'
	}
];

// ============================================================================
// QUEST ITEMS
// ============================================================================

export const questItems: NewItem[] = [
	{
		name: 'Signal Beacon',
		type: 'quest',
		subtype: 'key',
		description: 'A small device that pulses with faint blue light. It responds to your Sync attribute.',
		rarity: 'uncommon',
		value: 0,
		sellValue: 0,
		stackable: false,
		lore: 'The beacon that started it all. Where will it lead you?',
		iconPath: '/items/quest/signal-beacon.png'
	},
	{
		name: 'Conclave Seal',
		type: 'quest',
		subtype: 'token',
		description: 'An official seal of the Cinderlight Conclave. Grants access to restricted areas.',
		rarity: 'rare',
		value: 0,
		sellValue: 0,
		stackable: false,
		lore: 'Faith opens doors. This seal opens the rest.',
		iconPath: '/items/quest/conclave-seal.png'
	},
	{
		name: 'Forgewalker Union Badge',
		type: 'quest',
		subtype: 'token',
		description: 'Marks you as a member of the Forgewalkers Union.',
		rarity: 'rare',
		value: 0,
		sellValue: 0,
		stackable: false,
		lore: 'Progress through unity. Unity through progress.',
		iconPath: '/items/quest/union-badge.png'
	},
	{
		name: 'Encrypted Data Chip',
		type: 'quest',
		subtype: 'data',
		description: 'Contains encrypted information. You need the right equipment to read it.',
		rarity: 'uncommon',
		value: 0,
		sellValue: 0,
		stackable: true,
		maxStack: 10,
		lore: 'Secrets within secrets. Mysteries within mysteries.',
		iconPath: '/items/quest/data-chip.png'
	}
];

// ============================================================================
// EXPORT ALL ITEMS
// ============================================================================

export const allItems: NewItem[] = [
	...weapons,
	...scavengerSet,
	...conclaveSet,
	...forgewalkerSet,
	...accessories,
	...relics,
	...consumables,
	...questItems
];

console.log(`📦 Total items defined: ${allItems.length}`);
