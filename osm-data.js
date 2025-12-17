// OpenStreetMap Overpass API Integration with caching and retry logic
const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const OSM_CACHE_KEY_PREFIX = 'osm_cache_';
const OSM_CACHE_DURATION = 24 * 60 * 60 * 1000;

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

function getCacheKey(bbox) {
    return OSM_CACHE_KEY_PREFIX + 
           bbox.minLat.toFixed(3) + '_' + 
           bbox.minLng.toFixed(3) + '_' + 
           bbox.maxLat.toFixed(3) + '_' + 
           bbox.maxLng.toFixed(3);
}

function getCachedData(cacheKey) {
    try {
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        
        if (age > OSM_CACHE_DURATION) {
            localStorage.removeItem(cacheKey);
            return null;
        }
        
        console.log('Using cached OSM data');
        return data.elements;
    } catch (e) {
        return null;
    }
}

function setCachedData(cacheKey, elements) {
    try {
        const data = {
            timestamp: Date.now(),
            elements: elements
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
        console.error('Cache error:', e);
    }
}

function buildOverpassQuery(bbox, tags) {
    const tagQueries = tags.map(function(tag) {
        return 'node[' + tag + '](' + bbox.minLat + ',' + bbox.minLng + ',' + bbox.maxLat + ',' + bbox.maxLng + ');';
    }).join('\n  ');
    
    const query = '[out:json][timeout:25];\n(\n  ' + tagQueries + '\n);\nout body;';
    
    return query;
}

function fetchWithRetry(url, options, retries, delay) {
    retries = retries || 3;
    delay = delay || 1000;
    
    return fetch(url, options)
        .then(function(response) {
            if (!response.ok) {
                if (response.status === 429 || response.status === 504) {
                    if (retries > 0) {
                        console.log('Retrying in ' + (delay / 1000) + 's...');
                        return new Promise(function(resolve) {
                            setTimeout(function() {
                                resolve(fetchWithRetry(url, options, retries - 1, delay * 2));
                            }, delay);
                        });
                    }
                }
                throw new Error('OSM API failed');
            }
            return response.json();
        });
}

function fetchOSMPokestops(lat1, lng1, lat2, lng2, bufferKm, callback) {
    const bbox = calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm);
    const cacheKey = getCacheKey(bbox);
    
    console.log('Fetching Pokéstops from OSM...');
    
    const cached = getCachedData(cacheKey);
    if (cached) {
        processPokestops(cached, callback);
        return;
    }
    
    const query1 = buildOverpassQuery(bbox, POKESTOP_TAGS_HIGH_PRIORITY);
    
    fetchWithRetry(OSM_OVERPASS_API, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query1)
    }, 3, 2000)
    .then(function(data1) {
        console.log('High priority: ' + data1.elements.length);
        
        return new Promise(function(resolve) {
            setTimeout(function() {
                const query2 = buildOverpassQuery(bbox, POKESTOP_TAGS_MEDIUM_PRIORITY);
                
                fetchWithRetry(OSM_OVERPASS_API, {
                    method: 'POST',
                    body: 'data=' + encodeURIComponent(query2)
                }, 3, 2000)
                .then(function(data2) {
                    console.log('Medium priority: ' + data2.elements.length);
                    resolve({ data1: data1, data2: data2 });
                })
                .catch(function() {
                    resolve({ data1: data1, data2: { elements: [] } });
                });
            }, 2000);
        });
    })
    .then(function(result) {
        const allElements = result.data1.elements.concat(result.data2.elements);
        console.log('Total: ' + allElements.length);
        
        setCachedData(cacheKey, allElements);
        processPokestops(allElements, callback);
    })
    .catch(function(error) {
        console.error('OSM error:', error);
        callback(error, null);
    });
}

function processPokestops(allElements, callback) {
    const pokestops = allElements.map(function(element) {
        return {
            name: element.tags.name || element.tags.tourism || element.tags.historic || element.tags.amenity || 'POI',
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
    
    console.log('Filtered: ' + deduplicated.length);
    
    callback(null, deduplicated);
}

function scorePokestopLikelihood(element) {
    let score = 0;
    const tags = element.tags;
    
    if (tags.tourism === 'artwork') score += 10;
    if (tags.historic === 'monument') score += 10;
    if (tags.historic === 'memorial') score += 9;
    if (tags.amenity === 'fountain') score += 9;
    if (tags.tourism === 'museum') score += 8;
    if (tags.tourism === 'gallery') score += 8;
    if (tags.historic === 'castle') score += 8;
    if (tags.amenity === 'place_of_worship') score += 7;
    if (tags.amenity === 'library') score += 7;
    if (tags.amenity === 'post_box') score += 6;
    
    if (tags.name) score += 3;
    if (tags.description) score += 2;
    if (tags.wikidata) score += 2;
    
    if (!tags.name && !tags.description) score -= 2;
    if (tags.access === 'private') score -= 5;
    
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
        }
    });
    
    return filtered;
}

function clearOSMCache() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(OSM_CACHE_KEY_PREFIX)) {
            keys.push(key);
        }
    }
    keys.forEach(function(key) {
        localStorage.removeItem(key);
    });
    console.log('Cache cleared');
}
