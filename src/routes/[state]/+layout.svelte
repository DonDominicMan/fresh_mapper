<script lang="ts">
    import StateMap from "$lib/components/StateMap.svelte";
    let { data, children } = $props();
</script>

<StateMap currentState={data.state} counties={data.counties} districts={data.districts}></StateMap>
{@render children()}
