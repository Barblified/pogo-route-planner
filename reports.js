// Community reporting system for Pokéstop validation
// Uses localStorage for client-side storage

const REPORTS_STORAGE_KEY = 'pokestop_reports';
const USER_ID_KEY = 'user_id';

// Initialize or get user ID
function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

// Get all reports
function getReports() {
    const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!reportsJson) {
        return {};
    }
    try {
        return JSON.parse(reportsJson);
    } catch (e) {
        console.error('Error parsing reports:', e);
        return {};
    }
}

// Save reports
function saveReports(reports) {
    try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
        return true;
    } catch (e) {
        console.error('Error saving reports:', e);
        return false;
    }
}

// Submit a report
function submitReport(osmId, lat, lng, type, name) {
    const reports = getReports();
    const userId = getUserId();
    const reportKey = osmId || (lat.toFixed(6) + ',' + lng.toFixed(6));
    
    if (!reports[reportKey]) {
        reports[reportKey] = {
            osmId: osmId,
            lat: lat,
            lng: lng,
            name: name,
            confirms: 0,
            rejects: 0,
            userVotes: {}
        };
    }
    
    // Remove previous vote from this user
    if (reports[reportKey].userVotes[userId]) {
        const prevVote = reports[reportKey].userVotes[userId];
        if (prevVote === 'confirm') {
            reports[reportKey].confirms--;
        } else if (prevVote === 'reject') {
            reports[reportKey].rejects--;
        }
    }
    
    // Add new vote
    if (type === 'confirm') {
        reports[reportKey].confirms++;
        reports[reportKey].userVotes[userId] = 'confirm';
    } else if (type === 'reject') {
        reports[reportKey].rejects++;
        reports[reportKey].userVotes[userId] = 'reject';
    }
    
    reports[reportKey].lastUpdated = new Date().toISOString();
    
    saveReports(reports);
    
    console.log('Report submitted:', reportKey, type);
    
    return reports[reportKey];
}

// Report missing stop
function reportMissingStop(lat, lng, name, description) {
    const reports = getReports();
    const userId = getUserId();
    const reportKey = 'missing_' + lat.toFixed(6) + ',' + lng.toFixed(6);
    
    if (!reports[reportKey]) {
        reports[reportKey] = {
            type: 'missing',
            lat: lat,
            lng: lng,
            name: name || 'Unnamed Stop',
            description: description || '',
            reportedBy: userId,
            reportedAt: new Date().toISOString(),
            confirms: 1,
            rejects: 0,
            userVotes: {}
        };
        
        reports[reportKey].userVotes[userId] = 'confirm';
        
        saveReports(reports);
        
        console.log('Missing stop reported:', reportKey);
        
        return reports[reportKey];
    } else {
        console.log('Stop already reported at this location');
        return null;
    }
}

// Get report for specific stop
function getReportForStop(osmId, lat, lng) {
    const reports = getReports();
    const reportKey = osmId || (lat.toFixed(6) + ',' + lng.toFixed(6));
    return reports[reportKey] || null;
}

// Get user's vote for a stop
function getUserVote(osmId, lat, lng) {
    const report = getReportForStop(osmId, lat, lng);
    if (!report) return null;
    
    const userId = getUserId();
    return report.userVotes[userId] || null;
}

// Calculate confidence score for a stop based on reports
function calculateConfidence(osmId, lat, lng, baseScore) {
    const report = getReportForStop(osmId, lat, lng);
    if (!report) {
        return baseScore;
    }
    
    const netVotes = report.confirms - report.rejects;
    
    // Each confirm adds +1, each reject subtracts -2
    const adjustment = report.confirms + (report.rejects * -2);
    
    return baseScore + adjustment;
}

// Get all missing stop reports
function getMissingStops() {
    const reports = getReports();
    const missing = [];
    
    for (const key in reports) {
        if (reports[key].type === 'missing') {
            missing.push(reports[key]);
        }
    }
    
    return missing;
}

// Export stats
function getReportStats() {
    const reports = getReports();
    let totalReports = 0;
    let totalConfirms = 0;
    let totalRejects = 0;
    let totalMissing = 0;
    
    for (const key in reports) {
        if (reports[key].type === 'missing') {
            totalMissing++;
        } else {
            totalReports++;
            totalConfirms += reports[key].confirms;
            totalRejects += reports[key].rejects;
        }
    }
    
    return {
        totalReports: totalReports,
        totalConfirms: totalConfirms,
        totalRejects: totalRejects,
        totalMissing: totalMissing,
        userId: getUserId()
    };
}

// Clear all reports (for testing)
function clearAllReports() {
    localStorage.removeItem(REPORTS_STORAGE_KEY);
    console.log('All reports cleared');
}
