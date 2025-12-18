// reports.js - Community reporting system for Pokéstops

// Generate a unique user ID (persists in localStorage)
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// Get all reports from localStorage
function getReports() {
    const reports = localStorage.getItem('stopReports');
    return reports ? JSON.parse(reports) : [];
}

// Get all missing stop reports from localStorage
function getMissingStopReports() {
    const reports = localStorage.getItem('missingStopReports');
    return reports ? JSON.parse(reports) : [];
}

// Submit a report (confirm or reject)
function submitReport(osmId, lat, lng, type, name) {
    const reports = getReports();
    const userId = getUserId();
    
    // Create a unique key for this stop (Firebase-safe)
    const stopKey = osmId || ('coord_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_'));
    
    // Find existing report for this stop
    let report = reports.find(function(r) { return r.stopKey === stopKey; });
    
    if (!report) {
        report = {
            stopKey: stopKey,
            osmId: osmId,
            lat: lat,
            lng: lng,
            name: name,
            confirms: 0,
            rejects: 0,
            userVotes: {}
        };
        reports.push(report);
    }
    
    // Check if user already voted
    const previousVote = report.userVotes[userId];
    
    if (previousVote === type) {
        // Same vote, do nothing
        return false;
    }
    
    // Remove previous vote if exists
    if (previousVote === 'confirm') {
        report.confirms--;
    } else if (previousVote === 'reject') {
        report.rejects--;
    }
    
    // Add new vote
    if (type === 'confirm') {
        report.confirms++;
    } else if (type === 'reject') {
        report.rejects++;
    }
    
    report.userVotes[userId] = type;
    
    // Save to localStorage
    localStorage.setItem('stopReports', JSON.stringify(reports));
    
    console.log('Report submitted:', type, 'for', name);
    return true;
}

// Get report for a specific stop
function getReportForStop(osmId, lat, lng) {
    const reports = getReports();
    const stopKey = osmId || ('coord_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_'));
    return reports.find(function(r) { return r.stopKey === stopKey; });
}

// Get user's vote for a specific stop
function getUserVote(osmId, lat, lng) {
    const report = getReportForStop(osmId, lat, lng);
    if (!report) return null;
    
    const userId = getUserId();
    return report.userVotes[userId] || null;
}

// Calculate distance between two points (Haversine formula)
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

// Report a missing stop
function reportMissingStop(lat, lng, name, description) {
    const reports = getMissingStopReports();
    
    // Check if already reported (within 10 meters)
    const exists = reports.some(function(r) {
        const distance = calculateDistance(lat, lng, r.lat, r.lng);
        return distance < 0.01; // 10 meters
    });
    
    if (exists) {
        return false;
    }
    
    // Create Firebase-safe ID
    const safeId = 'missing_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_');
    
    const report = {
        id: safeId,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        reportedAt: new Date().toISOString(),
        userId: getUserId(),
        status: 'approved'
    };
    
    reports.push(report);
    localStorage.setItem('missingStopReports', JSON.stringify(reports));
    
    console.log('Missing stop reported:', report.id);
    return true;
}

// Get stats for reporting
function getReportingStats() {
    const reports = getReports();
    const missingReports = getMissingStopReports();
    
    const totalConfirms = reports.reduce(function(sum, r) { return sum + r.confirms; }, 0);
    const totalRejects = reports.reduce(function(sum, r) { return sum + r.rejects; }, 0);
    
    return {
        stopsReported: reports.length,
        missingStops: missingReports.length,
        totalConfirms: totalConfirms,
        totalRejects: totalRejects,
        netScore: totalConfirms - totalRejects
    };
}

// Get approved stops (OSM stops need 3+ net confirms)
function getApprovedStops() {
    const reports = getReports();
    return reports.filter(function(r) {
        const netVotes = r.confirms - r.rejects;
        return netVotes >= 3;
    }).map(function(r) {
        return {
            osmId: r.osmId,
            lat: r.lat,
            lng: r.lng,
            name: r.name,
            score: r.confirms - r.rejects
        };
    });
}

// Get all reported missing stops (auto-approved after 1 report)
function getReportedMissingStops() {
    const reports = getMissingStopReports();
    return reports.filter(function(r) {
        return r.status !== 'rejected';
    }).map(function(r) {
        return {
            osmId: null,
            lat: r.lat,
            lng: r.lng,
            name: r.name || 'Community Stop',
            score: 1
        };
    });
}

// Get rejected stops (3+ net rejects)
function getRejectedStops() {
    const reports = getReports();
    return reports.filter(function(r) {
        const netVotes = r.confirms - r.rejects;
        return netVotes <= -3;
    }).map(function(r) {
        return {
            osmId: r.osmId,
            lat: r.lat,
            lng: r.lng,
            name: r.name,
            score: r.confirms - r.rejects
        };
    });
}

// Clear all reports (admin function)
function clearAllReports() {
    localStorage.removeItem('stopReports');
    localStorage.removeItem('missingStopReports');
    console.log('All reports cleared');
}
