// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate density score - how many other stops are nearby
function calculateDensityScore(stop, allStops, radius) {
    radius = radius || 0.5;
    let nearbyCount = 0;
    allStops.forEach(function(otherStop) {
        if (otherStop !== stop) {
            const distance = calculateDistance(stop.lat, stop.lng, otherStop.lat, otherStop.lng);
            if (distance < radius) {
                nearbyCount++;
            }
        }
    });
    return nearbyCount;
}

// DENSITY-AWARE routing algorithm with MAX DETOUR LIMIT
function generateRouteStartToEnd(startLat, startLng, endLat, endLng) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [].concat(samplePokestops);
    
    // Calculate straight-line distance between start and end
    const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
    
    // Maximum allowed route distance (direct distance * 1.5)
    // This prevents crazy detours
    const maxRouteDistance = directDistance * 1.5;
    
    console.log('Direct distance: ' + directDistance.toFixed(2) + 'km, Max route: ' + maxRouteDistance.toFixed(2) + 'km');
    
    route.push({ lat: startLat, lng: startLng, name: "Start" });
    
    while (availableStops.length > 0) {
        let bestStop = null;
        let bestScore = -Infinity;
        let bestIndex = -1;
        
        availableStops.forEach(function(stop, index) {
            const currentToEnd = calculateDistance(currentLat, currentLng, endLat, endLng);
            const stopToEnd = calculateDistance(stop.lat, stop.lng, endLat, endLng);
            const progressToEnd = currentToEnd - stopToEnd;
            const detourDistance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
            
            // Skip stops that would make route too long
            const projectedDistance = totalDistance + detourDistance + stopToEnd;
            if (projectedDistance > maxRouteDistance) {
                return; // Skip this stop
            }
            
            // Skip stops that take us backwards
            if (progressToEnd < 0) {
                return; // Skip this stop
            }
            
            const densityScore = calculateDensityScore(stop, availableStops);
            
            const score = 
                (progressToEnd * 4.0) +    // Prioritize forward progress
                (densityScore * 0.5) -      // Slight bonus for clusters
                (detourDistance * 2.0);     // Penalize detours heavily
            
            if (score > bestScore) {
                bestScore = score;
                bestStop = stop;
                bestIndex = index;
            }
        });
        
        // Only add stop if score is positive AND we're under max distance
        if (bestStop && bestScore > 0 && (totalDistance + calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng)) < maxRouteDistance) {
            const distance = calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng);
            route.push(bestStop);
            totalDistance += distance;
            currentLat = bestStop.lat;
            currentLng = bestStop.lng;
            availableStops.splice(bestIndex, 1);
        } else {
            // No more good stops - head to end
            break;
        }
    }
    
    const finalDistance = calculateDistance(currentLat, currentLng, endLat, endLng);
    totalDistance += finalDistance;
    route.push({ lat: endLat, lng: endLng, name: "End" });
    
    console.log('Route generated: ' + route.length + ' points, ' + totalDistance.toFixed(2) + 'km total');
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2
    };
}

// Placeholder for samplePokestops (used by routing algorithm)
// This gets replaced by OSM data at runtime
let samplePokestops = [];
