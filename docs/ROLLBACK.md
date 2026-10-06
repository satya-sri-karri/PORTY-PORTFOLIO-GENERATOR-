# Original version and upgrade review

The user authorized preserving the original version and pushing the tested upgrades on 5 October 2026.

- Original commit: `1a7fd43922411be3660c1c7646f7d5458e5d0c36`.
- GitHub backup branch: `backup/pre-upgrade-2026-10-05`.
- Local backup tag: `porty-pre-upgrade-2026-10-05`.
- Upgrade branch: `upgrade/porty-batches-1-3`.

The original commit had a successful Vercel deployment reported by GitHub. Its deployment record is https://vercel.com/satya-sri-karris-projects/porty/3V66bCU4zPMTv6LJCNd8P27mWsoG . The backup preserves repository source, not hosting environment variables or a database snapshot.

The initial three development checkpoints were pushed together; subsequent fixes and the second design batch extend the same upgrade branch. The upgrade branch can be compared with the backup without changing the production branch. Vercel builds this branch as a preview, separate from production promotion.

The reviewed first design batch, including the preview login routing fix, is preserved at `47901c8d87666ae64d535fadbf58a7b2ec2dac20` on `backup/design-batch-1-2026-10-05` and the local tag `porty-design-batch-1-2026-10-05`. This additional checkpoint allows restoring the reviewed upgrades as well as the original version.

The second design batch is preserved at `35dc3f10f22e652c6d923f64cfeb99a0650c6e6f` on `backup/design-batch-2-2026-10-05` and the local tag `porty-design-batch-2-2026-10-05`. The third design batch extends the same preview branch, leaving all earlier checkpoints available.

## Restore the original site if the upgrade is promoted

Keep the backup branch and tag. If the upgrade is merged into the production branch, revert the corresponding merge or squash commit and redeploy that branch with the existing frontend and backend environment settings. Use a normal revert commit rather than force-pushing or deleting history. If unrelated changes were added afterward, review the revert before publishing it.

The exact revert commit will be recorded when production promotion occurs. If the upgrade remains only on its separate review branch, the original production source does not need a revert.

Project-story schema additions are optional and retain existing project IDs. Reverting source does not itself restore or delete portfolio records. Database contents and hosting secrets require their own backups if those are changed later.

## Validation at the third design batch

- Frontend production build passed.
- 18 backend tests, 6 content tests and 23 browser workflow scenarios passed.
- 300 responsive/content cases passed for fifteen upgraded/new designs, with keyboard controls and static/reduced-motion checks. The final small Kinetic touch-target and Bento control-label adjustments received focused rechecks.
- All 33 registered themes passed three rendering smoke fixtures each (99 cases).
- The original master checklist was preserved byte-for-byte.

See `docs/LOCAL_REVIEW.md` for local-service setup and the remaining release checks. Real development-database, authentication/email, AI-provider and physical-device checks have not been replaced by browser API fixtures.

## Preview login routing

The Vercel preview may have no `REACT_APP_API_URL` because production-only environment values do not apply to preview builds. The frontend then requests `/api` on its own origin. `frontend/vercel.json` now routes `/api/:path*` to the existing Render API before the React Router fallback, so login POST requests reach Express instead of the static frontend (which returned HTTP 405).

The Render address was confirmed from the original production JavaScript bundle. This connects the preview to the existing backend and account database; it does not upgrade or replace that backend. Saving in the preview can modify the same account records as the original site. Newly added project-story fields still require the upgraded backend before they can persist there.

## Full collection checkpoint

Before extending the third design batch, `894f1d273a964e0c3ffdc5ebfe6205a23490e818` was preserved locally on `backup/design-batch-3-2026-10-05` and tag `porty-design-batch-3-2026-10-05`. This is the immediately previous reviewed source state.

The full collection adds optional fields, anonymous Journey events and Feedback records. Deleted portfolios set `isPublic:false` as well as a Trash date, so an older public endpoint cannot inadvertently republish them after a source rollback. Restoring on the upgrade backend restores the previous visibility. A MongoDB TTL index permanently expires dated Trash entries after 30 days; database snapshots and deliberate index management are required separately from source backup. Reverting source does not remove an already-created TTL index.

See `UPGRADE_STATUS.md` for backend deployment dependencies and the remaining real-service/device/pilot gates.

At the initial local completion checkpoint, the collection was saved on `upgrade/porty-complete-checklist` before publishing the review branch. Switching back to `upgrade/porty-batches-1-3` or the third-batch backup returns to the earlier reviewed source. Verification results are recorded in `LOCAL_REVIEW.md`; local checks do not promote either service or modify the live database. The subsequent review deployment is recorded below.

## Motion and layout review checkpoint — 6 October 2026

The completion candidate was subsequently pushed at `7ef26760643d10db710ea170356a2c75f2d8f57e`, with a successful Vercel review deployment and draft PR #2. Before adding the motion/layout studio, it was preserved locally on `backup/pre-motion-studio-2026-10-06`; the same source is retained in GitHub under that branch. The earlier local-only completion SHA remains on `backup/completion-local-2026-10-05` with an identical file tree.

The motion upgrade continues `upgrade/porty-complete-checklist` for review; production `main` remains unchanged. Its `layoutSettings` and `none` motion value require the updated backend. Reverting to the preceding frontend keeps optional database settings stored but does not render them. Deploy frontend and backend together when promoting; source rollback does not undo data changes or remove the previously described Trash TTL index.

## Reference-inspired theme review — 6 October 2026

The reviewed motion/layout studio at `229e6e4137d6bf0e850fdd914b60d564f29a6d73` is preserved locally and on GitHub at `backup/pre-reference-themes-2026-10-06`. The next update adds temporary project browsing, focused project stories and original theme artwork on the same review branch. These additions need no schema migration. Original production and all earlier backups remain separate.

## Individual effects correction — 6 October 2026

Before this correction, rejected review commit `d13091e37c43a5b7fbe618e9004f0e755193f84c` was preserved locally and on GitHub at `backup/pre-individual-effects-2026-10-06`. The correction restores the native compositions from `7ef26760643d10db710ea170356a2c75f2d8f57e`, retaining earlier workflow changes and theme-native exploratory controls. It replaces the shared overlays with individually scoped effects.

The schema still accepts old layout settings; the renderer ignores them. No migration or deletion of account content is needed. Review deployment remains on `upgrade/porty-complete-checklist`; original production `main` and Render remain untouched. A source checkpoint is not a database backup.
