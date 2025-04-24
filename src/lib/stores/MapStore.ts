// src/lib/stores/mapStore.ts
import * as d3 from 'd3';
import type { Feature, Geometry } from 'geojson';
import type { MapState } from '$lib/types/mapping.js';
import { writable, derived } from 'svelte/store';
import { zoomIdentity, type ZoomTransform } from 'd3-zoom';

const initialTransform: ZoomTransform = zoomIdentity;

const createMapStore = () => {
    const { subscribe, update, set } = writable<MapState>({
        currentView: 'national',
        currentFeature: null,
        transitionInProgress: false,
        fullWidth: 975,
        fullHeight: 610,
        transform: initialTransform
    });

    return {
        subscribe,
        update,
        set,
        zoomToFeature: (feature: Feature<Geometry>, width: number, height: number) => {
            update(state => {
                const geoPath = d3.geoPath();
                
                // Get the bounding box of the feature in pixel coordinates
                const [[x0, y0], [x1, y1]] = geoPath.bounds(feature);
                
                // Calculate the maximum scale that fits the feature in view
                // The 0.9 multiplier adds a small margin around the feature
                const scale = Math.min(
                    8,  // Maximum allowed scale (don't zoom in too far)
                    0.9 / Math.max(
                        (x1 - x0) / width,  // Horizontal fit ratio
                        (y1 - y0) / height  // Vertical fit ratio
                    )
                );
                
                // Calculate the translation needed to center the feature
                const translateX = -(x0 + x1) / 2;
                const translateY = -(y0 + y1) / 2;

                // Create the new transform by:
                // 1. Moving to center of viewport
                // 2. Applying our calculated scale
                // 3. Adjusting to center the feature
                const transform = zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(scale)
                    .translate(translateX, translateY);

                return {
                    ...state,
                    transform,
                    currentFeature: feature,
                    transitionInProgress: true,
                    currentView: feature.properties?.type || 'county'
                };
            });
        },
        /**
         * Updates the transform during continuous zoom/pan interactions.
         * 
         * @param transform - The new transform from D3's zoom event
         */
        updateTransform: (transform: ZoomTransform) => {
            update(state => ({
                ...state,
                transform,
                transitionInProgress: false  // User-driven zooms are immediate
            }));
        },
        reset: () => {
            update(state => ({
                ...state,
                currentView: 'national',
                currentFeature: null,
                transform: initialTransform,
                transitionInProgress: false
            }));
        }
    };
};

// Customized Writable store instance
export const mapStore = createMapStore();

/**
 * Derived store that generates the SVG transform string.
 * 
 * This converts the ZoomTransform object into an SVG-compatible string like:
 * "translate(100, 50) scale(2)"
 */
export const transformString = derived(
    mapStore,
    $mapStore => `translate(${$mapStore.transform.x}, ${$mapStore.transform.y}) scale(${$mapStore.transform.k})`
);

/**
 * Derived store that calculates stroke width based on zoom level.
 * 
 * This makes borders thinner when zoomed in (k > 1) and thicker when zoomed out.
 * The 1/k formula ensures strokes maintain consistent visual weight.
 */
export const strokeWidth = derived(
    mapStore,
    $mapStore => 1 / $mapStore.transform.k
);