import { db } from '../index'
import { player, stat, region, location, faction, playerRole, playerStat, playerAchievement, playerFacility, playerRecipe, playerFaction, playerItem, playerLocation, playerQuest, playerResource, playerStatusEffect, session } from '../schema'

export async function resetDatabase() {
    console.log('🔄 Resetting database...')
    await db.delete(playerAchievement)
    await db.delete(playerFacility)
    await db.delete(playerFaction)
    await db.delete(playerItem)
    await db.delete(playerLocation)
    await db.delete(playerQuest)
    await db.delete(playerRecipe)
    await db.delete(playerResource)
    await db.delete(playerRole)
    await db.delete(playerStat)
    await db.delete(playerStatusEffect)

    await db.delete(stat)
    await db.delete(region)
    await db.delete(location)
    await db.delete(faction)
    await db.delete(session)
    await db.delete(player)
    console.log('✅ Database reset.')
}
