# Auction App Changelog

All notable changes to the Silent Auction Manager.

## Unreleased

### Fixed
- Event settings and document settings fields no longer trigger duplicate saves on blur after removing redundant `change` listeners where `input` already handles updates.
- Removed the unused jump-view listener and dead `.print-table` preview styles.
- Auction overview now uses the donor lookup map for orphaned-donor checks, and item import reuses the updated composite key instead of recomputing it.
- Winner validation errors now render inline inside the winner modal instead of behind the overlay.
- Item CSV re-import now matches existing items by title, donor, and category even when lot numbers change.
- Layout inspector position and size inputs now clamp blocks so they cannot extend beyond the page bounds.
- Home overview now warns when items reference donors that no longer exist.
- CSV exports now include a UTF-8 BOM so accented characters open correctly in Excel.
- CSV exports now prefix formula-like cell values with a leading single quote to prevent spreadsheet formula injection.
- Layout-block drags now use pointer capture so releasing the pointer outside the browser window does not leave a block stuck to the cursor.
- Layout dragging now updates block position directly during pointer movement and defers full canvas, inspector, and preview re-renders until drop for smoother motion.
- Clicking a layout block without moving it no longer saves a spurious "Layout updated" state.
- Layout block selection now relies on the drag pointer handlers so a click no longer triggers a duplicate canvas re-render before selection settles.
- Layout blocks now set `touch-action: none` so touch drags do not also pan or scroll the page.

### Changed
- `formatCurrency` now reuses a cached `Intl.NumberFormat` instance instead of constructing a new formatter on every call.

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
