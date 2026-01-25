# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

System Design Practice is a mobile-first quiz app for practicing system design estimation problems. Target audience: L6+ engineers preparing for system design discussions. Part of the nhoj.com static site.

## Development

No build system. Edit files directly and push to `main` for deployment.

**Local preview:** Open `index.html` in a browser. Content loads from `content/*.json` via fetch, so you'll need a local server (e.g., `python3 -m http.server`) to test content loading.

## Architecture

Single-page app with three views managed by CSS classes:
- **Landing** (`#landing`) - Unit/chapter selection
- **Practice** (`#practice`) - Question, options, feedback
- **Results** (`#results`) - Score summary

All HTML, CSS, and JS are in `index.html`. No external frameworks.

## Content Structure

Problems live in `content/unit-{N}-chapter-{M}.json`:

```json
{
  "unit": 1,
  "unitTitle": "Estimation",
  "chapter": 2,
  "chapterTitle": "Time Math",
  "chapterDescription": "Brief description shown during practice",
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

To add a chapter: create the JSON file, then add a button with `data-chapter="unit-X-chapter-Y"` to `index.html`.

## Content Guidelines

- **Target difficulty:** L6 system design (staff engineer level)
- **Problem types:** QPS calculations, SLA math, capacity planning, sanity checks
- **Avoid:** Pure arithmetic with no systems context
- **Good problems:** Multi-step reasoning, gotcha questions, real-world scenarios
- **Each problem must pass the "bus test":** Solvable in under a minute on a phone with no prep
