## Done
- Fixed the auction app P0 CSV export and layout-drag issues in `ai-code/auction/auction-app.js`.
- Updated `ai-code/auction/CHANGELOG.md` under `## Unreleased` -> `### Fixed`.
- Created branch `fix/auction-p0-bugs` for the work.

## Next
- Push `fix/auction-p0-bugs` to `origin`.
- Open a PR against `main` with the P0 fix summary.
- Reviewer should manually verify CSV export sanitization and layout drag behavior in the browser.

## Decisions
- Kept the fix scoped to the existing export path and drag handlers instead of refactoring related layout code.
- Updated layout drag to move the active block element directly and sync only the inspector X/Y inputs during drag; full canvas and preview renders now happen on drop.

## Gotchas
- Pointer capture is set on the existing canvas block element, so `startLayoutDrag` now avoids a full canvas re-render before the drag begins.
- There is no automated browser test setup in this repo; verification is limited to syntax checks and code review unless someone manually exercises the page.
