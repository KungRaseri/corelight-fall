<script lang="ts">
	import type { CharacterItemWithDetails } from '$lib/types/CharacterItemWithDetails';

	interface Props {
		inventory: CharacterItemWithDetails[];
	}

	let { inventory }: Props = $props();

	function selectItem(item: CharacterItemWithDetails) {
		const event = new CustomEvent('itemSelected', { detail: item, bubbles: true });
		dispatchEvent(event);
	}

	function handleKey(event: KeyboardEvent, item: CharacterItemWithDetails) {
		if (event.key === 'Enter' || event.key === ' ') {
			selectItem(item);
		}
	}
</script>

<div class="grid grid-cols-3 gap-4 p-4">
	{#each inventory as item}
		<button
			type="button"
			class="bg-surface-700 dark:bg-surface-800 hover:bg-surface-600 dark:hover:bg-surface-700 cursor-pointer rounded p-3"
			aria-label={`Select ${item.name}`}
			onclick={() => selectItem(item)}
			onkeydown={(event) => handleKey(event, item)}
		>
			<h3 class="text-center text-lg font-bold">{item.name}</h3>
			<p class="text-center">Quantity: {item.quantity}</p>
			<p class="text-center text-sm">{item.type ?? 'Unknown'}</p>
		</button>
	{/each}
</div>
