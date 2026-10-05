# Portfolio rendering contract

This contract is implemented for fifteen designs: Minimalist (`minimalist`, Swiss Design), Dark Luxe (`dark-luxe`, Luxury Typography), Scrapbook (`scrapbook`), Y2K Aesthetic (`y2k-aesthetic`), Product Showcase (`product-showcase`), Aurora (`aurora`), Editorial (`editorial`), Neon Terminal (`neon-terminal`), Brutalist (`brutalist`), Neumorphic (`neumorphic`), Kinetic (`kinetic`, Signature Studio), Executive (`executive`), Retro Wave (`retro-wave`), Organic (`organic`) and Bento Grid (`bento`). All registered themes receive normalized input, but the other designs still require individual content and interaction review.

## Data boundary

`ThemeRenderer` calls `normalizePortfolio` before loading a theme. Normalization is for display only: it does not write to the builder or database. Existing record metadata and subdocument IDs are retained. Missing nested objects, arrays and optional strings become safe empty values. Blank section rows are omitted from display. No role, employment, availability, score, testimonial, metric or outcome is invented.

| Field | Display rule |
| --- | --- |
| `name`, `title`, `about`, `location`, `avatarUrl` | Show supplied identity and biography. Portraits are optional and disappear on image failure. |
| `skills` | Show supplied strings without inferred percentages. |
| `projects` | Make every meaningful project available; adapt a single project layout. Bento initially shows four, with a labelled View all control to expose the remainder. Preserve title, description, technologies, image, live/source links and story facts. |
| `featured` | First selected project appears first for rendering. Saved array order stays unchanged. Builder selection is exclusive. |
| `problem`, `contribution`, `process`, `outcome` | Optional factual story; omit missing parts. Use native `details`/`summary` for keyboard-accessible expansion. |
| `experience` | Render supplied role, company, duration, description and explicit current-role flag. |
| `certifications`, `achievements` | Render supplied credentials and recognition, including actual credential destinations. |
| `codingProfiles` | Show provided platform, username, solved/rating strings and profile destination. No inferred scores. |
| `contact`, `socialLinks` | Show actual supplied contact methods and supported social destinations. |
| `themeColors` | Accept valid three- or six-digit hex overrides; otherwise use theme defaults. Accent-filled labels choose a readable black/white foreground. |

Web destinations accept HTTP/HTTPS or a bare hostname. Executable schemes and protocol-relative destinations are excluded from rendering. Images accept HTTP/HTTPS, root-relative paths and base64 image data. Failed project images show an explicit unavailable label; absent images use an explicitly labelled typographic cover. Screenshots fit within their frames using `object-fit: contain`.

## Theme structure

Shared components live in `frontend/src/components/themes/common/PortfolioParts.jsx`. Shared styling is scoped to `.portfolio-v4`; individual selectors also use their theme class. Themes live in isolated preview documents and remain lazy-loaded.

Use one `h1`, a main landmark, a skip link, real section anchors and native controls. Only render navigation for sections that exist. Keep all supplied text available without line clamping. Avoid fake interactive decorations; decorative window marks and device dots are hidden from assistive technology.

Optional portraits and empty sections must not leave broken columns. Narrow layouts stack content and wrap links and long strings. Animations and transitions stop for reduced motion and static previews. These fifteen themes do not require WebGL or JavaScript animation loops. Aurora's decorative CSS atmosphere has a native pause control and pauses when its hero is offscreen or the document is hidden. Neon Terminal exposes actual section destinations and keyboard-operable card/compact project views. Kinetic provides gallery/index project views and finite entrance transitions; Retro Wave's horizon is static. Bento's native expansion control retains focus on collapse and exposes every project in featured order. Theme controls do not invent connection status, files or portfolio facts.

## Compatibility and verification

All 30 original theme IDs remain valid; new designs add three IDs. Project schema additions have empty-string/false defaults, so legacy projects remain valid. AI recommendations use the same 33-ID catalog as the frontend.

```sh
npm test --prefix backend
npm run test:content --prefix frontend
npm run build --prefix frontend
npm run test:browser --prefix frontend
npm run test:themes --prefix frontend
```

Browser tests use isolated API fixtures, not production services. `test:themes` checks the fifteen designs with populated, sparse and legacy portfolios, up to eight projects, real supplied destinations, failed images, long strings, light/dark custom palettes and reduced motion. Widths are 360, 390, 768, 1024 and 1440px. It also checks Kinetic's keyboard view switching, Bento's expansion/collapse and featured ordering, Neon Terminal's real file destinations and keyboard view switching, and Aurora's motion controls, offscreen pause, dynamic reduced motion and static preview. Optional comma-separated `PORTY_THEME_FILTER` limits that suite; `PORTY_TEST_FILTER` limits workflow scenarios. `PORTY_CHROME_PATH` selects an installed Chromium executable.

The remaining 18 registered designs, eight planned new themes, physical device checks and the complete release matrix remain follow-up work. Smoke rendering alone does not establish those release gates.
