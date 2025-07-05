#!/usr/bin/env node

/**
 * Simplified Census Data Preparation Script
 * Downloads and processes Census boundary files into TopoJSON format
 * 
 * Prerequisites:
 * npm install shpjs topojson-server topojson-client
 */

import shp from 'shpjs';
import * as topojsonServer from 'topojson-server';
import * as topojsonClient from 'topojson-client';
import fs from 'fs';

// Configuration
const CENSUS_BASE_URL = 'https://www2.census.gov/geo/tiger/GENZ2024/shp/';
const OUTPUT_FILE = './static/us-boundaries-stable.json';

// Stable boundaries that rarely change
const STABLE_BOUNDARIES = [
  {
    name: 'nation',
    url: `${CENSUS_BASE_URL}cb_2024_us_nation_20m.zip`
  },
  {
    name: 'states',
    url: `${CENSUS_BASE_URL}cb_2024_us_state_20m.zip`
  },
  {
    name: 'counties',
    url: `${CENSUS_BASE_URL}cb_2024_us_county_20m.zip`
  }
];

async function loadShapefile(zipUrl) {
  console.log(`Loading shapefile: ${zipUrl}`);
  const geojson = await shp(zipUrl); // URL to .zip of shapefiles
  return geojson;
}

async function main() {
  try {
    // Create static directory if it doesn't exist
    if (!fs.existsSync('./static')) {
      fs.mkdirSync('./static', { recursive: true });
    }

    console.log('Loading shapefiles...');
    
    // Load all shapefiles concurrently
    const [nationGeoJSON, statesGeoJSON, countiesGeoJSON] = await Promise.all([
      loadShapefile(STABLE_BOUNDARIES[0].url),
      loadShapefile(STABLE_BOUNDARIES[1].url),
      loadShapefile(STABLE_BOUNDARIES[2].url)
    ]);

    console.log('Creating TopoJSON...');
    
    // Create topology from GeoJSON data
    // The key insight: pass an object with your desired layer names
    const topology = topojsonServer.topology({
      nation: nationGeoJSON,
      states: statesGeoJSON,
      counties: countiesGeoJSON
    });

    console.log('Simplifying TopoJSON...');
    
    // Option 1: Use topojson-simplify (if available)
    // const simplified = topojsonClient.simplify(topology, 0.25);
    
    // Option 2: Use presimplify + simplify (more common pattern)
    let simplified;
    try {
      const presimplified = topojsonClient.presimplify(topology);
      simplified = topojsonClient.simplify(presimplified, 0.25);
    } catch (error) {
      console.log(error);
      simplified = topology;
    }

    // Write the final TopoJSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simplified));

    console.log(`✅ Successfully created: ${OUTPUT_FILE}`);
    console.log('\nFile structure in TopoJSON:');
    console.log('- objects.nation: National boundary');
    console.log('- objects.states: State boundaries');
    console.log('- objects.counties: County boundaries');
    
    // Calculate file size
    const finalSize = fs.statSync(OUTPUT_FILE).size;
    console.log(`\nFile size: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();