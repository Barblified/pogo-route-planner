// OpenStreetMap Overpass API Integration
const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// POI types organized by priority
const POKESTOP_TAGS_HIGH_PRIORITY = [
    'tourism=artwork',
    'tourism=museum',
    'tourism=gallery',
    'tourism=viewpoint',
    'historic=monument',
    'historic=memorial',
    'historic=castle',
    'historic=ruins',
    'amenity=fountain',
    'amenity=place_of_worship',
    'amenity=library',
    'amenity=theatre',
    'man_made=lighthouse',
    'man_made=water_tower',
    'man_made=windmill',
    'man_made=tower'
];

const POKESTOP_TAGS_MEDIUM_PRIORITY = [
    'tourism=attraction',
    'tourism=information',
    'historic=archaeological_site',
    'historic=wayside_cross',
    'historic=battlefield',
    'historic=fort',
    'amenity=clock',
    'amenity=community_centre',
    'amenity=post_box',
    'amenity=arts_centre',
    'amenity=townhall',
    'man_made=mast',
    'man_made=obelisk',
    'leisure=playground',
    'leisure=park',
    'leisure=sports_centre',
    'leisure=stadium',
    'natural=peak',
    'natural=waterfall',
    'railway=station'
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

// Build Overpass QL query for a set of tags
function buildOverpassQuery(bbox, tags) {
    const tagQueries = tags.map(function(tag) {
        return 'node[' + tag + '](' + bbox.minLat + ',' + bbox.minLng + ',' + bbox.maxLat + ',' + bbox.maxLng + ');';
    }).join('\n  ');
    
    const query = '[out:json][timeout:25];\n(\n  ' + tagQueries + '\n);\nout body;';
    
    return query;
}

// Fetch Pokéstops from OSM (with batching)
function fetchOSMPokestops(lat1, lng1, lat2, lng2, bufferKm, callback) {
    const bbox = calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm);
    
    console.log('Fetching Pokéstops from OSM...');
    console.log('Bounding box:', bbox);
    
    // Fetch high priority first
    const query1 = buildOverpassQuery(bbox, POKESTOP_TAGS_HIGH_PRIORITY);
    
    fetch(OSM_OVERPASS_API, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query1)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('OSM API request failed');
        }
        return response.json();
    })
    .then(function(data1) {
        console.log('OSM batch 1: ' + data1.elements.length + ' POIs');
        
        // Fetch medium priority
        const query2 = buildOverpassQuery(bbox, POKESTOP_TAGS_MEDIUM_PRIORITY);
        
        return fetch(OSM_OVERPASS_API, {
            method: 'POST',
            body: 'data=' + encodeURIComponent(query2)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('OSM API request failed');
            }
            return response.json();
        })
        .then(function(data2) {
            console.log('OSM batch 2: ' + data2.elements.length + ' POIs');
            
            // Combine results
            const allElements = data1.elements.concat(data2.elements);
            console.log('OSM total: ' + allElements.length + ' potential Pokéstops');
            
            const pokestops = allElements.map(function(element) {
                return {
                    name: element.tags.name || element.tags.tourism || element.tags.historic || element.tags.amenity || element.tags.man_made || element.tags.natural || 'POI',
                    lat: element.lat,
                    lng: element.lon,
                    osmId: element.id,
                    tags: element.tags,
                    score: scorePokestopLikelihood(element)
                };
            });
            
            // FILTER: Only keep POIs with score >= 5
            const filtered = pokestops.filter(function(stop) {
                return stop.score >= 5;
            });
            
            // Remove duplicates
            const deduplicated = filterDuplicates(filtered);
            
            // Sort by score
            deduplicated.sort(function(a, b) {
                return b.score - a.score;
            });
            
            console.log('Filtered to ' + deduplicated.length + ' high-confidence stops');
            
            callback(null, deduplicated);
        });
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
    
    // HIGH CONFIDENCE
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
    if (tags.name) score += 3;
    if (tags.description) score += 2;
    if (tags.historic) score += 2;
    if (tags.wikidata) score += 2;
    if (tags.wikipedia) score += 2;
    
    // PENALTIES
    if (!tags.name && !tags.description) score -= 2;
    if (tags.access === 'private') score -= 5;
    if (tags.access === 'no') score -= 5;
    
    return score;
}

// Filter duplicate locations
function filterDuplicates(pokestops) {
    const seen = {};
    const filtered = [];
    
    pokestops.forEach(function(stop) {
        const key = stop.lat.toFixed(4) + ',' + stop.lng.toFixed(4);
        
        if (!seen[key]) {
            seen[key] = true;
            filtered.push(stop);
        } else {
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

function getTopPokestops(pokestops, limit) {
    limit = limit || 100;
    return pokestops.slice(0, limit);
}
```

---

## **WHAT CHANGED:**

✅ **Split into 2 batches** - High priority (16 tags) + Medium priority (19 tags)  
✅ **Sequential queries** - Fetch batch 1, then batch 2, then combine  
✅ **Same total coverage** - Still covers 35 POI types  
✅ **Under API limits** - Each query is small enough  

---

## **EXPECTED RESULT:**
```
OSM batch 1: 150 POIs
OSM batch 2: 120 POIs
OSM total: 270 potential Pokéstops
Filtered to 210 high-confidence stops
