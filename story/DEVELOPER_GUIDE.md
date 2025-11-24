# Developer Quick Reference - Story Implementation

## Story File Navigation

### Essential Reading Order for Developers

1. **START HERE**: `story/README.md` - Overview and structure
2. **WORLD**: `story/01-world/world-introduction.md` - Setting, factions, lore
3. **OPENING**: `story/02-prologue/awakening.md` - Tutorial and player intro
4. **PATHS**: 
   - `story/03-starting-paths/path-comparison.md` - Path differences
   - `story/03-starting-paths/path-scavenger/act1-survival.md` - Forgewalker route
   - `story/03-starting-paths/path-seeker/act1-discovery.md` - Conclave route
5. **MAIN ARC**: `story/04-main-arc/arc-overview.md` - Acts 2-4 convergence
6. **SUMMARY**: `story/SPRINT2_STORY_COMPLETE.md` - Implementation roadmap

---

## Quick Quest Reference

### Prologue Quests (Required)
- **Buried** - Wake up sequence, movement tutorial
- **The Fragment** - Find Navigator Fragment, visions
- **First Blood** - Combat tutorial vs Hollowed
- **The Stranger's Choice** - Moral choice: help Lynn or not
- **Two Paths Diverge** - Meet Ravenwood, choose path

### Scavenger's Path Quests
- **Welcome to the Forge** - Meet Torren, intro to Forgewalkers
- **The First Test** - Salvage run, Lynn encounter
- **Earning Your Place** - Return and shopping
- **The Deep Salvage** - Team mission, rival encounter, vault fragment
- **The Magistrate's Offer** - Venn wants fragment
- **Attack on the Forge** - Defense mission, siege

### Seeker's Path Quests
- **Sanctuary** - Arrival, meet Aria, tour
- **The Fragment Resonates** - Shared vision with Aria
- **Questions and Faith** - Meet Callum, fragment tests
- **The Heretic's Text** - Restricted documents reveal truth
- **Trial of Faith** - Daven confrontation, doctrine debate
- **The Sacred Relic** - Mission to GODFORGE lab
- **The Swarm** - Escape sequence, fragment power

### Main Arc Quests (Act 2)
- **The Calling** - Signal activates all fragments
- **The Journey Begins** - Travel to Ashlands
- **The Convergence** - Faction meeting, shared vision
- **Fractured Alliances** - Choose new alignment
- **The Fragment Hunt** - Locate 5 additional fragments
- **Voices in the Light** - Elena encounter, merge preview

---

## Key NPCs by Location

### The Forge (Forgewalker Settlement)
- **Torren Blackforge** - Mentor, lead engineer
- **Magistrate Venn** - Leader, pragmatic, complex
- **Kess "Sparkplug"** - Rival/friend, young inventor
- **Old Copper** - Merchant, ancient Drifter
- **Guard Captain Mira** - Gate security
- **Lynn** - Optional: injured scavenger (if saved)
- **Cade** - Rival crew leader

### The Sanctum (Conclave Outpost)
- **Sister Aria Lightbringer** - Mentor, cleric, romance option
- **High Luminary Daven** - Leader, hides truth
- **Brother Callum** - Scholar, seeker of truth
- **Brother Thomas** - Gate guardian, welcoming

### Neutral/Wandering
- **Ravenwood** - Free Drifter, introduces player to factions
- **Elena** - Navigator Fragment holder, merging
- **Luminarch Aurelia** - Via visions, helping prevent merge

### Later Game
- **Grove Mother Thera** - Verdant Circle leader
- **Various fragment holders** - 12 total NPCs with fragments

---

## Critical Story Variables

### Player State
```typescript
{
  // Identity & Progress
  playerName: string,
  startingPath: 'scavenger' | 'seeker' | 'drifter',
  currentAct: number, // 1-4
  level: number,
  
  // Core Items
  hasNavigatorFragment: boolean,
  fragmentCount: number,
  fragmentsDestroyed: number,
  
  // Major Choices
  helpedLynn: boolean,
  showedFragmentToTorren: boolean,
  soldFragmentToVenn: boolean,
  readHereticTexts: boolean,
  usedFragmentPower: boolean,
  
  // Reputation (-100 to 100)
  reputationConclave: number,
  reputationForgewalker: number,
  reputationVerdant: number,
  reputationDrifter: number,
  
  // Relationships (0-100)
  ariaRelationship: number,
  ariaRomance: boolean,
  torrenRespect: number,
  callumTrust: number,
  ravenwood Friendship: number,
  
  // Knowledge Unlocks
  knowsTruthOfFall: boolean,
  knowsAboutMerge: boolean,
  hasFailsafeKnowledge: boolean,
  contactedAurelia: boolean,
  
  // Final Arc
  mergeStance: 'support' | 'oppose' | 'compromise' | 'undecided',
  finalChoice: null | 'merge_partial' | 'merge_full' | 'destroy' | 'compromise' | 'refuse'
}
```

---

## Dialogue Choice Pattern

All major dialogues should offer 3-4 choices representing different approaches:

**Standard Pattern**:
1. **Aggressive/Direct** - Confrontational, demands answers
2. **Diplomatic/Kind** - Seeks understanding, builds bridges
3. **Deceptive/Clever** - Uses guile, hidden motives
4. **Curious/Neutral** - Information gathering, non-committal

**Attribute Checks**:
- Aggressive → Nerve check
- Diplomatic → Presence check
- Deceptive → Guile check
- Physical options → Vigor/Finesse check
- Technical options → Ingenuity check

---

## Branching Logic Examples

### Lynn Encounter (Prologue)
```typescript
if (helpedLynn) {
  // Lynn survives
  // Becomes merchant with 10% discount
  // Positive moral weight
  rewards.gold -= 50; // Less loot this run
  reputation.general += 5;
} else if (tookPack) {
  // Lynn dies
  // Full loot value
  // Ruthless reputation
  rewards.gold += 100;
  reputation.ruthless = true;
  torrenReaction = "approving";
} else if (partialHelp) {
  // Neutral outcome
  rewards.gold += 50;
  lynn.relationship = "neutral";
}
```

### Fragment Revelation (Act 2)
```typescript
// After vision at Convergence
if (startingPath === 'seeker') {
  aria.response = "conflicted"; // Faith challenged
  aria.questTrigger = "crisis_of_faith";
} else if (startingPath === 'scavenger') {
  torren.response = "pragmatic"; // Confirms tech view
  venn.questTrigger = "exploit_opportunity";
}

// Universal unlock
player.knowsTruthOfFall = true;
```

### Ending Determination
```typescript
function determineAvailableEndings() {
  const endings = [];
  
  if (fragmentCount >= 7) {
    endings.push('merge_partial', 'merge_full');
  }
  
  if (hasFailsafeKnowledge) {
    endings.push('destroy');
  }
  
  if (contactedAurelia && fragmentCount >= 5) {
    endings.push('compromise');
  }
  
  // Always available
  endings.push('refuse');
  
  return endings;
}
```

---

## Combat Encounter Difficulty

### Early Game (Act 1)
- **Weak Hollowed**: HP 20, Damage 5, Easy tutorial enemy
- **Standard Hollowed**: HP 40, Damage 10, Basic combat
- **Corrupted Animal**: HP 30, Damage 8, Fast but weak

### Mid Game (Act 2)
- **Hollowed Scavenger**: HP 60, Damage 15, Uses tactics
- **Corrupted Beast**: HP 80, Damage 20, High damage
- **Rogue Automaton**: HP 50, Damage 12, Resistant to physical

### Late Game (Act 3-4)
- **Hollowed Scientist**: HP 100, Damage 25, Corrupted abilities
- **Fragment Guardian**: HP 150, Damage 30, Special attacks
- **Merged Entity**: HP 200, Damage 35, Boss-tier

### Difficulty Modifiers
- Player path affects starting power level
- Equipment tier multiplies stats
- Companion support adds 30% effectiveness
- Faction bonuses provide situational advantages

---

## Lore Integration Points

### Environmental Storytelling Locations

**Prologue Ruins**:
- Burned journal (player's?)
- Skeleton at workstation
- Pre-Fall family photos
- Emergency broadcast recordings

**GODFORGE Laboratory**:
- Research notes on Luminarch creation
- Ethics committee warnings
- Final day security footage
- Containment breach logs

**Corelight Crater**:
- Blast pattern suggests internal explosion
- Fragments scattered non-randomly
- Temporal anomalies at epicenter
- Echoes of the Sundering moment

**Faction Headquarters**:
- Each has different interpretation of same artifacts
- Conclave preserves, Forgewalkers reverse-engineer
- Same history, different meanings

---

## Testing Checklist

### Story Flow Testing
- [ ] Prologue completes without bugs
- [ ] Both starting paths accessible
- [ ] Path-specific content loads correctly
- [ ] Convergence event triggers properly
- [ ] All endings reachable with valid choices

### Variable Persistence
- [ ] Choices save correctly
- [ ] Relationships track accurately
- [ ] Reputation changes persist
- [ ] Fragment count accurate
- [ ] Companion loyalty states

### Dialogue Trees
- [ ] All choices lead somewhere
- [ ] No dead-end conversations
- [ ] Attribute checks work correctly
- [ ] Consequences appear later
- [ ] NPC reactions consistent with history

### Balance Testing
- [ ] No single path overpowered
- [ ] Both paths equally viable
- [ ] Fragment hunt difficulty appropriate
- [ ] Time limits feel fair
- [ ] Resource scarcity balanced

---

## Implementation Phases

### Phase 1: Database Schema
- Quest table structure
- Dialogue tree storage
- Choice/consequence tracking
- NPC relationship system
- Fragment tracking

### Phase 2: Core Systems
- Quest state machine
- Dialogue parser
- Branching logic engine
- Reputation calculator
- Ending determiner

### Phase 3: Content Entry
- All prologue content
- Act 1 both paths
- NPC dialogues
- Environmental text
- Lore documents

### Phase 4: Integration
- Connect quests to gameplay
- Implement skill checks
- Add combat encounters
- Place loot and items
- Set up triggers

### Phase 5: Polish
- Playtest all paths
- Balance difficulty
- Fix continuity errors
- Add flavor text
- QA pass

---

## Common Pitfalls to Avoid

### ❌ Don't
- Hard-code quest progression
- Use single-state NPCs
- Forget to check prerequisites
- Make choices cosmetic
- Lock players into paths permanently

### ✅ Do
- Use flexible quest states
- Track NPC mood/opinion dynamically
- Check prerequisites before showing options
- Ensure choices have meaningful impact
- Allow path switching at convergence

---

## Quick Reference: File Sizes

Total story documentation: **~105,000 words**

- World Introduction: 11KB
- Prologue: 24KB combined
- Path Comparison: 9KB
- Scavenger Act 1: 15KB
- Seeker Act 1: 16KB
- Main Arc: 14KB
- Documentation: 10KB

**Ready for implementation in game database.**
