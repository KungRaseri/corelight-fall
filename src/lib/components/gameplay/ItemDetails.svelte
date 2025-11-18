<script lang="ts">
	import type { CharacterItemWithDetails } from '$lib/types/CharacterItemWithDetails';

	interface Props {
		selectedItem: CharacterItemWithDetails;
	}

	let { selectedItem }: Props = $props();

	function close() {
		const event = new CustomEvent('close', { bubbles: true });
		dispatchEvent(event);
	}

	function useItem() {
		alert(`Using ${selectedItem.name}`);
	}

	function dropItem() {
		alert(`Dropped ${selectedItem.name}`);
	}
</script>

<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
	<div class="bg-surface-800 dark:bg-surface-900 text-surface-100 dark:text-surface-50 w-80 rounded p-4">
		<h2 class="text-xl font-bold">{selectedItem.name}</h2>
		<p>Quantity: {selectedItem.quantity}</p>
		<p>Type: {selectedItem.type ?? 'Unknown'}</p>
		<p>Description: {selectedItem.description ?? 'No description available'}</p>
		<div class="mt-4 flex gap-2">
			<button class="btn preset-filled-primary-500" onclick={useItem}>Use</button>
			<button class="btn btn-danger" onclick={dropItem}>Drop</button>
			<button class="btn preset-tonal-secondary" onclick={close}>Close</button>
		</div>
	</div>
</div>






