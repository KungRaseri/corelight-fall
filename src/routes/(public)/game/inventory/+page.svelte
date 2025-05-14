<script lang="ts">
	import { playerItems, playerEquipment, equipItem, unequipItem } from '$lib/stores/inventory';
	import InventoryItem from '$lib/components/InventoryItem.svelte';
	import EquipmentSlot from '$lib/components/EquipmentSlot.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();

	// Reactive items and equipment states
	let items = $state<PlayerItemWithDetails[]>([]);
	let equipment = $state<Record<string, PlayerItemWithDetails | null>>({});

	// Log changes to verify reactivity
	playerItems.subscribe((value) => {
		items = value;
		console.log('Updated Items:', value);
	});
	playerEquipment.subscribe((value) => {
		equipment = value;
		console.log('Updated Equipment:', value);
	});

	// Handle Equip
	async function handleEquip(itemId: number, slot: string) {
		console.log(`Equipping item ${itemId} to slot ${slot}`);
		const result = await equipItem(itemId, slot);

		if (!result.error) {
			// Update the playerEquipment store
			playerEquipment.update((current) => {
				const itemToEquip = items.find((item) => item.itemId === itemId);
				if (itemToEquip) {
					return { ...current, [slot]: itemToEquip };
				}
				return current;
			});

			// Update the playerItems store
			playerItems.update((current) => {
				return current.map((item) => (item.itemId === itemId ? { ...item, slot } : item));
			});
		} else {
			console.error(`Failed to equip item ${itemId} to ${slot}`);
		}
	}

	// Handle Unequip
	async function handleUnequip(slot: string) {
		console.log(`Unequipping item from slot ${slot}`);
		const result = await unequipItem(slot);

		if (!result.error) {
			const unequippedItem = $playerEquipment[slot];

			// Update the playerEquipment store
			playerEquipment.update((current) => ({
				...current,
				[slot]: null
			}));

			if (unequippedItem) {
				playerItems.update((current) => {
					return current.map((item) =>
						item.itemId === unequippedItem.itemId ? { ...item, slot: null } : item
					);
				});
				console.log(`Unequipped ${unequippedItem.name} from ${slot}`);
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
					{} as Record<string, PlayerItemWithDetails | null>
				);

			playerItems.set([...backpackItems]);
			playerEquipment.set({ ...equippedItems });

			console.log('Loaded Items:', backpackItems);
			console.log('Loaded Equipment:', equippedItems);
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
						item={$playerEquipment[slot]}
						onUnequip={() => handleUnequip(slot)}
					/>
				{/each}
			</div>
		</div>

		<!-- Inventory Section -->
		<div>
			<h3 class="text-xl font-semibold">Backpack</h3>
			<div class="grid grid-cols-4 gap-2">
				{#each $playerItems as item (item.itemId)}
					<InventoryItem {item} onEquip={() => handleEquip(item.itemId, item.type ?? 'unknown')} />
				{/each}
			</div>
		</div>
	</div>
</div>
