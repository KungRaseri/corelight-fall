<script lang="ts">
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
    import IconDashboard from '@lucide/svelte/icons/layout-dashboard';
    import IconUsers from '@lucide/svelte/icons/users';
    import IconStats from '@lucide/svelte/icons/bar-chart';
    import IconLogs from '@lucide/svelte/icons/clipboard-list';
    import IconSettings from '@lucide/svelte/icons/settings';
    import IconSeed from '@lucide/svelte/icons/database';
</script>

<div class="bg-surface-900 w-60 h-full">
    <Navigation.Rail expanded={true}>
        {#snippet header()}
            <Navigation.Tile labelExpanded="Admin Dashboard" href="/admin">
                <IconDashboard />
            </Navigation.Tile>
        {/snippet}
        {#snippet tiles()}
            <Navigation.Tile labelExpanded="Users" href="/admin/users">
                <IconUsers />
            </Navigation.Tile>
            <Navigation.Tile labelExpanded="Stats" href="/admin/stats">
                <IconStats />
            </Navigation.Tile>
            <Navigation.Tile labelExpanded="Logs" href="/admin/logs">
                <IconLogs />
            </Navigation.Tile>
            <Navigation.Tile labelExpanded="Settings" href="/admin/settings">
                <IconSettings />
            </Navigation.Tile>
            <Navigation.Tile labelExpanded="Seed Data" href="/admin/seed">
                <IconSeed />
            </Navigation.Tile>
        {/snippet}
    </Navigation.Rail>
</div>
