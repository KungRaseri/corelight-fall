<script lang="ts">
	const { item, slot, onUnequip } = $props();

	const emptySlotText = 'Empty';
</script>

<div class="bg-surface-200 dark:bg-surface-800 rounded border p-2">
	<h4 class="font-semibold capitalize">{slot}</h4>
	{#if item}
		<div class="text-center">
			<span>{item.name}</span>
			<p class="text-sm">{item.description}</p>
			<button class="btn preset-filled-error px-1 py-0.5 text-xs" onclick={onUnequip}>Unequip</button>
		</div>
	{:else}
		<div class="text-center text-gray-500">{emptySlotText}</div>
	{/if}
</div>






