# Individual theme effects

6 October 2026. The user's direction is to preserve the themes and upgrade their visual effects, with a different personality for each. This correction restores the pre-studio 41-theme compositions from `7ef2676`; earlier workflow upgrades and theme-native controls remain.

Shared family artwork, generic layout presets, the common project search/index toolbar and shared project dialog are removed. Legacy layout settings remain stored for compatibility but no longer override the theme. No universal title entrance, card tilt or reading-progress line is applied. The earlier green Pixel world is restored; its night palette remains optional.

## Effects by theme

| Theme | Direction | Effect inside the retained design |
| --- | --- | --- |
| Minimalist | Measured lines | Precise rule drawing and quiet index accents in the original Swiss grid. |
| Dark Luxe | Gilded light | Gold reflections follow the light across the original serif gallery. |
| Scrapbook | Paper & tape | Mounted photos settle like paper; a focused story unfolds like a handwritten note. |
| Product Showcase | Studio reflection | Device frames catch a polished reflection around the case study. |
| Y2K Aesthetic | Chrome sparkle | Chrome highlights and slowly turning stars retain the playful browser windows. |
| Editorial | Ink & margin | Margin strokes and headline underlines bring the original publication to life. |
| Neon Terminal | Phosphor trace | A restrained CRT scan animates the developer workspace. |
| Brutalist | Offset press | Hard shadows compress and the oversized arrow snaps into place. |
| Neumorphic | Soft press | Soft controls compress into their surface beneath sculpted light. |
| Aurora | Northern light | Slow translucent ribbons move behind the centred introduction. |
| Kinetic | Type in motion | The existing typographic entrance gains a moving directional rule. |
| Executive | Signature rule | An accent line traces the business profile and career entries. |
| Retro Wave | Sunset horizon | The striped sun breathes above a travelling perspective grid. |
| Organic | Botanical breeze | A hand-drawn branch grows into view and leaves sway around the soft portrait. |
| Bento Grid | Cell highlight | Individual tiles gain a small corner trace and tactile focus response. |
| Apple Vision | Prismatic glass | Prismatic contours and a pointer-lit glass edge suit the rounded spatial panels. |
| Blueprint | Drafting plot | Construction lines draw like a plotted technical drawing. |
| Cyberpunk 2077 | Diagonal signal | An angled signal sweeps through the cut-corner panels; focus triggers one short chromatic echo. |
| AI Assistant | Conversation orbit | Three dots orbit the guide; topic replies arrive as a short conversation beat. |
| Interactive 3D | Desk perspective | The illustrated desk responds to pointer perspective while its text stays readable. |
| Timeline Journey | Journey path | A travelling path marker and finite milestone traces fit the existing career journey. |
| Dashboard Portfolio | Circuit activity | A circuit route and panel outlines give the dashboard an instrument feel. |
| Space Explorer | Orbital drift | Stable stars, a slow planetary orbit and gentle depth preserve the mission atmosphere. |
| Infinite Canvas | Pinned ideas | Pins and pencil connectors appear on the dotted board; dragging casts a deeper paper shadow. |
| Storybook | Turning pages | Page-edge light and a short page turn animate the chapter reader. |
| Spotify Wrapped | Rhythm & vinyl | A graphic equalizer and a rotating record ring support the music-inspired stories. |
| Netflix Portfolio | Preview spotlight | The horizontal collection gets focused poster zoom and a cinematic sweep. |
| Google Maps Portfolio | Route discovery | An illustrated route traces between section pins without inventing geographic data. |
| Comic Book | Panel impact | Speed lines draw outward and comic panels press into their hard shadows. |
| Terminal OS | Boot sequence | A finite boot-bar sequence and an input cursor fit the actual command console. |
| Newspaper | Printing press | Ink rules print across the newspaper; article headings gain a crisp underline. |
| Museum | Gallery lighting | A softly aimed pool of light illuminates framed work as visitors browse. |
| Hacker Matrix | Code rain | Opt-in code rain gains column depth and a terminal-style focus trace. |
| Surrealism | Liquid orbit | An eccentric ellipse slowly morphs around an impossible floating shape. |
| Pixel Art | Pixel weather | Stepped clouds, pixel stars and jump controls animate the green game world. |
| Maximalism | Collage burst | Different stamped shapes orbit a layered burst, retaining the bold alternating frames. |
| Conceptual Sketch | Pencil study | Loose pencil strokes draw over the ruled notebook and underline the project studies. |
| Bohemian | Woven sun | A woven radial sun and swaying fringe complement the arched portrait. |
| Victorian | Engraved flourish | An engraved flourish draws once around the ornate double borders. |
| Wabi-sabi | Ink & breath | An imperfect ink circle settles quietly inside the existing uneven frames. |
| Scroll Cinema | Moving aperture | A film aperture opens once, with gentle depth inside the original widescreen images. |

The labeled typographic project covers also have individual materials: paper, fine rules, glass, drafting grids, vinyl rings, halftone dots, pixel checks, woven patterns or gallery mats. They use supplied project initials and do not pretend to be screenshots. Real supplied screenshots remain intact in their existing frames.

## Review it

Open the review site's `/try` page, enter your own details and a few projects, and choose themes. Use **Theme effects** to select Expressive, Subtle or Still. The preview has Play/Pause and optional interaction. In the builder, preview choices apply only after **Apply Theme**; Cancel preserves the editor. Save is a separate action.

Compare Scrapbook's paper settle with Blueprint's plotted lines, Space Explorer's orbit with Wrapped's record/equalizer, and Victorian's engraved flourish with Pixel's stepped weather. Browse both projects with screenshots and labeled covers. Keyboard focus provides the same relevant highlights as pointer hover. Native Canvas dragging, Pixel controls, chapter slides, Terminal commands, Cinema navigation, Kinetic/Terminal views and Bento expansion remain available.

Continuous movement is limited to decorative objects and stops when its scene is offscreen or the page is hidden. Subtle mode stops continuous atmosphere; Still, reduced motion, visitor Pause and static capture stop animation. Pointer tracking is restricted to mouse/fine-pointer input and opt-in Expressive effects; touch and keyboard navigation never depend on it. Scroll depth is bounded to 18px and scoped to Space/Cinema.

## Validation

`test:themes` checks content, supplied destinations, five widths, sparse/long/broken-image cases, palettes and reduced motion across the full catalog. `test:motion` checks each theme under old studio settings, visitor pause/live reduced motion, cover materials and native interaction controls. `test:native` compares desktop/phone palette, typography, grids, spacing and frame geometry against a separately built pre-studio checkout:

```sh
PORTY_BASELINE_ROOT=/path/to/pre-studio-checkout PORTY_CHROME_PATH=/path/to/chromium npm run test:native --prefix frontend
```

Current results and visual-review notes are recorded in `LOCAL_REVIEW.md`. Browser emulation does not establish physical-device performance. The review frontend still uses the original Render backend; its additional server capabilities and non-default motion persistence require the separately upgraded review service. No production/backend/database changes accompany this correction.

## Checkpoint

The preceding review is backed up locally and on GitHub at `backup/pre-individual-effects-2026-10-06` (`d13091e37c43a5b7fbe618e9004f0e755193f84c`). This correction stays on the existing review branch and draft PR #2. Original production remains separate.

## Native interaction refinements — 8 October 2026

Storybook's page turn and Wrapped's track change now have separate transitions. Focus the story panel and use Left/Right, Home/End, or swipe sideways on touch. Vertical browsing does not turn a page. The full-story link opens the matching project or career entry, including featured-project ordering.

Focus Pixel's explorer to move with Left/Right and jump with Space/Up. Its project paths now lead to each individual project. Netflix's collection controls follow measured card widths, work after a partial swipe, and become unavailable at the start/end; Expressive uses smooth navigation while Pause, Still and reduced motion use immediate navigation.

Product, Museum, Desk, Canvas and Dashboard entrances wait for their actual objects to enter the viewport. Subtle stops all continuous decorative loops throughout the 41-theme catalog. All changes retain the native compositions, content and destinations. Current test evidence is in `LOCAL_REVIEW.md`.

The phone sharing toolbar starts as one compact button, keeping the story/game controls visible. Open it for Sharing kit, Share, Copy link and Build your own; Escape or clicking outside closes it. Its QR dialog restores focus to Sharing kit. The desktop action list remains available.
