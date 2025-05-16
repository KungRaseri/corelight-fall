import type { User } from "$lib/server/db/types";

export type SafeUser = Omit<User, 'passwordHash'>;