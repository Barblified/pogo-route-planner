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

function calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm) {
    bufferKm = bufferKm || 5;
    const bufferDeg = bufferKm / 111;
    
    const minLat = Math.min(lat1, lat2) - bufferDeg;
    const maxLat = Math.max(lat1, lat2) + bufferDeg;
    const minLng = Math.min(lng1, lng2) - bufferDeg;
    const maxLng = Math.max(lng1, lng2) + bufferDeg;
    
    return { minLat: minLat, maxLat: maxLat, minLng: minLng, maxLng: maxLng };
}

function buildOverpassQuery(bbox, tags) {
    const tagQueries = tags.map(function(tag) {
        return 'node[' + tag + '](' + bbox.minLat + ',' + bbox.minLng + ',' + bbox.maxLat + ',' + bbox.maxLng + ');';
    }).join('\n  ');
    
    const query = '[out:json][timeout:25];\n(\n  ' + tagQueries + '\n);\nout body;';
    
    return query;
}

function fetchOSMPokestops(lat1, lng1, lat2, lng2, bufferKm, callback) {
    const bbox = calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm);
    
    console.log('Fetching Pokéstops from OSM...');
    console.log('Bounding box:', bbox);
    
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
        console.log('OSM high priority: ' + data1.elements.length + ' POIs');
        
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
            console.log('OSM medium priority: ' + data2.elements.length + ' POIs');
            
            const allElements = data1.elements.concat(data2.elements);
            console.log('OSM total: ' + allElements.length + ' POIs');
            
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
            
            const filtered = pokestops.filter(function(stop) {
                return stop.score >= 5;
            });
            
            const deduplicated = filterDuplicates(filtered);
            
            deduplicated.sort(function(a, b) {
                return b.score - a.score;
            });
            
            console.log('Filtered to ' + deduplicated.length + ' stops');
            
            callback(null, deduplicated);
        });
    })
    .catch(function(error) {
        console.error('OSM fetch error:', error);
        callback(error, null);
    });
}

function scorePokestopLikelihood(element) {
    let score = 0;
    const tags = element.tags;
    
    if (tags.tourism === 'artwork') score += 10;
    if (tags.tourism === 'monument') score += 10;
    if (tags.historic === 'monument') score += 10;
    if (tags.historic === 'memorial') score += 9;
    if (tags.amenity === 'fountain') score += 9;
    if (tags.man_made === 'lighthouse') score += 9;
    if (tags.artwork_type === 'sculpture') score += 10;
    if (tags.artwork_type === 'statue') score += 10;
    if (tags.artwork_type === 'mural') score += 8;
    
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
    
    if (tags.amenity === 'clock') score += 6;
    if (tags.amenity === 'community_centre') score += 6;
    if (tags.leisure === 'playground') score += 5;
    if (tags.leisure === 'park') score += 5;
    if (tags.natural === 'peak') score += 6;
    if (tags.natural === 'waterfall') score += 7;
    if (tags.railway === 'station') score += 6;
    
    if (tags.name) score += 3;
    if (tags.description) score += 2;
    if (tags.historic) score += 2;
    if (tags.wikidata) score += 2;
    if (tags.wikipedia) score += 2;
    
    if (!tags.name && !tags.description) score -= 2;
    if (tags.access === 'private') score -= 5;
    if (tags.access === 'no') score -= 5;
    
    return score;
}

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
