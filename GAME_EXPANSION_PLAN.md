# Corelight Fall - Game Expansion Plan

## Overview
This document outlines the planned expansions to gameplay mechanics, content, and systems.

## Phase 1: Enhanced Equipment & Inventory System

### Equipment System Enhancements
**Database Schema Additions:**
- Item stats (damage, armor, attribute bonuses)
- Rarity tiers (Common, Uncommon, Rare, Epic, Legendary)
- Requirements (level, attributes)
- Durability system (optional)

**New Item Types:**
- Weapons: One-handed, Two-handed, Ranged
- Armor: Head, Chest, Legs, Hands, Feet
- Accessories: Amulet, Ring (2 slots), Trinket
- Relics: Special items with Sync-based abilities

**Equipment Slots:**
```
Main Hand, Off Hand, Head, Chest, Legs, Hands, Feet
Amulet, Ring 1, Ring 2, Trinket, Relic
```

### New Items to Create
**Weapons (15 items):**
- Starter: Rusty Iron Sword, Worn Dagger, Cracked Bow
- Mid-tier: Forgewalker's Blade, Signal Spear, Corruption Edge
- High-tier: Corelight Shard Sword, Relic Hammer, Void Bow

**Armor Sets (3 sets, 5 pieces each = 15 items):**
- Scavenger's Set (Light armor, +Finesse, +Guile)
- Conclave Devotee Set (Medium armor, +Nerve, +Presence)
- Forgewalker Set (Heavy armor, +Vigor, +Ingenuity)

**Accessories (10 items):**
- Amulets: Signal Resonator, Ash Ward, Luck Charm
- Rings: Band of Vigor, Guile Ring, Sync Enhancer
- Trinkets: Ancient Compass, Emergency Beacon, Lucky Coin

**Relics (5 unique items):**
- Corelight Fragment: Pulses with divine energy
- Corrupted Circuit: Dangerous but powerful
- Signal Amplifier: Boosts Sync abilities
- Memory Core: Contains ancient knowledge
- Divine Capacitor: Stores and releases energy

## Phase 2: New Storylines & Quests

### New Storyline: "Shadows of the Forgewalkers"
**Theme:** Industrial espionage and faction conflict
**Acts:** 3 acts, 8 quests total, 25+ encounters

**Arc Overview:**
1. **Act 1: Recruitment** - Join the Forgewalkers
2. **Act 2: The Heist** - Steal Conclave secrets
3. **Act 3: Consequences** - Deal with the aftermath

**Branching Paths:**
- Loyalty path (stay with Forgewalkers)
- Betrayal path (double-cross them)
- Neutral path (play both sides)

### New Storyline: "The Verdant Corruption"
**Theme:** Nature vs technology, environmental horror
**Acts:** 2 acts, 6 quests, 20+ encounters

**Arc Overview:**
1. **Act 1: Discovery** - Investigate strange growth
2. **Act 2: Cleansing** - Stop the corruption or embrace it

### Side Quests (5 standalone quests)
1. **The Lost Caravan** - Rescue mission, moral choices
2. **Relic Hunter's Challenge** - Timed dungeon crawl
3. **The Ash Prophet** - Mystery and investigation
4. **Bounty Board** - Repeatable combat encounters
5. **The Signal Network** - Tech puzzle quest

## Phase 3: New Gameplay Mechanics

### Status Effects System
**Positive Effects:**
- Blessed: +10% XP gain
- Fortified: +20% max HP
- Focused: Skill checks +2
- Synced: Relic abilities enhanced

**Negative Effects:**
- Corrupted: -1 to all attribute checks
- Exhausted: -50% XP gain
- Wounded: -25% current HP
- Disconnected: Cannot use Relics

**Implementation:**
- Add status_effect table
- Add character_status_effect junction table
- Add duration/expiry system
- Add effect stacking rules

### Crafting System
**Crafting Stations:**
- Forge (weapons, heavy armor)
- Workbench (light armor, accessories)
- Relic Altar (relics, special items)

**Recipe System:**
- Recipes found through exploration
- Require materials + gold + skill level
- Chance of quality improvement (10% rare, 1% epic)

**Material Types:**
- Scrap Metal (common)
- Ancient Alloys (uncommon)
- Corelight Shards (rare)
- Divine Circuitry (epic)

### Combat Enhancements
**Action Types:**
- Basic Attack (uses weapon)
- Special Ability (uses Sync or attributes)
- Defend (reduces damage next turn)
- Use Item (consumable)

**Enemy Types:**
- Corrupted Wildlife
- Rogue Automatons
- Hostile Scavengers
- Faction Soldiers
- Boss Encounters (unique mechanics)

## Phase 4: Enhanced Character Progression

### Ability/Skill System
**Skill Trees (one per attribute):**
- Vigor Tree: Tank abilities, HP regen
- Nerve Tree: Resist corruption, mental fortitude
- Finesse Tree: Critical hits, evasion
- Ingenuity Tree: Relic mastery, crafting bonuses
- Presence Tree: Faction influence, persuasion
- Guile Tree: Stealth, deception, theft
- Sync Tree: Divine powers, relic abilities

**Ability Points:**
- Earn 1 point per level
- Spend on skill tree nodes
- Some nodes require prerequisites
- Respec available (costly)

### Perk System
**Perks unlocked at:**
- Level 5, 10, 15, 20, 25, 30 (max)
- Choose 1 from 3 options each time
- Examples:
  - Relic Affinity: +2 Sync
  - Combat Veteran: +10% damage
  - Silver Tongue: Better prices, easier persuasion
  - Scavenger: Find more loot
  - Quick Learner: +15% XP

### Prestige System (Endgame)
**Unlock at level 30:**
- Reset to level 1 (keep one prestige token)
- Prestige tokens grant permanent bonuses
- Max 5 prestige levels
- Each prestige unlocks unique cosmetics

## Phase 5: World & Exploration

### New Regions (3 regions)
1. **The Rust Fields** - Industrial wasteland
2. **Corelight Crater** - Ground zero of the Fall
3. **The Undercity** - Ruins beneath civilization

### Dynamic Events
- Random encounters while traveling
- Faction wars affect regions
- Weather impacts gameplay
- Time of day matters

### Achievements System
**Categories:**
- Story (complete storylines)
- Combat (kill counts, boss defeats)
- Exploration (discover locations)
- Collection (find all items)
- Social (faction reputation)
- Challenge (special conditions)

**Rewards:**
- XP bonuses
- Unique titles
- Cosmetic unlocks
- Gold rewards

## Implementation Priority

### Sprint 1 (Current - Equipment System)
- [ ] Enhance item schema with stats
- [ ] Create 45 new items (weapons, armor, accessories, relics)
- [ ] Update inventory UI to show equipped items
- [ ] Implement equipment effects on character stats

### Sprint 2 (Storylines & Content)
- [ ] Create "Shadows of the Forgewalkers" storyline (8 quests, 25 encounters)
- [ ] Create "The Verdant Corruption" storyline (6 quests, 20 encounters)
- [ ] Add 5 side quests
- [ ] Write all choice text and outcomes

### Sprint 3 (Gameplay Mechanics)
- [ ] Implement status effects system
- [ ] Create crafting system
- [ ] Add combat enhancements
- [ ] Create enemy types and encounters

### Sprint 4 (Progression Systems)
- [ ] Design and implement skill trees
- [ ] Create perk system
- [ ] Add achievement tracking
- [ ] Implement prestige system

### Sprint 5 (World Expansion)
- [ ] Create 3 new regions
- [ ] Add dynamic events
- [ ] Implement achievement rewards
- [ ] Polish and balance

## Notes
- All new content should follow existing lore
- Maintain dark fantasy tone
- Ensure all choices have meaningful consequences
- Balance difficulty curve carefully
- Test extensively before releasing
