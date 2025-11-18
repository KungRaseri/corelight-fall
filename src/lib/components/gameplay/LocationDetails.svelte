<script lang="ts">
	interface Props {
		selectedLocation: { name: string; description?: string | null };
	}

	let { selectedLocation }: Props = $props();

	function close() {
		const event = new CustomEvent('close', { bubbles: true });
		dispatchEvent(event);
	}
</script>

<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
	<div class="bg-surface-800 dark:bg-surface-900 text-surface-100 dark:text-surface-50 w-80 rounded p-4">
		<h2 class="text-xl font-bold">{selectedLocation.name}</h2>
		<p>{selectedLocation.description ?? 'No description available.'}</p>
		<div class="mt-4">
			<button class="btn btn-primary" onclick={close}>Close</button>
		</div>
	</div>
</div>
