# Auction App Handoff

_Updated: 2026-03-14_

## Current state

The auction app at `ai-code/auction/` is functional and deployed on GitHub Pages. PR #9 (modal visibility + sample mode) is merged. PR #10 (coordination files) is merged. PR #11 (P0 fixes) is approved with suggestions and pending merge.

## Done

- Full staff review of the app (JS, CSS, HTML) — findings written to ROADMAP.md
- Fixed: modals always visible due to CSS `display: grid` overriding `hidden` attribute (PR #9)
- Fixed: `saveState` dropping `preserveSeedMode` option (PR #9)
- Fixed: `flushPendingSave` dropping queued save options on `beforeunload` (PR #9)
- Created `ai-code/auction/CHANGELOG.md` and `ai-code/auction/ROADMAP.md` (PR #10)
- Set up `.scratch/` for reviews, task specs, and working notes (PR #10)
- P0 fixes by Codex: CSV formula injection, pointer capture drag, deferred drag renders, spurious save guard (PR #11)
- Staff review of PR #11 — approved with suggestions (`.scratch/PR-REVIEW-11-01.md`)
- Set up `/audit`, `/dispatch`, `/staff-review` commands for multi-agent coordination

## Next

- Merge PR #11 after housekeeping commit
- Dispatch and fix P1 items (winner modal errors, import dedup, inspector clamping, orphaned items, CSV BOM)
- Dispatch and fix P2 items (performance, dead code)

## Decisions

- ROADMAP.md is the single source of truth for auction app backlog
- CHANGELOG.md tracks what shipped and when
- Tasks are written to be self-contained so they can be dispatched to Codex/GPT-5.4
- Claude Code acts as staff+ reviewer; Codex executes the implementation
- PRs are reviewed before merge (no self-merging)
- `HANDOFF.md` is retired — only `CLAUDE-HANDOFF.md` is used for session state
- Codex writes its handoff to `.scratch/CODEX-HANDOFF-{name}.md`

## Gotchas

- The app is vanilla JS with no build system — no npm, no modules, no bundler
- Deployed via GitHub Pages from `main` branch, auto-deploys on push
- `auction-app.js` is ~2930 lines in a single file (module split is in P3 backlog)
- The `AGENTS.md` file says "always commit and push without asking" — but the user has explicitly overridden this: PRs should be reviewed before merge
