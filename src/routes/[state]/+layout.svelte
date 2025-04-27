<script lang="ts">
    import { feature } from "$lib/stores/MapStore.js";
    import StateMap from "$lib/components/StateMap.svelte";

    let { data, children } = $props();
    let counties = $state(data.counties)

    $effect(() => {
        feature.set(data.state);
        counties = data.counties;
    })
</script>

<StateMap counties={counties}></StateMap>
{@render children()}
