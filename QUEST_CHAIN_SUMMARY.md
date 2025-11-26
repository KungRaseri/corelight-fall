# Quest Chain Setup - Summary

## ✅ What We've Accomplished

### 1. Database Schema Enhancement

Added two new fields to the `quest` table to support quest chains:

- **`prerequisiteQuestIds`**: JSONB array of quest IDs that must ALL be completed (AND logic)
- **`alternativePrerequisiteQuestIds`**: JSONB array where ANY completion unlocks the quest (OR logic)

This allows for:
- Linear quest chains (Quest 2 requires Quest 1)
- Path convergence (Main arc unlocked by Scavenger OR Seeker finale)

### 2. Quest Chain Data Seeded

Created comprehensive quest chains for both starting paths:

**Scavenger Path (5 quests)**:
1. Prove Your Worth → 2. Earning Respect → 3. The Fragment Market → 4. The Deep Salvage → 5. Attack on the Forge

**Seeker Path (5 quests)**:
1. Sanctuary → 2. Fragment Resonance → 3. The Heretic's Text → 4. Trial of Faith → 5. The Swarm

**Convergence (1 quest)**:
- The Crossroads (requires EITHER Scavenger finale OR Seeker finale)

**Main Arc (2+ quests)**:
- The Calling → Journey to the Crater → (more to come)

### 3. Service Layer Methods

Added to `QuestService`:

- **`isQuestAvailable(questId, characterId)`** - Checks if prerequisites are met
- **`getAvailableQuests(characterId)`** - Returns all quests player can start now
- **`getQuestChainInfo(storylineId?)`** - Gets quest chain structure for visualization

### 4. Documentation

Created `QUEST_CHAIN_SYSTEM.md` with:
- System architecture
- Quest chain diagrams
- Implementation details
- Testing scenarios
- Integration examples

## 🎯 How It Works

### Path Divergence (Act 1)

```
         START
           |
    Player Choice
           |
    ┌──────┴──────┐
    |             |
Scavenger     Seeker
  Path         Path
    |             |
  5 Quests    5 Quests
    |             |
    └──────┬──────┘
           |
```

### Path Convergence (Act 2+)

```
Scavenger Finale OR Seeker Finale
           |
    The Crossroads
           |
     Main Arc
     (Shared)
```

## 📝 Key Features

1. **Flexible Prerequisites**: Supports both AND logic (all required) and OR logic (any one works)
2. **Database-Driven**: Quest chains defined in data, not hardcoded
3. **Path Support**: Divergent paths that later converge
4. **Player-Friendly**: Can show which quests unlock which
5. **Scalable**: Easy to add new chains and dependencies

## 🧪 Testing the System

To test the quest chain system:

```typescript
// Get available quests for a character
const questService = new QuestService();
const available = await questService.getAvailableQuests(characterId);

// Check if specific quest is available
const canStart = await questService.isQuestAvailable(questId, characterId);

// View quest chain structure
const chain = await questService.getQuestChainInfo(storylineId);
```

## 🔄 Integration with Frontend

The quest system is ready to integrate with the `QuestList.svelte` component:

1. Fetch available quests using `getAvailableQuests()`
2. Show locked quests with prerequisite info
3. Display quest chains visually with arrows/lines
4. Update UI when quests are completed

## 📊 Current Database State

After running `npm run db:seed`:

- ✅ 2 Starting storylines (Scavenger, Seeker)
- ✅ 10 Act 1 quests (5 per path)
- ✅ 1 Convergence quest (The Crossroads)
- ✅ 2 Main Arc quests (The Calling, Journey to the Crater)
- ✅ All prerequisite chains properly configured

## 🚀 Next Steps

The quest chain system is fully functional! You can now:

1. **Build quest UI** showing available/locked quests
2. **Add more quest chains** for Acts 3-4
3. **Create side quest branches** with optional prerequisites
4. **Implement visual quest tree** in the Journal page
5. **Add quest notifications** when new quests unlock

## 🎮 Player Experience

From the player perspective:

1. Start game → Choose path (Scavenger or Seeker)
2. Complete 5 linear quests in chosen path
3. Both paths lead to "The Crossroads" (convergence)
4. All players join shared Main Arc (Acts 2-4)
5. Quest progression is gated by prerequisites
6. UI shows which quests are available vs locked

## ✨ Example Flow

**Scavenger Player**:
```
Start → Prove Your Worth (available)
Complete → Earning Respect (unlocked)
Complete → Fragment Market (unlocked)
Complete → Deep Salvage (unlocked)
Complete → Attack on Forge (unlocked)
Complete → The Crossroads (unlocked via Scavenger finale)
Complete → The Calling (unlocked)
```

**Seeker Player**:
```
Start → Sanctuary (available)
Complete → Fragment Resonance (unlocked)
Complete → Heretic's Text (unlocked)
Complete → Trial of Faith (unlocked)
Complete → The Swarm (unlocked)
Complete → The Crossroads (unlocked via Seeker finale)
Complete → The Calling (unlocked)
```

Both players end up in the same place (Main Arc) but took different journeys to get there!

---

**Status**: ✅ Quest chains fully implemented and ready for gameplay integration!
