# CLAUDE.md

Guidance for Claude Code working on this repository.

## Project Overview

**System Design Practice** ("L6 in a Box" internally) is a mobile-first, problem-based learning tool for system design interviews.

**Thesis:** Most system design materials are info-dumps expecting osmosis. This app applies the Rocking the Coding Interview model — structured problems with feedback loops — to system design.

**Target user:** Experienced engineers (L5+) who know how to code and have built systems. The gap is articulating architectural reasoning under interview pressure and getting enough reps for fluency.

**The Bus Test:** Every *problem* must be solvable in under a minute on a phone with no prep. Atomic, self-contained, immediate feedback. Session length is user's choice — large problem banks (50-100 per chapter) with randomization provide variety without repeats. Spaced repetition is v2; volume is fake spaced repetition for now.

## Development

No build system. Edit files directly and push to `main` for deployment. Fix forward if anything breaks.

**Local preview:** Content loads via `fetch()`, so you need a local server to test (e.g., `python3 -m http.server`). Opening `index.html` directly via `file://` won't load problems.

## Architecture

Single-page app, all HTML/CSS/JS in `index.html`. No external frameworks. Three views managed by CSS classes:

- **Landing** (`#landing`) — Unit/chapter selection
- **Practice** (`#practice`) — Question, options, feedback
- **Results** (`#results`) — Score summary

Build for extensibility. Adding a unit or chapter should be trivial.

## Design System

Uses the nhoj.com design system (see parent `CLAUDE.md`):
- **Font:** JetBrains Mono via Google Fonts
- **Colors:** CSS variables with light/dark mode via `prefers-color-scheme`
- **Style:** GitHub-inspired terminal aesthetic, mobile-first

## Content Structure

**10 units planned:**

1. Estimation ← current focus
2. Data Modeling
3. API Design
4. Storage Selection
5. Caching
6. Messaging & Async
7. Scaling Compute
8. Consistency & Coordination
9. Reliability
10. Classic Designs Decomposed

**Unit 1: Estimation chapters:**

1. Reference Numbers (cheat sheet, not drilled)
2. Time Math
3. Storage Math
4. Bandwidth Math
5. QPS & Load
6. Growth Projections
7. Sanity Checks
8. Compound Scenarios

Problems live in `content/unit-{N}-chapter-{M}.json`:
```json
{
  "unit": 1,
  "unitTitle": "Estimation",
  "chapter": 2,
  "chapterTitle": "Time Math",
  "chapterDescription": "Brief description",
  "problems": [
    {
      "id": "time-001",
      "type": "multiple-choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct": 1,
      "explanation": "Shown after answering"
    }
  ]
}
```

To add a chapter: create the JSON file, add a button with `data-chapter="unit-X-chapter-Y"` to `index.html`.

## Content Guidelines

- **Difficulty:** L5/L6 system design level
- **Volume:** 50-100 problems per chapter for variety
- **Problem types (implemented):** Multiple choice
- **Problem types (planned):** Numeric estimation (order of magnitude), spot-the-flaw, "which would you reach for," rank-by-X
- **Good problems:** Multi-step reasoning, real-world scenarios, genuine tradeoffs
- **Avoid:** Pure arithmetic with no systems context, trivia, ambiguous answers
- **Flag problems** where the correct answer is debatable or math is tricky. Expect John to edit/cull during alpha testing.

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

**Content review:**
- Verify all math in problems — easy to introduce errors
- "Cannot determine from this data" is a valid L6 answer (tests understanding of what info is needed) but use sparingly
- Pure unit conversions (seconds in a day) are too easy for L6 — add systems context or cut them
- Multi-step problems and "gotcha" questions (where the obvious answer is wrong) are good L6 material

**Process:**
- The bus test applies to individual problems, not sessions — 100 problems per chapter is fine because users control session length
- Randomization provides "fake spaced repetition" until real spaced repetition is built
