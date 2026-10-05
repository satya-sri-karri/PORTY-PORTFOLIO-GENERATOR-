# Original version and upgrade review

The user authorized preserving the original version and pushing the tested upgrades on 5 October 2026.

- Original commit: `1a7fd43922411be3660c1c7646f7d5458e5d0c36`.
- GitHub backup branch: `backup/pre-upgrade-2026-10-05`.
- Local backup tag: `porty-pre-upgrade-2026-10-05`.
- Upgrade branch: `upgrade/porty-batches-1-3`.

The original commit had a successful Vercel deployment reported by GitHub. Its deployment record is https://vercel.com/satya-sri-karris-projects/porty/3V66bCU4zPMTv6LJCNd8P27mWsoG . The backup preserves repository source, not hosting environment variables or a database snapshot.

All three local improvement batches are pushed together as one reviewable upgrade commit. The upgrade branch can be compared with the backup without changing the production branch. An automatic preview deployment, if enabled in the connected hosting project, is separate from production promotion.

## Restore the original site if the upgrade is promoted

Keep the backup branch and tag. If the upgrade is merged into the production branch, revert the corresponding merge or squash commit and redeploy that branch with the existing frontend and backend environment settings. Use a normal revert commit rather than force-pushing or deleting history. If unrelated changes were added afterward, review the revert before publishing it.

The exact revert commit will be recorded when production promotion occurs. If the upgrade remains only on its separate review branch, the original production source does not need a revert.

Project-story schema additions are optional and retain existing project IDs. Reverting source does not itself restore or delete portfolio records. Database contents and hosting secrets require their own backups if those are changed later.

## Validation already completed

- Frontend production build passed.
- 18 backend tests, 6 content tests and 21 browser workflow scenarios passed.
- 90 responsive/content cases passed for the five upgraded/new designs.
- All 33 registered themes passed three rendering smoke fixtures each (99 cases).
- The original master checklist was preserved byte-for-byte.

See `docs/LOCAL_REVIEW.md` for local-service setup and the remaining release checks. Real development-database, authentication/email, AI-provider and physical-device checks have not been replaced by browser API fixtures.

## Preview login routing

The Vercel preview may have no `REACT_APP_API_URL` because production-only environment values do not apply to preview builds. The frontend then requests `/api` on its own origin. `frontend/vercel.json` now routes `/api/:path*` to the existing Render API before the React Router fallback, so login POST requests reach Express instead of the static frontend (which returned HTTP 405).

The Render address was confirmed from the original production JavaScript bundle. This connects the preview to the existing backend and account database; it does not upgrade or replace that backend. Saving in the preview can modify the same account records as the original site. Newly added project-story fields still require the upgraded backend before they can persist there.
