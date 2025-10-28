<script lang="ts">
	import type { CharacterItemWithDetails } from '$lib/types/CharacterItemWithDetails';

	export let selectedItem: CharacterItemWithDetails;

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
	<div class="bg-surface-800 text-surface-100 w-80 rounded p-4">
		<h2 class="text-xl font-bold">{selectedItem.name}</h2>
		<p>Quantity: {selectedItem.quantity}</p>
		<p>Type: {selectedItem.type ?? 'Unknown'}</p>
		<p>Description: {selectedItem.description ?? 'No description available'}</p>
		<div class="mt-4 flex gap-2">
			<button class="btn btn-primary" on:click={useItem}>Use</button>
			<button class="btn btn-danger" on:click={dropItem}>Drop</button>
			<button class="btn btn-secondary" on:click={close}>Close</button>
		</div>
	</div>
</div>
