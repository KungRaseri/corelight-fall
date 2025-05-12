<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { player, clearPlayer } from '$lib/stores/player';
	import { goto } from '$app/navigation';
	import LightSwitch from '../LightSwitch.svelte';

	async function handleLogout() {
		await fetch('/auth/logout', { method: 'POST' });
		clearPlayer();
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
