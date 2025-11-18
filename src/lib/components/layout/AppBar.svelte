<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import type { SafeUser } from '$lib/types/SafeUser';
	import { clearUser, user } from '$lib/stores/user';
	import LightSwitch from '../ui/LightSwitch.svelte';

	let isUserMenuEnabled = $state(false);
	let userData = $state<SafeUser | null>(null);

	$effect(() => {
		const unsubscribe = user.subscribe((value) => {
			userData = value;
		});

		return unsubscribe;
	});

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearUser();
		goto('/');
	}
</script>

<AppBar>
	{#snippet lead()}
		<div class="text-primary-600-400">
			<a href="/" class="btn btn-link">Home</a>
			<a href="/about" class="btn btn-link">About</a>
			<a href="/features" class="btn btn-link">Features</a>
			<a href="/blog" class="btn btn-link">Blog</a>
		</div>
	{/snippet}
	{#snippet trail()}
		<LightSwitch />
		{#if userData}
			<div class="relative">
				<button
					class="bg-surface-400-600 hover:bg-surface-700 flex items-center gap-2 rounded p-2"
					onclick={() => (isUserMenuEnabled = !isUserMenuEnabled)}
				>
					<img
						src={`https://picsum.photos/seed/${userData.id}/120/120`}
						alt="Profile"
						class="size-8 rounded-full"
					/>
					<span>{userData.username}</span>
					<ChevronDown />
				</button>
				{#if isUserMenuEnabled}
					<div
						class="bg-surface-200-800 text-surface-900-100 absolute right-0 mt-2 w-48 rounded-md shadow-lg"
						transition:slide
					>
						<a href="/game/profile" class="block px-4 py-2">Profile</a>
						<button onclick={handleLogout} class="block w-full px-4 py-2 text-left">Logout</button>
					</div>
				{/if}
			</div>
		{:else}
			<a href="/auth/login" class="btn preset-filled-primary-500">Login</a>
			<a href="/auth/register" class="btn preset-tonal-secondary">Register</a>
		{/if}
	{/snippet}
	{#snippet headline()}
		<div class="text-primary-600-400 ml-5 text-2xl font-bold">
			<a href="/">The Corelight Fall</a>
		</div>
	{/snippet}
</AppBar>






