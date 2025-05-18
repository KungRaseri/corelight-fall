<script lang="ts">
	import { characterAttributes } from '$lib/stores/character';
	import type { CharacterAttribute, Attribute } from '$lib/server/db/types';
	import Info from '@lucide/svelte/icons/info';

	let attributes: { attribute: Attribute; characterAttribute: CharacterAttribute }[] = [];
	characterAttributes.subscribe((value) => (attributes = value));

	// Example: category icon and color mapping
	const categoryMap: Record<string, { icon: typeof Info; color: string; label: string }> = {
		Physical: { icon: Info, color: 'text-red-400', label: 'Physical' },
		Mental: { icon: Info, color: 'text-blue-400', label: 'Mental' },
		Social: { icon: Info, color: 'text-green-400', label: 'Social' }
		// Add more categories as needed
	};
</script>

<div class="bg-surface-800 rounded-md p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl font-bold tracking-wide">Character Attributes</h2>
	{#if attributes.length > 0}
		<table class="w-full border-separate border-spacing-y-2 text-left">
			<thead>
				<tr>
					<th class="px-2 py-1 text-sm font-semibold text-gray-300">Attribute</th>
					<th class="px-2 py-1 text-sm font-semibold text-gray-300">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each attributes as { attribute, characterAttribute }, i}
					<tr class={i % 2 === 0 ? 'bg-surface-700' : 'bg-surface-800'}>
						<td class="text-primary-400 flex items-center gap-2 px-2 py-1 font-bold">
							{attribute.name}
							<span class="group relative">
								<Info class="h-4 w-4 cursor-pointer text-gray-400" />
								<span
									class="bg-surface-900 absolute left-1/2 z-10 hidden w-48 -translate-x-1/2 rounded px-2 py-1 text-xs text-gray-200 shadow group-hover:block"
								>
									{attribute.description}
								</span>
							</span>
						</td>
						<td class="px-2 py-1 font-mono text-lg">{characterAttribute.value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="text-center text-gray-400">No attributes available.</p>
	{/if}
</div>
