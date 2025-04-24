import { feature } from 'topojson-client';
import type { CountyCollection } from '$lib/types/mapping.ts';

/** @type {import('./$types').PageServerLoad} */
export async function load({params, parent}) {

    const { US_QUANITIZED_TOPOLOGY } = await parent();
    const countyCollection: CountyCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.counties) as CountyCollection;
    const allCounties = countyCollection.features;

    const counties = allCounties.filter(( county ) => county.properties.state === params.state);
    
    return {
        counties
    };
}