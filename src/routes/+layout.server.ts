import type { QuantizedTopology } from '$lib/types/mapping.ts';
import json_data from "$lib/data/counties-albers-10m-full.json" with { type: "json" };

/** @type {import('./$types').LayoutServerLoad} */
export function load() {    
    const US_QUANITIZED_TOPOLOGY: QuantizedTopology = json_data as unknown as QuantizedTopology;

    return {
        US_QUANITIZED_TOPOLOGY
    }
}