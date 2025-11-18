<script lang="ts">
	const { item, onEquip } = $props();
</script>

<button class="bg-surface-200 dark:bg-surface-800 rounded border p-2" onclick={onEquip}>
	<h4 class="font-semibold">{item.name}</h4>
	<p class="text-sm">{item.description}</p>
	<p class="text-xs">Quantity: {item.quantity}</p>
</button>






