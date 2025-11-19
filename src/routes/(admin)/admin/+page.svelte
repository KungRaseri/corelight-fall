<script lang="ts">
	import { onMount } from 'svelte';
	import {
		LayoutDashboard,
		Users,
		BookOpen,
		Map,
		Swords,
		Target,
		TrendingUp,
		Clock,
		Activity,
		Settings,
		Database,
		Eye
	} from 'lucide-svelte';

	const { data } = $props();
	let statsData = $state({
		blogPosts: 0,
		storylines: 0,
		quests: 0,
		encounters: 0,
		users: 0
	});

	onMount(() => {
		statsData = { ...data.statsData };
	});

	// Recent activity with more detail
	const recentActivity = [
		{
			icon: Users,
			text: 'New user registered',
			detail: 'player_789',
			time: '5 minutes ago',
			color: 'text-primary-500'
		},
		{
			icon: BookOpen,
			text: 'Blog post published',
			detail: '"Welcome to Corelight Fall"',
			time: '1 hour ago',
			color: 'text-secondary-500'
		},
		{
			icon: Swords,
			text: 'Quest updated',
			detail: '"Forest Ambush"',
			time: '2 hours ago',
			color: 'text-tertiary-500'
		},
		{
			icon: Target,
			text: 'Encounter created',
			detail: '"Shadow Beast"',
			time: '3 hours ago',
			color: 'text-success-500'
		},
		{
			icon: Map,
			text: 'Storyline modified',
			detail: '"The Lost City"',
			time: '5 hours ago',
			color: 'text-warning-500'
		}
	];
</script>

<div class="space-y-8 p-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<LayoutDashboard class="text-primary-500 dark:text-primary-400 size-10" />
			<div>
				<h1 class="text-primary-500 dark:text-primary-400 text-4xl font-bold">Admin Dashboard</h1>
				<p class="text-surface-600 dark:text-surface-400">Welcome back! Here's what's happening.</p>
			</div>
		</div>
		<a href="/admin/stats" class="btn preset-glass-surface-primary-primary flex items-center gap-2">
			<TrendingUp class="size-5" />
			<span>View Analytics</span>
		</a>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<!-- Users Card -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Users class="text-primary-500 dark:text-primary-400 size-10" />
				<a
					href="/admin/user"
					class="btn-icon btn-icon-sm preset-glass-surface-primary"
					title="Manage Users"
				>
					<Eye class="size-4" />
				</a>
			</div>
			<h2 class="text-surface-600 dark:text-surface-400 mb-1 text-sm font-medium">
				Registered Users
			</h2>
			<p class="text-3xl font-bold">{statsData.users}</p>
		</div>

		<!-- Blog Posts Card -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<BookOpen class="text-secondary-500 dark:text-secondary-400 size-10" />
				<a
					href="/admin/blog"
					class="btn-icon btn-icon-sm preset-glass-surface-primary"
					title="Manage Blog"
				>
					<Eye class="size-4" />
				</a>
			</div>
			<h2 class="text-surface-600 dark:text-surface-400 mb-1 text-sm font-medium">Blog Posts</h2>
			<p class="text-3xl font-bold">{statsData.blogPosts}</p>
		</div>

		<!-- Storylines Card -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Map class="text-tertiary-500 dark:text-tertiary-400 size-10" />
				<a
					href="/admin/story"
					class="btn-icon btn-icon-sm preset-glass-surface-primary"
					title="Manage Storylines"
				>
					<Eye class="size-4" />
				</a>
			</div>
			<h2 class="text-surface-600 dark:text-surface-400 mb-1 text-sm font-medium">Storylines</h2>
			<p class="text-3xl font-bold">{statsData.storylines}</p>
		</div>

		<!-- Quests Card -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Swords class="text-success-500 dark:text-success-400 size-10" />
				<a
					href="/admin/quest"
					class="btn-icon btn-icon-sm preset-glass-surface-primary"
					title="Manage Quests"
				>
					<Eye class="size-4" />
				</a>
			</div>
			<h2 class="text-surface-600 dark:text-surface-400 mb-1 text-sm font-medium">Quests</h2>
			<p class="text-3xl font-bold">{statsData.quests}</p>
		</div>

		<!-- Encounters Card -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Target class="text-warning-500 dark:text-warning-400 size-10" />
				<a
					href="/admin/encounter"
					class="btn-icon btn-icon-sm preset-glass-surface-primary"
					title="Manage Encounters"
				>
					<Eye class="size-4" />
				</a>
			</div>
			<h2 class="text-surface-600 dark:text-surface-400 mb-1 text-sm font-medium">Encounters</h2>
			<p class="text-3xl font-bold">{statsData.encounters}</p>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
		<div class="mb-4 flex items-center gap-2">
			<Activity class="text-primary-500 dark:text-primary-400 size-6" />
			<h2 class="text-2xl font-bold">Quick Actions</h2>
		</div>
		<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
			<a
				href="/admin/blog"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<BookOpen class="size-5" />
				<span>Blog</span>
			</a>
			<a
				href="/admin/story"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<Map class="size-5" />
				<span>Stories</span>
			</a>
			<a
				href="/admin/quest"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<Swords class="size-5" />
				<span>Quests</span>
			</a>
			<a
				href="/admin/encounter"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<Target class="size-5" />
				<span>Encounters</span>
			</a>
			<a
				href="/admin/user"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<Users class="size-5" />
				<span>Users</span>
			</a>
			<a
				href="/admin/settings"
				class="btn preset-glass-surface-primary flex items-center justify-center gap-2"
			>
				<Settings class="size-5" />
				<span>Settings</span>
			</a>
		</div>
	</div>

	<!-- Two Column Layout for Activity and System Status -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Recent Activity -->
		<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Clock class="text-primary-500 dark:text-primary-400 size-6" />
					<h2 class="text-2xl font-bold">Recent Activity</h2>
				</div>
				<a href="/admin/log" class="btn preset-tonal flex items-center gap-1 text-sm">
					<span>View All</span>
					<Eye class="size-4" />
				</a>
			</div>
			<div class="space-y-3">
				{#each recentActivity as activity}
					{@const Icon = activity.icon}
					<div
						class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 flex items-start gap-3 rounded-xl p-3 transition-colors"
					>
						<Icon class="size-5 {activity.color} mt-0.5 flex-shrink-0" />
						<div class="min-w-0 flex-1">
							<p class="text-surface-900 dark:text-surface-100 font-semibold">
								{activity.text}
							</p>
							<p class="text-surface-600 dark:text-surface-400 truncate text-sm">
								{activity.detail}
							</p>
						</div>
						<span class="text-surface-500 dark:text-surface-400 text-xs whitespace-nowrap">
							{activity.time}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- System Status -->
		<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
			<div class="mb-4 flex items-center gap-2">
				<Database class="text-primary-500 dark:text-primary-400 size-6" />
				<h2 class="text-2xl font-bold">System Status</h2>
			</div>
			<div class="space-y-4">
				<!-- Database Status -->
				<div
					class="bg-surface-100 dark:bg-surface-800 flex items-center justify-between rounded-xl p-3"
				>
					<div class="flex items-center gap-3">
						<div class="bg-success-500 size-3 animate-pulse rounded-full"></div>
						<span class="font-semibold">Database</span>
					</div>
					<span class="text-success-500 text-sm">Connected</span>
				</div>

				<!-- Storage -->
				<div class="bg-surface-100 dark:bg-surface-800 rounded-xl p-3">
					<div class="mb-2 flex items-center justify-between">
						<span class="font-semibold">Storage Usage</span>
						<span class="text-surface-600 dark:text-surface-400 text-sm">2.4 GB / 10 GB</span>
					</div>
					<div class="bg-surface-300 dark:bg-surface-700 h-2 w-full rounded-full">
						<div class="bg-primary-500 h-2 rounded-full" style="width: 24%"></div>
					</div>
				</div>

				<!-- Uptime -->
				<div
					class="bg-surface-100 dark:bg-surface-800 flex items-center justify-between rounded-xl p-3"
				>
					<span class="font-semibold">Server Uptime</span>
					<span class="text-surface-600 dark:text-surface-400 text-sm">7 days, 14 hours</span>
				</div>

				<!-- Last Backup -->
				<div
					class="bg-surface-100 dark:bg-surface-800 flex items-center justify-between rounded-xl p-3"
				>
					<span class="font-semibold">Last Backup</span>
					<span class="text-surface-600 dark:text-surface-400 text-sm">2 hours ago</span>
				</div>

				<!-- Database Actions -->
				<div class="flex gap-2 pt-2">
					<a
						href="/admin/database"
						class="btn preset-glass-surface-primary-primary flex flex-1 items-center justify-center gap-2"
					>
						<Database class="size-4" />
						<span>Database Tools</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
