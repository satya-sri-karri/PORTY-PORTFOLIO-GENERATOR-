# ◈ PortfolioAI v3 — MERN + AI + 12 Themes

A production-grade full-stack MERN application where developers generate stunning portfolio websites using AI and 12 distinct visual themes.

---

## ✨ What Makes This Stand Out

| Feature | Detail |
|---------|--------|
| **AI Bio Generator** | Gemini AI writes your professional bio |
| **AI Project Descriptions** | AI writes compelling project copy |
| **AI Skill Suggester** | Suggests relevant skills for your role |
| **AI Theme Recommender** | Picks the best theme for your profile |
| **12 Distinct Themes** | Each targets a different persona and design style |
| **Pluggable Theme Engine** | One data schema → 12 different layouts |
| **JWT Authentication** | Secure register + login with bcrypt |
| **9 Portfolio Sections** | Personal, Skills, Projects, Experience, Certs, Achievements, Coding Profiles, Contact, Theme |
| **Shareable URLs** | `/p/your-name-abc123` — no login needed to view |
| **Rate Limiting** | API protection against abuse |
| **Pure MERN** | Zero UI libraries — built from scratch |

---

## 🎨 The 12 Themes

| # | Theme | Persona | Technical Showcase |
|---|-------|---------|-------------------|
| 1 | **Aurora** | Creative generalist | Glassmorphism, animated gradient mesh |
| 2 | **Minimalist** | Senior dev / PM | Swiss typography, extreme whitespace |
| 3 | **Editorial** | Designer / writer | Magazine grid, asymmetric layout |
| 4 | **Neon Terminal** | Developer / hacker | Typewriter effect, tab-based CLI |
| 5 | **Brutalist** | Bold creative / artist | Anti-design, marquee, oversized type |
| 6 | **Neumorphic** | Product / UI designer | Dual box-shadows, embossed surfaces |
| 7 | **Kinetic** | Motion designer | Bold color blocks, scroll energy |
| 8 | **Executive** | Consultant / business | Navy + gold, corporate gravitas |
| 9 | **Retro Wave** | Game dev / coder | 80s synthwave, neon grid |
| 10 | **Organic** | Photographer / wellness | Earthy tones, natural typography |
| 11 | **Bento Grid** | Modern SaaS / startup | Apple-style modular bento boxes |
| 12 | **Dark Luxe** | Freelancer / agency | Cinematic, gold accents, premium |

---

## 🗂 Folder Structure

```
portfolio-ai-v3/
├── package.json
│
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Portfolio.js
│   └── routes/
│       ├── auth.js
│       ├── portfolio.js
│       └── ai.js                ← Gemini AI endpoints
│
└── frontend/
    ├── vercel.json
    ├── public/index.html
    └── src/
        ├── App.jsx
        ├── index.js
        ├── index.css            ← Full design system (no Tailwind)
        ├── context/
        │   └── AuthContext.js
        ├── registry/
        │   └── themeRegistry.js ← Maps theme ID → component
        ├── hooks/
        │   └── usePortfolioForm.js
        ├── utils/
        │   └── api.js
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── AuthPages.jsx    ← Register + Login
        │   ├── DashboardPage.jsx
        │   ├── BuilderPage.jsx  ← 9-section sidebar builder with AI
        │   ├── PortfolioPage.jsx
        │   └── PreviewPage.jsx
        └── components/
            ├── shared/
            │   ├── Navbar.jsx
            │   └── ProtectedRoute.jsx
            └── themes/
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

## ⚡ Setup (5 Steps)

### Step 1 — Install dependencies
```bash
npm run install:all
```

### Step 2 — Get a Free Gemini API Key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API Key"** → **"Create API key"**
3. Copy the key (starts with `AIza...`)

### Step 3 — Create `backend/.env`
```bash
# Windows
copy backend\.env.example backend\.env
notepad backend\.env
```

Fill in:
```env
MONGODB_URI=mongodb://localhost:27017/portfolio-v3
PORT=5000
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=AIzaSy...your_key_here
```

### Step 4 — Start MongoDB
```bash
# Windows (Admin PowerShell)
net start MongoDB
```

### Step 5 — Start both servers
```bash
npm run dev
```

Open **http://localhost:3000**

---

## 📡 API Endpoints

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login + JWT |
| GET | `/api/auth/me` | ✅ | Current user |

### Portfolio
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/portfolio` | ✅ | Create |
| GET | `/api/portfolio/my` | ✅ | My portfolios |
| GET | `/api/portfolio/:id` | ✅ | Get one (owner) |
| PUT | `/api/portfolio/:id` | ✅ | Update |
| DELETE | `/api/portfolio/:id` | ✅ | Delete |
| GET | `/api/portfolio/share/:slug` | ❌ | **Public view** |

### AI (Gemini)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/ai/bio` | ✅ | Generate bio |
| POST | `/api/ai/skills` | ✅ | Suggest skills |
| POST | `/api/ai/project` | ✅ | Write project description |
| POST | `/api/ai/theme-recommend` | ✅ | Recommend theme |

---

## 🤖 How AI Integration Works

The backend uses **Google Gemini Pro** via `@google/generative-ai`:

```js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const result = await model.generateContent(prompt);
const text = result.response.text();
```

Each AI endpoint crafts a specific prompt and returns structured output:
- **Bio** → plain text paragraph
- **Skills** → JSON array of skill strings
- **Project desc** → plain text 2-3 sentences
- **Theme recommend** → JSON `{ theme, reason }`

---

## 🏗️ Theme Engine Architecture

The pluggable theme system is the key technical talking point:

```
portfolioData (one schema)
       ↓
themeRegistry.js
       ↓ maps theme ID → component
ThemeComponent (12 options)
       ↓ receives same data prop
Rendered Portfolio (12 unique layouts)
```

Every theme receives the same `data` object and renders it differently. This means:
- Adding a new theme = add one file + one registry entry
- No data duplication across themes
- Clean separation of data and presentation

---


