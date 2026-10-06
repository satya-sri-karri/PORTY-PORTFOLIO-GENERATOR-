# Motion and layout studio review

6 October 2026. This update extends the completion review branch. Production remains separate.

## Try it

Open the review site's `/try` page. Add your name, biography and a project; select a theme. Under **Make it your own**, try **Creative gallery**, **Playful deck**, **Editorial story** or **Developer index**. **Mix your own layout** lets you change the introduction, project presentation, spacing, typography, image frames and project interaction independently. **Surprise me** chooses another curated combination; **Reset layout** returns to the theme's own composition.

Use **Expressive** for the full motion treatment, **Subtle** for gentle movement and **Still** for no animation. Large previews play automatically. **Pause preview** freezes the scene; **Interact with preview** enables scrolling and the theme controls inside the preview. The compact preview stays visible while using the theme modal's controls on a phone. Catalog thumbnails and saved cover images remain still.

In an existing builder, choose **Theme & Publish**, open a theme, and experiment in its preview modal. **Cancel** discards the preview choices. **Apply Theme** transfers them to the editor; saving is a separate action. **Open full preview** lets you explore the entire portfolio in the same tab without committing experimental settings.

## Try the signature experiences

| Theme | What to try |
| --- | --- |
| Infinite Canvas | Drag project cards; focus a card and use arrow keys; Enter opens its supplied project story. Reset board or switch to Reading view. Board positions are temporary exploration. |
| Pixel Art | Move the character, Jump and follow the supplied project paths. The count records the paths visited during this view. Try the Daylight world palette as an alternative to the luminous night scene. |
| Terminal OS | Enter `help`, `ls`, `projects`, `skills`, `about`, `experience` or `contact`. Commands show supplied information and native section links. Unknown commands do not run code or change content. |
| Scroll Cinema | Choose a scene to reach the actual project; scroll for finite scene entrances and portrait depth. |
| Storybook / Spotify Wrapped | Use Previous / Next story or swipe to change the supplied story. Full content remains below. |
| Surrealism / Space Explorer / Cyberpunk 2077 | Watch slow morphing art, drifting stars or the scan atmosphere; Cyberpunk's title has a brief hover glitch. Pause motion, scroll away or enable reduced motion to verify the fallback. |
| All themes | Try a project image's tilt/light with a mouse, or the focus highlight with keyboard/touch; scroll for staged entrances and the reading-progress line. |

## Saving in the review environment

The later reference-inspired upgrade adds project search, supplied-technology filters, a temporary Reading index and a themed same-page project viewer. The guest trial supports multiple project entries. See `THEME_REFERENCE_UPGRADE.md` for the reference study and review steps. These visitor controls require no additional backend fields.

Custom layouts and non-default motion choices require this revision's backend. The editor first checks `/portfolio/capabilities`. If the service is older or the check fails, it makes no portfolio save request and keeps the experiment in the editor/recoverable draft with clear feedback. Device storage failures are reported separately. Guest experiments remain available without an account.

Connecting a separate review backend/database is still necessary to test live saved settings. Backend fixtures and browser API fixtures do not establish live persistence, email delivery, physical Android performance or target-user observation. The release gates in `UPGRADE_STATUS.md` remain open.
