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

**Phase 1: Audit index.html** ✓
- Added `// GENERIC` / `// DOMAIN` / `// MIXED` comments to identify the boundary

**Phase 2: Extract generic logic into openquizzer.js** ✓
- Engine ES module with state machine, all 5 question types, event system
- index.html imports engine, renders based on events

**Phase 3: Tests & review** ✓
- 48 tests covering engine (state machine, grading, parsing, session flows)
- Code review caught 2 bugs (allProblems by-reference, div-by-zero) and 4 dead code items

**Phase 4: Template repo** ✓

Create a GitHub template repo that anyone can use to build their own quiz site. System Design Practice remains the canonical source — changes flow from here to the template repo.

*What goes in the OpenQuizzer repo:*
- `openquizzer.js` — engine (copied from this project)
- `openquizzer.test.js` — tests (copied from this project)
- `index.html` — generic UI with placeholder content (adapted from this project's index.html, with System Design branding/content removed)
- `content/sample-chapter.json` — example chapter showing the JSON format for all 5 question types
- `README.md` — what OpenQuizzer is, how to create your own instance, content format docs, question type reference

*What the README covers:*
- Quick start: "Use this template" → edit UNITS → add content JSON → enable GitHub Pages
- Content JSON format for all 5 question types (with examples)
- How the engine works (state machine, events, API)
- Customization: styling, adding question types

*How to create an instance (e.g., cooking, geography):*
1. Click "Use this template" on GitHub → new repo
2. Edit the `UNITS` array in `index.html` with your topics
3. Add content JSON files to `content/`
4. Enable GitHub Pages → live quiz site
5. No build step, no dependencies, no npm

*Sync model:*
- System Design Practice (this project) is the canonical engine source
- When engine changes here, copy `openquizzer.js` + `openquizzer.test.js` to the template repo
- Instances are independent forks — they don't auto-update (acceptable for a single-file engine)

*Steps to execute:*
1. Create `openquizzer` repo on GitHub with template flag enabled
2. Generalize index.html: strip System Design content, use generic placeholder UNITS
3. Create sample-chapter.json with examples of all 5 question types
4. Write README with quick start, content format, and API docs
5. Push, verify "Use this template" works, test a fresh instance deploys to Pages

## Phase 5: Make System Design Practice a proper OpenQuizzer instance

System Design Practice was the original source for the engine extraction, but it isn't yet consuming the template in the standard way. This phase aligns it so the relationship is clean.

**What this means:**
- `index.html` structure should match the OpenQuizzer template (same HTML skeleton, same integration pattern)
- Domain-specific content stays: UNITS array, System Design branding, back-link to nhoj.com
- Engine files (`openquizzer.js`, `openquizzer.test.js`) remain the canonical source — changes here get copied to the template repo, not the other way around
- Any generic UI improvements made here should be ported to the template repo

**What to verify:**
- The generic portions of `index.html` match the template's `index.html` (diff should show only content/branding differences)
- No domain-specific logic has crept into `openquizzer.js`
- New question types added to the engine work in both this project and the template

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
