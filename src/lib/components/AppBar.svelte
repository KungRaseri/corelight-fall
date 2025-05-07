<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { player, clearPlayer } from '$lib/stores/player';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import type { Player } from '$lib/server/db/schema';

	let isUserMenuEnabled = $state(false);
	let playerData = $state<Player | null>(null);

	$effect(() => {
		const unsubscribe = player.subscribe((value) => {
			playerData = value;
		});
		return unsubscribe;
	});

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearPlayer();
		goto('/');
	}
</script>

<AppBar>
	<div class="flex w-full items-center justify-between">
		<div class="ml-5 text-2xl font-bold text-primary-400">
			<a href="/">The Corelight Fall</a>
		</div>

		<div class="flex items-center gap-4">
			<LightSwitch />
			{#if playerData}
				<div class="relative">
					<button
						class="bg-surface-800 hover:bg-surface-700 flex items-center gap-2 rounded p-2"
						onclick={() => (isUserMenuEnabled = !isUserMenuEnabled)}
					>
						<img
							src={`https://picsum.photos/seed/${playerData.id}/120/120`}
							alt="Profile"
							class="size-8 rounded-full"
						/>
						<span>{playerData.username}</span>
						<ChevronDown />
					</button>
					{#if isUserMenuEnabled}
						<div
							class="bg-surface-800 absolute right-0 mt-2 w-48 rounded-md shadow-lg"
							transition:slide
						>
							<a href="/game/profile" class="block px-4 py-2">Profile</a>
							<button onclick={handleLogout} class="block w-full px-4 py-2 text-left">Logout</button
							>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/auth/login" class="btn btn-primary">Login</a>
				<a href="/auth/register" class="btn btn-secondary">Register</a>
			{/if}
		</div>
	</div>
</AppBar>
