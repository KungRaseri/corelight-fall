<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<main class="space-y-4 p-4">
	<div
		class="divide-gray-200-800 bg-surface-200-800 mx-auto max-w-160 divide-y overflow-hidden rounded-lg shadow"
	>
		<div class="px-4 py-5 sm:px-6">
			<label class="text-gray-900-100 block text-sm/6 font-medium" for="userId">User ID</label>
			<input
				class="placeholder:text-gray-400-600 focus:outline-indigo-600-400 disabled:text-surface-100-900 disabled:outline-gray-200-800 block w-full rounded-md
				bg-white px-3 py-1.5 text-base
				outline outline-1 -outline-offset-1 outline-gray-300 focus:outline
				focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 sm:text-sm/6"
				type="text"
				name="userId"
				disabled
				value={data.player.id}
			/>
			<label class="text-gray-900-100 block text-sm/6 font-medium" for="username">Username</label>
			<input
				class="placeholder:text-gray-400-600 focus:outline-indigo-600-400 disabled:text-surface-100-900 disabled:outline-gray-200-800 block w-full rounded-md
				bg-white px-3 py-1.5 text-base
				outline outline-1 -outline-offset-1 outline-gray-300 focus:outline
				focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 sm:text-sm/6"
				type="text"
				name="username"
				disabled
				value={data.player.username}
			/>
		</div>
		<div class="px-4 py-5 sm:p-6">
			<!-- Content goes here -->
		</div>
	</div>
</main>
