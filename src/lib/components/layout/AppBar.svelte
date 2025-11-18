<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
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

<header class="bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-700">
	<div class="container mx-auto px-4 h-16 flex items-center justify-between">
		<!-- Logo/Title -->
		<div class="text-primary-500 dark:text-primary-400 text-2xl font-bold font-heading">
			<a href="/" class="hover:text-primary-600 dark:hover:text-primary-300 transition-colors">The Corelight Fall</a>
		</div>

		<!-- Navigation Links -->
		<nav class="hidden md:flex items-center gap-2">
			<a href="/" class="hover:preset-glass-primary px-3 py-2 rounded-lg transition-all">Home</a>
			<a href="/about" class="hover:preset-glass-primary px-3 py-2 rounded-lg transition-all">About</a>
			<a href="/features" class="hover:preset-glass-primary px-3 py-2 rounded-lg transition-all">Features</a>
			<a href="/blog" class="hover:preset-glass-primary px-3 py-2 rounded-lg transition-all">Blog</a>
		</nav>

		<!-- User Menu / Auth Buttons -->
		<div class="flex items-center gap-3">
			<LightSwitch />
			{#if userData}
				<div class="relative">
					<button
						class="preset-glass flex items-center gap-2 rounded-lg px-3 py-2"
						onclick={() => (isUserMenuEnabled = !isUserMenuEnabled)}
						aria-label="User menu"
					>
						<img
							src={`https://picsum.photos/seed/${userData.id}/120/120`}
							alt="Profile"
							class="size-8 rounded-full"
						/>
						<span>{userData.username}</span>
						<ChevronDown class="size-4" />
					</button>
					{#if isUserMenuEnabled}
						<div
							class="card preset-glass bg-surface-50 dark:bg-surface-900 absolute right-0 mt-2 w-48 shadow-xl z-50"
							transition:slide
						>
							<a href="/game/profile" class="block px-4 py-2 hover:preset-glass-primary rounded-t-lg">Profile</a>
							<button onclick={handleLogout} class="block w-full px-4 py-2 text-left hover:preset-glass-primary rounded-b-lg">Logout</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/auth/login" class="btn preset-glass-primary flex items-center gap-2">Login</a>
				<a href="/auth/register" class="btn preset-glass-secondary flex items-center gap-2">Register</a>
			{/if}
		</div>
	</div>
</header>






