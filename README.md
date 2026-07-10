# 🛡️ SignalSafe

> Detecting exploitation and trafficking risks in job posts and recruitment networks — before harm occurs.

Built for the **Call for Code AI: United Against Trafficking** hackathon, organized by Austin AI Hub in partnership with Call for Code & UN Human Rights.

**Track:** Anticipate & Disrupt
**Challenges addressed:** #1 Major Event Risk & Outreach Planner · #3 Suspicious Recruitment Network Mapper

---

## The Problem

Traffickers and exploitative recruiters hide in plain sight on job boards, WhatsApp, Facebook, and event pages. Vulnerable people — migrants, job seekers, and event workers — cannot always spot the warning signs. No one is systematically reading these posts at scale to catch them before harm occurs.

---

## What SignalSafe Does

SignalSafe is a web app that gives NGOs, labor advocates, and social workers four powerful tools in one dashboard:

### 1. 📸 AI Screenshot Analyzer
Upload screenshots directly from WhatsApp, Facebook, Telegram, or any job board. No CSV conversion needed — just screenshot and upload. SignalSafe uses Groq's vision AI (Llama 4 Scout) to read the image and scan for exploitation red flags:
- Vague or missing employer identity
- Unrealistic pay promises
- Upfront fees required
- Housing tied to the job
- Pressure to travel or relocate
- Document or passport control
- Unclear working conditions

Each image receives a **Low / Medium / High** risk score with a plain-language explanation of exactly which signals triggered the flag. Multiple images can be uploaded and analyzed simultaneously with a live progress bar.

### 2. 🗺️ Intelligent Risk Zone Map
Enter any city or event location worldwide. SignalSafe fetches real venue data from OpenStreetMap and scores each location using a composite formula:

```
Final Score = (Base Score + Density Bonus + Proximity Bonus) × Country Multiplier
```

**Score components:**
- **Base score** — determined by venue type (nightclubs score highest, guest houses lowest)
- **Density bonus** — venues surrounded by other high-risk venues within 500m score higher
- **Proximity bonus** — venues closer to the event epicenter score higher
- **Country multiplier** — derived from the US State Department TIP (Trafficking in Persons) Report:
  - Tier 3 countries (highest risk) → 1.4× multiplier
  - Tier 2 Watch List countries → 1.25× multiplier
  - Tier 1 countries (compliant) → 0.8× multiplier

Every venue marker is clickable and shows a full score breakdown. Circle size reflects risk score — higher risk venues appear larger on the map.

### 3. 🕸️ Recruitment Network Graph
SignalSafe connects the dots across uploaded images — shared phone numbers, recruiter names, and locations — and visualizes them as an interactive force-directed network graph. Patterns that are invisible when reviewing posts one by one become obvious when mapped as a network.

### 4. 📋 Location-Aware Outreach Recommendations
SignalSafe detects the user's current location via the browser and cross-references it with the locations mentioned in the analyzed posts. The AI then generates tailored NGO outreach guidance that accounts for:
- Whether the threat is local or from overseas
- Region-specific hotlines, NGOs, and reporting channels
- Vulnerable groups most at risk based on the locations involved
- Immediate actions specific to the user's country

---

## Who It's For

| User | How They Use It |
|---|---|
| NGOs & shelters | Screenshot suspicious posts flagged by clients and get instant risk assessments |
| Labor rights organizations | Monitor recruitment activity around major events |
| Migrant support groups | Help vulnerable people identify dangerous job offers before responding |
| Social workers | Quickly assess and compare multiple suspicious listings |
| Researchers & investigators | Identify recruiter networks and geographic patterns |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| CSS Modules | Component scoped styling with light/dark theme via CSS variables |
| Groq API — Llama 4 Scout (Vision) | AI image reading and risk classification |
| Groq API — GPT-OSS 120B | Location-aware outreach recommendation generation |
| Leaflet.js + React Leaflet | Interactive risk zone map |
| OpenStreetMap Nominatim | City geocoding and reverse geocoding — no API key required |
| OpenStreetMap Overpass API | Real venue data — no API key required |
| US State Dept TIP Report (2024) | Country-level trafficking risk tiers for score multipliers |
| React Force Graph 2D | Recruiter network visualization |
| Browser Geolocation API | Detecting user's current location for tailored recommendations |
| Vercel | Deployment |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- A Groq API key — get one free at [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOURUSERNAME/signalsafe.git
cd signalsafe

# Install dependencies
npm install

# Create your environment file
touch .env
```

Add your Groq API key to `.env`:
```
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

```bash
# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## How To Use

### Analyzing Suspicious Posts
1. Click **Launch Dashboard** on the home page
2. Allow location permission when prompted — this enables location-aware recommendations
3. In the **Upload Screenshots** panel, drag and drop or click to upload screenshots
4. Supported formats: JPG, PNG, WEBP — multiple files supported
5. Each image is analyzed automatically — results appear with risk scores and explanations

### Mapping Risk Zones
1. In the **Risk Zone Map** panel type any city or event location
2. Press **Search** or hit Enter
3. Real venue locations load from OpenStreetMap
4. Each venue is scored using venue type, density, proximity, and the country's TIP Report tier
5. Click any circle to see the full score breakdown

### Reading the Network Graph
- Each analyzed post appears as a colored node (red = high risk, orange = medium, green = low)
- Phone numbers, recruiter names, and locations extracted from posts appear as separate nodes
- Lines connecting nodes show shared entities — two posts connecting to the same phone number node reveals a linked recruiter network

---

## Risk Scoring Explained

### Venue Type Base Scores
| Venue | Base Score |
|---|---|
| Nightclub | 75 |
| Bar | 60 |
| Hotel | 45 |
| Hostel | 42 |
| Bus Station | 38 |
| Train Station | 35 |
| Guest House | 22 |

### Country TIP Report Multipliers
| Tier | Examples | Multiplier |
|---|---|---|
| Tier 3 — Highest Risk | Russia, China, Iran, North Korea | 1.4× |
| Tier 2 Watch List | Nigeria, South Africa, India, UAE | 1.25× |
| Tier 1 — Compliant | USA, UK, Germany, Australia | 0.8× |

### Score Interpretation
| Score | Risk Level |
|---|---|
| 70–100 | 🔴 High Risk |
| 40–69 | 🟠 Medium Risk |
| 0–39 | 🟢 Low Risk |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Top navigation with light/dark toggle
│   ├── MapView.js         # Leaflet risk zone map with intelligent scoring
│   ├── UploadPanel.js     # Image upload with drag and drop
│   ├── NetworkGraph.js    # Recruiter connection graph
│   └── OutreachPanel.js   # Location-aware outreach recommendations
├── pages/
│   ├── Home.js            # Landing page
│   └── Dashboard.js       # Main analysis dashboard with geolocation
├── utils/
│   ├── groqApi.js         # Groq AI integration (vision + text)
│   └── parseCSV.js        # CSV parsing utility
└── styles/
    ├── Navbar.module.css
    ├── MapView.module.css
    └── Dashboard.module.css
```

---

## Hackathon Context

**Event:** Call for Code AI: United Against Trafficking
**Organizer:** Austin AI Hub
**Partners:** Call for Code & UN Human Rights
**Track:** Anticipate & Disrupt
**Submission deadline:** July 9, 2026

---

## Data Sources

- **OpenStreetMap** — Real venue location data via Overpass API (open license)
- **US State Department TIP Report 2024** — Country trafficking risk tier classifications
- **OpenStreetMap Nominatim** — Geocoding and reverse geocoding

---

## Future Improvements

- Integration of historical trafficking incident report data by region
- Time-of-day risk adjustment — nightlife venues scored higher after dark
- Cross-referencing network graph locations with map risk zones
- Multilingual post analysis supporting all 11 official South African languages
- Export reports as PDF for NGO field workers
- Real-time monitoring of live job boards and social media
- Mobile responsive design for field use

---

## License

MIT License — open source for NGOs and researchers to use freely.