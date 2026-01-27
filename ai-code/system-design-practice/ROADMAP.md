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

## In Progress: Unit 2 Data Modeling

**Completed:**
1. Entity Identification (100 problems) ✓

**Remaining chapters:**
2. Relationships — 1:1, 1:N, M:N, how to represent each
3. Keys & Indexes — primary/foreign/composite keys, when to index
4. Normalization — 1NF, 2NF, 3NF in plain English
5. Denormalization — when to break rules, read vs write tradeoffs
6. Access Patterns — design for queries, not how data "looks"
7. Schema Evolution — migrations, backward compatibility
8. Modeling Scenarios — compound problems (booking system, social feed, etc.)

**Question types to use:** MC (bulk), multi-select, numeric, ordering, two-stage
**Target:** 50-100 problems per chapter

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
