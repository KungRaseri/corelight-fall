<script lang="ts">
	import { goto } from '$app/navigation';
	import LightSwitch from '../ui/LightSwitch.svelte';
	import { clearUser } from '$lib/stores/user';

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearUser();
		goto('/');
	}
</script>

<header class="bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-700">
	<div class="container mx-auto px-4 h-16 flex items-center justify-between">
		<div class="text-primary-400 text-lg font-semibold">Admin - The Corelight Fall</div>
		<div class="flex items-center gap-3">
			<LightSwitch />
			<button class="btn preset-glass-primary px-2 py-1 text-sm" onclick={handleLogout}>Logout</button>
		</div>
	</div>
</header>






