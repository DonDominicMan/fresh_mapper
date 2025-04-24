<script lang="ts">
	import NationalMap from '$lib/components/NationalMap.svelte';
    const { data } = $props();
</script>

<NationalMap states={data.states}></NationalMap>