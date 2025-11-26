# Quest Chain System - The Corelight Fall

## Overview

The quest chain system ensures that quests unlock in the proper sequence, supporting:
- **Linear progression** within each path (Scavenger or Seeker)
- **Path divergence** at Act 1 (two separate quest chains)
- **Path convergence** at Act 2 (both paths merge into main arc)
- **Flexible prerequisites** using AND/OR logic

## Database Schema

### Quest Table Fields

```typescript
{
  id: number;
  storylineId: number;  // Which storyline this quest belongs to
  title: string;
  order: number;        // Suggested completion order
  isMain: boolean;      // Main story quest vs side quest
  
  // NEW: Quest prerequisite system
  prerequisiteQuestIds: number[];              // AND logic - ALL must be complete
  alternativePrerequisiteQuestIds: number[];   // OR logic - ANY can be complete
  
  // Rewards
  xpReward: number;
  goldReward: number;
}
```

### Prerequisite Logic

```typescript
// Quest is available if:
// 1. ALL prerequisiteQuestIds are completed (AND logic)
// 2. AND at least ONE alternativePrerequisiteQuestIds is completed (OR logic)
// 3. OR if both arrays are empty (starting quest)

function isQuestAvailable(quest, completedQuestIds) {
  // Check AND prerequisites
  if (quest.prerequisiteQuestIds.length > 0) {
    if (!quest.prerequisiteQuestIds.every(id => completedQuestIds.has(id))) {
      return false;
    }
  }
  
  // Check OR prerequisites
  if (quest.alternativePrerequisiteQuestIds.length > 0) {
    if (!quest.alternativePrerequisiteQuestIds.some(id => completedQuestIds.has(id))) {
      return false;
    }
  }
  
  return true;
}
```

## Quest Chain Structure

### Act 1: Two Divergent Paths

```
PROLOGUE (Linear - All Players)
└─ Shards of Hope (Scavenger intro)
└─ Echoes of the Luminarchs (Seeker intro)

                    PLAYER CHOICE
                          |
        ┌─────────────────┴─────────────────┐
        |                                   |
 SCAVENGER PATH                       SEEKER PATH
 (Storyline 12)                      (Storyline 13)
        |                                   |
    Quest 1                             Quest 1
    "Prove Your Worth"                  "Sanctuary"
    [No prerequisites]                  [No prerequisites]
        |                                   |
    Quest 2                             Quest 2
    "Earning Respect"                   "Fragment Resonance"
    [Requires: Quest 1]                 [Requires: Quest 1]
        |                                   |
    Quest 3                             Quest 3
    "The Fragment Market"               "The Heretic's Text"
    [Requires: Quest 2]                 [Requires: Quest 2]
        |                                   |
    Quest 4                             Quest 4
    "The Deep Salvage"                  "Trial of Faith"
    [Requires: Quest 3]                 [Requires: Quest 3]
        |                                   |
    Quest 5 (FINALE)                    Quest 5 (FINALE)
    "Attack on the Forge"               "The Swarm"
    [Requires: Quest 4]                 [Requires: Quest 4]
        |                                   |
        └─────────────────┬─────────────────┘
                          |
                   CONVERGENCE POINT
```

### Act 2: Path Convergence

```
                   CONVERGENCE QUEST
                   "The Crossroads"
                   [Requires: Scavenger Quest 5 OR Seeker Quest 5]
                   (alternativePrerequisiteQuestIds: [scav5, seek5])
                          |
                          |
                   MAIN ARC BEGINS
                   (Storyline 14)
                          |
                      Quest 1
                   "The Calling"
                   [Requires: The Crossroads]
                          |
                      Quest 2
                   "Journey to the Crater"
                   [Requires: The Calling]
                          |
                    (More quests...)
                          |
                    ACT 3, ACT 4...
```

## Implementation Details

### 1. Scavenger Path Quest Chain

**Quest IDs** (from seed): Varies by database

**Chain Structure**:
```typescript
{
  "Prove Your Worth": {
    prerequisiteQuestIds: [],
    alternativePrerequisiteQuestIds: []
  },
  "Earning Respect": {
    prerequisiteQuestIds: [proveYourWorthId],
    alternativePrerequisiteQuestIds: []
  },
  "The Fragment Market": {
    prerequisiteQuestIds: [earningRespectId],
    alternativePrerequisiteQuestIds: []
  },
  "The Deep Salvage": {
    prerequisiteQuestIds: [fragmentMarketId],
    alternativePrerequisiteQuestIds: []
  },
  "Attack on the Forge": {
    prerequisiteQuestIds: [deepSalvageId],
    alternativePrerequisiteQuestIds: []
  }
}
```

### 2. Seeker Path Quest Chain

**Quest IDs** (from seed): Varies by database

**Chain Structure**:
```typescript
{
  "Sanctuary": {
    prerequisiteQuestIds: [],
    alternativePrerequisiteQuestIds: []
  },
  "Fragment Resonance": {
    prerequisiteQuestIds: [sanctuaryId],
    alternativePrerequisiteQuestIds: []
  },
  "The Heretic's Text": {
    prerequisiteQuestIds: [fragmentResonanceId],
    alternativePrerequisiteQuestIds: []
  },
  "Trial of Faith": {
    prerequisiteQuestIds: [hereticTextId],
    alternativePrerequisiteQuestIds: []
  },
  "The Swarm": {
    prerequisiteQuestIds: [trialOfFaithId],
    alternativePrerequisiteQuestIds: []
  }
}
```

### 3. Convergence Quest

**The Crossroads** - First shared quest

```typescript
{
  "The Crossroads": {
    prerequisiteQuestIds: [],  // Empty!
    alternativePrerequisiteQuestIds: [
      attackOnForgeId,  // Scavenger finale
      theSwarmId        // Seeker finale
    ]
  }
}
```

**Key Feature**: Uses `alternativePrerequisiteQuestIds` to accept EITHER path completion.

### 4. Main Arc Quest Chain

**Shared progression after convergence**

```typescript
{
  "The Calling": {
    prerequisiteQuestIds: [theCrossroadsId],
    alternativePrerequisiteQuestIds: []
  },
  "Journey to the Crater": {
    prerequisiteQuestIds: [theCallingId],
    alternativePrerequisiteQuestIds: []
  }
  // More quests follow...
}
```

## Service Layer Methods

### QuestService.isQuestAvailable()

Checks if a quest is available for a character:

```typescript
async isQuestAvailable(questId: number, characterId: number): Promise<boolean>
```

**Algorithm**:
1. Fetch quest data and prerequisites
2. Get all completed quests for character
3. Check AND prerequisites (all must be complete)
4. Check OR prerequisites (at least one must be complete)
5. Return true if all conditions met

### QuestService.getAvailableQuests()

Gets all quests a character can start right now:

```typescript
async getAvailableQuests(characterId: number)
```

**Returns**: Array of quests where:
- Prerequisites are met
- Quest not already started/completed
- Quest is active

### QuestService.getQuestChainInfo()

Gets quest chain structure for visualization:

```typescript
async getQuestChainInfo(storylineId?: number)
```

**Returns**: Array of quests with their prerequisite relationships

## Frontend Integration

### Quest List Component

The `QuestList.svelte` component should:

1. **Filter by availability**:
```typescript
const availableQuests = quests.filter(q => checkPrerequisites(q, completedQuests));
```

2. **Show locked quests** with requirements:
```svelte
{#if !isAvailable}
  <div class="badge preset-tonal-warning">
    Requires: {getPrerequisiteNames(quest)}
  </div>
{/if}
```

3. **Display quest chains** visually:
```svelte
<div class="quest-chain">
  {#each sortedQuests as quest, i}
    <QuestCard {quest} isLocked={!isAvailable(quest)} />
    {#if i < sortedQuests.length - 1}
      <ArrowDown />
    {/if}
  {/each}
</div>
```

## Testing Quest Chains

### Scenario 1: Scavenger Path Player

```typescript
// Character completes Scavenger path
await completeQuest(characterId, "Prove Your Worth");
// ✓ "Earning Respect" now available
await completeQuest(characterId, "Earning Respect");
// ✓ "The Fragment Market" now available
await completeQuest(characterId, "The Fragment Market");
// ✓ "The Deep Salvage" now available
await completeQuest(characterId, "The Deep Salvage");
// ✓ "Attack on the Forge" now available
await completeQuest(characterId, "Attack on the Forge");
// ✓ "The Crossroads" now available (path finale complete)
```

### Scenario 2: Seeker Path Player

```typescript
// Character completes Seeker path
await completeQuest(characterId, "Sanctuary");
await completeQuest(characterId, "Fragment Resonance");
await completeQuest(characterId, "The Heretic's Text");
await completeQuest(characterId, "Trial of Faith");
await completeQuest(characterId, "The Swarm");
// ✓ "The Crossroads" now available (path finale complete)
```

### Scenario 3: Path Convergence

```typescript
// After either path finale:
const available = await questService.getAvailableQuests(characterId);
// Should include "The Crossroads"

await completeQuest(characterId, "The Crossroads");
// ✓ "The Calling" now available (both paths converged)
```

## Benefits of This System

✅ **Flexible Branching** - Supports divergent paths that merge
✅ **Clear Dependencies** - Easy to understand quest relationships
✅ **Database-Driven** - No hardcoded quest chains in code
✅ **Player-Friendly** - Shows what's needed to unlock quests
✅ **Scalable** - Easy to add new quest chains
✅ **Testable** - Clear logic for prerequisite checking

## Future Enhancements

### Potential Additions

1. **Level Requirements**:
```typescript
minLevel: number;  // Character must be this level
```

2. **Faction Requirements**:
```typescript
factionRequirements: {
  factionId: number;
  minReputation: number;
}[];
```

3. **Item Requirements**:
```typescript
requiredItems: number[];  // Must have these items
```

4. **Time-Gated Quests**:
```typescript
availableAfter: Date;  // Quest unlocks on specific date
```

5. **Mutually Exclusive Quests**:
```typescript
conflictingQuestIds: number[];  // Can't do this if you did that
```

## Conclusion

The quest chain system provides a robust foundation for branching narratives that converge, supporting the core story structure where players choose between Scavenger and Seeker paths in Act 1, then unite for the shared main arc in Act 2+.

The use of `prerequisiteQuestIds` (AND logic) and `alternativePrerequisiteQuestIds` (OR logic) allows for flexible quest unlocking that supports both linear progression and path convergence.
