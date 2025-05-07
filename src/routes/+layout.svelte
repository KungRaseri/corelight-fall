<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte';

	// Icons
	import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
	import IconGames from '@lucide/svelte/icons/gamepad';
	import IconMenu from '@lucide/svelte/icons/menu';
	import IconSettings from '@lucide/svelte/icons/settings';
	import { slide } from 'svelte/transition';
	import { redirect } from '@sveltejs/kit';

	// State
	let sidebarExpanded = $state(true);
	let isUserMenuEnabled = $state(false);

	import { page } from '$app/state';

	let { children } = $props();
	import { player, setPlayer, clearPlayer } from '$lib/stores/player';
	import type { Player } from '$lib/server/db/schema';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';

	// Subscribe to player store
	let playerData = $state<Player | null>(null);

	// Set player data on page load
	$effect(() => {
		if (page.data?.player) {
			setPlayer(page.data.player);
		}
	});

	$effect(() => {
		const unsubscribe = player.subscribe((value) => {
			playerData = value;
		});

		return unsubscribe;
	});

	const toaster = createToaster();

	// Function to handle logout
	async function handleLogout() {
		try {
			const response = await fetch('/auth/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				toaster.success({
					title: 'Logged Out',
					description: 'You have successfully logged out.'
				});

				// Update UI without reloading the page
				clearPlayer();

				setTimeout(
					() =>
						goto('/', {
							invalidateAll: true
						}),
					1000
				);
			} else {
				const result = await response.json();
				toaster.error({
					title: 'Error',
					description: result.message || 'Failed to log out. Please try again.'
				});
			}
		} catch (error) {
			toaster.error({
				title: 'Network Error',
				description: 'Could not reach the server.'
			});
		}
	}
</script>

<div class="bg-surface-950 text-surface-100 font-base min-h-screen transition-all">
	<!-- Sidebar (desktop) -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<Navigation.Rail expanded={sidebarExpanded}>
			{#snippet header()}
				<Navigation.Tile
					onclick={() => (sidebarExpanded = !sidebarExpanded)}
					title="Toggle Menu Width"
				>
					<IconMenu />
				</Navigation.Tile>
			{/snippet}

			{#snippet tiles()}
				<Navigation.Tile labelExpanded="Dashboard" href="/">
					<IconDashboard />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Game" href="/game">
					<IconGames />
				</Navigation.Tile>
			{/snippet}

			{#snippet footer()}
				<Navigation.Tile labelExpanded="Settings" href="/settings">
					<IconSettings />
				</Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
	</div>

	<!-- Content wrapper -->
	<div class={sidebarExpanded ? 'lg:pl-60' : 'lg:pl-24'}>
		<!-- AppBar -->
		<div class="bg-surface-900 text-surface-100 border-surface-700 border-b shadow-lg">
			<AppBar>
				{#snippet lead()}
					<div class="font-heading text-primary-400 ml-5 text-lg">
						<a href="/">The Corelight Fall</a>
					</div>
				{/snippet}

				{#snippet trail()}
					<div class="flex items-center gap-4 px-4">
						{#if !playerData}
							<a href="/auth/login" class="btn btn-sm btn-secondary">Login / Register</a>
						{:else}
							<div class="relative">
								<!-- Profile button -->
								<button
									type="button"
									class="bg-surface-800 hover:bg-surface-700 flex items-center gap-2 rounded p-2"
									onclick={() => (isUserMenuEnabled = !isUserMenuEnabled)}
								>
									<img
										class="size-8 rounded-full"
										src={`https://picsum.photos/seed/${playerData.id}/120/120`}
										alt="Profile"
									/>
									<span>{playerData.username}</span>
									<ChevronDown />
								</button>

								<!-- User menu -->
								{#if isUserMenuEnabled}
									<div
										class="bg-surface-800 ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black"
										transition:slide
									>
										<a href="/game/profile" class="text-surface-100 block px-4 py-2 text-sm"
											>Profile</a
										>
										<button
											class="text-surface-100 hover:bg-surface-700 block w-full px-4 py-2 text-left text-sm"
											onclick={handleLogout}
										>
											Log Out
										</button>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/snippet}
			</AppBar>
		</div>

		<!-- Main content -->
		<main class="py-10">
			<div class="px-4 sm:px-6 lg:px-8">
				{@render children()}
			</div>
		</main>

		<!-- Footer -->
		<Footer />
	</div>

	<!-- Mobile Nav -->
	<div class="border-surface-700 bg-surface-900 sticky bottom-0 border-t lg:hidden">
		<Navigation.Bar>
			<Navigation.Tile labelExpanded="Dashboard" href="/">
				<IconDashboard />
			</Navigation.Tile>
			<Navigation.Tile labelExpanded="Game" href="/game">
				<IconGames />
			</Navigation.Tile>
		</Navigation.Bar>
	</div>

	<Toaster {toaster} />
</div>
