<script lang="ts">
	import InventoryHeader from '$lib/components/InventoryHeader.svelte';
	import ItemGrid from '$lib/components/ItemGrid.svelte';
	import ItemDetails from '$lib/components/ItemDetails.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { PlayerItemWithDetails } from '$lib/types/PlayerItemWithDetails';

	let inventory: PlayerItemWithDetails[] = [];
	let selectedItem: PlayerItemWithDetails | null = null;

	onMount(() => {
		inventory = page.data?.inventory || [];
	});

	function handleSelect(event: CustomEvent<PlayerItemWithDetails>) {
		selectedItem = event.detail;
	}

	function closeDetails() {
		selectedItem = null;
	}
</script>

<div class="p-6">
	<InventoryHeader itemCount={inventory.length} />
	<ItemGrid {inventory} on:itemSelected={handleSelect} />
	{#if selectedItem}
		<ItemDetails {selectedItem} on:close={closeDetails} />
	{/if}
</div>
