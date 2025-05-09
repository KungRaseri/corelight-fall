<script lang="ts">
    import type { PlayerItemWithDetails } from '$lib/types/PlayerItemWithDetails';

    export let inventory: PlayerItemWithDetails[];

    function selectItem(item: PlayerItemWithDetails) {
        const event = new CustomEvent('itemSelected', { detail: item, bubbles: true });
        dispatchEvent(event);
    }
</script>

<div class="grid grid-cols-3 gap-4 p-4">
    {#each inventory as item}
        <div class="bg-surface-700 p-3 rounded cursor-pointer hover:bg-surface-600"
             on:click={() => selectItem(item)}>
            <h3 class="text-center text-lg font-bold">{item.name}</h3>
            <p class="text-center">Quantity: {item.quantity}</p>
            <p class="text-center text-sm">{item.type ?? 'Unknown'}</p>
        </div>
    {/each}
</div>
