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

// Greedy nearest-neighbor routing algorithm
function generateRoute(startLat, startLng, targetDistance) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [...samplePokestops];
    
    route.push({ lat: startLat, lng: startLng, name: "Start Point" });
    
    while (totalDistance < targetDistance && availableStops.length > 0) {
        // Find nearest unvisited stop
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
        
        // Check if adding this stop would exceed target distance
        const returnDistance = calculateDistance(nearestStop.lat, nearestStop.lng, startLat, startLng);
        if (totalDistance + nearestDistance + returnDistance > targetDistance) {
            break;
        }
        
        // Add stop to route
        route.push(nearestStop);
        totalDistance += nearestDistance;
        currentLat = nearestStop.lat;
        currentLng = nearestStop.lng;
        availableStops.splice(nearestIndex, 1);
    }
    
    // Return to start
    const returnDistance = calculateDistance(currentLat, currentLng, startLat, startLng);
    totalDistance += returnDistance;
    route.push({ lat: startLat, lng: startLng, name: "End Point" });
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2 // Exclude start and end
    };
}
