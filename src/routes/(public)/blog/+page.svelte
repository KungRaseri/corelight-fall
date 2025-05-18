<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
    const { data } = $props();
</script>

<h1 class="text-3xl font-bold mb-6">Blog</h1>
<ul>
    {#each data.posts as post}
        <li class="mb-4">
            <a href={`/blog/${post.slug}`} class="text-primary-400 hover:underline text-xl">{post.title}</a>
            <div class="text-gray-400 text-sm">{post.date}</div>
            <p class="mt-1">{post.summary}</p>
        </li>
    {/each}
</ul>