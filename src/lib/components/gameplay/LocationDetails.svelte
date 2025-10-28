<script lang="ts">
	export let selectedLocation: { name: string; description: string };

	function close() {
		const event = new CustomEvent('close', { bubbles: true });
		dispatchEvent(event);
	}
</script>

<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
	<div class="bg-surface-800 text-surface-100 w-80 rounded p-4">
		<h2 class="text-xl font-bold">{selectedLocation.name}</h2>
		<p>{selectedLocation.description}</p>
		<div class="mt-4">
			<button class="btn btn-primary" on:click={close}>Close</button>
		</div>
	</div>
</div>
