// PlayerItemWithDetails.ts
export type PlayerItemWithDetails = {
    id: number;
    itemId: number;
    quantity: number;
    name: string;
    type: string | null;
    description: string | null;
};
