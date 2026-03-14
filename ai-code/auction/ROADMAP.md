# Auction App Roadmap

Backlog for the Silent Auction Manager at `ai-code/auction/`.

Items are grouped by priority. Each task is meant to be a single PR.

## P0 — Bugs and security (fix now)

### CSV formula injection in exports
`generateCsv` does not sanitize values starting with `=`, `+`, `-`, `@`. A donor name like `=CMD("calc")` passes through to the exported CSV and can execute when opened in Excel or Google Sheets.

**Fix:** In `generateCsv`, prefix any cell value whose first character is `=`, `+`, `-`, or `@` with a leading single-quote (`'`). This is the standard mitigation.

**Files:** `auction-app.js` — `generateCsv` function (~line 1825).

### Layout drag gets stuck when pointer leaves window
`startLayoutDrag` does not call `setPointerCapture`. If the user drags a block and releases outside the browser, `pointerup` never fires and the block stays attached to the cursor.

**Fix:** Call `element.setPointerCapture(event.pointerId)` in `startLayoutDrag`. Release it in `stopLayoutDrag`. This also eliminates the need for the separate `click` handler for selection since `pointerdown`/`pointerup` without movement can handle it.

**Files:** `auction-app.js` — `startLayoutDrag`, `stopLayoutDrag`, `handleLayoutDrag` (~lines 2223–2267).

### Drag re-renders entire canvas + preview on every pointermove
`handleLayoutDrag` calls `renderLayoutCanvas()`, `renderInspector()`, and `renderDocumentPreview()` on every pixel of movement. The preview render builds document contexts and donor lookups — expensive with 50+ items.

**Fix:** During drag, only update the dragged block's `style.left`/`style.top` directly. Defer full re-renders to `stopLayoutDrag`. Alternatively, throttle `handleLayoutDrag` to ~60fps and skip the preview render entirely during drag.

**Files:** `auction-app.js` — `handleLayoutDrag` (~line 2244).

### Canvas click triggers spurious save
Every block selection (click without drag) fires `stopLayoutDrag` which calls `saveState('Layout updated')` even when nothing moved.

**Fix:** In `stopLayoutDrag`, compare the block's current `x`/`y` to its position at `pointerdown`. Only call `saveState` if the position actually changed.

**Files:** `auction-app.js` — `stopLayoutDrag` (~line 2260).

## P1 — UX issues (should fix soon)

### Winner validation errors hidden behind modal
`saveWinner` shows errors via `showBanner()` in the main workspace, but the winner modal overlay covers the banner. The user never sees the error.

**Fix:** Show validation errors inline inside the winner modal (e.g., a `<div>` above the form fields) instead of using the workspace banner.

**Files:** `auction-app.js` — `saveWinner` (~line 1697). `index.html` — `winnerModal` div (~line 557).

### Item import composite key is broken
`itemImportKey` includes `normalizeComparable(item.donorId)`, which is a UUID. Imported items get new UUIDs, so the title+donor+category key never matches existing items. Dedup falls back to lot-number-only matching.

**Fix:** Resolve `donorId` to the donor's name (or name+business) before building the key. Pass a donor lookup map into `itemImportKey`.

**Files:** `auction-app.js` — `itemImportKey` (~line 1949), callers in `applyCsvImport`.

### Inspector doesn't clamp block position to stay on-page
Drag clamps `x` to `100 - block.w`, but typing X=95, W=20 in the inspector lets the block extend to 115% off the right edge.

**Fix:** In `updateSelectedBlockSetting`, clamp `x` to `max(0, min(value, 100 - block.w))` and same for `y`/`h`. Or clamp `w` to `100 - block.x`.

**Files:** `auction-app.js` — `updateSelectedBlockSetting` (~line 2269).

### Orphaned items silently disappear from thank-you letters
If a donor is deleted but their items remain, those items are grouped under a `donorId` key that matches no donor. They are silently skipped in thank-you letter generation with no warning.

**Fix:** When a donor is deleted, either clear `donorId` on their items (with a confirmation) or add an issue card in the overview ("N item(s) reference a deleted donor").

**Files:** `auction-app.js` — donor deletion handler, `renderOverview` issues section.

### No UTF-8 BOM in CSV export
Excel on Windows may misread accented characters (donor names, addresses) without a BOM.

**Fix:** Prepend `\uFEFF` to the CSV string in `generateCsv` before creating the Blob.

**Files:** `auction-app.js` — `generateCsv` (~line 1830).

## P2 — Performance and code quality

### `formatCurrency` creates new `Intl.NumberFormat` every call
Called hundreds of times per render. Should be cached in a module-level constant like `DATE_FORMAT`.

**Files:** `auction-app.js` — `formatCurrency` (~line 477).

### `donorLookup()` rebuilt 5–10 times per render cycle
Each render function independently calls `donorLookup()`. Should build once in `renderAll` and pass through.

**Files:** `auction-app.js` — `renderAll` and all render functions.

### Double save/render on settings inputs
Both `input` and `change` listeners call the same handler for event settings and document settings. The `change` fires on blur after `input` already handled it, causing redundant renders.

**Fix:** Use only `input` for text/number fields. Use only `change` for `<select>` and date inputs.

**Files:** `auction-app.js` — event listener setup (~lines 2761–2764, 2822–2826).

### Dead code cleanup
- `[data-jump-view]` event listener targets non-existent elements (~line 2732).
- `.print-table` CSS class is defined but never generated by JS.
- Remove these to reduce confusion.

## P3 — Product enhancements (backlog)

- [ ] Multi-page document preview (currently only page 1 is shown).
- [ ] Add state schema version field for cleaner future migrations.
- [ ] Split `auction-app.js` into modules (`state.js`, `documents.js`, `ui.js`).
- [ ] Add explicit "clear this field" path for CSV upsert imports.
- [ ] Make the HTML archive a fuller offline handoff package.
- [ ] Add table-column customization to the layout system.
- [ ] Add print-friendly repeating headers/footers.
- [ ] Keyboard/screen-reader interaction for layout canvas.
- [ ] Undo/redo for destructive operations.
- [ ] Browser regression checklist for release readiness.
