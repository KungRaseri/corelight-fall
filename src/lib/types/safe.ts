import type { Player } from "$lib/server/db/types";

export type SafePlayer = Omit<Player, 'passwordHash'>;