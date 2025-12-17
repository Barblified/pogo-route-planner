// OpenStreetMap Overpass API Integration with caching and retry logic
const OSM_OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const OSM_CACHE_KEY_PREFIX = 'osm_cache_';
const OSM_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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
        
        console.log('Using cached OSM data (age: ' + Math.round(age / 1000 / 60) + ' mins)');
        return data.elements;
    } catch (e) {
        console.error('Cache read error:', e);
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
        console.log('Cached ' + elements.length + ' POIs');
    } catch (e) {
        console.error('Cache write error:', e);
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
                    // Rate limited or timeout
                    if (retries > 0) {
                        console.log('Rate limited, retrying in ' + (delay / 1000) + 's... (' + retries + ' retries left)');
                        return new Promise(function(resolve) {
                            setTimeout(function() {
                                resolve(fetchWithRetry(url, options, retries - 1, delay * 2));
                            }, delay);
                        });
                    }
                }
                throw new Error('OSM API request failed: ' + response.status);
            }
            return response.json();
        });
}

function fetchOSMPokestops(lat1, lng1, lat2, lng2, bufferKm, callback) {
    const bbox = calculateBoundingBox(lat1, lng1, lat2, lng2, bufferKm);
    const cacheKey = getCacheKey(bbox);
    
    console.log('Fetching Pokéstops from OSM...');
    console.log('Bounding box:', bbox);
    
    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
        processPokestops(cached, callback);
        return;
    }
    
    // Fetch high priority with retry
    const query1 = buildOverpassQuery(bbox, POKESTOP_TAGS_HIGH_PRIORITY);
    
    fetchWithRetry(OSM_OVERPASS_API, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query1)
    }, 3, 2000)
    .then(function(data1) {
        console.log('OSM high priority: ' + data1.elements.length + ' POIs');
        
        // Wait 2 seconds before second request (rate limit protection)
        return new Promise(function(resolve) {
            setTimeout(function() {
                const query2 = buildOverpassQuery(bbox, POKESTOP_TAGS_MEDIUM_PRIORITY);
                
                fetchWithRetry(OSM_OVERPASS_API, {
                    method: 'POST',
                    body: 'data=' + encodeURIComponent(query2)
                }, 3, 2000)
                .then(function(data2) {
                    console.log('OSM medium priority: ' + data2.elements.length + ' POIs');
                    resolve({ data1: data1, data2: data2 });
                })
                .catch(function(error) {
                    console.warn('Medium priority query failed, using high priority only');
                    resolve({ data1: data1, data2: { elements: [] } });
                });
            }, 2000);
        });
    })
    .then(function(result) {
        const allElements = result.data1.elements.concat(result.data2.elements);
        console.log('OSM total: ' + allElements.length + ' POIs');
        
        // Cache the combined results
        setCachedData(cacheKey, allElements);
        
        processPokestops(allElements, callback);
    })
    .catch(function(error) {
        console.error('OSM fetch error:', error);
        callback(error, null);
    });
}

function processPokestops(allElements, callback) {
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

// Utility: Clear OSM cache (for testing)
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
    console.log('Cleared ' + keys.length + ' cached OSM queries');
}
```

---

## **WHAT THIS DOES:**

✅ **24-hour client-side cache** - stores results in localStorage  
✅ **Retry logic** - 3 attempts with exponential backoff (2s → 4s → 8s)  
✅ **2-second delay** between batched queries (rate limit protection)  
✅ **Graceful degradation** - if medium priority fails, uses high priority only  
✅ **Cache hits logged** - see "Using cached OSM data (age: X mins)"  

---

## **HOW IT WORKS:**

**First run (London):**
```
Fetching Pokéstops from OSM...
OSM high priority: 2751 POIs
[waits 2 seconds]
OSM medium priority: 3664 POIs
Cached 6415 POIs
```

**Second run (same area within 24 hours):**
```
Fetching Pokéstops from OSM...
Using cached OSM data (age: 2 mins)
Filtered to 3036 stops
```

**If rate limited:**
```
Rate limited, retrying in 2s... (3 retries left)
Rate limited, retrying in 4s... (2 retries left)
OSM high priority: 2751 POIs
