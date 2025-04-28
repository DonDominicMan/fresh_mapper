<script lang="ts">
    import { feature } from "$lib/stores/MapStore.js";
    import StateMap from "$lib/components/StateMap.svelte";
    let { data, children } = $props();
    $effect(() => {
        feature.set(data.state);
    })
</script>

<StateMap stateCode={data.state?.properties.code} counties={data.counties}></StateMap>
{@render children()}
