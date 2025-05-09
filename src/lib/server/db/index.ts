import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

// Core
import { player } from './schema/core/player';
import { session } from './schema/core/session';
import { logEntry } from './schema/core/log';

// Gameplay
import { item } from './schema/gameplay/item';
import { playerItem } from './schema/gameplay/playerItem';
import { resource } from './schema/gameplay/resource';
import { playerResource } from './schema/gameplay/playerResource';
import { quest } from './schema/gameplay/quest';
import { playerQuest } from './schema/gameplay/playerQuest';
import { combatEncounter } from './schema/gameplay/combat';
import { enemy } from './schema/gameplay/enemy';
import { stat } from './schema/gameplay/stat';
import { playerStat } from './schema/gameplay/playerStat';
import { statusEffect } from './schema/gameplay/statusEffect';
import { playerStatusEffect } from './schema/gameplay/playerStatusEffect';

// Map
import { location } from './schema/map/location';
import { playerLocation } from './schema/map/playerLocation';
import { region } from './schema/map/region';

// Social
import { faction } from './schema/social/faction';
import { playerFaction } from './schema/social/playerFaction';
import { dialog } from './schema/social/dialog';
import { dialogOption } from './schema/social/dialogOption';

// World
import { facility } from './schema/world/facility';
import { playerFacility } from './schema/world/playerFacility';
import { facilityUpgrade } from './schema/world/facilityUpgrade';
import { recipe } from './schema/world/recipe';
import { playerRecipe } from './schema/world/playerRecipe';
import { achievement } from './schema/world/achievement';
import { playerAchievement } from './schema/world/playerAchievement';
import { calendarEvent } from './schema/world/calendar';
import { worldState } from './schema/world/worldState';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

// Combine all imported tables into a single schema object
const schema = {
    // Core
    player,
    session,
    logEntry,

    // Gameplay
    item,
    playerItem,
    resource,
    playerResource,
    quest,
    playerQuest,
    combatEncounter,
    enemy,
    stat,
    playerStat,
    statusEffect,
    playerStatusEffect,

    // Map
    location,
    playerLocation,
    region,

    // Social
    faction,
    playerFaction,
    dialog,
    dialogOption,

    // World
    facility,
    playerFacility,
    facilityUpgrade,
    recipe,
    playerRecipe,
    achievement,
    playerAchievement,
    calendarEvent,
    worldState,
};

export const db = drizzle(client, { schema });
