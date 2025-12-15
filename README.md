# 🗺️ Pokemon Go Route Planner

**The first legitimate Pokemon Go route optimizer.**

## What is this?

An app that generates optimized walking routes for Pokemon Go players between two locations, maximizing Pokéstops and Gyms visited along the way.

## 🎯 Features

- 🗺️ **Start-to-End routing** - Plan routes between any two locations
- 📍 **Postcode/address search** - Enter locations like a Sat Nav
- 🎯 **Density-aware algorithm** - Routes through high Pokéstop clusters
- 💯 **95% accuracy** using Ingress portal data (coming soon)
- 📱 **Mobile-friendly** web app
- 🌙 **Dark mode** map interface
- 🔒 **100% legal and safe** (no GPS spoofing)

## 📊 Status

🚀 **In Development** - Demo available now, launching Q1 2025

[View Live Demo](https://[YOUR-USERNAME].github.io/pogo-route-planner/)

## 💡 How It Works

1. Enter your **start location** (home, train station, etc.)
2. Enter your **end location** (work, gym, shop, etc.)
3. Generate route - we find the optimal path that visits the most Pokéstops
4. Export as GPX or follow on your phone

**Perfect for:**
- Walking to/from work
- Daily commutes
- Planned walks in new areas
- Maximizing Community Day routes

## 💰 Pricing

- **Free Tier:** Route planning with OpenStreetMap data
- **Premium:** £0.99/year for Ingress portal data accuracy + unlimited routes

## 🛠️ Tech Stack

- Frontend: Vanilla JS + Leaflet.js
- Mapping: CartoDB Dark Matter (dark mode)
- Routing: OSRM (walking paths) + custom density-aware algorithm
- Data: Ingress portal database (premium) + OpenStreetMap (free)

## 🎮 Try The Demo

Current demo uses sample data from central London. Try these locations:

- **Start:** `SW1A 1AA` (Buckingham Palace)
- **End:** `WC2N 5DN` (Trafalgar Square)

Or click anywhere on the map to set custom start/end points!

## 📝 Roadmap

- [x] Basic route planning (start → end)
- [x] Postcode/address search
- [x] Density-aware routing algorithm
- [x] Dark mode map
- [x] GPX export
- [x] Open in Maps (mobile)
- [ ] Ingress portal data integration
- [ ] Save favorite routes
- [ ] Mobile app (React Native)
- [ ] Offline maps

## 📝 License

Proprietary - All rights reserved

---

*Building the future of Pokemon Go route planning* 🚀
