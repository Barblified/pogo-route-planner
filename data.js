// Sample Pokéstop data for London (Trafalgar Square area)
const samplePokestops = [
    { name: "Nelson's Column", lat: 51.5081, lng: -0.1280 },
    { name: "National Gallery", lat: 51.5089, lng: -0.1283 },
    { name: "St Martin-in-the-Fields", lat: 51.5092, lng: -0.1264 },
    { name: "Admiralty Arch", lat: 51.5071, lng: -0.1276 },
    { name: "Horse Guards Parade", lat: 51.5045, lng: -0.1272 },
    { name: "Churchill War Rooms", lat: 51.5020, lng: -0.1293 },
    { name: "Westminster Abbey", lat: 51.4994, lng: -0.1273 },
    { name: "Big Ben", lat: 51.5007, lng: -0.1246 },
    { name: "London Eye", lat: 51.5033, lng: -0.1195 },
    { name: "Waterloo Station", lat: 51.5031, lng: -0.1132 },
    { name: "Southbank Centre", lat: 51.5056, lng: -0.1154 },
    { name: "Somerset House", lat: 51.5110, lng: -0.1170 },
    { name: "Covent Garden Market", lat: 51.5118, lng: -0.1226 },
    { name: "Leicester Square", lat: 51.5103, lng: -0.1301 },
    { name: "Piccadilly Circus", lat: 51.5100, lng: -0.1347 },
    { name: "Buckingham Palace", lat: 51.5014, lng: -0.1419 },
    { name: "St James's Park", lat: 51.5045, lng: -0.1339 },
    { name: "Tower of London", lat: 51.5081, lng: -0.0759 },
    { name: "Tower Bridge", lat: 51.5055, lng: -0.0754 },
    { name: "HMS Belfast", lat: 51.5065, lng: -0.0813 }
];

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate density score - how many other stops are nearby
function calculateDensityScore(stop, allStops, radius = 0.5) {
    let nearbyCount = 0;
    allStops.forEach(otherStop => {
        if (otherStop !== stop) {
            const distance = calculateDistance(stop.lat, stop.lng, otherStop.lat, otherStop.lng);
            if (distance < radius) {
                nearbyCount++;
            }
        }
    });
    return nearbyCount;
}

// DENSITY-AWARE routing algorithm - prefers routes through clusters (BALANCED VERSION)
function generateRouteStartToEnd(startLat, startLng, endLat, endLng) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [...samplePokestops];
    
    route.push({ lat: startLat, lng: startLng, name: "Start" });
    
    // Keep adding stops while moving towards end
    while (availableStops.length > 0) {
        let bestStop = null;
        let bestScore = -Infinity;
        let bestIndex = -1;
        
        availableStops.forEach((stop, index) => {
            // Calculate basic progress toward end
            const currentToEnd = calculateDistance(currentLat, currentLng, endLat, endLng);
            const stopToEnd = calculateDistance(stop.lat, stop.lng, endLat, endLng);
            const progressToEnd = currentToEnd - stopToEnd;
            const detourDistance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
            
            // Calculate density score (how many nearby stops)
            const densityScore = calculateDensityScore(stop, availableStops);
            
            // Combined score (BALANCED):
            // - Reward progress toward end (HIGH priority)
            // - Penalize detours moderately
            // - Bonus for dense areas (but not worth huge detours)
            const score = 
                (progressToEnd * 3.0) +      // Moving toward end is HIGH priority
                (densityScore * 0.8) -        // Dense areas are nice, but not worth huge detours
                (detourDistance * 1.2);       // Detours are actually expensive
            
            if (score > bestScore) {
                bestScore = score;
                bestStop = stop;
                bestIndex = index;
            }
        });
        
        // Add stop if it's worthwhile (reasonable threshold)
        if (bestStop && bestScore > 0.5) {
            const distance = calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng);
            route.push(bestStop);
            totalDistance += distance;
            currentLat = bestStop.lat;
            currentLng = bestStop.lng;
            availableStops.splice(bestIndex, 1);
        } else {
            break;
        }
    }
    
    // Add final leg to end
    const finalDistance = calculateDistance(currentLat, currentLng, endLat, endLng);
    totalDistance += finalDistance;
    route.push({ lat: endLat, lng: endLng, name: "End" });
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2
    };
}

// Legacy function for backward compatibility (not used in new version)
function generateRoute(startLat, startLng, targetDistance) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [...samplePokestops];
    
    route.push({ lat: startLat, lng: startLng, name: "Start Point" });
    
    while (totalDistance < targetDistance && availableStops.length > 0) {
        let nearestStop = null;
        let nearestDistance = Infinity;
        let nearestIndex = -1;
        
        availableStops.forEach((stop, index) => {
            const distance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestStop = stop;
                nearestIndex = index;
            }
        });
        
        if (!nearestStop) break;
        
        const returnDistance = calculateDistance(nearestStop.lat, nearestStop.lng, startLat, startLng);
        if (totalDistance + nearestDistance + returnDistance > targetDistance) {
            break;
        }
        
        route.push(nearestStop);
        totalDistance += nearestDistance;
        currentLat = nearestStop.lat;
        currentLng = nearestStop.lng;
        availableStops.splice(nearestIndex, 1);
    }
    
    totalDistance += calculateDistance(currentLat, currentLng, startLat, startLng);
    route.push({ lat: startLat, lng: startLng, name: "End Point" });
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2
    };
}
