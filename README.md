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

SignalSafe is a web app that gives NGOs, labor advocates, and social workers three powerful tools in one dashboard:

### 1. 📂 AI Post Analyzer
Upload a CSV of job posts or recruitment listings. SignalSafe uses Groq AI (Llama 3) to scan each post for exploitation red flags:
- Vague or missing employer identity
- Unrealistic pay promises
- Upfront fees required
- Housing tied to the job
- Pressure to travel or relocate
- Document or passport control

Each post receives a **Low / Medium / High** risk score with a plain-language explanation of exactly which signals triggered the flag.

### 2. 🗺️ Real-Time Risk Zone Map
Enter any city or event location. SignalSafe fetches real venue data from OpenStreetMap and plots risk zones based on:
- 🔴 **High Risk** — Nightclubs, bars
- 🟠 **Medium Risk** — Hotels, hostels, transit hubs, train stations
- 🟢 **Low Risk** — Guest houses

Every city shows different results because the data is pulled live — nothing is hardcoded.

### 3. 🕸️ Recruitment Network Graph
SignalSafe connects the dots across uploaded posts — shared phone numbers, recruiter names, and locations — and visualizes them as an interactive network graph. Patterns that are invisible when reading posts one by one become obvious when mapped as a network.

### 4. 📋 AI Outreach Recommendations
Based on the analyzed posts, SignalSafe generates actionable NGO outreach guidance including urgency level, immediate actions, specific recommendations, and priority target groups.

---

## Who It's For

| User | How They Use It |
|---|---|
| NGOs & shelters | Screen posts flagged by clients before they respond |
| Labor rights organizations | Monitor job boards in their region |
| Migrant support groups | Protect vulnerable people seeking work |
| Social workers | Quickly assess risk across multiple listings |
| Researchers & investigators | Identify patterns and networks across many posts |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| CSS Modules | Component scoped styling |
| Groq API (Llama 3.3 70b) | AI risk scoring and outreach generation |
| Leaflet.js + React Leaflet | Interactive risk zone map |
| OpenStreetMap Nominatim | City geocoding — no API key required |
| OpenStreetMap Overpass API | Real venue data — no API key required |
| React Force Graph 2D | Recruiter network visualization |
| PapaParse | CSV file parsing |
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

### Analyzing Posts
1. Prepare a CSV file with columns: `title`, `description`, `contact`
2. Click **Get Started** on the home page
3. Click **Upload CSV** and select your file
4. Wait for AI analysis — each post will show a risk score and explanation

### Sample CSV Format
```csv
title,description,contact
Job Opportunity,Earn R50000 per month no experience needed. Must surrender passport on arrival.,+27123456789
Event Staff Needed,Flexible hours great pay. Upfront fee of R500 required. Recruiter: Mike.,+27987654321
Marketing Role,Join our team in Cape Town. Competitive salary. Send CV to hr@company.co.za,+27111222333
```

### Mapping Risk Zones
1. In the Risk Zone Map panel type any city name
2. Press **Search** or hit Enter
3. Real venue locations load from OpenStreetMap and are color coded by risk level
4. Click any marker to see the venue name and risk level

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Top navigation bar
│   ├── MapView.js         # Leaflet risk zone map
│   ├── UploadPanel.js     # CSV upload and results display
│   ├── NetworkGraph.js    # Recruiter connection graph
│   └── OutreachPanel.js   # AI outreach recommendations
├── pages/
│   ├── Home.js            # Landing page
│   └── Dashboard.js       # Main analysis dashboard
├── utils/
│   ├── groqApi.js         # Groq AI integration
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
**Submission deadline:** July 14, 2026

---

## Future Improvements

- Multilingual post analysis supporting all 11 official South African languages
- Historical trafficking hotspot data integration
- Export reports as PDF for NGO field workers
- Real time monitoring of live job boards
- Mobile responsive design for field use

---

## License

MIT License — open source for NGOs and researchers to use freely.

---
