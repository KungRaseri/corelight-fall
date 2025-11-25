# Sprint 3 - Story Systems & Database Enhancement

## Overview

Sprint 3 focuses on implementing the database schema and core systems needed to support the story content created in Sprint 2. This sprint bridges the narrative design with the technical implementation.

**Duration**: 2-3 weeks  
**Status**: 🚀 In Progress  
**Started**: November 24, 2025

---

## Goals

### Primary Objectives

1. ✅ **Enhance Story Schema** - Add missing tables for story implementation
2. ⏳ **Quest System** - Implement quest states, prerequisites, and branching
3. ⏳ **Dialogue System** - Create dialogue trees with choices and consequences
4. ⏳ **Choice Tracking** - Track player decisions and their impacts
5. ⏳ **Relationship System** - NPC relationships and faction reputation
6. ⏳ **Fragment System** - Track Corelight fragments and their properties

### Secondary Objectives

7. ⏳ **Status Effects** - Implement status effect system
8. ⏳ **Companion System** - Track companion loyalty and availability
9. ⏳ **World Events** - Time-based and triggered events
10. ⏳ **Save System Enhancement** - Support complex story states

---

## Database Schema Enhancements

### 1. Story Path System

**New Tables**:

```typescript
// story/path.ts
- id, name, description
- startingLocation, startingFaction
- mentorNpc, firstQuest
- philosophyDescription, gameplayFocus
```

**Purpose**: Track which path player chose (Scavenger, Seeker, Drifter)

---

### 2. Enhanced Quest System

**Existing**: `quest` table  
**Additions Needed**:

```typescript
// story/quest.ts (enhance existing)
- prerequisites: text[] (quest IDs or conditions)
- pathRestriction: 'scavenger' | 'seeker' | 'drifter' | null
- actNumber: integer
- estimatedDuration: integer (minutes)
- moralWeight: integer (-100 to 100)
- category: 'main' | 'side' | 'companion' | 'faction'
```

**New Table**: `quest_objective`

```typescript
- id, questId
- description, type (kill, collect, talk, explore, etc.)
- targetId, targetCount
- isOptional, order
```

**New Table**: `character_quest_state`

```typescript
- id, characterId, questId
- status: 'locked' | 'available' | 'active' | 'completed' | 'failed'
- startedAt, completedAt
- choicesMade: jsonb
- objectivesCompleted: integer[]
```

---

### 3. Dialogue & Conversation System

**New Tables**:

```typescript
// social/dialogue_tree.ts
- id, npcId, questId (optional)
- rootNodeId, title
- availableWhen: jsonb (conditions)

// social/dialogue_node.ts
- id, treeId
- speakerType: 'npc' | 'player' | 'narrator'
- text, mood, animation
- nextNodeId (for linear)
- requiresCheck: jsonb (attribute checks)

// social/dialogue_choice.ts
- id, nodeId
- choiceText, choiceType: 'aggressive' | 'diplomatic' | 'deceptive' | 'curious'
- attributeCheck: jsonb
- skillCheckDifficulty: integer
- nextNodeId
- consequence: jsonb
- flags: text[] (sets story flags)

// social/character_dialogue_history.ts
- id, characterId, dialogueTreeId
- lastNodeId, completedAt
- choicesMade: jsonb
- relationshipImpact: integer
```

---

### 4. Choice & Consequence Tracking

**New Table**: `story_flag`

```typescript
- id, characterId
- flagName: text (e.g., 'helped_lynn', 'sold_fragment_to_venn')
- flagValue: boolean | integer | text
- setAt: timestamp
- questId (optional - which quest set this)
```

**New Table**: `major_choice`

```typescript
- id, name, description
- questId, encounterId
- choiceOptions: jsonb[]
- consequences: jsonb (describes outcomes)
- category: 'moral' | 'strategic' | 'relationship' | 'faction'
```

**New Table**: `character_major_choice`

```typescript
- id, characterId, majorChoiceId
- chosenOption: integer
- chosenAt: timestamp
- outcome: jsonb
```

---

### 5. NPC Relationship System

**New Table**: `npc`

```typescript
- id, name, title
- faction, role
- description, backstory
- personality: jsonb
- currentLocation
- isCompanion, isRomanceable, isMentor
- defaultMood, portrait
```

**New Table**: `character_npc_relationship`

```typescript
- id, characterId, npcId
- relationshipLevel: integer (0-100)
- relationshipStatus: 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'romance' | 'rival' | 'enemy'
- trustLevel: integer (0-100)
- romanceUnlocked: boolean
- loyaltyLevel: integer (0-100) // for companions
- lastInteraction: timestamp
- interactions: jsonb[] (history)
```

---

### 6. Faction Reputation System

**Enhance Existing**: `character_faction` table

```typescript
// social/characterFaction.ts (add columns)
- reputationLevel: integer (-100 to 100)
- reputationTitle: text ('Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Honored', 'Exalted')
- canTrade: boolean
- hasAccessTo: text[] (location IDs)
- completedQuests: integer
- betrayalCount: integer
```

---

### 7. Fragment System

**New Table**: `fragment`

```typescript
- id, name, type: 'navigator' | 'prime' | 'standard' | 'corrupted'
- description, lore
- powerLevel: integer
- currentLocation: text
- foundBy: integer (character_id, nullable)
- isActive: boolean
- abilities: jsonb
- corruptionLevel: integer (0-100)
```

**New Table**: `character_fragment`

```typescript
- id, characterId, fragmentId
- acquiredAt: timestamp
- acquiredHow: text ('found', 'quest', 'trade', 'combat')
- isEquipped: boolean
- attunementLevel: integer (0-100)
- visionsSeen: text[] (vision IDs)
```

**New Table**: `fragment_vision`

```typescript
- id, fragmentId
- title, description
- visionContent: jsonb (scenes)
- triggeredWhen: jsonb (conditions)
- loreUnlocked: text[]
```

---

### 8. Companion System

**New Table**: `companion`

```typescript
- id, npcId
- joinQuest: integer (quest ID when they join)
- leaveQuest: integer (quest ID when they leave, optional)
- combatRole: 'tank' | 'damage' | 'healer' | 'support'
- abilities: jsonb
- equipment: jsonb
- personalQuest: integer (quest ID)
```

**New Table**: `character_companion_state`

```typescript
- id, characterId, companionId
- status: 'available' | 'active' | 'dismissed' | 'left' | 'dead'
- loyaltyLevel: integer (0-100)
- joinedAt, leftAt: timestamp
- personalQuestCompleted: boolean
- canRomance: boolean
- romanceActive: boolean
```

---

### 9. World Events

**New Table**: `world_event`

```typescript
- id, name, description
- eventType: 'timed' | 'triggered' | 'random'
- startCondition: jsonb
- endCondition: jsonb
- effects: jsonb (changes to world state)
- questsUnlocked: integer[]
- questsBlocked: integer[]
- isActive: boolean
```

**New Table**: `character_event_state`

```typescript
- id, characterId, eventId
- hasTriggered: boolean
- triggeredAt: timestamp
- choicesMade: jsonb
- outcome: text
```

---

## Implementation Tasks

### Week 1: Core Schema (Nov 24-30)

- [x] Create Sprint 3 plan
- [ ] Create new schema files for:
  - [ ] `story/path.ts`
  - [ ] `story/questObjective.ts`
  - [ ] `story/characterQuestState.ts`
  - [ ] `social/npc.ts`
  - [ ] `social/characterNpcRelationship.ts`
  - [ ] `social/dialogueTree.ts`
  - [ ] `social/dialogueNode.ts`
  - [ ] `social/dialogueChoice.ts`
  - [ ] `social/characterDialogueHistory.ts`
  - [ ] `story/storyFlag.ts`
  - [ ] `story/majorChoice.ts`
  - [ ] `story/characterMajorChoice.ts`
  - [ ] `gameplay/fragment.ts`
  - [ ] `gameplay/characterFragment.ts`
  - [ ] `gameplay/fragmentVision.ts`
  - [ ] `gameplay/companion.ts`
  - [ ] `gameplay/characterCompanionState.ts`
  - [ ] `world/worldEvent.ts`
  - [ ] `world/characterEventState.ts`
- [ ] Enhance existing `characterFaction` table
- [ ] Create migration script
- [ ] Update schema index exports

### Week 2: API & Services (Dec 1-7)

- [ ] Create quest service:
  - [ ] Quest state management
  - [ ] Prerequisite checking
  - [ ] Objective tracking
  - [ ] Completion logic
- [ ] Create dialogue service:
  - [ ] Tree traversal
  - [ ] Choice validation
  - [ ] Skill check resolution
  - [ ] Consequence application
- [ ] Create relationship service:
  - [ ] NPC relationship updates
  - [ ] Faction reputation changes
  - [ ] Companion loyalty tracking
- [ ] Create fragment service:
  - [ ] Fragment tracking
  - [ ] Vision triggers
  - [ ] Attunement system

### Week 3: Integration & Testing (Dec 8-14)

- [ ] Create story progression service:
  - [ ] Path selection
  - [ ] Act progression
  - [ ] Major choice handling
  - [ ] Ending determination
- [ ] Create save/load enhancements:
  - [ ] Save all story states
  - [ ] Save relationships
  - [ ] Save flags and choices
- [ ] API endpoints:
  - [ ] `/api/story/quests`
  - [ ] `/api/story/dialogue/:treeId`
  - [ ] `/api/story/choice/:choiceId`
  - [ ] `/api/relationships/:npcId`
  - [ ] `/api/fragments`
- [ ] Integration tests
- [ ] Data seeding for prologue content

---

## Data Seeding Priority

### Prologue Content (First Priority)

1. **Path Selection**:
   - Scavenger Path
   - Seeker Path
   - Drifter Path (optional)

2. **NPCs**:
   - Ravenwood (guide)
   - Torren Blackforge (Scavenger mentor)
   - Sister Aria (Seeker mentor)

3. **Quests** (Prologue):
   - Buried
   - The Fragment
   - First Blood
   - Stranger's Choice
   - Two Paths Diverge

4. **Dialogue Trees**:
   - Ravenwood introduction
   - Path choice dialogue
   - Torren first meeting
   - Aria welcome

5. **Major Choices**:
   - Lynn encounter (help/take/partial/mercy)
   - Fragment revelation (show/hide)
   - Path selection

---

## Success Criteria

### Database

✅ All new tables created and migrated  
✅ Relationships properly defined  
✅ Indexes on frequently queried columns  
✅ Seed data for prologue content  

### Services

✅ Quest progression works  
✅ Dialogue trees navigable  
✅ Choices persist and have consequences  
✅ Relationships track correctly  
✅ Fragments can be collected and tracked  

### API

✅ All endpoints functional  
✅ Proper error handling  
✅ TypeScript types generated  
✅ API documented  

### Testing

✅ Unit tests for services  
✅ Integration tests for quest flow  
✅ Prologue playable end-to-end  

---

## Technical Decisions

### JSON vs Normalized Tables

**Using JSONB for**:
- Dialogue choice consequences (flexible structure)
- NPC personalities (varies by NPC)
- Quest prerequisites (complex conditions)
- Fragment abilities (unique per fragment)

**Using Normalized Tables for**:
- Core relationships (character-quest, character-npc)
- Frequently queried data (quest status, reputation)
- Data that needs indexing (flags, choices)

### TypeScript Types

Generate types from schema using Drizzle:
```bash
npm run db:generate
```

All services will use generated types for type safety.

### State Management

- Quest states: Enum-based progression
- Relationship levels: Numeric with thresholds
- Flags: Named boolean/numeric values
- Choices: Historical record with outcomes

---

## Dependencies

### Required

- Drizzle ORM (✅ already installed)
- PostgreSQL (✅ already configured)
- Existing schema structure (✅ in place)

### Nice to Have

- Quest editor UI (future sprint)
- Dialogue tree visualizer (future sprint)
- Relationship graph UI (future sprint)

---

## Risks & Mitigation

### Risk: Schema complexity

**Mitigation**: Start with core tables, iterate

### Risk: Performance with JSONB

**Mitigation**: Index commonly queried JSON paths

### Risk: Data seeding time

**Mitigation**: Automate with TypeScript scripts, focus on prologue first

### Risk: Breaking existing saves

**Mitigation**: Version migrations, provide migration tools

---

## Next Sprint Preview (Sprint 4)

Once Sprint 3 is complete:

1. **Admin UI** for quest/dialogue creation
2. **Game UI** for quest log, dialogue display
3. **Story content entry** for Act 1 both paths
4. **Combat encounters** tied to quests
5. **Companion AI** and battle system

---

## Notes

- Story content from Sprint 2 is in `story/` folder
- Use Developer Guide (`story/DEVELOPER_GUIDE.md`) as reference
- All quest/dialogue data should match story documents
- Focus on **prologue first** for early testing

---

**Let's build the systems that bring the story to life!** 🎮
