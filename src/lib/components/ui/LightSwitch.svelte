<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let checked = $state(false);
	let mounted = $state(false);

	// Initialize from localStorage only on the client
	onMount(() => {
		if (browser) {
			const mode = localStorage.getItem('mode') || 'light';
			checked = mode === 'dark';
			mounted = true;
		}
	});

	function onCheckedChange(event: { checked: boolean }) {
		if (!browser) return;

		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.dataset.mode = mode;
		localStorage.setItem('mode', mode);
		checked = event.checked;
	}
</script>

{#if mounted}
	<Switch {checked} {onCheckedChange}>
		<Switch.Control>
			<Switch.Thumb>
				<Switch.Context>
					{#snippet children(switch_)}
						{#if switch_().checked}
							<Moon class="size-4" />
						{:else}
							<Sun class="size-4" />
						{/if}
					{/snippet}
				</Switch.Context>
			</Switch.Thumb>
		</Switch.Control>
		<Switch.HiddenInput />
	</Switch>
{:else}
	<!-- Placeholder during SSR to prevent layout shift -->
	<div
		class="bg-surface-200 dark:bg-surface-700 flex h-8 w-14 items-center justify-start rounded-full p-1"
	>
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-white">
			<Sun class="size-4 text-yellow-500" />
		</div>
	</div>
{/if}
