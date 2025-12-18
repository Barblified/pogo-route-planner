# 🗺️ Pokemon Go Route Planner

**Optimise your Pokemon Go walks with intelligent route planning.**

Plan efficient walking routes that maximise Pokéstops visited. Perfect for Community Days, daily commutes, and exploring new areas.

🔗 **Live Demo:** [barblified.github.io/pogo-route-planner](https://barblified.github.io/pogo-route-planner)

---

## ✨ Features

### 🎯 **Smart Route Optimization**
- Intelligent pathfinding algorithm that maximises Pokéstops between any two points
- 40m proximity detection - counts stops within spin range without unnecessary detours
- Adjustable route parameters (1.8x direct distance max)

### 📱 **Seamless Navigation**
- One-click export to Google Maps or Apple Maps
- GPX file download for GPS devices
- Mobile-responsive design
- Geolocation support

### 🗄️ **Community-Powered Database**
- Real-time Firebase integration
- User-submitted stop reports
- Auto-approval system (3+ confirms = verified)
- Auto-rejection system (3+ rejects = removed)
- 24-hour OSM data caching for performance

### 🌍 **Wide Coverage**
- **Excellent:** Major UK cities (London, Manchester, Birmingham, Leeds, York, etc.)
- **Good:** UK suburbs and towns
- **Growing:** US cities (experimental)
- Uses OpenStreetMap + community contributions

### 📊 **Data Sources**
- OpenStreetMap POI data (churches, monuments, art, fountains, etc.)
- ML scoring system (filters 6000+ POIs → ~180 high-confidence stops)
- Community reports (Firebase real-time database)
- 100% legal - no scraped data

---

## 🚀 Quick Start

### Try it Now
1. Visit [barblified.github.io/pogo-route-planner](https://barblified.github.io/pogo-route-planner)
2. Enter start and end locations
3. Click "Generate Optimal Route"
4. Export to Maps and start walking!
