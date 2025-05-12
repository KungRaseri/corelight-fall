<script lang="ts">
    let { data } = $props();
</script>

<section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <p>Welcome, {data.player?.username}!</p>
    <a href="/admin/users" class="btn btn-primary mt-4">Manage Users</a>
</section>
