import type { DialogChoice } from "./DialogChoice";


export type DialogStep = {
    id: string;
    speaker: string;
    text: string;
    portrait?: string;
    choices?: DialogChoice[];
    next?: string; // id of the next step if no choices
};
