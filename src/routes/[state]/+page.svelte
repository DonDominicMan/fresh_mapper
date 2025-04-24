<script lang="ts">
	import StateMap from '$lib/components/StateMap.svelte';
    let { data } = $props();
</script>

<StateMap counties={data.counties}></StateMap>