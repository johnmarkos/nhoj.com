# Auction App Changelog

All notable changes to the Silent Auction Manager.

## Unreleased

Nothing yet.

## 2026-03-14

### Fixed
- **Modal visibility bug** — `.modal` CSS set `display: grid` unconditionally, overriding the HTML `hidden` attribute. Both modals (CSV import, winner) were always visible from page load. Added `.modal[hidden] { display: none }`. (PR #9)
- **Sample mode immediately lost** — `saveState()` silently dropped its `options` parameter, so `preserveSeedMode: true` never reached `persistState()`. Loading sample data reverted `seedMode` to `'user'` on the next debounced save. (PR #9)
- **beforeunload flush dropped queued options** — `flushPendingSave` now replays the pending save's original message and options instead of replacing them with `{ skipRender: true }`. Fixes the edge case where loading sample data and immediately closing the tab lost sample mode. (PR #9)

### Added
- Sample-first onboarding — first visit auto-loads sample auction data (3 donors, 3 items, 1 winner) so every section is explorable immediately. (PRs #4–#8)
- CSV modal example rows — import modal shows example donor/item rows before a file is chosen. (PR #5)
- Legacy redirect — `ai-code/auction.html` redirects to `ai-code/auction/`. (PR #6)
- Dashboard home — Home opens as Auction Dashboard, not a splash page. (PR #8)

### Changed
- Replaced "Start Here" hero with a standard action card. (PR #8)
- Removed separate first-run guide and Data tab sample guide cards. (PR #8)

## 2026-03-13

### Added
- Initial rewrite as folder-based app (`ai-code/auction/`). (PR #3)
- Layout editor with draggable blocks, inspector, and custom text blocks.
- Donor and item management with search, sort, and inline editing.
- Checkout with winner recording, paid status, and payment tracking.
- Document system: bid sheets, item price lists, thank-you letters.
- CSV import with preview, column mapping, and upsert deduplication.
- CSV and JSON export, HTML archive with embedded data snapshot.
- Printable documents with configurable layouts.
