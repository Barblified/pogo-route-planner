// OpenStreetMap Overpass API Integration
// Fetches likely Pokéstop locations based on OSM data

const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// POI types that are likely to be Pokéstops
const POKESTOP_TAGS = [
    'tourism=artwork',
    'tourism=attraction',
    'tourism=museum',
    'tourism=gallery',
    'historic=monument',
    'historic=memorial',
    'historic=castle',
    'historic=ruins',
    'historic=archaeological_site',
    'historic=wayside_cross',
    'historic=wayside_shrine',
    'amenity=place_of_worship',
    'amenity=fountain',
    'amenity=clock',
    'amenity=community_centre',
    'amenity=library',
    'amenity=theatre',
    'man_made=water_tower',
    'man_made=lighthouse',
    'leisure=playground',
    'leisure=park',
    'leisure=sports_centre'
];

// Calculate bounding box with buffer
function calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm) {
    bufferKm = bufferKm || 5; // Default 5km buffer
    
    // Convert buffer to degrees (rough approximation)
    const bufferDeg = bufferKm / 111; // 1 degree ≈ 111km
    
    const minLat = Math.min(lat1, lat2) - bufferDeg;
    const maxLat = Math.max(lat1, lat2) + bufferDeg;
    const minLng = Math.min(lng1, lng2) - bufferDeg;
    const maxLng = Math.max(lng1, lng2) + bufferDeg;
    
    return { minLat: minLat, maxLat: maxLat, minLng: minLng, maxLng: maxLng };
}

// Build Overpass QL query
function buildOverpassQuery(bbox) {
    // Build query for all POI types
    const tagQueries = POKESTOP_TAGS.map(function(tag) {
        return 'node[' + tag + '](' + bbox.minLat + ',' + bbox.minLng + ',' + bbox.maxLat + ',' + bbox.maxLng + ');';
    }).join('\n  ');
    
    const query = '[out:json][timeout:25];\n(\n  ' + tagQueries + '\n);\nout body;';
    
    return query;
}

// Fetch Pokéstops from OSM
function fetchOSMPokestops(lat1, lng1, lat2, lng2, bufferKm, callback) {
    const bbox = calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm);
    const query = buildOverpassQuery(bbox);
    
    console.log('Fetching Pokéstops from OSM...');
    console.log('Bounding box:', bbox);
    
    fetch(OSM_OVERPASS_API, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('OSM API request failed');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('OSM returned ' + data.elements.length + ' potential Pokéstops');
        
        // Convert OSM data to our format
        const pokestops = data.elements.map(function(element) {
            return {
                name: element.tags.name || element.tags.tourism || element.tags.historic || element.tags.amenity || 'POI',
                lat: element.lat,
                lng: element.lon,
                osmId: element.id,
                tags: element.tags
            };
        });
        
        // Filter out duplicates (same location)
        const filtered = filterDuplicates(pokestops);
        
        console.log('Filtered to ' + filtered.length + ' unique stops');
        
        callback(null, filtered);
    })
    .catch(function(error) {
        console.error('OSM fetch error:', error);
        callback(error, null);
    });
}

// Filter duplicate locations
function filterDuplicates(pokestops) {
    const seen = {};
    const filtered = [];
    
    pokestops.forEach(function(stop) {
        const key = stop.lat.toFixed(5) + ',' + stop.lng.toFixed(5);
        if (!seen[key]) {
            seen[key] = true;
            filtered.push(stop);
        }
    });
    
    return filtered;
}

// Score stops by likelihood of being a Pokéstop
function scorePokestop(stop) {
    let score = 1;
    
    // Higher score for named POIs
    if (stop.tags.name) score += 2;
    
    // High-value POI types
    if (stop.tags.tourism === 'artwork') score += 3;
    if (stop.tags.tourism === 'monument') score += 3;
    if (stop.tags.historic) score += 2;
    if (stop.tags.amenity === 'fountain') score += 2;
    if (stop.tags.amenity === 'place_of_worship') score += 1;
    
    return score;
}

// Get top N most likely Pokéstops
function getTopPokestops(pokestops, limit) {
    limit = limit || 100;
    
    // Score each stop
    const scored = pokestops.map(function(stop) {
        return {
            stop: stop,
            score: scorePokestop(stop)
        };
    });
    
    // Sort by score
    scored.sort(function(a, b) {
        return b.score - a.score;
    });
    
    // Return top N
    return scored.slice(0, limit).map(function(item) {
        return item.stop;
    });
}
