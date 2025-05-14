type PlayerItemWithDetails = {
    itemId: number,
    playerId: number,
    name: string,
    description: string | null,
    type: string | null,
    slot: string | null,
    quantity: number
}