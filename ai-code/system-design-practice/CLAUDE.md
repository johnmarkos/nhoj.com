# CLAUDE.md

Guidance for Claude Code working on this repository.

## Project Overview

**System Design Practice** is a mobile-first, problem-based learning tool for system design.

**Thesis:** Most system design materials are info-dumps expecting osmosis. This app applies the Grokking the Coding Interview model — structured problems with feedback loops — to system design.

**Target user:** Experienced engineers (L5+) who know how to code and have built systems. The gap is articulating architectural reasoning under interview pressure and getting enough reps for fluency.

**The Bus Test:** Every *problem* must be solvable in under a minute on a phone with no prep. Atomic, self-contained, immediate feedback. Session length is user's choice — large problem banks (50-100 per chapter) with randomization provide variety without repeats. Spaced repetition is v2; volume is fake spaced repetition for now.

## Development

No build system. Edit files directly and push to `main` for deployment. Fix forward if anything breaks.

**Local preview:** Content loads via `fetch()`, so you need a local server to test (e.g., `python3 -m http.server`). Opening `index.html` directly via `file://` won't load problems.

**Tests:** `node --test openquizzer.test.js` — 48 tests covering the engine (state machine, all 5 question types, numeric parsing, session flows). Zero dependencies, uses Node's built-in test runner. Run tests after any engine changes.

## Architecture

This is an **OpenQuizzer instance**. Three generic files come from the OpenQuizzer template repo; one file is instance-specific:

- **`openquizzer.js`** — Quiz engine ES module. Manages state machine (`idle → practicing → answered → complete`), grading, scoring, and shuffle logic. Emits events, never touches the DOM. Tested independently.
- **`index.html`** — All HTML, CSS, and UI logic. Imports the engine and config, renders questions based on engine events, delegates user actions to engine methods. Generic across all instances.
- **`config.js`** — Instance-specific: title, description, back-link, and units/chapters catalog. This is the only file that differs from the template.

**Upgrade path:** Copy `openquizzer.js`, `openquizzer.test.js`, and `index.html` from the OpenQuizzer repo (`/home/nhoj/Documents/learning/web/openquizzer/`). `config.js` and `content/` are untouched.

**OpenQuizzer relationship:** The OpenQuizzer repo is canonical for the engine and generic UI. This project is an instance that consumes those files. When the engine or UI changes in OpenQuizzer, copy the files here.

**Readability is a nonfunctional requirement.** Code should be legible to humans, weaker models, and future maintainers without needing the full project context. Concretely: use section headers to group related code, add doc comments on non-obvious algorithms, choose method names that describe what the code does (not what the caller uses it for), label conditional branches, and avoid single-letter variable names outside tight loops. When in doubt, a short comment is better than making the reader trace through code to understand intent.

Three views managed by CSS classes:

- **Landing** (`#landing`) — Unit/chapter selection
- **Practice** (`#practice`) — Question, options, feedback
- **Results** (`#results`) — Score summary (shown after completing all problems)

**Unit/chapter list is dynamic.** The `units` array in `config.js` defines all units and chapters. To add a new chapter:
1. Create the JSON file in `content/`
2. Set `ready: true` for that chapter in the `units` array in `config.js`

The "Practice All" button appears automatically when a unit has 2+ ready chapters.

## Design System

Uses the nhoj.com design system (see parent `CLAUDE.md`):
- **Font:** JetBrains Mono via Google Fonts
- **Colors:** CSS variables with light/dark mode via `prefers-color-scheme`
- **Style:** GitHub-inspired terminal aesthetic, mobile-first

## Content Structure

**10 units planned:**

1. Estimation (complete — 1,007 problems, 8 chapters)
2. Data Modeling (complete — 800 problems, 8 chapters)
3. API Design
4. Storage Selection
5. Caching
6. Messaging & Async
7. Scaling Compute
8. Consistency & Coordination
9. Reliability
10. Classic Designs Decomposed

**Unit 1: Estimation chapters:**

1. Reference Numbers
2. Time Math
3. Storage Math
4. Bandwidth Math
5. QPS & Load
6. Growth Projections
7. Reasonableness Checks
8. Compound Scenarios

**Unit 2: Data Modeling chapters:**

1. Entity Identification
2. Relationships
3. Keys & Indexes
4. Normalization
5. Denormalization
6. Access Patterns
7. Schema Evolution
8. Modeling Scenarios

Problems live in `content/unit-{N}-chapter-{M}.json`. Five question types are supported:

```json
// Multiple choice (default if type omitted)
{ "id": "ex-001", "type": "multiple-choice", "question": "...", "options": ["A", "B", "C", "D"], "correct": 1, "explanation": "..." }

// Numeric input (supports K/M/B/T suffixes)
{ "id": "ex-002", "type": "numeric-input", "question": "...", "answer": 86400, "unit": "seconds", "tolerance": 0.1, "explanation": "..." }
// tolerance: "order-of-magnitude" (10x), "exact", or decimal (0.1 = 10%)

// Ordering (rank items)
{ "id": "ex-003", "type": "ordering", "question": "Rank smallest to largest:", "items": ["KB", "MB", "GB"], "correctOrder": [0, 1, 2], "explanation": "..." }

// Multi-select (multiple correct answers)
{ "id": "ex-004", "type": "multi-select", "question": "Select all that apply:", "options": ["A", "B", "C", "D"], "correctIndices": [0, 2], "explanation": "..." }

// Two-stage (sequential dependent questions)
{ "id": "ex-005", "type": "two-stage", "stages": [
    { "question": "Part 1...", "options": ["A", "B"], "correct": 0, "explanation": "..." },
    { "question": "Part 2...", "options": ["X", "Y"], "correct": 1, "explanation": "..." }
  ]
}
```

To add a chapter: create the JSON file, set `ready: true` in the `units` array in `config.js`.

## Content Guidelines

- **Difficulty:** L5/L6 system design level
- **Volume:** 50-150 problems per chapter for variety
- **Problem types:** multiple-choice, numeric-input, ordering, multi-select, two-stage (all implemented)
- **Good problems:** Multi-step reasoning, real-world scenarios, genuine tradeoffs
- **Avoid:** Pure arithmetic with no systems context, trivia, ambiguous answers
- **Flag problems** where the correct answer is debatable or math is tricky. Expect John to edit/cull during alpha testing.

## Roadmap & Changelog

Future features are tracked in `ROADMAP.md`. Completed work is recorded in `CHANGELOG.md`.

## Self-Review Loop

After completing each milestone, switch to a **reviewer role** and critique your own work harshly. Look for:

- Problems with ambiguous or incorrect answers
- UX friction on mobile
- Code that's not extensible for future units
- Anything that fails the bus test

Fix issues. Review again. **Iterate until the reviewer finds nothing significant.**

**Escape hatch:** If the same issue recurs or you're uncertain, flag it for human review and move on. Perfect is the enemy of shipped.

## Process

John is alpha testing. Agile: ship minimal, try it, iterate. Don't over-invest in polish before validation.

## Maintaining This File

**This CLAUDE.md is a living document.** At the end of each session or milestone:

1. **Capture insights** — If you learned something reusable (a pattern that worked, a mistake to avoid, a clarification), add it here.
2. **Trim cruft** — Remove anything that's obvious, outdated, or low-value. Keep it lean.
3. **Refine structure** — If a section is getting unwieldy, reorganize.

The goal: a future Claude instance should be productive faster because of what we learned.

## Lessons Learned

Insights captured from development:

**Code review:**
- Use the author/reviewer dialogue pattern — reviewer critiques, author responds, iterate until consensus
- Check for: inline styles (use CSS classes), proper error handling, accessibility (ARIA labels, focus management), race conditions (disable buttons during async ops)
- Review code with scale in mind — what works for 1 chapter may not work for 10 units × 8 chapters
- When adding state fields, audit all functions that read/write state (especially reset functions like `backToMenu()` and `retry()`)

**Content review:**
- Verify all math in problems — easy to introduce errors
- "Cannot determine from this data" is a valid L6 answer (tests understanding of what info is needed) but use sparingly
- Pure unit conversions (seconds in a day) are too easy for L6 — add systems context or cut them
- Multi-step problems and "gotcha" questions (where the obvious answer is wrong) are good L6 material

**Content generation:**
- Generate more problems than needed, expect to cull 10-20%
- Run automated checks for uncertainty markers ("Hmm", "Wait", "Let me") in explanations — these often indicate math errors that need fixing
- "Depends on X" answers are valid L6 content when they test real-world nuance (e.g., "depends on database implementation"), but verify each one

**Process:**
- The bus test applies to individual problems, not sessions — 100 problems per chapter is fine because users control session length
- Randomization provides "fake spaced repetition" until real spaced repetition is built

**Dead code removal:**
- When features evolve (e.g., Reference Numbers from static to interactive), old code paths become orphaned
- Search for unused functions/elements during code review — grep for function names and verify they're called
- Remove dead code promptly; it confuses future readers and accumulates

**Display toggling:**
- Prefer CSS classes (`.hidden-container`) over inline `style.display` manipulation
- More consistent, easier to debug, and keeps styling in CSS where it belongs

**Multi-select quality:**
- All-correct multi-selects ("select all that apply" where all 4 are correct) are valid when testing "know the complete set" (e.g., "which are real PostgreSQL index types?") but should have at least one distractor when testing discriminating judgment
- Single-correct multi-selects should be converted to multiple-choice — "select all that apply" with one answer is confusing UX
- Automated check: flag any multi-select where correctIndices.length == options.length or correctIndices.length == 1

**Uncertainty markers:**
- "Actually" used as rhetorical "in fact" (highlighting counterintuitive points) is fine and pedagogically effective — don't flag these
- "maybe", "probably" as hedging in explanations should be replaced with confident language
- False positive rate is high (~80%) — manual review is needed after automated flagging

**Accessibility basics:**
- `aria-live="polite"` on dynamic content (feedback messages) for screen reader announcements
- `aria-pressed` on toggle buttons (multi-select options)
- Keyboard accessibility for custom interactions (flagged ordering for v2)

**Engine extraction (Phase 2):**
- When splitting MIXED functions (part logic, part DOM), the engine emits events with all data the UI needs — the UI should never need to reach back into the engine for display info
- Store defensive copies of caller-provided arrays (`[...problems]`) — the caller may mutate the original after passing it in
- Watch for dead fields after extraction: if a field is set but never read (no getter, no internal use), delete it. Common during refactors when responsibilities shift between files
- `loadProblems()` shouldn't accept parameters the engine doesn't use — keep the API honest about what the engine cares about vs. what's a UI concern
- Guard against division by zero in numeric grading when `correctValue === 0` — easy to miss since no current content has answer=0, but a future unit easily could
- When the UI checks state via DOM classes (e.g., `item.classList.contains('placed')`), prefer that over querying and looping through sibling elements

**Testing:**
- Node's built-in test runner (`node:test`) is sufficient for a zero-dependency project — no need for Jest/Vitest
- Node 24+ detects ES modules natively; Node 20 needs `--experimental-detect-module`
- Test fixtures as factory functions (`mcProblem('id', correct)`) keep tests concise and make the test data structure obvious
- The `collectEvents` pattern (register listener, return array, assert on array after actions) works well for event-driven APIs
- Test through shuffling by reading `quiz.problem` to get the current problem and using its `.correct` field — don't assume problem order
