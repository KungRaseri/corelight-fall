<script lang="ts">
	const { data } = $props();
</script>

<div class="p-6">
	<h1 class="text-primary-500 mb-6 text-3xl font-bold">User Management</h1>

	{#if data.users.length > 0}
		<div class="border-surface-700 overflow-x-auto rounded-lg border shadow-md">
			<table class="min-w-full table-auto border-collapse">
				<thead class="bg-surface-800">
					<tr>
						<th class="text-surface-100 px-4 py-2 text-left text-sm font-semibold">ID</th>
						<th class="text-surface-100 px-4 py-2 text-left text-sm font-semibold">Username</th>
						<th class="text-surface-100 px-4 py-2 text-left text-sm font-semibold">Created At</th>
						<th class="text-surface-100 px-4 py-2 text-left text-sm font-semibold">Role</th>
						<th class="text-surface-100 px-4 py-2 text-left text-sm font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-surface-700 bg-surface-900 divide-y">
					{#each data.users as user}
						<tr class="hover:bg-surface-800">
							<td class="text-surface-200 px-4 py-2 text-sm">{user.id}</td>
							<td class="text-surface-200 px-4 py-2 text-sm">{user.username}</td>
							<td class="text-surface-200 px-4 py-2 text-sm"
								>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td
							>
							<td class="text-surface-200 px-4 py-2 text-sm">{user.roleName ?? 'None'}</td>
							<td class="text-surface-200 space-x-2 px-4 py-2 text-sm">
								<button class="btn btn-sm btn-primary">Edit</button>
								<button class="btn btn-sm btn-error">Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-surface-400">No users found.</p>
	{/if}
</div>
