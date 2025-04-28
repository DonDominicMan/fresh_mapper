<script lang="ts">
    import { feature } from "$lib/stores/MapStore.js";
    let { data, children } = $props();
    $effect(() => {
        console.log(data.county);
        feature.set(data.county);
    })
</script>

{@render children()}
