<div align="center">

# ◈ PORTY — AI Portfolio Generator

**Build a stunning developer portfolio in under 5 minutes.**  
Fill a form. Pick a theme. Get a shareable link. Let AI do the writing.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-porty--eight.vercel.app-5B5BD6?style=for-the-badge&logo=vercel)](https://porty-eight.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-satya--sri--karri-181717?style=for-the-badge&logo=github)](https://github.com/satya-sri-karri/PORTY-PORTFOLIO-GENERATOR-)
[![Stack](https://img.shields.io/badge/Stack-MERN-00ED64?style=for-the-badge)](https://github.com/satya-sri-karri/PORTY-PORTFOLIO-GENERATOR-)

</div>

---

## What is PORTY?

PORTY is a full-stack MERN web application that generates professional portfolio websites. You fill out a form with your details — name, skills, projects, experience — pick from 12 visually distinct themes, and get a public shareable link instantly.

AI (Google Gemini) helps you write your bio, suggest skills, describe your projects, and even pick the best theme for your profile.

**Live at → [porty-eight.vercel.app](https://porty-eight.vercel.app)**

---

## Features at a Glance

| Feature | Description |
|---------|-------------|
| ✦ AI Bio Generator | Gemini writes your professional bio from your name, role, and skills |
| ✦ AI Skill Suggester | Suggests 12 in-demand skills for your role |
| ✦ AI Project Descriptions | Writes compelling project copy from your title and tech stack |
| ✦ AI Theme Recommender | Picks the best visual theme for your profile |
| ◈ 12 Unique Themes | Each one targets a different persona and design aesthetic |
| ◈ Pluggable Theme Engine | One data schema renders across 12 completely different layouts |
| ◈ OTP Email Verification | 6-digit OTP sent to your email on registration |
| ◈ 9 Portfolio Sections | Personal info, Skills, Projects, Experience, Certifications, Achievements, Coding Profiles, Contact, Theme |
| ◈ Public Share Links | Every portfolio gets a unique `/p/your-name-slug` URL — no login required to view |
| ◈ PDF Export | Download your portfolio as a clean, printable PDF using jsPDF |
| ◈ Loading Skeletons | Smooth skeleton loaders on dashboard, builder, and portfolio view |
| ◈ JWT Auth | Secure login with bcrypt password hashing |
| ◈ Rate Limiting | API protection with express-rate-limit |

---

## The 12 Themes

Each theme targets a different type of developer or creative:

| Theme | Best For | Visual Style |
|-------|----------|--------------|
| **Aurora** | Creative generalist | Glassmorphism, animated gradient mesh |
| **Minimalist** | Senior engineer / PM | Swiss typography, extreme whitespace |
| **Editorial** | Designer / writer | Magazine grid, Lora serif, asymmetric layout |
| **Neon Terminal** | Developer / hacker | Typewriter effect, tab UI, CLI aesthetic |
| **Brutalist** | Bold creative / artist | Anti-design, marquee text, oversized type |
| **Neumorphic** | UI/UX designer | Soft shadows, embossed surfaces |
| **Kinetic** | Motion / frontend dev | Bold color blocks, scroll energy, marquee |
| **Executive** | Consultant / business | Navy + gold, Playfair Display, corporate |
| **Retro Wave** | Game dev / creative coder | 80s synthwave, neon glow, perspective grid |
| **Organic** | Photographer / wellness | Earthy tones, Lora serif, natural curves |
| **Bento Grid** | SaaS / startup dev | Apple-style modular bento boxes |
| **Dark Luxe** | Freelancer / agency | Cinematic black + gold, premium feel |

---

## Tech Stack

**Frontend**
- React 18 (Create React App)
- React Router v6
- Pure CSS — no Tailwind, no UI libraries
- jsPDF 2.5.1 — PDF export
- react-icons — icon set

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs — password hashing
- Nodemailer — OTP emails
- express-rate-limit — API protection
- @google/generative-ai — Gemini AI

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Project Structure

```
PORTY-PORTFOLIO-GENERATOR/
├── package.json                  ← Root — runs both servers
├── render.yaml                   ← Render deployment config
│
├── backend/
│   ├── server.js                 ← Express app, CORS, rate limiting
│   ├── .env.example              ← Environment variable template
│   ├── middleware/
│   │   └── auth.js               ← JWT verification middleware
│   ├── models/
│   │   ├── User.js               ← User schema, OTP methods, bcrypt
│   │   └── Portfolio.js          ← Portfolio schema, shareSlug auto-gen
│   └── routes/
│       ├── auth.js               ← Register, verify-otp, resend-otp, login, me
│       ├── portfolio.js          ← CRUD + public share endpoint
│       └── ai.js                 ← Gemini AI — bio, skills, project, theme
│
└── frontend/
    ├── vercel.json               ← Rewrites for React Router
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx               ← All routes
        ├── index.js
        ├── index.css             ← Design system (CSS variables, components)
        ├── context/
        │   └── AuthContext.js    ← Auth state, login/logout
        ├── registry/
        │   └── themeRegistry.js  ← Maps theme ID → component (theme engine)
        ├── hooks/
        │   └── usePortfolioForm.js
        ├── utils/
        │   ├── api.js            ← All fetch() calls
        │   └── share.js          ← getShareUrl() — handles localhost vs production
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── AuthPages.jsx     ← Register, Login, OTP screen
        │   ├── DashboardPage.jsx ← Portfolio cards, stats, share links
        │   ├── BuilderPage.jsx   ← 9-section sidebar builder with AI buttons
        │   ├── PortfolioPage.jsx ← Public theme renderer + share bar + PDF
        │   └── PreviewPage.jsx   ← Live preview before saving
        └── components/
            ├── shared/
            │   ├── Navbar.jsx
            │   ├── ProtectedRoute.jsx
            │   ├── Skeleton.jsx      ← DashboardSkeleton, BuilderSkeleton, etc.
            │   ├── PDFExport.jsx     ← jsPDF full portfolio export
            │   └── GradientMenu.jsx  ← Animated gradient nav menu
            └── themes/               ← 12 theme components
                ├── AuroraTheme.jsx
                ├── MinimalistTheme.jsx
                ├── EditorialTheme.jsx
                ├── NeonTerminalTheme.jsx
                ├── BrutalistTheme.jsx
                ├── NeumorphicTheme.jsx
                ├── KineticTheme.jsx
                ├── ExecutiveTheme.jsx
                ├── RetroWaveTheme.jsx
                ├── OrganicTheme.jsx
                ├── BentoTheme.jsx
                └── DarkLuxeTheme.jsx
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- Google Gemini API key (free)

### Step 1 — Clone and install

```bash
git clone https://github.com/satya-sri-karri/PORTY-PORTFOLIO-GENERATOR-.git
cd PORTY-PORTFOLIO-GENERATOR-
npm run install:all
```

This installs dependencies for root, backend, and frontend in one command.

### Step 2 — Get a free Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API key**
3. Copy the key — it starts with `AIzaSy...`

### Step 3 — Create your `.env` file

```bash
# Windows
copy backend\.env.example backend\.env
notepad backend\.env

# Mac / Linux
cp backend/.env.example backend/.env
nano backend/.env
```

Fill in the values:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio-v3
PORT=5000
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=AIzaSy_your_key_here

# Optional — leave blank to use dev mode (OTP prints in terminal)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Dev mode tip:** If `EMAIL_USER` is not set, the OTP prints directly in your backend terminal. Just copy it and type it in the browser — no email setup needed for local development.

### Step 4 — Start MongoDB

```bash
# Windows (Admin PowerShell)
net start MongoDB

# Mac / Linux
mongod
```

### Step 5 — Start the app

```bash
npm run dev
```

Opens at **http://localhost:3000**

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Long random string for signing JWT tokens |
| `PORT` | ✅ | Backend port (default: 5000) |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `EMAIL_USER` | Optional | Gmail address for OTP emails |
| `EMAIL_PASS` | Optional | Gmail App Password (not your regular password) |

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register + send OTP |
| POST | `/api/auth/verify-otp` | — | Verify 6-digit OTP |
| POST | `/api/auth/resend-otp` | — | Resend OTP |
| POST | `/api/auth/login` | — | Login + JWT token |
| GET | `/api/auth/me` | JWT | Get current user |

### Portfolio

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/portfolio` | JWT | Create portfolio |
| GET | `/api/portfolio/my` | JWT | Get all my portfolios |
| GET | `/api/portfolio/:id` | JWT | Get one portfolio |
| PUT | `/api/portfolio/:id` | JWT | Update portfolio |
| DELETE | `/api/portfolio/:id` | JWT | Delete portfolio |
| GET | `/api/portfolio/share/:slug` | — | Public view |

### AI (Gemini)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/bio` | JWT | Generate professional bio |
| POST | `/api/ai/skills` | JWT | Suggest skills for your role |
| POST | `/api/ai/project` | JWT | Write project description |
| POST | `/api/ai/theme-recommend` | JWT | Recommend best theme |

---

## How the Theme Engine Works

This is the core technical idea behind PORTY. One portfolio data schema drives 12 completely different visual layouts:

```
User fills the builder form
           ↓
portfolioData { name, title, about, skills, projects, ... }
           ↓
themeRegistry.js  →  maps theme ID  →  React component
           ↓
<AuroraTheme data={portfolioData} />      ← same data
<BrutalistTheme data={portfolioData} />   ← same data
<DarkLuxeTheme data={portfolioData} />    ← same data
```

Adding a new theme only requires:
1. Create one `.jsx` file in `/themes/`
2. Add one line to `themeRegistry.js`
3. Done — no other code changes

---

## How OTP Verification Works

```
User registers
      ↓
Backend generates a 6-digit OTP (valid 10 min, max 5 attempts)
      ↓
OTP sent to email via Nodemailer (or printed in terminal in dev mode)
      ↓
User types OTP in the 6-box input on frontend
      ↓
Backend verifies → account activated → JWT issued → logged in
```

---

## Deployment

### Backend → Render

```
Root Directory:   backend
Build Command:    npm install
Start Command:    node server.js
```

Add these environment variables on Render:

```
MONGODB_URI      → MongoDB Atlas connection string
JWT_SECRET       → your secret key
GEMINI_API_KEY   → your Gemini key
FRONTEND_URL     → https://your-app.vercel.app
EMAIL_USER       → your Gmail (optional)
EMAIL_PASS       → your App Password (optional)
```

### Frontend → Vercel

```
Root Directory:   frontend
Build Command:    CI=false npm run build
Output Dir:       build
```

Add these environment variables on Vercel:

```
REACT_APP_API_URL    → https://your-backend.onrender.com/api
REACT_APP_SHARE_URL  → https://your-app.vercel.app
```

### Keep Backend Alive on Render Free Tier

Render free tier spins down after 15 minutes of inactivity. Use [cron-job.org](https://cron-job.org) to ping your backend health endpoint every 10 minutes:

```
https://your-backend.onrender.com/api/health
```

---

## Built By

**Satya Sri Karri** — CSE Student & Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-satya--sri--karri-181717?style=flat-square&logo=github)](https://github.com/satya-sri-karri)

---

<div align="center">

**PORTY** · MongoDB · Express · React · Node.js · Google Gemini AI

</div>
