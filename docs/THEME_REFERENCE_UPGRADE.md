# Theme reference study and upgrade

6 October 2026. This review builds on the animated layout studio. The previous source is preserved locally and on GitHub at `backup/pre-reference-themes-2026-10-06` (`229e6e4137d6bf0e850fdd914b60d564f29a6d73`).

## What was studied

Official portfolio pages, examples, template descriptions and interaction documentation were reviewed. Readymag's homepage returned a fetch restriction; its official blog and animation documentation were accessible. This is a public reference study, not a hands-on audit of paid editors or measured comparison of their performance.

| Reference | Pattern used in PORTY |
| --- | --- |
| [Framer portfolio builder](https://www.framer.com/solutions/portfolio-website/) and [Quiet Magic](https://www.framer.com/marketplace/templates/quiet-magic/) | Independent presentation choices, responsive gallery exploration, meaningful entrances and controlled atmosphere. |
| [Readymag interactive examples](https://blog.readymag.com/interactivity-features-to-catch-all-eyes/) and [animation documentation](https://help.readymag.com/hc/en-us/articles/360020527292-Animation) | Content-led exploration, same-page project stories and pointer interactions with explicit keyboard/tap alternatives. |
| [Portfoliobox features](https://www.portfoliobox.com/features) and [examples](https://www.portfoliobox.com/examples) | Gallery and reading presentations that adapt to different kinds of supplied work. |
| [UXfolio examples](https://uxfol.io/examples) | Clear problem, contribution, process and outcome sections using the creator's own information. |
| [Carrd](https://carrd.co/) | A small, labeled set of controls, with no extra setup needed for visitor exploration. |
| [Webflow interactions](https://webflow.com/feature/interactions-animations) | Restrained hover/scroll timing and reusable interaction treatments. |

PORTY retains its own layouts, artwork and code. No purchased templates, reference images, biographies, customer examples, fabricated outcomes or testimonials were imported.

## Implemented

- All 41 themes provide project search, filters derived from supplied technologies, a clear matching count, Clear filters and temporary Theme gallery / Reading index controls. Search and filters combine. Other portfolio sections remain available when the search has no matches.
- Every supplied project can open in a themed same-page viewer with a larger screenshot, complete description, technologies, supplied story sections and actual project/source links. Previous / Next covers the full collection. Missing story fields are omitted; failed screenshots keep the remaining details and destinations.
- Native modal behavior is supplemented by explicit Tab/Shift+Tab containment, Escape, scroll locking and focus restoration. Within an interactive theme iframe, the first Escape closes the project viewer; a subsequent Escape closes the parent theme modal.
- Bento's reading view and filters include projects beyond the initial four. Theme gallery restores its original compact collection. Canvas, Pixel and Cinema destinations clear incompatible filters and reveal the correct project in the reading index.
- Original palette-aware SVG ornaments and typographic covers vary across modern, editorial, playful, technical, organic, cosmic and cinematic art directions. Selected native compositions have larger leading projects or alternating story rows. Explicit studio layout choices retain priority; temporary visitor index choices take precedence while browsing.
- Expressive cosmic/playful ornaments run only while visible and active. Image zoom and finite viewer entrances respect visitor pause, static previews, Still and reduced motion. Thumbnails omit collection controls and project viewer buttons.

## Review

Open `/try`, supply your project titles/descriptions using **Add another project**, and choose a theme. Enable **Interact with preview** and scroll to Projects. Try search, Reading index, Clear filters and Explore project. Technology filters appear when your supplied work includes different technologies (through resume import or the full builder). In the story viewer try Next/Previous, keyboard Tab/Shift+Tab and Escape. Compare Swiss, Scrapbook, Museum, Terminal OS, Surrealism and Scroll Cinema to see their separate visual treatments.

Visitor browsing does not save or modify the creator's portfolio. This update adds no backend fields or migrations. The preceding layout studio's saved custom settings still require an upgraded review backend; the original Render connection and its existing compatibility guard remain. Real backend/provider and physical-device release gates are tracked in `UPGRADE_STATUS.md`.
