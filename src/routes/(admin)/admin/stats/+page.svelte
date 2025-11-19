<script lang="ts">
import { TrendingUp, Users, BookOpen, Map, Swords, Activity, ArrowUp, ArrowDown } from 'lucide-svelte';

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
{ id: 1, action: 'New user registered', user: 'player_123', time: '2 minutes ago', type: 'user' },
{ id: 2, action: 'Blog post published', user: 'admin', time: '15 minutes ago', type: 'blog' },
{ id: 3, action: 'Quest completed', user: 'player_456', time: '32 minutes ago', type: 'quest' },
{ id: 4, action: 'Encounter created', user: 'storyteller', time: '1 hour ago', type: 'encounter' },
{ id: 5, action: 'Storyline updated', user: 'admin', time: '2 hours ago', type: 'storyline' },
{ id: 6, action: 'New choice added', user: 'storyteller', time: '3 hours ago', type: 'choice' }
]);

function getGrowthColor(growth: number): string {
return growth >= 0 ? 'text-success-500' : 'text-error-500';
}
</script>

<div class="space-y-6 p-8">
<div class="flex items-center gap-3">
<TrendingUp class="size-8 text-primary-500 dark:text-primary-400" />
<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400">Statistics & Analytics</h1>
</div>

<!-- Key Metrics Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<!-- Total Users -->
<div class="card preset-glass-surface-primary p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
<div class="flex items-center justify-between mb-4">
<Users class="size-12 text-primary-500 dark:text-primary-400" />
<div class="flex items-center gap-1 {getGrowthColor(stats.userGrowth)}">
{#if stats.userGrowth >= 0}
<ArrowUp class="size-4" />
{:else}
<ArrowDown class="size-4" />
{/if}
<span class="font-semibold">{Math.abs(stats.userGrowth)}%</span>
</div>
</div>
<h3 class="text-sm font-medium text-surface-600 dark:text-surface-400">Total Users</h3>
<p class="text-4xl font-bold mt-2">{stats.totalUsers.toLocaleString()}</p>
</div>

<!-- Blog Posts -->
<div class="card preset-glass-surface-secondary p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
<div class="flex items-center justify-between mb-4">
<BookOpen class="size-12 text-secondary-500 dark:text-secondary-400" />
<div class="flex items-center gap-1 {getGrowthColor(stats.blogGrowth)}">
{#if stats.blogGrowth >= 0}
<ArrowUp class="size-4" />
{:else}
<ArrowDown class="size-4" />
{/if}
<span class="font-semibold">{Math.abs(stats.blogGrowth)}%</span>
</div>
</div>
<h3 class="text-sm font-medium text-surface-600 dark:text-surface-400">Blog Posts</h3>
<p class="text-4xl font-bold mt-2">{stats.totalBlogPosts}</p>
</div>

<!-- Storylines -->
<div class="card preset-glass-surface-tertiary p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
<div class="flex items-center justify-between mb-4">
<Map class="size-12 text-tertiary-500 dark:text-tertiary-400" />
<div class="flex items-center gap-1 {getGrowthColor(stats.storylineGrowth)}">
{#if stats.storylineGrowth >= 0}
<ArrowUp class="size-4" />
{:else}
<ArrowDown class="size-4" />
{/if}
<span class="font-semibold">{Math.abs(stats.storylineGrowth)}%</span>
</div>
</div>
<h3 class="text-sm font-medium text-surface-600 dark:text-surface-400">Storylines</h3>
<p class="text-4xl font-bold mt-2">{stats.totalStorylines}</p>
</div>

<!-- Quests -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
<div class="flex items-center justify-between mb-4">
<Swords class="size-12 text-primary-500 dark:text-primary-400" />
<div class="flex items-center gap-1 {getGrowthColor(stats.questGrowth)}">
{#if stats.questGrowth >= 0}
<ArrowUp class="size-4" />
{:else}
<ArrowDown class="size-4" />
{/if}
<span class="font-semibold">{Math.abs(stats.questGrowth)}%</span>
</div>
</div>
<h3 class="text-sm font-medium text-surface-600 dark:text-surface-400">Quests</h3>
<p class="text-4xl font-bold mt-2">{stats.totalQuests}</p>
</div>

<!-- Encounters -->
<div class="card preset-glass-surface-success p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
<div class="flex items-center justify-between mb-4">
<Activity class="size-12 text-success-500 dark:text-success-400" />
<div class="flex items-center gap-1 {getGrowthColor(stats.encounterGrowth)}">
{#if stats.encounterGrowth >= 0}
<ArrowUp class="size-4" />
{:else}
<ArrowDown class="size-4" />
{/if}
<span class="font-semibold">{Math.abs(stats.encounterGrowth)}%</span>
</div>
</div>
<h3 class="text-sm font-medium text-surface-600 dark:text-surface-400">Encounters</h3>
<p class="text-4xl font-bold mt-2">{stats.totalEncounters.toLocaleString()}</p>
</div>
</div>

<!-- Charts Placeholders -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<!-- User Growth Chart -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg">
<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
<TrendingUp class="size-6 text-primary-500 dark:text-primary-400" />
User Growth Trend
</h2>
<div class="h-64 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-xl">
<p class="text-surface-500 dark:text-surface-400">Chart Placeholder - User Growth Over Time</p>
</div>
</div>

<!-- Content Overview Chart -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg">
<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
<BookOpen class="size-6 text-secondary-500 dark:text-secondary-400" />
Content Distribution
</h2>
<div class="h-64 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-xl">
<p class="text-surface-500 dark:text-surface-400">Chart Placeholder - Content Distribution</p>
</div>
</div>
</div>

<!-- Recent Activity Feed -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg">
<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
<Activity class="size-6 text-primary-500 dark:text-primary-400" />
Recent Activity
</h2>
<div class="space-y-3">
{#each recentActivity as activity: ActivityEntry (activity.id)}
<div class="flex items-center justify-between p-4 bg-surface-100 dark:bg-surface-800 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
<div class="flex items-center gap-3">
<div class="size-2 rounded-full bg-primary-500"></div>
<div>
<p class="font-semibold">{activity.action}</p>
<p class="text-sm text-surface-600 dark:text-surface-400">by {activity.user}</p>
</div>
</div>
<span class="text-sm text-surface-500 dark:text-surface-400">{activity.time}</span>
</div>
{/each}
</div>
</div>
</div>

