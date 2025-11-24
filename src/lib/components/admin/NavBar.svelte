<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LightSwitch from '../ui/LightSwitch.svelte';
	import { clearUser } from '$lib/stores/user';
	import { Users, ScrollText, Sword, Settings2, Wrench } from 'lucide-svelte';

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearUser();
		goto('/');
	}

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: Settings2 },
		{ href: '/admin/users', label: 'Users', icon: Users },
		{ href: '/admin/blog', label: 'Blog', icon: ScrollText },
		{ href: '/admin/content', label: 'Content', icon: Sword },
		{ href: '/admin/tools', label: 'Tools', icon: Wrench }
	];

	function isActive(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<header class="bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-700">
	<div class="container mx-auto px-4">
		<!-- Top bar -->
		<div class="h-16 flex items-center justify-between">
			<div class="text-primary-500 dark:text-primary-400 text-lg font-semibold">
				Admin - The Corelight Fall
			</div>
			<div class="flex items-center gap-3">
				<LightSwitch />
				<button class="btn preset-tonal-surface px-3 py-1.5 text-sm flex items-center gap-2" onclick={handleLogout}>
					<span>Logout</span>
				</button>
			</div>
		</div>

		<!-- Navigation tabs -->
		<nav class="flex gap-1 -mb-px">
			{#each navItems as item}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
						{active
							? 'text-primary-500 dark:text-primary-400 border-primary-500 dark:border-primary-400'
							: 'text-surface-600 dark:text-surface-400 border-transparent hover:text-primary-500 dark:hover:text-primary-400 hover:border-surface-300 dark:hover:border-surface-700'}"
				>
					<svelte:component this={item.icon} class="size-4" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</div>
</header>






