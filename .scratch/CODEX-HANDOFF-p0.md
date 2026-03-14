## Completed
- Fixed CSV formula injection in `generateCsv` by prefixing export-only cells that start with `=`, `+`, `-`, or `@`.
- Fixed layout drag pointer handling so blocks do not stay stuck when the pointer is released outside the browser window.
- Stopped layout drag from re-rendering the entire canvas, inspector, and preview on every `pointermove`; the dragged block now repositions directly and full re-renders happen on drop.
- Prevented click-without-drag from saving a spurious `Layout updated` state.
- Added matching changelog notes under `ai-code/auction/CHANGELOG.md`.

## Decisions
- Left the existing click-based layout selection flow in place to keep the patch narrow; the P0 fixes only change the drag lifecycle.
- Synced the inspector's `x` and `y` inputs directly during drag so the inspector still reflects movement without triggering full renders.

## Tricky
- Pointer capture has to stay attached to the original dragged element, so the drag start path cannot immediately rebuild the canvas DOM.
- The preview render is intentionally deferred until drop so large auctions avoid repeated expensive preview work during drag.

## Gotchas For Reviewer
- Manual browser verification is still important for the drag behavior because there is no automated interaction test harness here.
- A simple click on a block will still re-render selection UI, but it should no longer trigger `saveState('Layout updated')`.
