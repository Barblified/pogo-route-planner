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
    const A = calculateDistance(pointLat, pointLng, line1Lat, line1Lng);
    const B = calculateDistance(pointLat, pointLng, line2Lat, line2Lng);
    const C = calculateDistance(line1Lat, line1Lng, line2Lat, line2Lng);
    
    if (C < 0.001) {
        return Math.min(A, B);
    }
    
    const s = (A + B + C) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - A) * (s - B) * (s - C)));
    const height = (2 * area) / C;
    
    const dotProduct = (A * A + C * C - B * B) / (2 * C);
    if (dotProduct < 0) return A;
    if (dotProduct > C) return B;
    
    return height;
}

// Calculate density score
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

// Find stops within proximity of route
function findStopsNearPath(routePath, allStops, proximityKm) {
    proximityKm = proximityKm || 0.04;
    const nearbyStops = [];
    
    allStops.forEach(function(stop) {
        let minDistance = Infinity;
        
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

// Routing algorithm with 40m proximity
function generateRouteStartToEnd(startLat, startLng, endLat, endLng) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [].concat(samplePokestops);
    
    const directDistance = calculateDistance(startLat, startLng, endLat, endLng);
    const maxRouteDistance = directDistance * 1.8;
    
    console.log('Direct distance: ' + directDistance.toFixed(2) + 'km, Max route: ' + maxRouteDistance.toFixed(2) + 'km');
    
    route.push({ lat: startLat, lng: startLng, name: "Start" });
    
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
            
            const projectedDistance = totalDistance + detourDistance + stopToEnd;
            if (projectedDistance > maxRouteDistance) {
                return;
            }
            
            if (progressToEnd < -0.1) {
                return;
            }
            
            const densityScore = calculateDensityScore(stop, availableStops);
            
            const score = (progressToEnd * 5.0) + (densityScore * 0.8) - (detourDistance * 3.0);
            
            if (score > bestScore) {
                bestScore = score;
                bestStop = stop;
                bestIndex = index;
            }
        });
        
        if (bestStop && bestScore > 0 && (totalDistance + calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng)) < maxRouteDistance) {
            const distance = calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng);
            route.push(bestStop);
            totalDistance += distance;
            currentLat = bestStop.lat;
            currentLng = bestStop.lng;
            availableStops.splice(bestIndex, 1);
            visitedStops.push(bestStop);
        } else {
            break;
        }
    }
    
    const finalDistance = calculateDistance(currentLat, currentLng, endLat, endLng);
    totalDistance += finalDistance;
    route.push({ lat: endLat, lng: endLng, name: "End" });
    
    const proximityStops = findStopsNearPath(route, samplePokestops, 0.04);
    
    const bonusStops = proximityStops.filter(function(item) {
        return !visitedStops.some(function(visited) {
            return visited.lat === item.stop.lat && visited.lng === item.stop.lng;
        });
    });
    
    console.log('Route: ' + route.length + ' waypoints, ' + totalDistance.toFixed(2) + 'km');
    console.log('Explicit: ' + visitedStops.length + ', Proximity: ' + bonusStops.length + ', Total: ' + (visitedStops.length + bonusStops.length));
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: visitedStops.length + bonusStops.length,
        explicitStops: visitedStops.length,
        proximityStops: bonusStops.length
    };
}

let samplePokestops = [];
