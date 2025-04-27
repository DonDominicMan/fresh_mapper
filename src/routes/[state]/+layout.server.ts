import type { State } from '$lib/types/mapping.ts';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params, parent}) {
    console.log("loading route /[state] with :", params);

    const stateCode = params.state;
    const { states, allCounties } = await parent();

    const counties = allCounties.filter(( county ) => county.properties.state === stateCode);
    const state: State | undefined = states.find(( state: State ) => state.properties.code === stateCode);
    
    return {
        state,
        counties
    };
}