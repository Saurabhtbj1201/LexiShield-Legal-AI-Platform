<div align="center">

[![PromptWars Virtual](https://img.shields.io/badge/PromptWars-Virtual%20Participant-0A66C2?style=for-the-badge&logo=google&logoColor=white)](https://promptwars.in/promptwarsVirtual.html)
![India Only](https://img.shields.io/badge/Region-India-138808?style=for-the-badge)
![Build Mode](https://img.shields.io/badge/Build%20Mode-Intent--Driven%20Development-111827?style=for-the-badge)

<img src="https://h2svision.github.io/publicAssets/buildWithAi/google.svg" height="28" alt="Google for Developers" />
<img src="https://h2svision.github.io/publicAssets/buildWithAi/h2s.svg" height="28" alt="Hack2Skill" />

# ⚖️ LexiShield (ClarifyLegal)
### GenAI Legal Document Navigator, Risk Radar & Attorney Prep Platform
**Theme: AI for Legal Assistance & Access**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-v6-007FFF.svg)](https://mui.com/)
[![Gemini GenAI](https://img.shields.io/badge/GenAI-Google%20Gemini-8E75B2.svg)](https://ai.google.dev/)

</div>

---

## 📌 Executive Summary & Problem Space

Legal documents (rental leases, freelance consulting contracts, NDAs, and employment agreements) are deliberately dense, filled with legalese, and skewed towards drafting parties. Everyday citizens, tenants, and independent contractors often sign away rights, accept uncapped indemnification, or forfeit hard-earned pay without realizing what they agreed to.

**LexiShield** bridges the justice and legal literacy gap. Powered by Google Gemini and an intelligent deterministic legal heuristic engine, LexiShield simplifies complex documents, spots predatory traps using an interactive **0–100 Risk Radar**, visualizes contract version changes with **Redlining**, answers questions with **grounded citations**, and generates a **5-question Attorney Prep Kit** to save on billable legal fees.

> **Important Legal Disclaimer:** LexiShield is an educational, analytical, and navigational tool. It provides informative legal document assistance and does not replace licensed legal representation or create an attorney-client relationship.

---

## 🚀 Key Features

### 1. 📡 Interactive Risk & Obligation Radar
- **Dynamic 0–100 Gauge:** Computes an aggregated risk score based on liability caps, penalties, IP overreach, and dispute imbalances.
- **Legal Vulnerability Matrix:** Breaks risk down into 4 core dimensions:
  - *Financial Exposure* (penalties, withholding rights, deposit forfeitures)
  - *Liability & Indemnity* (unlimited third-party indemnification)
  - *Rights & Intellectual Property* (prior inventions capture, global non-competes)
  - *Termination & Remedies* (asymmetric exit rights, fee forfeitures)
- **Missing Standard Safeguards:** Identifies standard protections missing from the contract (mutual liability cap, 15-day cure notice).
- **Key Duties Checklist:** Summarizes exact obligations required from the user.

### 2. 📖 Plain English Explainer with Tone Toggles
- Instant clause translation with 3 selectable tones:
  - 📖 **Plain English:** Clear, jargon-free summary.
  - 👶 **Explain Like I'm 5 (ELI5):** Intuitive real-life analogies.
  - 💼 **Practical Impact:** Real-world consequences for personal savings or career.
- **Fair Counter-Proposal Generator:** Copyable fairer alternative wording ready for email negotiations.

### 3. ⚖️ Visual Contract Comparison & Version Redline (v1 vs v2)
- Compares original offer sheets against revised formal contracts.
- Calculates exact **Risk Delta** points (e.g. 32 ➔ 84, +52 points worse).
- Highlights hidden alterations: extended equity cliffs, slashed severance pay, or expanded IP seizure.
- Provides strategic counter-negotiation talking points.

### 4. 💬 "Talk to Your Contract" (Grounded Legal Q&A)
- Context-grounded conversational assistant that only answers based on the document.
- Verifiable clause excerpts and section citations attached to every answer.
- Suggested prompt discovery chips ("What happens if I exit early?", "Who owns the IP?").

### 5. 💼 Attorney Consultation Prep Kit
- Arrive prepared for legal consultations to minimize billable attorney hours.
- 5 strategic high-leverage questions with rationale and exact requested changes.
- One-click **Print / PDF export** and **Markdown brief copy**.

### 6. ⚡ Zero-Friction Hybrid Engine
- **Pre-Loaded Presets:** One-click evaluation of real-world agreements (Residential Lease, Freelance Services Agreement, Mutual NDA, Employment Offer v1 vs v2).
- **High-Fidelity Offline Legal Fallback:** Works 100% out of the box with zero setup friction if no API key is provided, with full optional support for Google Gemini API keys.
- **Document Upload:** Direct parsing of PDF, TXT, and Markdown documents up to 10MB.

---

## 🛠️ Architecture & Tech Stack

```
[User Browser (React 19 + Material UI v6 + Light Gradient Theme)]
       │
       ├── Presentation Layer: AppBar, RiskRadar Gauge, ClauseExplainer, PrepKit, Grounded Chat
       ├── Styling System: Modern Light Gradient Theme, Soft Translucency, Sharp 8-12px Radii
       │
       ▼ (REST API / JSON)
[Backend Server (Node.js + Express)]
       │
       ├── Document Ingestion: Multer (Memory Storage) + pdf-parse (PDF extraction)
       ├── AI Analysis Service:
       │     ├── Google Gemini 1.5/2.0 API (@google/generative-ai)
       │     └── Fallback Deterministic Legal Knowledge Engine (100% offline uptime)
       └── Production Static Delivery: Serves optimized client/dist bundle
```

- **Frontend:** React 19, Material UI (MUI v6), `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `lucide-react`, `canvas-confetti`, Vite 8
- **Backend:** Node.js 22, Express 4, `@google/generative-ai`, `pdf-parse`, `multer`, `cors`, `dotenv`
- **Design:** Custom Modern Light Gradient Theme with sharp typography (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`)

---

## 📦 Project Directory Structure

```
Exclusive Challenge/
├── client/                     # Vite + React 19 frontend
│   ├── src/
│   │   ├── components/         # Material UI components
│   │   │   ├── ApiKeyModal.jsx
│   │   │   ├── AttorneyPrepKit.jsx
│   │   │   ├── ChatGrounded.jsx
│   │   │   ├── ClauseExplainer.jsx
│   │   │   ├── ContractComparison.jsx
│   │   │   ├── DisclaimerBanner.jsx
│   │   │   ├── HeroUpload.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── RiskRadar.jsx
│   │   ├── theme.js            # Custom MUI Light Gradient Theme
│   │   ├── App.jsx             # Main App layout & state
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express backend API
│   ├── data/
│   │   └── presetContracts.js  # Curated real-world agreements
│   ├── services/
│   │   └── legalAiService.js   # Gemini + Heuristic legal engine
│   ├── .env.example
│   ├── index.js                # API routes & static server
│   └── package.json
├── Dockerfile                  # Production container build
├── .dockerignore
├── .gitignore
├── LICENSE                     # MIT License
├── package.json                # Root orchestration scripts
├── render.yaml                 # Render blueprint
├── vercel.json                 # Vercel deployment config
└── README.md
```

---

## 🚢 Complete Deployment Guide

### Option A: 1-Click Deploy on Render (Recommended for Full-Stack)

1. Fork or push this repository to your **GitHub** account.
2. Sign in to [Render](https://render.com) and click **New +** ➔ **Blueprint** (or **Web Service**).
3. Connect your repository. Render will automatically detect [`render.yaml`](./render.yaml).
4. (Optional) Set the Environment Variable:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key - optional)*
5. Click **Apply / Deploy**. Render will automatically run `npm run build` and `npm start`.
6. Your live full-stack app will be accessible at `https://<your-app-name>.onrender.com`!

---

### Option B: Deploy Frontend on Vercel + Backend on Render/Railway

#### Step 1: Deploy Backend (Render / Railway / Koyeb)
1. In Render or Railway, create a new **Web Service** pointing to the `server/` directory:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** `PORT=5000`, `GEMINI_API_KEY=your_key`
2. Copy your deployed backend URL (e.g. `https://lexishield-api.onrender.com`).

#### Step 2: Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and click **Add New** ➔ **Project**.
2. Select your repository:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
3. In `client/vite.config.js`, update the API proxy target or add `VITE_API_URL` environment variable.
4. Click **Deploy**.

---

### Option C: Docker Deployment

You can deploy anywhere that supports Docker (Railway, Fly.io, AWS ECS, GCP Cloud Run, DigitalOcean):

```bash
# 1. Build the multi-stage Docker image
docker build -t lexishield .

# 2. Run the container locally or on a VPS
docker run -d -p 5000:5000 -e GEMINI_API_KEY=your_api_key --name lexishield-app lexishield

# 3. Access in browser
open http://localhost:5000
```

---

### Option D: Local Development Setup

#### Prerequisites
- Node.js v20+ or v22+
- npm v10+

#### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/Saurabhtbj1201/Exclusive-Challenge.git
cd Exclusive-Challenge

# 2. Install dependencies for root, client, and server
npm run install:all

# 3. (Optional) Configure Gemini API key
cp server/.env.example server/.env
# Edit server/.env to add your GEMINI_API_KEY

# 4. Start local development (both server and client concurrently)
npm run dev
```

- **Frontend:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:5000/](http://localhost:5000/)

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & Gemini configuration status |
| `/api/presets` | `GET` | Retrieve list of curated sample contracts |
| `/api/analyze` | `POST` | Analyze contract text, compute risk radar & explain clauses |
| `/api/upload` | `POST` | Multipart upload (PDF, TXT, MD) and automated analysis |
| `/api/compare` | `POST` | Side-by-side contract comparison and risk delta calculation |
| `/api/chat` | `POST` | Grounded Q&A against contract text with source citations |
| `/api/prep-kit` | `POST` | Generate tailored attorney consultation agenda & questions |

---

## 👨💻 Developer
<div align="center">

### © Made with ❤️ by Saurabh Kumar. All Rights Reserved 2025

<a href="https://github.com/Saurabhtbj1201">
  <img src="https://github.com/Saurabhtbj1201.png" width="100" style="border-radius: 50%; border: 3px solid #0366d6;" alt="Saurabh Profile"/>
</a>

### [Saurabh Kumar](https://github.com/Saurabhtbj1201)

<a href="https://github.com/Saurabhtbj1201">
  <img src="https://img.shields.io/github/followers/Saurabhtbj1201?label=Follow&style=social" alt="GitHub Follow"/>
</a>

### 🔗 Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/saurabhtbj1201)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/saurabhtbj1201)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/saurabhtbj1201)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/saurabh.tbj)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://gu-saurabh.site)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/9798024301)

---

<p align="center">
  <strong>Made with ❤️ by Saurabh Kumar</strong>
  <br>
  ⭐ Star this repo if you find it helpful!
</p>

![Repo Views](https://komarev.com/ghpvc/?username=Saurabhtbj1201&style=flat-square&color=red)

</div>
