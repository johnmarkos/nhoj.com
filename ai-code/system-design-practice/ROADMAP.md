# Roadmap

Future features and improvements for System Design Practice.

## v2: Accessibility & Polish

**Keyboard accessibility for ordering questions**
- Current: tap-to-order only (touch/mouse)
- Needed: keyboard navigation (arrow keys to select, Enter to place, Escape to deselect)
- Consider: drag-and-drop as alternative interaction pattern
- Priority: Medium (accessibility compliance)

**Spaced repetition**
- Track user performance per problem
- Surface weak areas more frequently
- Persist progress in localStorage or backend
- Priority: High (mentioned in project thesis)

## Completed: Unit 2 Data Modeling (800 problems)

1. Entity Identification (100 problems) ✓
2. Relationships (100 problems) ✓
3. Keys & Indexes (100 problems) ✓
4. Normalization (100 problems) ✓
5. Denormalization (100 problems) ✓
6. Access Patterns (100 problems) ✓
7. Schema Evolution (100 problems) ✓
8. Modeling Scenarios (100 problems) ✓

## OpenQuizzer Extraction

Extract the quiz engine from System Design Practice into a reusable library called **OpenQuizzer**. Goal is clean separation, not a framework.

**Phase 1: Audit index.html**
- Add comments marking code as `// GENERIC` (reusable quiz logic) or `// DOMAIN` (system design specific)
- Don't move anything yet — just identify the boundary

**Phase 2: Extract generic logic into openquizzer.js**
- State machine: idle → practicing → answered → complete
- Handle all question types: MC, numeric, ranking, multi-select, two-stage
- Score and track progress
- Take content JSON as input
- Emit events, not touch DOM

**Phase 3: Refactor UI as a theme**
- UI code listens to engine events
- Keep current nhoj.com styling as default theme

**Phase 4: Separate repo** (later)
- Move OpenQuizzer to its own repo/package

## Future: Content Expansion

**Units 3-10** (see CLAUDE.md for full list)

## v2: UX Improvements

**Progress persistence**
- Resume interrupted sessions
- Track completion per chapter

**Review mode**
- Review missed questions at end of session
- Bookmark problems for later

## Deferred / Low Priority

**Reference Numbers as static cheat sheet**
- Originally Chapter 1 was a non-interactive reference table
- Converted to interactive problems in current version
- Could add a "View Reference" toggle if users want quick lookup
- Code was removed in code review; would need to rebuild if wanted

---

*This file is referenced from CLAUDE.md. Update when flagging features for future work.*
