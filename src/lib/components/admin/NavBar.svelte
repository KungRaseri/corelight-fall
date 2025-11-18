<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';
	import LightSwitch from '../ui/LightSwitch.svelte';
	import { clearUser } from '$lib/stores/user';

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearUser();
		goto('/');
	}
</script>

<AppBar>
	{#snippet lead()}
		<div class="text-primary-400 ml-5 text-lg">Admin - The Corelight Fall</div>
	{/snippet}
	{#snippet trail()}
		<LightSwitch />
		<button class="btn preset-outlined-primary-500 px-2 py-1 text-sm" onclick={handleLogout}>Logout</button>
	{/snippet}
</AppBar>






