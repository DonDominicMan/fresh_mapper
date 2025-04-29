<script lang="ts">
    import StateMap from "$lib/components/StateMap.svelte";
    let { data, children } = $props();
</script>

<StateMap currentState={data.state} counties={data.counties}></StateMap>
{@render children()}
