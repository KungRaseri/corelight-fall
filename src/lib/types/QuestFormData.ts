import type { Quest } from "$lib/server/db/types";
import type { EncounterFormData } from "./EncounterFormData";

export type QuestFormData = Omit<Quest, 'id' | 'storylineId'> & {
    id: number | null;
    storylineId: number | null;
    encounters?: EncounterFormData[]
}