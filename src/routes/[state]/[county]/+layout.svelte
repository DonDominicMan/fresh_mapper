<script lang="ts">
    import { feature } from "$lib/stores/MapStore.js";
    let { data, children } = $props();

    console.log(data);
    $effect(() => {
        feature.set(data.county);
    })
</script>

{@render children()}
