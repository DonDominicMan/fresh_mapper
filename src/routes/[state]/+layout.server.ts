import { feature } from 'topojson-client';
import type { CountyCollection, State } from '$lib/types/mapping.ts';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params, parent}) {
    console.log("loading route /[state] with :", params);

    const stateCode = params.state;
    const { US_QUANITIZED_TOPOLOGY, states } = await parent();
    const countyCollection: CountyCollection = feature(US_QUANITIZED_TOPOLOGY, US_QUANITIZED_TOPOLOGY.objects.counties) as CountyCollection;
    const allCounties = countyCollection.features;
    const counties = allCounties.filter(( county ) => county.properties.state === stateCode);

    const state: State | undefined = states.find(( state: State ) => state.properties.code === stateCode);
    

    
    return {
        state,
        counties
    };
}