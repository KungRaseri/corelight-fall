<script lang="ts">
import { Activity, CircleAlert, Info, CircleCheckBig, CircleX } from 'lucide-svelte';

type LogLevel = 'info' | 'success' | 'warning' | 'error';
type LogCategory = 'auth' | 'blog' | 'content' | 'database' | 'system';

interface LogEntry {
	id: number;
	level: LogLevel;
	message: string;
	timestamp: Date;
	category: LogCategory;
}

// Mock log data - replace with real data from server
let logs = $state<LogEntry[]>([
{ id: 1, level: 'info', message: 'User alice logged in', timestamp: new Date(Date.now() - 1000 * 60 * 5), category: 'auth' },
{ id: 2, level: 'success', message: 'Blog post "Welcome to Corelight Fall" published', timestamp: new Date(Date.now() - 1000 * 60 * 15), category: 'blog' },
{ id: 3, level: 'warning', message: 'High memory usage detected', timestamp: new Date(Date.now() - 1000 * 60 * 30), category: 'system' },
{ id: 4, level: 'error', message: 'Failed to connect to database', timestamp: new Date(Date.now() - 1000 * 60 * 45), category: 'database' },
{ id: 5, level: 'info', message: 'Quest "Forest Ambush" updated', timestamp: new Date(Date.now() - 1000 * 60 * 60), category: 'content' },
{ id: 6, level: 'success', message: 'Database backup completed', timestamp: new Date(Date.now() - 1000 * 60 * 90), category: 'system' },
]);

let selectedLevel = $state<string>('all');
let selectedCategory = $state<string>('all');

function getLogIcon(level: string) {
switch (level) {
case 'error': return CircleX;
case 'warning': return CircleAlert;
case 'success': return CircleCheckBig;
case 'info':
default: return Info;
}
}

function getLogColor(level: string) {
switch (level) {
case 'error': return 'text-error-500';
case 'warning': return 'text-warning-500';
case 'success': return 'text-success-500';
case 'info':
default: return 'text-primary-500';
}
}

let filteredLogs = $derived(
	logs.filter((log: LogEntry) => {
		const levelMatch = selectedLevel === 'all' || log.level === selectedLevel;
		const categoryMatch = selectedCategory === 'all' || log.category === selectedCategory;
		return levelMatch && categoryMatch;
	})
);
</script>

<div class="space-y-6 p-8">
<div class="flex items-center justify-between">
<h1 class="text-3xl font-bold text-primary-500 dark:text-primary-400 flex items-center gap-3">
<Activity class="size-8" />
Activity Logs
</h1>
<button class="btn preset-glass-primary flex items-center gap-2">
<Activity class="size-5" />
<span>Refresh</span>
</button>
</div>

<!-- Filters -->
<div class="card preset-glass-surface p-6 rounded-2xl shadow-lg">
<div class="flex flex-wrap gap-4">
<div class="flex-1 min-w-[200px]">
<label class="label">
<span class="font-semibold mb-2">Log Level</span>
<select bind:value={selectedLevel} class="select">
<option value="all">All Levels</option>
<option value="info">Info</option>
<option value="success">Success</option>
<option value="warning">Warning</option>
<option value="error">Error</option>
</select>
</label>
</div>
<div class="flex-1 min-w-[200px]">
<label class="label">
<span class="font-semibold mb-2">Category</span>
<select bind:value={selectedCategory} class="select">
<option value="all">All Categories</option>
<option value="auth">Authentication</option>
<option value="blog">Blog</option>
<option value="content">Content</option>
<option value="database">Database</option>
<option value="system">System</option>
</select>
</label>
</div>
</div>
</div>

<!-- Log Entries -->
<div class="space-y-3">
{#each filteredLogs as log: LogEntry}
{@const Icon = getLogIcon(log.level)}
{@const colorClass = getLogColor(log.level)}
<div class="card preset-glass-surface p-4 rounded-xl shadow hover:shadow-lg transition-all duration-200">
<div class="flex items-start gap-4">
<Icon class="size-6 {colorClass} flex-shrink-0 mt-1" />
<div class="flex-1">
<div class="flex items-center justify-between mb-1">
<span class="font-semibold text-surface-900 dark:text-surface-100">{log.message}</span>
<span class="text-sm text-surface-600 dark:text-surface-400">
{log.timestamp.toLocaleTimeString()}  {log.timestamp.toLocaleDateString()}
</span>
</div>
<div class="flex gap-2">
<span class="badge preset-tonal text-xs">{log.level}</span>
<span class="badge preset-tonal text-xs">{log.category}</span>
</div>
</div>
</div>
</div>
{:else}
<div class="card preset-glass-surface p-12 text-center rounded-2xl">
<Info class="size-16 mx-auto mb-4 text-surface-400" />
<p class="text-lg text-surface-600 dark:text-surface-400">No logs match the selected filters</p>
</div>
{/each}
</div>
</div>

