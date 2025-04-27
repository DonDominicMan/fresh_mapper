import * as d3 from 'd3';
import type { Feature } from 'geojson';
import { type Writable, writable } from "svelte/store";

export const feature: Writable<Feature | undefined> = writable(undefined);
export const transform: Writable<d3.ZoomTransform> = writable(d3.zoomIdentity);
