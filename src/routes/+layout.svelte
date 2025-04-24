<script lang="ts">
	import Aside from "$lib/components/aside.svelte";
	import NationalMap from "$lib/components/NationalMap.svelte";
	import type { MapStore } from "$lib/types/mapping.js";
	import { writable } from "svelte/store";

    let { data, children } = $props();
    let selectedFeatureName = $state("Federal Gov")
    let isOpen = $state(true);

    const toggleSidebar = () => isOpen = !isOpen;

    const mapStore = writable<MapStore>({
        nationalFeature: data.US_QUANITIZED_TOPOLOGY,
        stateFeature: null,
        countyFeature: null,
    });
</script>

<main>
    <NationalMap data={data} mapStore={mapStore}></NationalMap>
</main>

<Aside 
    selectedFeatureName={selectedFeatureName}
    isOpen={isOpen}
    toggleSidebar={toggleSidebar}
>
    {@render children()}
</Aside>

<style>
    main{
        width: 100vw;
        display: flex;
        justify-content: right;
    }
</style>