<script lang="ts">
	import Aside from "$lib/components/aside.svelte";

    let { children } = $props();
    let selectedFeatureName = $state("Federal Gov")
    let isOpen = $state(true);

    const toggleSidebar = () => isOpen = !isOpen;
</script>

<main>
    {@render children()}
</main>

<Aside 
    selectedFeatureName={selectedFeatureName}
    isOpen={isOpen}
    toggleSidebar={toggleSidebar}
>
</Aside>