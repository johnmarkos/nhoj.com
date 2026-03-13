# Auction App Roadmap

Backlog for the standalone auction manager in `ai-code/auction/`.

This file is for work we believe is correct and worth doing, but that we are not shipping in the current PR.

## Near-Term

- [ ] Add an explicit "clear this field" path to CSV upsert imports.
  Right now blank CSV cells preserve existing values on matching donors/items. That is safer by default, but it means imports cannot intentionally clear a bad address, note, or other text field. Good options:
  - support a sentinel like `--clear--`
  - add an import toggle for "blank cells clear existing values"
  - document the behavior more prominently if we keep the current default

- [ ] Split `auction-app.js` into smaller modules.
  The app is working well, but the single JS file is large enough that future feature work will get slower and riskier. A pragmatic split would be:
  - `state.js` for normalization, persistence, IDs, and import/export helpers
  - `documents.js` for preview, print, and layout rendering
  - `ui.js` for event wiring and view rendering

- [ ] Improve migration for older customized item-list layouts.
  We now auto-migrate untouched default footers to make room for page numbers, but customized saved layouts are intentionally left alone. Add a better migration or a one-time UI notice if a saved layout still needs manual repositioning.

## Product Enhancements

- [ ] Make the HTML archive a fuller offline handoff package.
  The current archive is a readable snapshot with embedded JSON plus copy/download helpers. A stronger version would let someone open the archive and continue working immediately without a separate restore step.

- [ ] Add table-column customization to the layout system.
  The layout editor supports field/text/image/table block placement, but table internals are still fixed in code. Useful next steps:
  - show/hide columns in the item list
  - reorder columns
  - tune column labels and widths
  - optionally choose alternate price-list variants for different events

- [ ] Add print-friendly headers/footers beyond static blocks.
  Examples:
  - repeating page header/footer controls for long item lists
  - optional organization/contact footer on thank-you letters
  - print date/time metadata for archival runs

## Operational Polish

- [ ] Add a lightweight browser regression checklist for release readiness.
  This does not need a full test harness. A short manual checklist would help future revisions:
  - multi-page item list print preview
  - layout inspector typing/dragging
  - CSV re-import/update behavior
  - backup/restore round-trip
  - winner edit + paid/unpaid flow

- [ ] Consider a clearer import report after CSV processing.
  We already report added/updated/skipped rows. If imports get more complex, a richer summary could list which rows conflicted, which donors were auto-created, and which lots were skipped.
