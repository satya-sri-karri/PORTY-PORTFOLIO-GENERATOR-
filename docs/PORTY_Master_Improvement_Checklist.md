# PORTY master improvement checklist

Consolidated on 4 October 2026 from the source audit, theme decisions, and product discussion. This is a roadmap, not a record of implemented changes. The earlier audit covered 30 registered themes and isolated component checks; authenticated production flows, visual quality, mobile layouts, and animation performance still require real-browser testing.

## Product goal and scope

Help users turn their real information into a distinctive, polished portfolio with little design effort. Start with students, fresh graduates, and early-career creatives. Evaluate success through completed, published, and shared portfolios.

The proposed collection contains **41 themes: 30 existing themes upgraded and 11 new themes**. Neo-brutalism is a curated style within Brutalist. Creator’s Desk guides Interactive 3D; Signature Studio guides Kinetic. Preserve existing theme identifiers and saved portfolio links when display names or designs change.

## 1. Essential reliability repairs — first release gate

- [ ] Guard graphics initialization, preserve a static background, and isolate graphics errors so the homepage, login, and builder remain usable without WebGL.
- [ ] Handle graphics context loss and clean up animation loops and listeners.
- [ ] After creating a portfolio, move into editing the created record; subsequent saves update it rather than creating duplicates.
- [ ] Prevent duplicate submissions while a save is in progress; preserve entered information after failures.
- [ ] Implement recoverable drafts instead of restoring the most recent preview into every new portfolio.
- [ ] Distinguish New portfolio, Recover draft, and Edit existing; clear obsolete draft snapshots appropriately.
- [ ] Preserve the originating builder route when opening preview and returning to edit.
- [ ] Handle blocked preview popups, storage failures, and expired sessions with useful feedback.
- [ ] Separate dashboard loading, genuine empty account, request failure, and loaded states; provide Retry.
- [ ] Provide a working authenticated owner preview for private portfolios and clearly communicate public visibility.
- [ ] Await clipboard/share operations before reporting success; handle failure or cancellation accurately.
- [ ] Make failed uploads, saves, AI requests, and publishing operations visible and recoverable.

Acceptance: create, reload, recover, preview, save again, and view privately without losing information or creating another record. Repeat the entry flow with graphics disabled.

## 2. Landing page and onboarding

- [ ] Present a clear value proposition, real portfolio examples, and prominent Try it and Create portfolio actions.
- [ ] Show representative real themes and a brief explanation of how the product works.
- [ ] Add a guest trial: enter a name, role, and project to see a real portfolio before signing up.
- [ ] Preserve guest work through account creation; do not publish it automatically.
- [ ] Ask about the user's goal and personality with a small number of optional choices.
- [ ] Offer manual entry and resume import as starting routes.
- [ ] Explain required and optional fields; allow users to skip optional sections and return later.
- [ ] Verify and improve password visibility, recovery, OTP resend/cooldown, expiration feedback, autocomplete, and authentication error messages.
- [ ] Ensure loading or verification never silently discards the user's draft.

## 3. Builder and content workflow

- [ ] Provide form and live preview together on desktop; use clear Edit/Preview switching on mobile.
- [ ] Keep Save, Preview, and Publish reachable on small screens; repair the current sidebar/CSS conflict.
- [ ] Make the lifecycle explicit: Draft, Preview, Publish, then Save changes. State whether saving changes updates the live portfolio or requires publishing separately.
- [ ] Display Saving, Saved with timestamp, Unsaved changes, and Save failed states accurately.
- [ ] Add debounced draft saving, recovery, undo, and protection against unintentionally leaving unsaved work.
- [ ] Allow project and section reordering, featured project selection, and section visibility controls.
- [ ] Collect optional location and availability; display them according to explicit user choices.
- [ ] Give helpful input examples and inline validation without replacing the user's text.
- [ ] Guide project descriptions through problem, contribution, tools, process, and outcome; do not invent missing results.
- [ ] Improve image upload, preview, cropping, replacing, compression, and broken-image handling.
- [ ] Provide useful fallbacks when a portrait, screenshot, social link, or optional section is absent.
- [ ] Let users review and accept AI writing suggestions before replacement; support retry and restore previous text.
- [ ] Avoid exposing implementation terminology in product-facing instructions.

## 4. Theme discovery and personalization

- [ ] Replace generic theme mockups with actual screenshots or isolated live component previews.
- [ ] Render the user's current content in the selected theme preview; use clearly labeled samples when needed.
- [ ] Keep existing category filters and add theme-name/style search as the collection grows.
- [ ] Recommend three themes with concise reasons, extending the existing recommender.
- [ ] Offer desktop/mobile preview, an accessible full-size preview, and straightforward comparison.
- [ ] Provide curated palettes, Reset colours, and guidance when custom colours become unreadable.
- [ ] Provide Subtle/Expressive motion choices while always respecting device reduced-motion preferences.
- [ ] Let users optionally add interests, a motto, and theme-appropriate decorative details.
- [ ] Do not require elaborate assets or advanced animation settings to get an attractive result.
- [ ] Clearly indicate Apply versus Cancel; preview changes should not unexpectedly commit settings.

## 5. Design autopilot

- [ ] Adapt layouts to the quantity and length of real content.
- [ ] Give one project a substantial featured presentation; organize many projects into a complete browsable collection.
- [ ] Rebalance layouts without a portrait or experience section; avoid empty reserved spaces.
- [ ] Accommodate long names, biographies, URLs, and project titles.
- [ ] Apply consistent image framing, typography, spacing, and section hierarchy within each theme.
- [ ] Use appropriate illustration or typographic fallbacks when screenshots are unavailable, without suggesting invented project imagery is real.
- [ ] Keep automatic choices reversible through simple user controls.
- [ ] Preserve all content and link destinations when switching themes.

## 6. Quality standard for every theme

- [ ] Define a distinct hero, navigation, typography system, project presentation, contact section, and signature interaction.
- [ ] Keep identity and key project information easy to find, including in exploratory themes.
- [ ] Support biography, skills, projects, experience, certificates, awards, coding profiles, contact/social links, and optional location/availability.
- [ ] When showing a featured subset, provide View all rather than silently dropping items.
- [ ] Remove invented skill percentages, project distances, availability claims, and other factual-looking decorative metrics.
- [ ] Design deliberate mobile layouts, touch alternatives, accessible controls, and readable text.
- [ ] Keep decorative motion controlled; implement reduced-motion and static alternatives.
- [ ] Scope CSS and animation names; isolate multi-theme previews to prevent collisions.
- [ ] Lazy-load theme code and optional graphics; load only what the active experience needs.
- [ ] Ensure thumbnails and cover images update with the saved content/theme and remain readable on light and dark palettes.
- [ ] Keep decorative interactions separate from essential access to portfolio content.

## 7. Upgrade all 30 existing themes

These are design targets and source-audit repairs, not visual ratings.

| Existing theme | Required direction and repairs |
| --- | --- |
| Aurora | Develop the Ethereal direction: luminous atmosphere, delicate type, controlled motion, static fallback, readable translucent surfaces. |
| Minimalist | Develop Swiss Design: precise grids, typographic hierarchy, darken faint labels, stack date/content layouts on mobile. |
| Editorial | Strengthen magazine art direction and project stories; fix missing navigation targets and duplicated skill categorization. |
| Neon Terminal | Preserve code-editor identity; honor text colours, expose credential links, improve tab access, and reduce typing/blinking when requested. |
| Brutalist | Preserve the raw treatment and add a Neo-brutalist style with bold colours, outlines, hard shadows, tactile controls, and responsive cards. |
| Neumorphic | Improve contrast, theme-aware surfaces/shadows, tactile feedback, and mobile composition. |
| Kinetic | Use the Signature Studio direction: expressive typography, strong imagery, project previews, coordinated transitions; remove fabricated proficiency. |
| Executive | Refine business typography and project evidence; remove invented percentages and adapt hero/date columns. |
| Retro Wave | Create a coherent synthwave identity; adapt card widths and provide a static grid and readable palettes. |
| Organic | Improve image-led composition, natural textures, long-name wrapping, and responsive split layouts. |
| Bento Grid | Recompose responsive tiles, avoid clipped fixed-height content, show all projects through expansion, restore missing content and credential links. |
| Dark Luxe | Develop Luxury Typography: excellent type and imagery, restrained transitions; restore coding profiles and adapt dense rows. |
| Apple Vision | Refine glass surfaces and depth; accessible responsive tabs and readable colours with reduced blur on modest devices. |
| Blueprint | Use meaningful section labels, accurate active-sheet state, genuine information, and responsive navigation. |
| Cyberpunk 2077 | Develop an original Cybercore direction; add credential links, readable plain section labels, and controlled glitch/flicker. |
| AI Assistant | Correct query routing, provide direct browsing and clickable links, and accurately describe rule-based capabilities unless real AI is implemented. |
| Interactive 3D | Develop Creator’s Desk with meaningful object interactions, pointer optimization, touch navigation, and an attractive static/2D fallback. |
| Timeline Journey | Make career milestones meaningful; prevent long selectors from dominating and handle empty sections gracefully. |
| Dashboard Portfolio | Present genuine content counts and useful widgets; remove fake normalized skill levels and adapt crowded grids/header. |
| Space Explorer | Stabilize generated star positions, control animation work, improve mobile project layouts, and preserve easy navigation. |
| Infinite Canvas | Improve orientation, readable notes, responsive navigation, keyboard/touch access, and a direct content overview. |
| Storybook | Refine chapter pacing and page composition; omit empty chapters and provide reduced-motion transitions and reachable controls. |
| Spotify Wrapped | Refine identity and slide storytelling; implement real swipe or correct the instruction; provide labeled controls and direct section access. |
| Netflix Portfolio | Use clear project/source labels, meaningful detail views, responsive header/carousels, and complete identity even without a featured project. |
| Google Maps Portfolio | Present genuine location/journey information; remove invented distances/proficiency and clearly label project links. |
| Comic Book | Develop coherent panel storytelling; scale long names, retain readable paragraphs, and make motion optional. |
| Terminal OS | Make Explorer items functional; expose awards, coding profiles, project/credential links, text colours, and mobile sidebar controls. |
| Newspaper | Improve print hierarchy and stable decorative details; stack narrow-screen text columns and keep projects prominent. |
| Museum | Curate projects as exhibits with captions/details; repair minimum-width overflow and small-text contrast. |
| Hacker Matrix | Preserve technical identity while improving readable content, custom text colour support, canvas resizing, and pause/static behavior. |

## 8. Build the 11 new themes

| New theme | Experience and signature interaction |
| --- | --- |
| Scrapbook | Personal photographs, torn paper, tape, handwritten notes, and unfolding project sheets. Replaces the working name Paper Atelier. |
| Surrealism | Dreamlike scale and compositions, floating visual elements, and controlled scene transitions with a readable content layer. |
| Y2K Aesthetic | Chrome type, translucent digital windows, stickers, springy controls, and restrained sparkle. Distinct from Retro Wave. |
| Pixel Art | Original illustrated world and project locations; optional exploration with direct navigation. Develops Pixel Adventure. |
| Maximalism | Expressive type, patterns, layered imagery, and deliberate density with a clear reading order. |
| Conceptual Sketch | Pencil annotations, diagrams, project process, sketchbook composition, and line-drawing reveals. |
| Bohemian | Warm palettes, handmade details, textile-inspired patterns, expressive photography, and tactile interactions. |
| Victorian | Ornamental frames, engraved details, refined editorial type, rich palettes, and restrained page/frame reveals. |
| Wabi-sabi | Quiet asymmetry, muted colours, tactile surfaces, generous breathing room, and minimal movement. |
| Product Showcase | Device mockups and project case studies following problem, process, solution, and genuine outcomes. |
| Scroll Cinema | A continuous cinematic narrative with coordinated scenes for introduction, featured work, journey, and contact. |

First design batch: Scrapbook, Y2K Aesthetic, Product Showcase, and the Swiss Design and Luxury Typography upgrades. Use their content adaptation, mobile behavior, visual quality, and performance as the acceptance standard for later themes. Build the heavier interactive experiences after reliable fallbacks are in place.

## 9. Dashboard, publishing, and sharing

- [ ] Use actual portfolio thumbnails; show draft/public/private status, last update, and clear Edit/Preview actions.
- [ ] Make deletion a secondary action with clear consequences; choose a recovery policy rather than leaving behavior ambiguous.
- [ ] Provide a publishing check with actionable missing-link, missing-image, incomplete-contact, and readability feedback.
- [ ] Generate accurate per-portfolio page titles, descriptions, and social preview images; replace outdated theme-count messaging.
- [ ] Give public portfolios stable links; preserve them when content or themes change.
- [ ] Generate a sharing kit: QR code, cover image, copyable link, and editable announcement text.
- [ ] Provide a visitor-facing quick profile with role, strongest projects, resume if provided, and contact information.
- [ ] Extend multiple portfolios with reusable profile information and audience-specific versions; let owners choose which updates propagate.
- [ ] Extend analytics with measured project clicks, resume downloads, and contact clicks. Define views clearly; current fetch counts should not be presented as unique visitors.
- [ ] Make the publication and visibility choices easy to understand before sharing.

## 10. Resume import and AI assistance

- [ ] Parse supported resume formats into editable fields; explain unsupported or unreadable files and allow manual entry.
- [ ] Review extracted information before applying it; allow correction and avoid overwriting existing work silently.
- [ ] Show AI-proposed text separately with accept/reject/revise controls.
- [ ] Ground suggestions in supplied facts; do not fabricate qualifications, proficiency, achievements, or outcomes.
- [ ] Support clear loading, failure, retry, and cancellation states.
- [ ] Extend the existing theme recommender with preview-based recommendations and concise explanations.
- [ ] Treat recommendations as suggestions, with full access to the collection.

## 11. Accessibility, mobile, and performance

- [ ] Associate labels and errors with form fields; use native buttons, switches, links, and appropriate tab semantics.
- [ ] Make the complete core workflow operable by keyboard with visible focus.
- [ ] Add accessible dialog naming, focus management, Escape, and focus restoration.
- [ ] Verify colour contrast across default and custom palettes; ensure glass/textured backgrounds remain readable.
- [ ] Test 360, 390, 768, 1024, and 1440px layouts and actual Android touch interaction.
- [ ] Support long text, zoom, broken images, sparse content, and intentional horizontal interactions without accidental page overflow.
- [ ] Respect reduced motion; pause unnecessary animations offscreen or when the page is hidden.
- [ ] Optimize images, fonts, theme chunks, pointer handlers, blur effects, and graphics loops.
- [ ] Measure loading, interactivity, and layout stability on real user devices, alongside development checks.
- [ ] Keep interactive themes readable and usable on slower devices and connections.

## 12. Validation and release gates

- [ ] Test each of the 41 themes with minimal, full, and empty-optional content: 123 component fixture cases, supplemented by actual browser checks.
- [ ] Test all navigation, project/credential/social links, tabs, commands, slide controls, and signature interactions.
- [ ] Verify saved data round trips, custom colours, uploads, theme changes, and existing portfolio compatibility.
- [ ] Verify login/OTP/session behavior, reload recovery, create-to-edit transition, private preview, publishing, and share destinations.
- [ ] Verify graphics-disabled and reduced-motion entry flows.
- [ ] Test long names, long URLs, large descriptions, maximum supported content, missing/broken images, and sparse portfolios.
- [ ] Watch 10–15 target users create and publish without coaching; record hesitations, failures, and abandonment points.
- [ ] Fix critical workflow and content-loss failures before presenting the collection as production-ready.

Passing isolated render tests is not evidence that the themes are visually polished, responsive, or fully functional in production.

## 13. Adoption and ongoing learning — after the core experience works

- [ ] Pilot with students and early-career creators; collect feedback from actual creation sessions.
- [ ] Create an opt-in showcase with owner-approved examples and accurate attribution.
- [ ] Offer Use this style to reuse theme/settings with the new user's own content, without copying another person's identity or work.
- [ ] Make it easy to share published results through the sharing kit.
- [ ] Track the funnel: start → preview → save → publish → share.
- [ ] Measure publication rate, time to publish, recovery/error rates, and repeat edits; use these to prioritize improvements.
- [ ] Expand audience-specific guidance and themes based on demonstrated needs.

## Implementation order

1. Repair entry, draft/save lifecycle, dashboard errors, private preview, and content truthfulness.
2. Make the builder mobile-accessible and provide real theme previews.
3. Establish theme contracts, design autopilot, and the first polished theme batch.
4. Upgrade the remaining existing themes and introduce new themes in reviewed batches.
5. Add guest onboarding, resume import, guided writing, publishing checks, and the sharing kit as their dependencies become ready.
6. Improve audience variants, useful analytics, and visitor quick profiles.
7. Run the campus pilot and introduce the opt-in showcase after the creation experience passes user testing.

Do not make completion of all 41 themes a requirement for the first improved release. Release a smaller verified collection while continuing the full roadmap.
