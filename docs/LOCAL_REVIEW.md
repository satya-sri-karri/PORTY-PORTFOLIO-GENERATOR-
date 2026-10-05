# PORTY local review — batches 1, 2 and 3

These notes record the local checkpoints before publication. On 5 October 2026, the user authorized a GitHub backup and an upgrade-branch push. See `docs/ROLLBACK.md` for the original-version reference and publication plan; the historical local/uncommitted statements below describe those earlier checkpoints.

These batches implement the reliability foundation, real theme previews, reviewable AI suggestions, and the first five theme designs from the master checklist. This is a review checkpoint, not completion of the full roadmap or a production release.

Baseline: `1a7fd43922411be3660c1c7646f7d5458e5d0c36` on `main`.
Local branch: `local/porty-improvements`.
Changes are local and uncommitted. No GitHub writes, push, deployment, production API requests, account creation, or production database changes were performed.

## Changes available to review

- Static homepage/authentication backgrounds survive unavailable WebGL, shader/initialization failures and context loss. Graphics resources and listeners are released. Decorative loops stop for reduced motion or hidden pages.
- Creating a portfolio moves to editing its ID. Subsequent saves update that record. Concurrent clicks are guarded; server request IDs make retrying a lost create response safe.
- Drafts are scoped by account and portfolio. New, recover, and edit paths are distinct. Autosave is debounced; recovery is explicit; drafts clear after a successful save. Entered text survives save failures.
- Preview opens in the same tab and returns to the originating builder with its unsaved content. No popup permission is needed. Browser history snapshots are consumed once so reloads cannot silently restore outdated data.
- Private portfolios have authenticated owner previews. New portfolios start private. The builder explains when Save keeps a record private or updates a public portfolio.
- Dashboard loading, empty, failed and loaded states are separate. Failed requests offer Retry. Private links cannot be copied for public sharing. Public view counts are described as page loads, including repeat visits.
- Clipboard and sharing results are awaited. Failures show feedback; share cancellation does not claim success. Share feedback cannot block subsequent button clicks.
- Storage failures, expired sessions, failed uploads, saves and AI recommendations show useful feedback. Sign-in returns to the requested route.
- Builder section controls are native keyboard-accessible buttons. Visibility uses switch semantics. Mobile navigation scrolls horizontally; save and preview remain reachable. Compact header actions prevent narrow-screen overflow.
- Invented skill percentages, project distances, randomly assigned project status and availability claims are removed. Existing theme IDs are unchanged. The Assistant theme accurately describes its preset portfolio replies, and work-history requests no longer route to projects. Blueprint displays its actual active sheet.

## Run with your local services

Keep your existing backend environment settings on your computer. The bundle contains examples only; no live credentials were copied here.

From the project root:

```sh
npm install
npm ci --prefix backend
npm ci --prefix frontend
```

Create `backend/.env` using `backend/.env.example` if it does not already exist. Configure your development MongoDB, JWT secret, email service and AI keys. Prefer a development database for review.

```sh
npm run dev
```

Open `http://localhost:3000`. If Create React App reports an `allowedHosts` configuration error on your machine, you can review the production build instead; this avoids the development-server issue observed in this execution environment:

```sh
npm run dev:backend
```

In a second terminal:

```sh
npm run build --prefix frontend
npm run review --prefix frontend
```

For this production-build review, create `frontend/.env.local` with `REACT_APP_API_URL=http://localhost:5000/api` **before building**, so real requests reach your local backend. The review server is bound to your computer's loopback address. It does not publish or deploy anything.

## Review in this order

1. Sign in, create a new portfolio, enter a name and biography, and save privately. Confirm the address becomes `/builder/<id>`.
2. Save again after editing. Confirm the dashboard still contains one record and its link has not changed.
3. Type unsaved changes, reload, and choose Recover draft. Then start a separate new portfolio and choose Start new portfolio when offered recovery.
4. Open Preview, return to editing, and confirm unsaved text and the original record are retained.
5. Open the saved private preview from the dashboard. Its public `/p/<slug>` address should remain unavailable to signed-out visitors.
6. Turn on Public in Theme & Publish and save. Open the public link in a signed-out browser. Editing and saving that record should retain its link.
7. Disconnect the backend to check dashboard Retry and failed-save feedback. Reconnect it and retry without re-entering content.
8. Review keyboard navigation and a 360/390px phone layout. Repeat on your actual Android device when available.

## Automated verification

```sh
npm test --prefix backend
npm run build --prefix frontend
npx --prefix frontend playwright install chromium
npm run test:browser --prefix frontend
npm run test:content --prefix frontend
npm run test:themes --prefix frontend
```

The browser checks start their own loopback review server, intercept API requests with test fixtures, and block external font requests so checks use available fallback fonts. They require a prior frontend build. A system Chromium can be selected using `PORTY_CHROME_PATH`.

Backend tests exercise the actual Express router and JWT middleware with an in-memory model double: create retry, concurrent requests, stable links, protected metadata, private access, owner authorization and expired sessions. They do not establish that MongoDB index creation works in your database.

Browser checks exercise actual built React pages: create/edit/reload/preview, recovery, save failure, dashboard retry, storage failure, expired sessions, five viewport widths, WebGL-disabled entry pages, clipboard failure/share cancellation, changed theme fixtures, upload/AI failure and real WebGL context loss.

Still requiring your environment: real MongoDB round trips and the new compound request-ID index, actual login/OTP/email delivery, real AI providers, all existing uploaded-image formats, and physical Android testing. The browser API fixtures do not replace those checks.

## Remaining roadmap

The original master checklist is preserved alongside this guide. It intentionally remains unchecked: it describes the entire product and its release gates.

Batch 3 establishes the rendering contract and content adaptation for the first five designs: Swiss Design through Minimalist, Luxury Typography through Dark Luxe, Scrapbook, Y2K Aesthetic, and Product Showcase. The catalog now contains 33 themes with all original IDs preserved.

Next: continue reviewing and upgrading the other 28 registered themes in the checklist order, create the remaining eight planned new themes, and replace the dashboard cover generator with actual captures.

Resume import, guest trial/onboarding, sharing kit, metadata/analytics improvements, accessibility across all themes, the full 123-case theme fixture matrix, and target-user observation remain later work. The all-theme smoke checks do not establish full design or interaction validation of the other themes.

## Verified results for the batch 1 checkpoint

- Production frontend build: passed.
- Backend route/JWT tests: 8 passed.
- Browser integration scenarios: 13 passed.
- Builder widths: 360, 390, 768, 1024 and 1440px checked for page overflow and reachable controls.
- Real software WebGL context-loss check: passed; the canvas was removed and sign-in fields stayed usable.
- Mobile and desktop screenshots: visually reviewed for the repaired workflow.
- Git diff whitespace check: passed.

These are local checks with development fixtures; they are not a claim that all 30 current themes or the planned 41-theme collection passed full release validation.

## Same-tab preview follow-up

Dashboard Preview and both saved-portfolio links now use in-app navigation. The builder Preview button also keeps the current tab. A browser regression checks saved-portfolio links and dashboard previews at desktop and phone widths, verifies the owner preview loads, and asserts that no popup or second tab is created. The frontend production build and all 13 browser scenarios passed after this change.


## Batch 2 — theme discovery and AI review

- The builder shows a live preview beside the form at 1280px and wider. Smaller screens have Edit details / Live preview buttons; Save and the full Preview remain available. Narrow screens start with the phone preview layout.
- Theme cards render actual theme components in separate documents. Only nearby previews mount; documents unmount when out of view. Theme CSS cannot leak into the builder or other previews.
- Current user content appears in each theme. Entirely blank portfolios use explicitly labeled sample content. Once any real content is supplied, sample projects and claims are removed.
- Search matches theme name, description, persona and tags, combined with existing category filters.
- Theme dialogs offer desktop/phone layouts, three curated palettes, Reset colours, and text/background and accent/background contrast guidance. Apply commits settings; Cancel and Escape leave settings untouched. Focus stays inside the dialog and returns to its trigger.
- Open full preview stays in the same tab and offers direct, accessible portfolio browsing in its own document. Theme headers cannot cover Back to Builder. Returning restores the builder's original settings if the previewed theme was not applied.
- Bio and project AI drafts appear in editable review panels. Apply, dismiss, try another, and restore previous text are explicit actions. Restoring is offered while the applied text is unchanged, so subsequent manual edits are protected.
- AI skill suggestions require individual selection before being added. Duplicate and existing suggestions are filtered.
- Project rewrites require supplied facts. Biography requests include actual notes and no longer default to an invented developer/student identity or job search. Provider output still requires the user's factual review.
- AI failures show plain-language retry feedback. Leaving an editor aborts its request. Project editor keys survive removal, preventing a delayed reply from attaching to another project.
- The recommender considers all 30 existing themes and returns three distinct validated IDs with reasons. No saved theme identifiers were changed.
- Browser smoke checks found Netflix Portfolio omitted the full identity and biography entirely. Its introduction now shows the supplied name, role and bio even without a featured project; project/source labels are explicit and the fabricated NEW badge is removed.
- Theme modules are lazy-loaded behind loading/error fallbacks. Terminal typing is static in previews and for reduced motion. Matrix graphics have guarded setup, static preview/reduced-motion rendering, colour-aware drawing, resize rebuilding and visibility pause.

Review these changes with your own content before approving a push. In Theme & Publish, search for Aurora, open it, change a palette and Cancel; confirm your saved theme does not change. Repeat and Apply; save, reload and confirm the palette remains. On a phone, switch Edit details / Live preview and return to verify text is retained. Request a bio or project rewrite, edit the suggestion, apply it, then restore the original. Request skills and add just one selected suggestion.

The original checklist remains unchanged and unchecked; these notes record the implemented subset. Individual theme designs, saved dashboard cover captures, guest onboarding and new themes remain unfinished.


## Verified results for batch 2 (5 October 2026)

- Production frontend build: passed; initial JavaScript is approximately 107.5 KB compressed, down from 156.1 KB before theme lazy loading. Individual theme chunks load on demand.
- Backend tests: 15 passed, including factual prompt construction, input/output validation, three distinct existing theme recommendations, authentication and catalog compatibility.
- Browser scenarios: 20 passed. These cover the batch 1 regressions plus AI edit/apply/retry/dismiss/restore, manual edits during generation, selected skills, project removal during a request, theme search and recommendation display, dialog keyboard focus and Escape, contrast feedback, palette reset/save, live desktop/phone previews and same-tab unconfirmed-theme return.
- Theme rendering smoke checks: all 30 existing themes with minimal, populated and empty-optional fixtures (90 cases), checked for lazy-load/runtime failures and retained identity. This is not full link, interaction, visual or mobile validation of each theme.
- Desktop and 390px preview screenshots: visually reviewed.
- Original master checklist: byte-for-byte preserved.
- Git whitespace and cumulative patch application checks: passed.

The complete local bundle includes batches 1 and 2. Changes remain uncommitted on the local improvement branch. No push or deployment was performed. Real MongoDB, login/OTP/email and Groq output still require verification with your configured development services.

## Batch 3 — first five designs and project stories

- Minimalist now follows the Swiss Design direction with a typography grid, strong rules, and optional portrait. Dark Luxe follows Luxury Typography with serif headings, restrained warm colours and larger project imagery. Both retain their saved IDs and names.
- Three new designs are registered in discovery, live preview, public rendering and the AI recommendation catalog: Scrapbook, Y2K Aesthetic, and Product Showcase. They have separate visual treatments and share factual content handling.
- Rendering normalizes missing legacy fields without changing saved records. Empty optional sections and their navigation links disappear. These five themes display all supplied projects, skills, work history, certifications, achievements, coding profiles, contact methods and social links.
- Project screenshots fit their frames without cropping. Missing images receive explicitly labelled typographic covers; failed images receive an unavailable label. Missing or failed portraits do not leave an empty portrait column. No fake metrics or outcomes are supplied.
- Reorder projects with Move up / Move down. Mark one project as featured or clear that choice. These five designs show the chosen project first while retaining the saved array order for editing.
- Optional project-story fields record the problem, your contribution, the process and the outcome. Native expandable stories show only supplied facts. Product Showcase opens the first story. Other registered themes retain these fields in the record but have not yet been updated to display them.
- Project AI rewrites use the supplied story facts, including when the short description is empty. Suggestions still require review and Apply.
- Editor identity follows reordered projects. Late image uploads cannot attach to another project after its editor is removed.
- The save indicator compares object values consistently after normalization. Applying a palette and saving no longer leaves a false Unsaved changes status caused solely by object key order.
- The landing page now uses the actual registered theme count and accurately describes reviewable drafts.

Review: create two projects, add story facts to one, move it down, mark it featured, select Product Showcase and save. Confirm Saved at appears, the full preview shows the featured project first, and returning/reloading keeps the editor order and all facts. Try each of the five designs with your own portrait, one screenshot, and no images. Check phone navigation, project destinations, and story expansion.

The implementation contract is documented in `docs/THEME_CONTRACT.md`. The original master checklist is preserved unchanged.

## Verified results for batch 3 (5 October 2026)

- Production frontend build: passed; initial JavaScript is approximately 110.6 KB compressed. Theme modules remain lazy-loaded.
- Backend tests: 18 passed. New tests check factual project-story prompts and actual Mongoose project-schema compatibility with existing IDs and legacy records. No database is contacted.
- Content and save-comparison tests: 6 passed, including sparse legacy data, safe web destinations, nonmutating featured ordering, readable button labels and object-key-independent saved status.
- Browser integration scenarios: 21 passed, including project reorder/feature/story save, preview and reload, plus the previous workflow regressions.
- All-theme rendering smoke checks: 33 registered themes with minimal, populated and empty-optional fixtures (99 cases). These check runtime failures and identity retention, not full mobile, destination or visual correctness of every theme.
- First-five layout/content checks: 90 cases across 360, 390, 768, 1024 and 1440px, plus long strings, custom colours, failed images and missing legacy fields. Checks include all eight fixture projects, actual supplied link destinations, optional-section navigation and story expansion. Reduced motion is enabled and external fonts are blocked for deterministic fallback-font checks.
- Desktop and phone screenshots of the new designs were visually inspected. The Scrapbook tablet overflow found during testing was corrected.
- Original checklist preservation, whitespace, ZIP integrity and cumulative patch application: checked before packaging.

The batch 3 bundle includes all three batches. All changes remain local and uncommitted. Real development MongoDB round trips, login/OTP/email, AI provider output and physical Android testing remain for your configured environment.
