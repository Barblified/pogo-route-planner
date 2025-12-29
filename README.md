# 🗺️ TrainerTrails

**Smart route planning for Pokémon GO trainers**

[![Beta](https://img.shields.io/badge/status-beta-orange)](https://trainertrails.com)
[![Mobile-First](https://img.shields.io/badge/platform-mobile--first-blue)](https://trainertrails.com/planner.html)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> 🚀 **Now in Public Beta!** Help us test and improve TrainerTrails.

---

## ✨ What is TrainerTrails?

TrainerTrails is a mobile-first route planner designed specifically for Pokémon GO players. Unlike generic mapping tools, TrainerTrails:

- 🚶 **Uses real footpaths and trails** - not just roads
- 🌍 **Works worldwide** - powered by OpenStreetMap data
- 👥 **Community-driven** - trainers help build the Pokéstop database
- 📊 **Optimizes routes** - maximize Pokéstops per kilometer
- 📱 **Built for mobile** - tap, swipe, and go

**[🎯 Start Planning Routes →](https://trainertrails.com/planner.html)**

---

## 🎮 Features

### Core Functionality
- **Route Generation**: Set start/end points, get optimized walking routes
- **Real Pedestrian Paths**: Includes footpaths, trails, and off-road routes via OpenRouteService
- **Pokéstop Detection**: Automatic detection using OpenStreetMap data + community reports
- **Export Options**: 
  - Open in Google Maps / Apple Maps
  - Download GPX files for fitness trackers
  
### Community Features
- **Report Missing Stops**: Tap the map to add Pokéstops we missed
- **Confirm/Reject Stops**: Help validate the database
- **Crowdsourced Accuracy**: Community voting improves data quality

### Route Intelligence
- Efficiency stats (stops per km)
- Estimated walk time
- Distance breakdown
- Data quality reports

---

## 📱 Platform Support

### ✅ Fully Supported
- **iOS Safari** (iPhone/iPad)
- **Android Chrome** (Phone/Tablet)
- **Mobile Browsers** (optimized experience)

### ⚠️ Desktop (Limited)
Desktop users will see the mobile interface centered on screen. Full desktop support coming soon!

---

## 🚀 How to Use

1. **Open TrainerTrails** on your phone: [trainertrails.com/planner.html](https://trainertrails.com/planner.html)
2. **Set your start location** by tapping the map or using your GPS
3. **Set your end location** the same way
4. **Generate route** - TrainerTrails finds the best path with maximum Pokéstops
5. **Export to Maps** or download GPX to follow the route

### Pro Tips
- Use "My Location" for quick setup
- Tap map instead of typing addresses (faster!)
- Export to your favorite maps app for turn-by-turn navigation
- Report missing stops to help the community

---

## 🐛 Known Issues (Beta)

This is a **public beta**. Here are known limitations:

- **Desktop mode disabled** - mobile interface only for now
- **Data coverage varies** - UK/Europe has best Pokéstop data
- **Community database growing** - some stops may be missing
- **Route optimization** - algorithm may not always find the absolute best route

**[Report bugs on GitHub Issues →](https://github.com/TomGuyler/trainertrails/issues)**

---

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks!)
- **Mapping**: Leaflet.js + CartoDB tiles
- **Routing**: OpenRouteService API (via Cloudflare Worker proxy)
- **Data**: OpenStreetMap + Firebase Realtime Database
- **Hosting**: GitHub Pages
- **Security**: HMAC-SHA256 request signing

### Security Features
- Request signing prevents API abuse
- Firebase security rules protect community data
- No user tracking or analytics
- Open source for transparency

---

## 🤝 Contributing

TrainerTrails is in beta and needs your help!

### Ways to Contribute:

1. **🧪 Test the app** - use it on your walks and report issues
2. **🐛 Report bugs** - [GitHub Issues](https://github.com/TomGuyler/trainertrails/issues)
3. **💡 Suggest features** - open a GitHub Issue with your ideas
4. **📍 Improve data** - report missing/incorrect Pokéstops in-app
5. **💬 Spread the word** - share with your local community

### Development Contributions

Want to contribute code? Great! Here's how:

```bash
# Clone the repo
git clone https://github.com/TomGuyler/trainertrails.git

# Open in your editor
cd trainertrails

# Test locally (needs a local server)
python -m http.server 8000
# or
npx serve

# Open http://localhost:8000/planner.html
```

**Before submitting PRs:**
- Test on mobile devices (primary platform)
- Keep code vanilla JS (no build tools)
- Follow existing code style
- Update README if needed

---

## 📊 Roadmap

### ✅ Phase 1 - Beta Launch (DONE)
- ✅ Mobile-first route planner
- ✅ Real footpath routing
- ✅ Community Pokéstop database
- ✅ Firebase integration
- ✅ Public beta release

### 🎯 Phase 2 - Improvements (In Progress)
- ⏳ Desktop mode (proper layout)
- ⏳ Improved route optimization algorithm
- ⏳ Multi-stop route planning (>2 points)
- ⏳ Save/load routes
- ⏳ User accounts (optional)

### 🔮 Phase 3 - Advanced Features (Planned)
- 📋 Loop route generation
- 📋 Time-based planning (e.g., "45 min walk")
- 📋 Gym + Raid integration
- 📋 Event route planning
- 📋 Community route sharing
- 📋 Offline mode

**Have ideas? [Open an issue!](https://github.com/TomGuyler/trainertrails/issues)**

---

## ❓ FAQ

### Is this affiliated with Niantic or Pokémon GO?
No. TrainerTrails is an independent, community project not affiliated with Niantic or The Pokémon Company.

### How accurate is the Pokéstop data?
Data comes from OpenStreetMap + community reports. Accuracy varies by region. UK/Europe has the best coverage. You can help by reporting missing stops!

### Does this work in my country?
Yes! Routing works worldwide via OpenStreetMap. Pokéstop data coverage varies - help us improve it by reporting missing stops.

### Is my data private?
TrainerTrails doesn't track users. Community Pokéstop reports are anonymous. No analytics, no cookies.

### Can I use this for other games?
The underlying routing works for any walking activity. Pokéstop data is specific to Pokémon GO, but you can use the route planner for general walking routes.

### Why mobile-only?
Pokémon GO is a mobile game - you need the routes on your phone! Desktop support is planned but not essential for beta.

---

## 📞 Contact & Community

- **Website**: [trainertrails.com](https://trainertrails.com)
- **GitHub**: [github.com/TomGuyler/trainertrails](https://github.com/TomGuyler/trainertrails)
- **Issues**: [Report bugs here](https://github.com/TomGuyler/trainertrails/issues)
- **Reddit**: Discuss on [r/TheSilphRoad](https://www.reddit.com/r/TheSilphRoad/)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built with:
- [Leaflet.js](https://leafletjs.com/) - mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) - map data
- [OpenRouteService](https://openrouteservice.org/) - routing engine
- [Firebase](https://firebase.google.com/) - realtime database
- [CartoDB](https://carto.com/) - map tiles

Special thanks to the Pokémon GO and Silph Road communities for testing and feedback!

---

**Made with ❤️ by trainers, for trainers**

*Happy walking! 🚶‍♂️💨*
