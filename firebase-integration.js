// firebase-integration.js - Firebase Realtime Database integration

let firebaseInitialized = false;

function initializeFirebase() {
    if (firebaseInitialized) {
        console.log('Firebase already initialized');
        return;
    }
    
    const firebaseConfig = {
        apiKey: "AIzaSyCviwIQ0pLbIHGNDg489a5kT-X09JRVQ9E",
        authDomain: "pogo-route-planner.firebaseapp.com",
        databaseURL: "https://pogo-route-planner-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "pogo-route-planner",
        storageBucket: "pogo-route-planner.firebasestorage.app",
        messagingSenderId: "21741546648",
        appId: "1:21741546648:web:dbe9a7ce442def5d93b4ed"
    };
    
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
    } else {
        console.error('Firebase SDK not loaded');
    }
}

// Submit stop report to Firebase (confirm/reject for OSM stops)
function submitStopReportToFirebase(osmId, lat, lng, type, name) {
    if (!firebaseInitialized) {
        console.error('Firebase not initialized');
        return Promise.reject('Firebase not initialized');
    }
    
    // Create Firebase-safe key
    const reportKey = osmId || ('coord_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_'));
    const userId = getUserId();
    
    const database = firebase.database();
    const reportRef = database.ref('stop_reports/' + reportKey);
    
    return reportRef.once('value').then(function(snapshot) {
        let reportData = snapshot.val() || {
            osmId: osmId,
            lat: lat,
            lng: lng,
            name: name,
            confirms: 0,
            rejects: 0,
            userVotes: {},
            created: firebase.database.ServerValue.TIMESTAMP,
            lastUpdated: firebase.database.ServerValue.TIMESTAMP
        };
        
        // Check previous vote
        const previousVote = reportData.userVotes[userId];
        
        // Remove previous vote count
        if (previousVote === 'confirm') {
            reportData.confirms = Math.max(0, reportData.confirms - 1);
        } else if (previousVote === 'reject') {
            reportData.rejects = Math.max(0, reportData.rejects - 1);
        }
        
        // Add new vote
        if (type === 'confirm') {
            reportData.confirms++;
        } else if (type === 'reject') {
            reportData.rejects++;
        }
        
        reportData.userVotes[userId] = type;
        reportData.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
        
        return reportRef.set(reportData);
    });
}

// Submit missing stop to Firebase
function submitMissingStopToFirebase(lat, lng, name, description) {
    if (!firebaseInitialized) {
        console.error('Firebase not initialized');
        return Promise.reject('Firebase not initialized');
    }
    
    // Create Firebase-safe key
    const reportKey = 'missing_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_');
    const userId = getUserId();
    
    const database = firebase.database();
    const reportRef = database.ref('missing_stops/' + reportKey);
    
    return reportRef.once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            // Already exists, just add a confirm vote
            let reportData = snapshot.val();
            reportData.confirms = (reportData.confirms || 0) + 1;
            if (!reportData.userVotes) {
                reportData.userVotes = {};
            }
            reportData.userVotes[userId] = 'confirm';
            reportData.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
            return reportRef.set(reportData);
        } else {
            // Create new missing stop report
            const reportData = {
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                reportedBy: userId,
                created: firebase.database.ServerValue.TIMESTAMP,
                lastUpdated: firebase.database.ServerValue.TIMESTAMP,
                confirms: 1,
                rejects: 0,
                userVotes: {},
                status: 'approved'
            };
            reportData.userVotes[userId] = 'confirm';
            return reportRef.set(reportData);
        }
    });
}

// Submit reject vote for community stop
function submitMissingStopRejectToFirebase(lat, lng) {
    if (!firebaseInitialized) {
        console.error('Firebase not initialized');
        return Promise.reject('Firebase not initialized');
    }
    
    // Create Firebase-safe key
    const reportKey = 'missing_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_');
    const userId = getUserId();
    
    const database = firebase.database();
    const reportRef = database.ref('missing_stops/' + reportKey);
    
    return reportRef.once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            let reportData = snapshot.val();
            
            // Check previous vote
            const previousVote = reportData.userVotes ? reportData.userVotes[userId] : null;
            
            // Remove previous vote count
            if (previousVote === 'confirm') {
                reportData.confirms = Math.max(0, (reportData.confirms || 0) - 1);
            } else if (previousVote === 'reject') {
                reportData.rejects = Math.max(0, (reportData.rejects || 0) - 1);
            }
            
            // Add reject vote
            reportData.rejects = (reportData.rejects || 0) + 1;
            if (!reportData.userVotes) {
                reportData.userVotes = {};
            }
            reportData.userVotes[userId] = 'reject';
            reportData.lastUpdated = firebase.database.ServerValue.TIMESTAMP;
            
            return reportRef.set(reportData);
        } else {
            return Promise.reject('Missing stop not found');
        }
    });
}

// Get community stops and rejected stops from Firebase
function getApprovedStopsFromFirebase(callback) {
    if (!firebaseInitialized) {
        console.error('Firebase not initialized');
        callback([], []);
        return;
    }
    
    const database = firebase.database();
    const communityStops = [];
    const rejectedStops = [];
    
    // Get OSM stop reports (to find rejected stops)
    database.ref('stop_reports').once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                const report = childSnapshot.val();
                
                // If ANY rejects, hide the stop immediately
                if (report.rejects >= 1) {
                    rejectedStops.push({
                        osmId: report.osmId,
                        lat: report.lat,
                        lng: report.lng,
                        name: report.name
                    });
                }
            });
        }
        
        // Get community-reported missing stops
        return database.ref('missing_stops').once('value');
    }).then(function(snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                const report = childSnapshot.val();
                
                // Check if rejected (1+ reject votes)
                const rejects = report.rejects || 0;
                
                if (rejects >= 1) {
                    // Hide rejected community stops
                    rejectedStops.push({
                        osmId: null,
                        lat: report.lat,
                        lng: report.lng,
                        name: report.name || 'Community Stop'
                    });
                } else if (report.status === 'approved') {
                    // Show approved community stops
                    communityStops.push({
                        osmId: null,
                        lat: report.lat,
                        lng: report.lng,
                        name: report.name || 'Community Stop',
                        score: 1
                    });
                }
            });
        }
        
        callback(communityStops, rejectedStops);
    }).catch(function(error) {
        console.error('Firebase fetch error:', error);
        callback([], []);
    });
}

// Get user's vote from Firebase
function getUserVoteFromFirebase(osmId, lat, lng, callback) {
    if (!firebaseInitialized) {
        callback(null);
        return;
    }
    
    // Create Firebase-safe key
    const reportKey = osmId || ('coord_' + lat.toFixed(6).replace(/\./g, '_') + '_' + lng.toFixed(6).replace(/\./g, '_'));
    const userId = getUserId();
    
    const database = firebase.database();
    database.ref('stop_reports/' + reportKey + '/userVotes/' + userId).once('value').then(function(snapshot) {
        callback(snapshot.val());
    }).catch(function(error) {
        console.error('Firebase fetch error:', error);
        callback(null);
    });
}
