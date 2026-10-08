# Portfolio rendering contract

The shared rendering contract now covers all 41 designs. Fifteen use individual theme compositions; the remaining 26 use distinct scoped art directions with shared content and theme-specific experiences. Every design receives normalized input and the optional layout/motion controls.

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

Optional portraits and empty sections must not leave broken columns. Narrow layouts stack content and wrap links and long strings. Animations and transitions stop for reduced motion and static previews. All 41 themes do not require WebGL or JavaScript animation loops. Aurora's decorative CSS atmosphere has a native pause control and pauses when its hero is offscreen or the document is hidden. Neon Terminal exposes actual section destinations and keyboard-operable card/compact project views. Kinetic provides gallery/index project views and finite entrance transitions; Retro Wave's horizon moves gently in Expressive mode. Bento's native expansion control retains focus on collapse and exposes every project in featured order. Theme controls do not invent connection status, files or portfolio facts.

## Compatibility and verification

All 30 original theme IDs remain valid; new designs add eleven IDs. Project schema additions have empty-string/false defaults, so legacy projects remain valid. AI recommendations use the same 41-ID catalog as the frontend.

```sh
npm test --prefix backend
npm run test:content --prefix frontend
npm run build --prefix frontend
npm run test:browser --prefix frontend
npm run test:themes --prefix frontend
```

Browser tests use isolated API fixtures, not production services. `test:themes` checks all 41 designs with populated, sparse and legacy portfolios, up to eight projects, real supplied destinations, failed images, long strings, light/dark custom palettes and reduced motion. Widths are 360, 390, 768, 1024 and 1440px. It also checks Kinetic's keyboard view switching, Bento's expansion/collapse and featured ordering, Neon Terminal's real file destinations and keyboard view switching, and Aurora's motion controls, offscreen pause, dynamic reduced motion and static preview. Optional comma-separated `PORTY_THEME_FILTER` limits that suite; `PORTY_TEST_FILTER` limits workflow scenarios. `PORTY_CHROME_PATH` selects an installed Chromium executable.

The remaining 18 existing and eight new designs are implemented. Physical-device, provider/database, hosted social metadata and real-user release gates remain pending; see `UPGRADE_STATUS.md`.

## Presentation settings and public privacy

`availability`, `motto`, `interests` and `resumeUrl` are optional supplied facts. `showLocation` controls location display. `sectionOrder` reorders projects, experience, credentials, profiles and contact; `sectionVisibility` hides sections without deleting owner data. Public API responses also remove hidden sections/contact/location and omit account ownership, recovery metadata and analytics. Owner previews retain the complete editable record.

New drafts use Expressive motion. Existing saved Subtle choices remain valid and now allow gentle reveals rather than forcing a static document. Still (`none`) disables animation. Device reduced motion always takes priority. Visitors can Pause/Resume motion. Rain remains explicit opt-in; atmospheres pause offscreen/hidden. Finite reveals never hide essential content. Illustrations use original SVG and direct links, with full content below.

Covers are captured from the actual theme document and saved with the portfolio. A failed capture clears an obsolete cover; the portfolio remains usable and the sharing kit explains missing cover availability. No invented skills or projects appear in capture output.

## Individual theme effects

The native compositions from the pre-studio 41-theme checkpoint (`7ef2676`) are retained. All 41 themes have a separate effect direction; no shared layout, font, spacing or image-frame overrides apply. The former `layoutSettings` schema remains compatible with saved records but is ignored during rendering. Applying a theme resets those experimental settings in the editor; Cancel changes nothing. Other saved information, visibility, ordering and destinations are preserved.

The catalog describes each actual effect in `INDIVIDUAL_THEME_EFFECTS.md`. Shared code manages only pause, live reduced motion, viewport visibility, document visibility, and scheduled pointer/scroll events. CSS and SVG artwork remain individually scoped. There is no global card tilt or title entrance. Continuous movement belongs to decorative objects; actual information is immediately readable. Thumbnails and capture stay still.

Native exploration controls remain theme-specific: Canvas board, Pixel explorer, Terminal commands, chapter/story slides, Cinema scenes, Bento expansion and Kinetic/Terminal presentation controls. Motion preference changes are local to the preview until Apply Theme. A visitor can stop motion without losing navigation or supplied work. The visitor motion control must stay clear of the public sharing toolbar.

`test:motion` verifies the effects and native-layout invariance under previously saved studio settings. `test/native-compositions.cjs` additionally compares a separately built `7ef2676` checkout against this build on desktop and phone. It checks palette, fonts, type sizes/weights, grids, spacing, image frames and widths rather than assuming restoration from source diffs.
