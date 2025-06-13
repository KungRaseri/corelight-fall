<script lang="ts">
	import IconGitBranch from '@lucide/svelte/icons/git-branch';
	import { Handle } from '@xyflow/svelte';
	export let data: any;
</script>

<div class="rounded-lg shadow bg-gradient-to-br from-amber-400/80 to-amber-700/80 border-2 border-amber-300 px-4 py-2 min-w-[120px] text-center text-surface-900-100 dark:text-surface-100-900">
	<Handle type="target" position="left" />
	<div class="font-semibold text-base flex items-center justify-center gap-2">
		<span>
			<IconGitBranch size={16} class="text-amber-300" />
		</span>
		{data.label}
	</div>
	<Handle type="source" position="right" />
</div>
