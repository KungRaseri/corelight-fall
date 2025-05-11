import type { Player } from "$lib/server/db/types";
import type { SafePlayer } from "$lib/types/safe";

export function sanitizePlayerData(playerData: Player): SafePlayer {
    const { passwordHash, ...safeData } = playerData

    return safeData
}