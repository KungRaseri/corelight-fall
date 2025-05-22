import type { Choice } from "$lib/server/db/types";

export type ChoiceFormData = Omit<Choice, 'id' | 'encounterId'> & {
    id: number | null;
    encounterId: number | null;
}