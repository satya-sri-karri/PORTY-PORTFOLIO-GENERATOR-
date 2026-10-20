# PORTY application UX — 20 October 2026

This pass applies Hick’s law through task hierarchy and progressive disclosure. Fewer competing choices are shown at each decision point; optional capabilities remain reachable. Faster decisions and better completion are design hypotheses, not measured user-study results.

## The experience

- Entry: one primary route to the guest trial. The landing page explains three steps instead of presenting four competing calls to action and 41 decorative theme cards.
- Navigation: portfolios and a compact account disclosure. Creating a portfolio belongs in the dashboard; appearance and sign-out are grouped under the account control. Escape and outside-click close that disclosure.
- Account: focused sign-in, two-step email verification and account recovery. Registration offers sign-in on both steps. The animated full-page effects are removed from these application screens.
- Dashboard: portfolios come first. Each card leads with Edit and Preview; sharing details, analytics and Trash sit under More. Profile reuse, Trash, device activity and feedback remain below the collection. Search appears only when there are more than four portfolios.
- Guest trial: About you → Your work → Your style. Three initial style directions precede the full collection. Content survives moving between steps and remains in the existing device draft. Mobile previews are explicitly revealed.
- Builder: About you → Your work → Contact → Design → Review & save. Skills, experience, certifications, achievements and coding profiles are optional sections. Photo/location and additional personal fields are disclosed separately. The footer names the next step and moves focus to its heading.
- Design discovery: current style plus at most six starting points. Search, category selection or Browse all accesses the entire 41-theme collection. AI suggestions, animation, typography, colours and comparison are disclosed in context. Cancel restores focus and does not apply settings.
- Publishing: visibility is chosen in Review & save. Changing visibility alone never publishes; the final button states whether it saves privately, publishes, or updates public content. Draft recovery, validation, undo/redo and existing save behavior remain in place.

## Visual system and scope

Application-scoped colours, spacing, type, form states and button hierarchy support dark and light appearance, keyboard focus and reduced motion. App screens use a restrained lavender/ink palette and opaque reading surfaces. Mobile layouts stack content and use readable input sizes.

Portfolio theme components, styles, registry definitions and rendering documents are unchanged. The discovery interface changes how users select a theme, not its design. No backend schema, API contract or dependency was added.

## Verification

- Production build passes; initial JavaScript is approximately 108 KB gzip, compared with approximately 129 KB before this application pass.
- `npm run test:ux --prefix frontend` (after a build): compiled-app DOM tests cover landing/account hierarchy, staged guest content retention, dashboard disclosure, optional builder navigation, full theme access, modal cancel/focus restoration and explicit private saving. CSS scope is checked separately.
- Content and metadata tests pass. Existing browser regression scripts have updated navigation/disclosure steps and pass syntax checks.
- Visual browser/mobile rendering checks could not run because the supported browser-control capability is unavailable in this environment. DOM tests are not layout or screen-reader testing. Real-device review and user observation remain necessary before claiming a measured usability improvement.
