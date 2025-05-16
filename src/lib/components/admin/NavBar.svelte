<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';
	import LightSwitch from '../LightSwitch.svelte';
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
		<button class="btn btn-sm btn-outline" onclick={handleLogout}>Logout</button>
	{/snippet}
</AppBar>
