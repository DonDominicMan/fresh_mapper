<script lang="ts">
    let { data } = $props();
</script>

<h1>
    {data.county?.properties.name || "...loading"} county
</h1>
