# Upgrade implementation and release status

Updated 6 October 2026. The original `PORTY_Master_Improvement_Checklist.md` is preserved unchanged. This document reports implementation separately from live release validation.

The earlier three design batches are retained; the remaining 18 original themes and eight new themes bring the catalog to **41**. All original theme identifiers remain valid. Neo-brutalism remains a Brutalist palette; Creator's Desk remains `interactive-3d`, and Signature Studio remains `kinetic`.

| Master area | Implementation | Validation / remaining gate |
| --- | --- | --- |
| 1. Reliability | Guarded graphics; scoped drafts; idempotent create/edit; failure feedback; same-tab and private previews; awaited sharing | Fixture workflow coverage. Live database/session and providers still need review deployment checks. |
| 2. Onboarding | Guest trial, retained account transition, optional goal/style, manual/import starts; password visibility, recovery, OTP cooldown and explicit delivery errors | Guest/login transition and recovery UI tested locally; real email delivery remains unverified. |
| 3. Builder | Desktop/mobile preview, lifecycle and timestamps, debounced drafts, undo/redo, leave guard, projects/sections/visibility, availability, factual stories, image compression/cropping/replacement, AI review | Round trips checked against API fixtures. Actual MongoDB persistence/index behavior and production upload handling remain release gates. |
| 4. Discovery | Actual isolated previews, search/filter, three recommendations with reasons, desktop/mobile/full preview, comparison, palettes/reset/contrast, motion and optional personal details | Keyboard modal behavior and reversible application covered. Custom palette guidance is a warning, not a guarantee for every arbitrary colour pair. |
| 5. Autopilot | All projects available, featured ordering, optional sections/portraits, long-text wrapping, image/type fallbacks, reversible controls | 41 themes × content/width/stress cases; no content fabricated. |
| 6. Theme standard | Shared content contract; distinct scoped art directions; real navigation; native command/file/slide/scene controls; actual thumbnails; lazy loading and static alternatives | Screenshots inspected. Physical-device motion/performance still requires measurement. |
| 7. Existing themes | All 30 original designs upgraded; 15 earlier directions preserved | IDs and link destinations retained; full catalog browser checks. |
| 8. New themes | All 11 added: Scrapbook, Surrealism, Y2K, Pixel Art, Maximalism, Conceptual Sketch, Bohemian, Victorian, Wabi-sabi, Product Showcase, Scroll Cinema | Full catalog fixture checks; new exploratory controls get browser coverage. |
| 9. Dashboard/publishing/sharing | Actual captured covers; 30-day Trash; publishing check; server-rendered metadata; QR/link/announcement; quick profile/resume; audience reuse; atomic view/click counters | Browser and server function fixtures. Hosted functions, review backend deployment and social-crawler/live-device checks remain. |
| 10. Resume/AI | Lazy PDF/DOCX/TXT text parsing; editable conservative suggestions for name, bio, email, skills and project drafts; selectable application; cancellation/errors; factual reviewed AI | Raw text retained for manual transfer of experience/credentials that cannot be reliably inferred. Scanned PDFs and legacy `.doc` show unsupported/manual guidance. |
| 11. Access/mobile/performance | Native labeled forms and controls; modal focus/Escape restoration; 360/390/768/1024/1440 layouts; touch-capable controls; reduced motion, offscreen/hidden pause; lazy parsers/themes and compressed images | Browser/emulated checks do not substitute for an actual Android device, real connection, loading/interactivity/CLS measurements or a complete assistive-technology audit. |
| 12. Release validation | Automated build, content, workflow, backend, metadata, catalog and interaction checks | Real email/AI/database tests, physical device review and observation of 10–15 target users remain **pending**. No production-ready claim. |
| 13. Adoption/learning | Owner opt-in showcase and attribution; style-only reuse; sharing kit; anonymous session funnel, first-publication time, repeat saves, failure/recovery counts; feedback submission | Tools are implemented. Recruitment, pilot observation, actual feedback analysis and subsequent evidence-based changes require real participants. |

## New backend is required

The public preview originally uses the existing Render backend and database. New routes and optional fields require this branch's backend. Updating only the frontend does not add password recovery, Trash, analytics, showcase, metadata or storage of presentation/story fields to that older backend.

Before promoting either service, create a separate backend/database for review, configure Mailjet and Groq there, and point review Vercel routing and `PORTY_BACKEND_URL` at it. Never replace production backend configuration just to exercise fixture scenarios. The master checklist's final release gates remain open until these checks are performed.

## Motion and layout upgrade — 6 October 2026

All 41 themes now accept independent layout experiments. The theme preview modal provides five starting presets, Surprise me, Reset layout, introduction/project composition, typography, spacing, image framing and lift/tilt choices. Apply Theme commits the experiment to the editor; Cancel discards it. Guest trials also offer these controls.

Larger previews play motion and have Play/Pause and optional interaction. New drafts use Expressive motion; Subtle gives gentle movement and Still disables it. Visitors can Pause/Resume. Reading progress, finite entrances, pointer tilt/light, focus highlights and offscreen/hidden atmosphere controls are shared across the catalog. New experiences include a draggable/keyboard Canvas board, Pixel movement/jump/project paths, Terminal commands, Storybook page turns and Cinema navigation. Space, Surrealism and Cyberpunk have controlled ambient effects. Pixel's luminous night palette has a Daylight world alternative.

The read-only `/portfolio/capabilities` endpoint advertises support for saved layouts. Before writing a custom layout or non-default motion setting, the editor checks that support. An older backend refuses the unsupported save with clear feedback and retains the editor/device draft; it does not claim that the experiment was published. Guest experimentation, animated previews and native composition remain available. Real backend persistence and physical-device release gates remain open.

## Verification record

The reference-inspired theme upgrade adds all-theme project search/filtering, gallery/index browsing and a focused project viewer, with separate palette-aware art directions. Guest trials accept multiple projects. These visitor features do not write portfolio records and need no new backend fields. The study and review flow are documented in `THEME_REFERENCE_UPGRADE.md`; saved custom-layout and other live-service gates above still apply.

Commands and results are recorded in `LOCAL_REVIEW.md`. Screenshots are generated artifacts rather than committed marketing examples. Fixture identities and screenshots are labeled samples; no fictitious creator is added to the opt-in showcase.

## Pilot protocol

Recruit 10–15 students or early-career creators with permission. Give the task: create, review, publish and share a portfolio using their own real work. Do not coach the workflow. Record elapsed time, field confusion, hesitation, abandonment, failures, draft recovery and whether the shared link/QR works on another device. Ask what worked and where they got stuck using the feedback form. Review supplied feedback in the development database's `feedbacks` collection; do not publish answers or identities without consent.

Observe on at least one real Android phone with touch, an ordinary laptop, reduced motion, keyboard-only input, zoom and a slower connection. Measure real loading/interactivity/layout stability alongside funnel counts. Resolve critical content loss, authentication, navigation or publishing failures before production promotion.
