<script lang="ts">
	import {
		TrendingUp,
		Users,
		BookOpen,
		Map,
		Swords,
		Activity,
		ArrowUp,
		ArrowDown
	} from 'lucide-svelte';

	interface ActivityEntry {
		id: number;
		action: string;
		user: string;
		time: string;
		type: string;
	}

	let stats = $state({
		totalUsers: 1247,
		userGrowth: 12.5,
		totalBlogPosts: 42,
		blogGrowth: 8.3,
		totalStorylines: 15,
		storylineGrowth: -2.1,
		totalQuests: 89,
		questGrowth: 15.7,
		totalEncounters: 312,
		encounterGrowth: 23.4
	});

	let recentActivity = $state<ActivityEntry[]>([
		{
			id: 1,
			action: 'New user registered',
			user: 'player_123',
			time: '2 minutes ago',
			type: 'user'
		},
		{ id: 2, action: 'Blog post published', user: 'admin', time: '15 minutes ago', type: 'blog' },
		{ id: 3, action: 'Quest completed', user: 'player_456', time: '32 minutes ago', type: 'quest' },
		{
			id: 4,
			action: 'Encounter created',
			user: 'storyteller',
			time: '1 hour ago',
			type: 'encounter'
		},
		{ id: 5, action: 'Storyline updated', user: 'admin', time: '2 hours ago', type: 'storyline' },
		{ id: 6, action: 'New choice added', user: 'storyteller', time: '3 hours ago', type: 'choice' }
	]);

	function getGrowthColor(growth: number): string {
		return growth >= 0 ? 'text-success-500' : 'text-error-500';
	}
</script>

<div class="space-y-6 p-8">
	<!-- Key Metrics -->
	<div class="flex items-center gap-3">
		<TrendingUp class="text-primary-500 dark:text-primary-400 size-8" />
		<h1 class="text-primary-500 dark:text-primary-400 text-3xl font-bold">
			Statistics & Analytics
		</h1>
	</div>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Total Users -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Users class="text-primary-500 dark:text-primary-400 size-12" />
				<div class="flex items-center gap-1 {getGrowthColor(stats.userGrowth)}">
					{#if stats.userGrowth >= 0}
						<ArrowUp class="size-4" />
					{:else}
						<ArrowDown class="size-4" />
					{/if}
					<span class="font-semibold">{Math.abs(stats.userGrowth)}%</span>
				</div>
			</div>
			<h3 class="text-surface-600 dark:text-surface-400 text-sm font-medium">Total Users</h3>
			<p class="mt-2 text-4xl font-bold">{stats.totalUsers.toLocaleString()}</p>
		</div>

		<!-- Blog Posts -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<BookOpen class="text-primary-500 dark:text-primary-400 size-12" />
				<div class="flex items-center gap-1 {getGrowthColor(stats.blogGrowth)}">
					{#if stats.blogGrowth >= 0}
						<ArrowUp class="size-4" />
					{:else}
						<ArrowDown class="size-4" />
					{/if}
					<span class="font-semibold">{Math.abs(stats.blogGrowth)}%</span>
				</div>
			</div>
			<h3 class="text-surface-600 dark:text-surface-400 text-sm font-medium">Blog Posts</h3>
			<p class="mt-2 text-4xl font-bold">{stats.totalBlogPosts}</p>
		</div>

		<!-- Storylines -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Map class="text-primary-500 dark:text-primary-400 size-12" />
				<div class="flex items-center gap-1 {getGrowthColor(stats.storylineGrowth)}">
					{#if stats.storylineGrowth >= 0}
						<ArrowUp class="size-4" />
					{:else}
						<ArrowDown class="size-4" />
					{/if}
					<span class="font-semibold">{Math.abs(stats.storylineGrowth)}%</span>
				</div>
			</div>
			<h3 class="text-surface-600 dark:text-surface-400 text-sm font-medium">Storylines</h3>
			<p class="mt-2 text-4xl font-bold">{stats.totalStorylines}</p>
		</div>

		<!-- Quests -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Swords class="text-primary-500 dark:text-primary-400 size-12" />
				<div class="flex items-center gap-1 {getGrowthColor(stats.questGrowth)}">
					{#if stats.questGrowth >= 0}
						<ArrowUp class="size-4" />
					{:else}
						<ArrowDown class="size-4" />
					{/if}
					<span class="font-semibold">{Math.abs(stats.questGrowth)}%</span>
				</div>
			</div>
			<h3 class="text-surface-600 dark:text-surface-400 text-sm font-medium">Quests</h3>
			<p class="mt-2 text-4xl font-bold">{stats.totalQuests}</p>
		</div>

		<!-- Encounters -->
		<div
			class="card preset-glass-surface rounded-2xl p-6 shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Activity class="text-primary-500 dark:text-primary-400 size-12" />
				<div class="flex items-center gap-1 {getGrowthColor(stats.encounterGrowth)}">
					{#if stats.encounterGrowth >= 0}
						<ArrowUp class="size-4" />
					{:else}
						<ArrowDown class="size-4" />
					{/if}
					<span class="font-semibold">{Math.abs(stats.encounterGrowth)}%</span>
				</div>
			</div>
			<h3 class="text-surface-600 dark:text-surface-400 text-sm font-medium">Encounters</h3>
			<p class="mt-2 text-4xl font-bold">{stats.totalEncounters.toLocaleString()}</p>
		</div>
	</div>

	<!-- Charts Placeholders -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- User Growth Chart -->
		<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
				<TrendingUp class="text-primary-500 dark:text-primary-400 size-6" />
				User Growth Trend
			</h2>
			<div
				class="bg-surface-100 dark:bg-surface-800 flex h-64 items-center justify-center rounded-xl"
			>
				<p class="text-surface-500 dark:text-surface-400">
					Chart Placeholder - User Growth Over Time
				</p>
			</div>
		</div>

		<!-- Content Overview Chart -->
		<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
				<BookOpen class="text-secondary-500 dark:text-secondary-400 size-6" />
				Content Distribution
			</h2>
			<div
				class="bg-surface-100 dark:bg-surface-800 flex h-64 items-center justify-center rounded-xl"
			>
				<p class="text-surface-500 dark:text-surface-400">
					Chart Placeholder - Content Distribution
				</p>
			</div>
		</div>
	</div>

	<!-- Recent Activity Feed -->
	<div class="card preset-glass-surface rounded-2xl p-6 shadow-lg">
		<h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
			<Activity class="text-primary-500 dark:text-primary-400 size-6" />
			Recent Activity
		</h2>
		<div class="space-y-3">
			{#each recentActivity as activity: ActivityEntry (activity.id)}
				<div
					class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 flex items-center justify-between rounded-xl p-4 transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="bg-primary-500 size-2 rounded-full"></div>
						<div>
							<p class="font-semibold">{activity.action}</p>
							<p class="text-surface-600 dark:text-surface-400 text-sm">by {activity.user}</p>
						</div>
					</div>
					<span class="text-surface-500 dark:text-surface-400 text-sm">{activity.time}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
