# Porty — Portfolio Generator

Turn real information into a personal portfolio. The upgrade collection contains **41 lazy-loaded themes**, preserving all 30 original identifiers and existing public links.

Production: https://porty-eight.vercel.app

Repository: https://github.com/satya-sri-karri/PORTY-PORTFOLIO-GENERATOR-

This branch is an upgrade candidate. Source implementation and fixture validation do not mean the existing Render backend has been upgraded or that production release gates are complete. See [completion status](docs/UPGRADE_STATUS.md), [local review](docs/LOCAL_REVIEW.md), and [rollback](docs/ROLLBACK.md).

## Workflow

- Try `/try` without an account: enter identity and multiple projects, explore actual desktop/phone theme previews, and continue the private draft after sign-in.
- Import PDF with selectable text, Word `.docx`, or TXT on the device. Review and correct extracted suggestions; explicitly choose which fields replace existing content. Scanned documents require text recognition outside Porty or manual entry.
- Build with live previews, recoverable device drafts, undo/redo, project/section ordering, featured work, visibility controls, optional personal details and motion preferences.
- Experiment in the layout studio: five starting presets, introduction/project layouts, spacing, typography, image frames and lift/tilt interactions. Preview and Cancel before applying. Larger previews can play and accept interaction; thumbnails stay still.
- New drafts default to Expressive motion; Subtle adds gentle movement, and Still disables animation. Visitors can pause motion. Interactive themes include a draggable Canvas board, Pixel explorer, Terminal commands and Cinema scene navigation; all keep direct access to the supplied projects.
- Visitors can search projects, filter by supplied technologies, switch to a reading index and open themed project stories with larger screenshots, complete supplied details and real destinations. These exploration choices are temporary and make no portfolio writes. Original artwork and covers vary across theme families.
- Review factual AI suggestions before applying them. AI calls use Groq through the OpenAI-compatible client; they remain optional and fail without replacing the user's text.
- Save privately or choose Public and save. Subsequent saves update that same record and stable link, including changes to a public portfolio.
- Share the link, QR, actual portfolio cover or edited announcement. Visitors can browse a quick profile and a supplied resume link.
- Create private audience versions and explicitly copy selected profile fields to selected owned versions.
- Recover deleted portfolios from Trash for 30 days. Public links stop working immediately; restoring recovers the earlier visibility and same link.
- Owners may opt a published portfolio into `/showcase`. Reusing a style copies only theme/settings, never the original creator's identity or projects.

Views count public portfolio requests, including repeats. Project/resume/contact metrics count reported clicks, not unique visitors or confirmed downloads. Funnel metrics count anonymous browser sessions and actions; clearing session storage starts a new session. Feedback contains only the supplied answers.

## Collection

| Theme ID | Design |
| --- | --- |
| `aurora` | Aurora |
| `minimalist` | Minimalist |
| `editorial` | Editorial |
| `neon-terminal` | Neon Terminal |
| `brutalist` | Brutalist |
| `neumorphic` | Neumorphic |
| `kinetic` | Kinetic |
| `executive` | Executive |
| `retro-wave` | Retro Wave |
| `organic` | Organic |
| `bento` | Bento Grid |
| `dark-luxe` | Dark Luxe |
| `apple-vision` | Apple Vision |
| `blueprint` | Blueprint |
| `cyberpunk-2077` | Cyberpunk 2077 |
| `ai-assistant` | AI Assistant |
| `interactive-3d` | Interactive 3D |
| `timeline-journey` | Timeline Journey |
| `dashboard-portfolio` | Dashboard Portfolio |
| `space-explorer` | Space Explorer |
| `infinite-canvas` | Infinite Canvas |
| `storybook` | Storybook |
| `spotify-wrapped` | Spotify Wrapped |
| `netflix-portfolio` | Netflix Portfolio |
| `google-maps-portfolio` | Google Maps Portfolio |
| `comic-book` | Comic Book |
| `terminal-os` | Terminal OS |
| `newspaper` | Newspaper |
| `museum` | Museum |
| `hacker-matrix` | Hacker Matrix |
| `scrapbook` | Scrapbook |
| `y2k-aesthetic` | Y2K Aesthetic |
| `product-showcase` | Product Showcase |
| `surrealism` | Surrealism |
| `pixel-art` | Pixel Art |
| `maximalism` | Maximalism |
| `conceptual-sketch` | Conceptual Sketch |
| `bohemian` | Bohemian |
| `victorian` | Victorian |
| `wabi-sabi` | Wabi-sabi |
| `scroll-cinema` | Scroll Cinema |

## Development

Use Node 20+ and MongoDB. Install backend and frontend dependencies independently:

```sh
npm ci --prefix backend
npm ci --prefix frontend
```

Configure backend environment values without committing secrets:

```env
MONGODB_URI=mongodb://localhost:27017/porty-upgrade-review
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your-own-key
MAILJET_API_KEY=your-own-key
MAILJET_SECRET_KEY=your-own-secret
EMAIL_FROM=your-verified-sender@example.com
```

Run `npm start --prefix backend` and `npm start --prefix frontend` in separate terminals. CRA proxies `/api` to localhost:5000. Guest/manual entry works without AI; registration and recovery require functioning Mailjet delivery. Codes are never printed as a substitute for sending email.

Use a separate review database and backend. The existing Vercel rewrite still points to the original Render API; do not use that API to validate new schema fields or Trash/recovery routes. For a review deployment, set the rewrite to the review backend and set server-side `PORTY_BACKEND_URL` to its `/api` base. Vercel's portfolio page/cover functions use the same backend for public metadata without increasing view counts. `PORTY_PUBLIC_ORIGIN` is optional; otherwise metadata uses the request host.

## Checks

```sh
npm test --prefix backend
npm run test:content --prefix frontend
npm run build --prefix frontend
npm run test:browser --prefix frontend
npm run test:completion --prefix frontend
npm run test:themes --prefix frontend
npm run test:metadata --prefix frontend
```

Browser checks launch an isolated local static server and intercept API calls. `PORTY_CHROME_PATH` selects an installed Chromium executable. Do not rebuild while browser suites are using `frontend/build`; a rebuild replaces their served files. Generated screenshots stay in `frontend/test/artifacts`.

PDF and Word parsers, QR generation and theme code load on demand. Core entry screens do not depend on WebGL. Reduced motion and static previews keep decorative motion inactive.
