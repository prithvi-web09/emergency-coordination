# 🚨 AURA Ops — Emergency Response Coordination Platform

> **Hackstreak 3.0 Prototype**  
> **Team**: Pixel Pirates  
> **Author / Contributor**: [prithviclg@gmail.com](mailto:prithviclg@gmail.com)

A centralized, real-time emergency operations dashboard that bridges the communication gap during public crises and disasters. Connects citizens, field dispatchers, and emergency agencies into a single operational picture.

---

## 🎯 Problem Statement

> *"During emergencies and public crises, information about resources, on-ground conditions, and agency coordination is often fragmented across disconnected channels. This lack of a unified system leads to delayed response times and inefficient resource allocation."*

**AURA Ops** provides the solution:
$$\text{Fragmented Channels} \longrightarrow \text{Centralized Platform} \longrightarrow \text{Auto-Triage} \longrightarrow \text{Proximity Dispatch} \longrightarrow \text{Rapid Resolution}$$

---

## ✨ Key Features

- 🖥️ **Command Operations Center**: Real-time stats, interactive Leaflet dark map, prioritized incident queue, and live activity log.
- 🗺️ **Live Geospatial Mapping**: Powered by Leaflet & OpenStreetMap (CartoDB Dark Matter tiles) with custom status pins (Critical, High, Medium, Resolved) and active fleet markers.
- 🧠 **Autonomous Priority Engine**: Multi-factor triage logic combining incident type and severity to compute priorities and transparent operational reasoning.
- 🚑 **Proximity-Based Resource Recommendation**: Haversine distance calculator that scores and recommends closest available emergency units.
- 🔄 **5-Stage Response Lifecycle**: Complete operational tracking from `REPORTED` $\rightarrow$ `VERIFIED` $\rightarrow$ `RESOURCE ASSIGNED` $\rightarrow$ `RESPONDING` $\rightarrow$ `RESOLVED`.
- 📋 **Incident Reporting Intake**: Rapid reporting form with pre-configured demo scenarios and instant confirmation cards.
- 🚒 **Resource Fleet Tracking**: Agency asset management with status badges (`AVAILABLE`, `DEPLOYED`, `BUSY`) and manual overrides.
- 💾 **Local Persistence**: All incidents, statuses, and logs persist in `localStorage` with a 1-click **Reset Demo** control.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Command Center Dark Palette)
- **Maps**: Leaflet + OpenStreetMap (CartoDB Dark Matter)
- **Icons**: Lucide React
- **State**: React Context API with `localStorage` synchronization

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd emergency-coordination-platform
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎬 2-Minute Judge Demo Script

1. **Overview Page**: Review the core mission and the 6-step coordination pipeline.
2. **Open Command Center**: Click `Open Command Center` to view live metrics and the metropolitan map.
3. **Inspect Critical Emergency**: Click `INC-1005` (Cardiac Arrest) to view the AI Priority reason and recommended ambulance.
4. **Dispatch Resource**: Click `[Assign Resource]` on `Ambulance A-12`. Note status transitions to `DEPLOYED` and `RESOURCE ASSIGNED`.
5. **Progress Response**: Step through `RESPONDING` $\rightarrow$ `RESOLVED`.
6. **Report New Incident**: Click `Report Emergency`, select a fast-fill scenario, and submit to see it instantly pinned to the map and queue!

---

## 👥 Contributors

- **Team**: Pixel Pirates
- **Lead Developer**: prithviclg@gmail.com

