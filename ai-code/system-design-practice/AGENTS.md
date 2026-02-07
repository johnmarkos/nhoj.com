# AGENTS.md

Guidance for agents working on this repository.

## Project Overview

**System Design Practice** is a mobile-first, problem-based learning tool for system design.

**Thesis:** Most system design materials are info-dumps expecting osmosis. This app applies the Grokking the Coding Interview model — structured problems with feedback loops — to system design.

**Target user:** Experienced engineers (L5+) who know how to code and have built systems. The gap is articulating architectural reasoning under interview pressure and getting enough reps for fluency.

**The Bus Test:** Every *problem* must be solvable in under a minute on a phone with no prep. Atomic, self-contained, immediate feedback. Session length is user's choice — large problem banks (50-100 per chapter) with randomization provide variety without repeats. Spaced repetition is v2; volume is fake spaced repetition for now.

## Project Structure

Before making any file changes, confirm which repository and directory the changes belong in. The main repos are:
- **nhoj.com** (`/home/nhoj/Documents/learning/web/nhoj.com/`) — Personal site, including this project at `ai-code/system-design-practice/`
- **openquizzer** (`/home/nhoj/Documents/learning/web/openquizzer/`) — Canonical quiz engine and generic UI

Never cross-pollinate changes between repos without explicit user confirmation.

## Content Generation

When generating large content files (e.g., 100+ problem JSON files), break them into smaller batches (25-30 items at a time) and append to the file incrementally. Never try to generate the entire file in a single output.

## Workflow Rules

For multi-chapter or multi-unit tasks, always process ONE chapter at a time: write, review, fix, commit, then move to the next. Never try to load or process an entire unit at once. See "Content Creation Workflow" below for the full per-chapter loop.

Default autonomy rule: after writing chapter content and running validation tests, continue directly into the content review and fix loop without waiting for an explicit user prompt. If you must pause before review, state clearly that the next required task is the chapter content review step.

## Development

No build system. Edit files directly and push to `main` for deployment. Fix forward if anything breaks.

**Local preview:** Content loads via `fetch()`, so you need a local server to test (e.g., `python3 -m http.server`). Opening `index.html` directly via `file://` won't load problems.

**Tests:**
- `node --test openquizzer.test.js` — Engine tests (state machine, question types, parsing)
- `node --test config.test.js` — Config and content validation (syntax, structure, duplicate IDs)

**Pre-commit hook:** A git hook in `.git/hooks/pre-commit` runs both test suites when SDP files are staged. This catches syntax errors in config.js and invalid content before they reach production.

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

Uses the nhoj.com design system (see parent `AGENTS.md`):
- **Font:** JetBrains Mono via Google Fonts
- **Colors:** CSS variables with light/dark mode via `prefers-color-scheme`
- **Style:** GitHub-inspired terminal aesthetic, mobile-first

## Content Structure

**10 units planned** (see `ROADMAP.md` for current progress):

1. Estimation (complete — 1,007 problems, 8 chapters)
2. Data Modeling (complete — 800 problems, 8 chapters)
3. API Design (complete — 791 problems, 8 chapters)
4. Storage Selection (complete — 800 problems, 8 chapters)
5. Caching (complete — 800 problems, 8 chapters)
6. Messaging & Async (in progress)
7. Scaling Compute
8. Consistency & Coordination
9. Reliability
10. Classic Designs Decomposed

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

**Keep these files up to date.** They are the project's source of truth for what's done and what's next.

- **`ROADMAP.md`** — What's done, what's in progress, what's next. Update after completing each chapter or milestone.
- **`CHANGELOG.md`** — Record of completed work with problem counts and chapter details. Update when finishing a chapter or unit.

## Getting Started (for a fresh agent)

1. Read this `AGENTS.md` for project context and guidelines.
2. Read `ROADMAP.md` to find your next task — look at the "Now (In Progress)" section.
3. If starting a new unit, plan it in detail first (chapter topics, problem distribution, scope). Get user approval before writing content.
4. If resuming a unit in progress, pick up the next unfinished chapter.

## Content Creation Workflow

**CRITICAL: Work one chapter at a time.** Do not attempt to write or review multiple chapters in a single session. Context overflow causes quality degradation — reviewing a whole unit at once leads to missed issues and sloppy fixes.

The loop for each chapter:

1. **Write content** — Create the JSON file with ~100 problems (target: ~35 MC, ~25 two-stage, ~17 multi-select, ~12 numeric, ~11 ordering). ID format: `msg-{abbrev}-{NNN}` (adjust prefix per unit).
2. **Update config** — Set `ready: true` in `config.js` for the new chapter.
3. **Run tests** — `node --test config.test.js` to validate structure.
4. **Review content** — Launch a subagent to do a thorough content review. Be harsh. Check for:
   - Wrong answers (verify correct indices, math, ordering)
   - Near-duplicate problems (same concept, same structure)
   - Processing artifacts ("Wait", "Hmm", "Let me")
   - Too-easy definition questions (should be scenario-based for L5/L6)
   - Multi-select issues (all-correct without distractor, single-correct should be MC)
   - Debatable answers, pure arithmetic, ambiguous orderings
   - Thematic over-saturation (>3 problems on the same narrow concept)
5. **Fix all issues** — Work through the review findings, make edits.
6. **Run tests again** — Verify fixes didn't break anything.
7. **Commit and push** — One commit per chapter.
8. **Move to next chapter** — Repeat from step 1.

Do not stop after step 3 unless the user explicitly asks to pause. The default behavior is to continue through steps 4-7 in the same work session.

When starting a **new unit**, plan it in detail before writing any content:
- Define all 8 chapter topics with scope descriptions
- Identify the key concepts each chapter should cover
- Get user approval on the plan before proceeding

## Content Review

Follow the author/reviewer dialogue pattern. Review one chapter at a time, present findings, wait for user approval before proceeding to the next chapter. Do not batch reviews. Use a subagent to keep the review's full JSON content out of the main context window.

## Pre-Commit Checklist

When building new apps or features, always validate:
1. Correct target directory (ask if unclear)
2. No syntax errors in config files
3. Run tests (`node --test config.test.js`) and verify they pass before committing

## Commit Attribution

Commit messages from coding agents should include a line in this format:

`Co-authored by <model> in <tool>`

If not all attribution details are available, include the best available information (for example, `Co-authored by Cascade in Windsurf` or `Co-authored by Cascade`).

## Process

John is alpha testing. Agile: ship minimal, try it, iterate. Don't over-invest in polish before validation.

## Maintaining This File

**This AGENTS.md is a living document.** At the end of each session or milestone:

1. **Capture insights** — If you learned something reusable (a pattern that worked, a mistake to avoid, a clarification), add it here.
2. **Trim cruft** — Remove anything that's obvious, outdated, or low-value. Keep it lean.
3. **Refine structure** — If a section is getting unwieldy, reorganize.

The goal: a future agent instance should be productive faster because of what we learned.

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
- Near-duplicate detection and thematic over-saturation are the most common review findings — the most effective fix is replacing one problem in the pair with a different angle on the concept, not just rewording
- Definition questions ("What is X?") should be reworked into scenarios ("A team encounters Y. What technique solves this, and why?") for L5/L6 difficulty
- Pure arithmetic problems need systems context — instead of "5000 × 2 = ?", ask about the business cost or capacity implication of the number

**Content review process:**
- Review ONE chapter at a time, not a whole unit — context overflow degrades review quality
- Use a subagent for reviews to protect the main context window from the full JSON content
- The review checklist (wrong answers, near-duplicates, definitions, multi-select issues, etc.) is in the Content Creation Workflow section above
- Typical chapter review finds 15-25 issues; expect to make 15-30 edits per chapter

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

**Config separation:**
- Instance-specific content (title, description, units, back-link) belongs in `config.js`, not `index.html`
- `index.html` should be byte-identical across all instances — never edit it for instance customization
- When upgrading from OpenQuizzer, copy three files (`openquizzer.js`, `openquizzer.test.js`, `index.html`) and verify tests pass
