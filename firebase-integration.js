// Firebase Realtime Database Integration for Pokemon Go Route Planner
// Stores community-submitted stop reports in real-time

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCviwIQ0pLbIHGNDg489a5kT-X09JRVQ9E",
  authDomain: "pogo-route-planner.firebaseapp.com",
  databaseURL: "https://pogo-route-planner-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pogo-route-planner",
  storageBucket: "pogo-route-planner.firebasestorage.app",
  messagingSenderId: "21741546648",
  appId: "1:21741546648:web:dbe9a7ce442def5d93b4ed"
};

// Initialize Firebase (will be done via CDN script tags)
let database = null;

function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return false;
  }
  
  try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase init error:', error);
    return false;
  }
}

// Submit stop report to Firebase
function submitStopReportToFirebase(osmId, lat, lng, type, name) {
  if (!database) {
    console.error('Firebase not initialized');
    return Promise.reject('Firebase not available');
  }
  
  const userId = getUserId();
  const reportKey = osmId || 'coord_' + lat.toFixed(6) + '_' + lng.toFixed(6);
  const reportRef = database.ref('stop_reports/' + reportKey);
  
  return reportRef.once('value').then(function(snapshot) {
    const existing = snapshot.val();
    
    if (!existing) {
      // New report
      return reportRef.set({
        osmId: osmId || null,
        lat: lat,
        lng: lng,
        name: name,
        confirms: type === 'confirm' ? 1 : 0,
        rejects: type === 'reject' ? 1 : 0,
        created: firebase.database.ServerValue.TIMESTAMP,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP,
        userVotes: {
          [userId]: type
        }
      });
    } else {
      // Update existing
      const updates = {};
      
      // Remove old vote
      if (existing.userVotes && existing.userVotes[userId]) {
        const oldVote = existing.userVotes[userId];
        if (oldVote === 'confirm') {
          updates['confirms'] = (existing.confirms || 0) - 1;
        } else if (oldVote === 'reject') {
          updates['rejects'] = (existing.rejects || 0) - 1;
        }
      }
      
      // Add new vote
      if (type === 'confirm') {
        updates['confirms'] = (updates['confirms'] !== undefined ? updates['confirms'] : existing.confirms || 0) + 1;
      } else if (type === 'reject') {
        updates['rejects'] = (updates['rejects'] !== undefined ? updates['rejects'] : existing.rejects || 0) + 1;
      }
      
      updates['lastUpdated'] = firebase.database.ServerValue.TIMESTAMP;
      updates['userVotes/' + userId] = type;
      
      return reportRef.update(updates);
    }
  });
}

// Submit missing stop to Firebase
function submitMissingStopToFirebase(lat, lng, name, description) {
  if (!database) {
    console.error('Firebase not initialized');
    return Promise.reject('Firebase not available');
  }
  
  const userId = getUserId();
  const reportKey = 'missing_' + lat.toFixed(6) + '_' + lng.toFixed(6);
  const reportRef = database.ref('missing_stops/' + reportKey);
  
  return reportRef.once('value').then(function(snapshot) {
    if (snapshot.exists()) {
      console.log('Stop already reported at this location');
      return null;
    }
    
    return reportRef.set({
      lat: lat,
      lng: lng,
      name: name || 'Unnamed Stop',
      description: description || '',
      reportedBy: userId,
      created: firebase.database.ServerValue.TIMESTAMP,
      confirms: 1,
      rejects: 0,
      status: 'pending',
      userVotes: {
        [userId]: 'confirm'
      }
    });
  });
}

// Get all approved stops from Firebase
function getApprovedStopsFromFirebase(callback) {
  if (!database) {
    callback([], []);
    return;
  }
  
  const confirmedStops = [];
  const rejectedStops = [];
  
  database.ref('stop_reports').once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      const data = child.val();
      const netVotes = (data.confirms || 0) - (data.rejects || 0);
      
      // Auto-approve with 3+ net confirms
      if (netVotes >= 3) {
        confirmedStops.push({
          osmId: data.osmId,
          lat: data.lat,
          lng: data.lng,
          name: data.name,
          score: 10 + netVotes,
          source: 'community'
        });
      }
      
      // Auto-reject with 3+ net rejects
      if (netVotes <= -3) {
        rejectedStops.push({
          osmId: data.osmId,
          lat: data.lat,
          lng: data.lng
        });
      }
    });
    
    // Get missing stops
    database.ref('missing_stops').once('value').then(function(missingSnapshot) {
      missingSnapshot.forEach(function(child) {
        const data = child.val();
        const netVotes = (data.confirms || 0) - (data.rejects || 0);
        
        if (netVotes >= 3) {
          confirmedStops.push({
            osmId: null,
            lat: data.lat,
            lng: data.lng,
            name: data.name,
            score: 8 + netVotes,
            source: 'community_missing'
          });
        }
      });
      
      callback(confirmedStops, rejectedStops);
    });
  }).catch(function(error) {
    console.error('Firebase read error:', error);
    callback([], []);
  });
}

// Get user's vote from Firebase
function getUserVoteFromFirebase(osmId, lat, lng, callback) {
  if (!database) {
    callback(null);
    return;
  }
  
  const userId = getUserId();
  const reportKey = osmId || 'coord_' + lat.toFixed(6) + '_' + lng.toFixed(6);
  
  database.ref('stop_reports/' + reportKey + '/userVotes/' + userId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  }).catch(function() {
    callback(null);
  });
}
