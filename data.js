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

// Calculate distance from point to line segment
function distanceToLineSegment(pointLat, pointLng, line1Lat, line1Lng, line2Lat, line2Lng) {
    // Convert to radians
    const lat1 = line1Lat * Math.PI / 180;
    const lng1 = line1Lng * Math.PI / 180;
    const lat2 = line2Lat * Math.PI / 180;
    const lng2 = line2Lng * Math.PI / 180;
    const latP = pointLat * Math.PI / 180;
    const lngP = pointLng * Math.PI / 180;
    
    // Simple approximation: calculate perpendicular distance
    const A = calculateDistance(pointLat, pointLng, line1Lat, line1Lng);
    const B = calculateDistance(pointLat, pointLng, line2Lat, line2Lng);
    const C = calculateDistance(line1Lat, line1Lng, line2Lat, line2Lng);
    
    // If line segment is very short, return distance to nearest endpoint
    if (C < 0.001) {
        return Math.min(A, B);
    }
    
    // Use Heron's formula for triangle area, then calculate height
    const s = (A + B + C) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - A) * (s - B) * (s - C)));
    const height = (2 * area) / C;
    
    // Check if perpendicular point is within segment
    const dotProduct = (A * A + C * C - B * B) / (2 * C);
    if (dotProduct < 0) return A;
    if (dotProduct > C) return B;
    
    return height;
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

// Find stops within proximity of a route path
function findStopsNearPath(routePath, allStops, proximityKm) {
    proximityKm = proximityKm || 0.04; // 40 meters default
    const nearbyStops = [];
    
    // Check each stop against each segment of the route
    allStops.forEach(function(stop) {
        let minDistance = Infinity;
        
        // Check distance to each route segment
        for (let i = 0; i < routePath.length - 1; i++) {
            const segmentDistance = distanceToLineSegment(
                stop.lat, stop.lng,
                routePath[i].lat, routePath[i].lng,
                routePath[i + 1].lat, routePath[i + 1].lng
            );
            minDistance = Math.min(minDistance, segmentDistance);
        }
        
        if (minDistance <= proximityKm) {
            nearbyStops.push({
                stop: stop,
                distance: minDistance
            });
        }
    });
    
    return nearbyStops;
}

// IMPROVED: Routing algorithm with 40m proximity detection
function generateRouteStartToEnd(startLat, startLng, endLat, endLng) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [].concat(samplePokestops);
    
    // Calculate straight-line distance between start and end
    const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
    
    // Maximum allowed route distance (direct distance * 1.8)
    // Increased slightly to allow some detours for high-value stops
    const maxRouteDistance = directDistance * 1.8;
    
    console.log('Direct distance: ' + directDistance.toFixed(2) + 'km, Max route: ' + maxRouteDistance.toFixed(2) + 'km');
    
    route.push({ lat: startLat, lng: startLng, name: "Start" });
    
    // Track visited stops (including proximity visits)
    let visitedStops = [];
    
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
            
            // Skip stops that take us backwards significantly
            if (progressToEnd < -0.1) {
                return; // Skip this stop
            }
            
            const densityScore = calculateDensityScore(stop, availableStops);
            
            // Calculate score based on:
            // 1. Forward progress (high weight)
            // 2. Low detour distance (high weight)
            // 3. Density bonus (medium weight)
            const score = 
                (progressToEnd * 5.0) +     // Strong preference for forward progress
                (densityScore * 0.8) -       // Bonus for clusters
                (detourDistance * 3.0);      // Heavy penalty for detours
            
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
            visitedStops.push(bestStop);
        } else {
            // No more good stops - head to end
            break;
        }
    }
    
    const finalDistance = calculateDistance(currentLat, currentLng, endLat, endLng);
    totalDistance += finalDistance;
    route.push({ lat: endLat, lng: endLng, name: "End" });
    
    // NOW: Find stops within 40m of the route that we didn't explicitly visit
    const proximityStops = findStopsNearPath(route, samplePokestops, 0.04);
    
    // Filter out stops we already visited
    const bonusStops = proximityStops.filter(function(item) {
        return !visitedStops.some(function(visited) {
            return visited.lat === item.stop.lat && visited.lng === item.stop.lng;
        });
    });
    
    console.log('Route generated: ' + route.length + ' waypoints, ' + totalDistance.toFixed(2) + 'km total');
    console.log('Explicit visits: ' + visitedStops.length);
    console.log('Proximity visits (within 40m): ' + bonusStops.length);
    console.log('Total stops: ' + (visitedStops.length + bonusStops.length));
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: visitedStops.length + bonusStops.length,
        explicitStops: visitedStops.length,
        proximityStops: bonusStops.length
    };
}

// Placeholder for samplePokestops (used by routing algorithm)
// This gets replaced by OSM data at runtime
let samplePokestops = [];
```

---

## **WHAT THIS DOES:**

✅ **Calculates distance from each stop to your route**  
✅ **Counts stops within 40m as "visited"** (even if not in waypoints)  
✅ **Shows breakdown:** explicit visits vs proximity visits  
✅ **Shorter routes, more stops!**  

---

## **EXAMPLE OUTPUT YOU'LL SEE:**
```
Route generated: 8 waypoints, 1.2km total
Explicit visits: 3
Proximity visits (within 40m): 5
Total stops: 8
