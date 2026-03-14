# Auction App Handoff

## Current state

The auction app at `ai-code/auction/` is functional and deployed on GitHub Pages. The critical modal-visibility bug (PR #9) is fixed. A full staff review has been completed and findings are tracked in `ai-code/auction/ROADMAP.md`.

## Done

- Full staff review of the app (JS, CSS, HTML) — findings written to ROADMAP.md
- Fixed: modals always visible due to CSS `display: grid` overriding `hidden` attribute (PR #9)
- Fixed: `saveState` dropping `preserveSeedMode` option (PR #9)
- Fixed: `flushPendingSave` dropping queued save options on `beforeunload` (PR #9)
- Created `ai-code/auction/CHANGELOG.md`
- Rewrote `ai-code/auction/ROADMAP.md` with prioritized, dispatchable tasks from the review

## Next

- Fix P0 items from ROADMAP.md (CSV injection, drag bugs, spurious saves)
- Fix P1 items (winner modal errors, import dedup, inspector clamping, orphaned items, CSV BOM)
- Fix P2 items (performance, dead code)
- All work should be PRs reviewed before merge

## Decisions

- ROADMAP.md is the single source of truth for auction app backlog
- CHANGELOG.md tracks what shipped and when
- Tasks are written to be self-contained so they can be dispatched to Codex/GPT-5.4
- Claude Code acts as staff+ reviewer; Codex executes the implementation
- PRs are reviewed before merge (no self-merging)

## Gotchas

- The app is vanilla JS with no build system — no npm, no modules, no bundler
- Deployed via GitHub Pages from `main` branch, auto-deploys on push
- `auction-app.js` is ~2930 lines in a single file (module split is in P3 backlog)
- The `AGENTS.md` file says "always commit and push without asking" — but the user has explicitly overridden this: PRs should be reviewed before merge
- Old `HANDOFF.md` in the repo root is stale (from Codex sessions) — this file supersedes it
