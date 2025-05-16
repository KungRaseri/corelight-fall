<script lang="ts">
	import {
		characterItems,
		characterEquipment,
		equipItem,
		unequipItem
	} from '$lib/stores/inventory';
	import InventoryItem from '$lib/components/InventoryItem.svelte';
	import EquipmentSlot from '$lib/components/EquipmentSlot.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();

	// Handle Equip
	async function handleEquip(itemId: number, slot: string) {
		console.log(`Equipping item ${itemId} to slot ${slot}`);
		const result = await equipItem(itemId, slot);

		if (!result.error) {
			characterEquipment.update((current) => {
				const itemToEquip = $characterItems.find((item) => item.itemId === itemId);
				if (itemToEquip) {
					return { ...current, [slot]: itemToEquip };
				}
				return current;
			});
			characterItems.update((current) => current.filter((item) => item.itemId !== itemId));
		} else {
			console.error(`Failed to equip item ${itemId} to ${slot}`);
		}
	}

	// Handle Unequip
	async function handleUnequip(slot: string) {
		console.log(`Unequipping item from slot ${slot}`);
		const result = await unequipItem(slot);

		if (!result.error) {
			const unequippedItem = $characterEquipment[slot];
			characterEquipment.update((current) => ({
				...current,
				[slot]: null
			}));
			if (unequippedItem) {
				characterItems.update((current) => [...current, { ...unequippedItem, slot: null }]);
			}
		} else {
			console.error(`Failed to unequip item from ${slot}`);
		}
	}

	// Populate the items and equipment on mount
	onMount(() => {
		if (data.inventory) {
			const backpackItems = data.inventory.filter((item) => item.slot == null);
			const equippedItems = data.inventory
				.filter((item) => item.slot != null)
				.reduce(
					(acc, item) => {
						if (item.slot) acc[item.slot] = item;
						return acc;
					},
					{} as Record<string, CharacterItemWithDetails | null>
				);

			characterItems.set([...backpackItems]);
			characterEquipment.set({ ...equippedItems });
		}
	});
</script>

<div class="space-y-4 p-4">
	<h2 class="text-3xl font-bold">Inventory</h2>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Equipment Section -->
		<div>
			<h3 class="text-xl font-semibold">Equipped Items</h3>
			<div class="grid grid-cols-4 gap-4">
				{#each data.inventorySlots as slot}
					<EquipmentSlot
						{slot}
						item={$characterEquipment[slot]}
						onUnequip={() => handleUnequip(slot)}
					/>
				{/each}
			</div>
		</div>

		<!-- Inventory Section -->
		<div>
			<h3 class="text-xl font-semibold">Backpack</h3>
			<div class="grid grid-cols-4 gap-2">
				{#each $characterItems.filter((item) => item.slot == null) as item (item.itemId)}
					<InventoryItem {item} onEquip={() => handleEquip(item.itemId, item.type ?? 'unknown')} />
				{/each}
			</div>
		</div>
	</div>
</div>
