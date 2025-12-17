// OpenStreetMap Overpass API Integration
// Fetches likely Pokéstop locations based on OSM data

const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// EXPANDED POI types that are likely to be Pokéstops
const POKESTOP_TAGS = [
    // Tourism (HIGH confidence)
    'tourism=artwork',
    'tourism=attraction',
    'tourism=museum',
    'tourism=gallery',
    'tourism=viewpoint',
    'tourism=information',
    
    // Historic (HIGH confidence)
    'historic=monument',
    'historic=memorial',
    'historic=castle',
    'historic=ruins',
    'historic=archaeological_site',
    'historic=wayside_cross',
    'historic=wayside_shrine',
    'historic=battlefield',
    'historic=fort',
    'historic=manor',
    'historic=tomb',
    'historic=yes',
    
    // Amenities (MEDIUM-HIGH confidence)
    'amenity=place_of_worship',
    'amenity=fountain',
    'amenity=clock',
    'amenity=community_centre',
    'amenity=library',
    'amenity=theatre',
    'amenity=post_box',
    'amenity=bench["memorial"="yes"]',
    'amenity=arts_centre',
    'amenity=cinema',
    'amenity=townhall',
    
    // Man-made (MEDIUM confidence)
    'man_made=water_tower',
    'man_made=lighthouse',
    'man_made=tower',
    'man_made=windmill',
    'man_made=mast',
    'man_made=obelisk',
    'man_made=cross',
    'man_made=chimney',
    
    // Leisure (MEDIUM confidence)
    'leisure=playground',
    'leisure=park',
    'leisure=sports_centre',
    'leisure=stadium',
    'leisure=pitch',
    'leisure=garden',
    
    // Natural features (MEDIUM confidence)
    'natural=peak',
    'natural=waterfall',
    'natural=spring',
    'natural=tree["denotation"="landmark"]',
    'natural=stone',
    'natural=rock',
    
    // Art & Culture (HIGH confidence)
    'artwork_type=sculpture',
    'artwork_type=statue',
    'artwork_type=mural',
    'artwork_type=graffiti',
    
    // Other notable features
    'railway=station',
    'railway=halt',
    'public_transport=station'
];

// Calculate bounding box with buffer
function calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm) {
    bufferKm = bufferKm || 5;
    const bufferDeg = bufferKm / 111;
    
    const minLat = Math.min(lat1, lat2) - bufferDeg;
    const maxLat = Math.max(lat1, lat2) + bufferDeg;
    const minLng = Math.min(lng1, lng2) - bufferDeg;
    const maxLng = Math.max(lng1, lng2) + bufferDeg;
    
    return { minLat: minLat, maxLat: maxLat, minLng: minLng, maxLng: maxLng };
}

// Build Overpass QL query
function buildOverpassQuery(bbox) {
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
        
        const pokestops = data.elements.map(function(element) {
            return {
                name: element.tags.name || element.tags.tourism || element.tags.historic || element.tags.amenity || element.tags.man_made || element.tags.natural || 'POI',
                lat: element.lat,
                lng: element.lon,
                osmId: element.id,
                tags: element.tags,
                score: scorePokestopLikelihood(element)
            };
        });
        
        // FILTER: Only keep POIs with score >= 5 (removes low-confidence junk)
        const filtered = pokestops.filter(function(stop) {
            return stop.score >= 5;
        });
        
        // Remove duplicates
        const deduplicated = filterDuplicates(filtered);
        
        // Sort by score (highest first)
        deduplicated.sort(function(a, b) {
            return b.score - a.score;
        });
        
        console.log('Filtered to ' + deduplicated.length + ' high-confidence stops');
        
        callback(null, deduplicated);
    })
    .catch(function(error) {
        console.error('OSM fetch error:', error);
        callback(error, null);
    });
}

// ML SCORING: Rate likelihood of being a Pokéstop
function scorePokestopLikelihood(element) {
    let score = 0;
    const tags = element.tags;
    
    // HIGH CONFIDENCE (almost definitely stops)
    if (tags.tourism === 'artwork') score += 10;
    if (tags.tourism === 'monument') score += 10;
    if (tags.historic === 'monument') score += 10;
    if (tags.historic === 'memorial') score += 9;
    if (tags.amenity === 'fountain') score += 9;
    if (tags.man_made === 'lighthouse') score += 9;
    if (tags.artwork_type === 'sculpture') score += 10;
    if (tags.artwork_type === 'statue') score += 10;
    if (tags.artwork_type === 'mural') score += 8;
    
    // MEDIUM-HIGH CONFIDENCE
    if (tags.tourism === 'museum') score += 8;
    if (tags.tourism === 'gallery') score += 8;
    if (tags.tourism === 'viewpoint') score += 7;
    if (tags.historic === 'castle') score += 8;
    if (tags.historic === 'ruins') score += 7;
    if (tags.amenity === 'place_of_worship') score += 7;
    if (tags.amenity === 'library') score += 7;
    if (tags.amenity === 'theatre') score += 7;
    if (tags.amenity === 'post_box') score += 6;
    if (tags.man_made === 'water_tower') score += 7;
    if (tags.man_made === 'windmill') score += 7;
    
    // MEDIUM CONFIDENCE
    if (tags.amenity === 'clock') score += 6;
    if (tags.amenity === 'community_centre') score += 6;
    if (tags.leisure === 'playground') score += 5;
    if (tags.leisure === 'park') score += 5;
    if (tags.natural === 'peak') score += 6;
    if (tags.natural === 'waterfall') score += 7;
    if (tags.railway === 'station') score += 6;
    
    // BONUSES
    if (tags.name) score += 3; // Named POIs more likely
    if (tags.description) score += 2; // Has description
    if (tags.historic) score += 2; // Historic tag is good indicator
    if (tags.wikidata) score += 2; // Wikidata = notable
    if (tags.wikipedia) score += 2; // Wikipedia = notable
    
    // PENALTIES
    if (!tags.name && !tags.description) score -= 2; // Generic unnamed
    if (tags.access === 'private') score -= 5; // Private property
    if (tags.access === 'no') score -= 5; // No access
    
    return score;
}

// Filter duplicate locations (within 10m = same stop)
function filterDuplicates(pokestops) {
    const seen = {};
    const filtered = [];
    
    pokestops.forEach(function(stop) {
        // Round to ~10m precision
        const key = stop.lat.toFixed(4) + ',' + stop.lng.toFixed(4);
        
        if (!seen[key]) {
            seen[key] = true;
            filtered.push(stop);
        } else {
            // If duplicate, keep the one with higher score
            const existing = filtered.find(function(s) {
                return (s.lat.toFixed(4) + ',' + s.lng.toFixed(4)) === key;
            });
            if (existing && stop.score > existing.score) {
                filtered[filtered.indexOf(existing)] = stop;
            }
        }
    });
    
    return filtered;
}

// Get top N most likely Pokéstops (legacy function, now handled by score filter)
function getTopPokestops(pokestops, limit) {
    limit = limit || 100;
    return pokestops.slice(0, limit);
}
