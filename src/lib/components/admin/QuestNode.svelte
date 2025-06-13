<script lang="ts">
	import IconFlag from '@lucide/svelte/icons/flag';
	import IconStar from '@lucide/svelte/icons/star';
	import { Handle } from '@xyflow/svelte';
	export let data: any;
</script>

<div class="rounded-lg shadow bg-gradient-to-br from-emerald-400/80 to-emerald-700/80 border-2 border-emerald-300 px-4 py-2 min-w-[120px] text-center text-surface-900-100 dark:text-surface-100-900">
	<Handle type="target" position="left" />
	<div class="font-bold text-lg flex items-center justify-center gap-2">
		<span>
			{#if data.isMain}
				<IconStar size={18} class="text-amber-300" />
			{:else}
				<IconFlag size={18} class="text-emerald-300" />
			{/if}
		</span>
		{data.label}
	</div>
	{#if data.isMain}
		<div class="text-xs text-amber-400 font-semibold">Main Quest</div>
	{/if}
	<Handle type="source" position="right" />
</div>
