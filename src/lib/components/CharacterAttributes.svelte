<script lang="ts">
	import { characterAttributes } from '$lib/stores/characterAttributes';
	import type { CharacterAttribute, Attribute } from '$lib/server/db/types';

	let attributes: { attribute: Attribute; characterAttribute: CharacterAttribute }[] = [];
	characterAttributes.subscribe((value) => (attributes = value));
</script>

<div class="bg-surface-800 rounded-md p-4 shadow-md">
	<h2 class="mb-2 text-xl font-semibold">Player Attributes</h2>
	{#if attributes.length > 0}
		<ul class="list-disc space-y-1 pl-6">
			{#each attributes as { attribute, characterAttribute }}
				<li>
					<span class="font-bold">{attribute.name}:</span>
					{characterAttribute.value}
					<span class="text-gray-400">({attribute.description})</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No attributes available.</p>
	{/if}
</div>
