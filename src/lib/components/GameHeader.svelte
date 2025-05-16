<script lang="ts">
	import type { User } from '$lib/server/db/types';
	import { user } from '$lib/stores/user';

	let userData = $state<User | null>(null);
	$effect(() => {
		user.subscribe((value) => (userData = value));
	});
</script>

<header class="bg-surface-800 text-surface-100 p-4 shadow-md">
	{#if userData}
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
			<div>
				<span class="text-primary-400">{userData.username}</span>
				<span class="ml-2">Health: 100%</span>
			</div>
		</div>
	{:else}
		<h1 class="text-2xl font-semibold">The Corelight Fall</h1>
	{/if}
</header>
