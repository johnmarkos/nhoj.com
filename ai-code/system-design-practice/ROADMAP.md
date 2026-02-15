# System Design Practice Roadmap

## Done

- [x] **Unit 1: Estimation** — 8 chapters, 1,007 problems
- [x] **Unit 2: Data Modeling** — 8 chapters, 800 problems
- [x] **Unit 3: API Design** — 8 chapters, 791 problems
- [x] **Unit 4: Storage Selection** — 8 chapters, 800 problems
- [x] **Unit 5: Caching** — 8 chapters, 800 problems
- [x] **Unit 6: Messaging & Async** — 8 chapters, 770 problems
- [x] **Unit 7: Scaling Compute** — 8 chapters, 800 problems
- [x] **Unit 8: Consistency & Coordination** — 8 chapters, 800 problems
- [x] **Unit 9: Reliability** — 8 chapters, 800 problems
- [x] **Unit 10: Classic Designs Decomposed** — 8 chapters, 800 problems
- [x] **Unit 11: Security, Privacy & Abuse Resistance** — 8 chapters, 800 problems
- [x] **Unit 12: Interview Execution & Design Communication** — 9 chapters, 876 problems (includes curated staff-level hard set chapter)

## Now (Feedback & Progress — via OpenQuizzer upgrades)

Features below come from the OpenQuizzer engine roadmap. This instance gets them by copying the updated engine/UI files. Instance-specific work (content tagging) is called out separately.

### OpenQuizzer v2.7: Single-Session Feedback

- [x] **Upgrade engine/UI** — Copy openquizzer.js + index.html from upstream after v2.7 ships
- [ ] **Add tags to content** — Tag each problem with 1-2 skill dimensions (e.g., `["estimation", "caching"]`, `["consistency", "replication"]`). This is the big content effort. Can be done incrementally — untagged problems degrade gracefully.
  - Tagging taxonomy: align with the 12 unit titles plus cross-cutting skills (e.g., "back-of-envelope", "trade-off analysis", "failure modes")
  - Progress: curated staff-level hard set chapter is tagged (`tags`) and difficulty-labeled (`difficulty`) across 76 problems.

### OpenQuizzer v2.8: Session History & Aggregate Dashboard

- [x] **Upgrade engine/UI** — Copied openquizzer.js, openquizzer.test.js, index.html from upstream v2.8. Updated bootstrap test for new DOM elements and globals.
- [x] No instance-specific work needed — session history with localStorage auto-save, paste-back import/export, and aggregate dashboard (per-unit/tag accuracy) work with existing content out of the box.

### OpenQuizzer v2.8.1: Expandable Mini-Lessons

- [x] **Upgrade engine/UI** — Copied openquizzer.js, openquizzer.test.js, index.html from upstream v2.8.1. Engine now passes optional `detailedExplanation` through all result events; UI shows a "Learn more" toggle when present.
- [x] **Bulk-generate detailed explanations** — Added `detailedExplanation` across all content files (all ready units/chapters, 9,844 total problems). Two-stage stage-level detailed explanations are also complete.

### OpenQuizzer v2.8.2: References (Further Reading Links)

- [x] **Upgrade engine/UI** — Copied openquizzer.js, openquizzer.test.js, index.html from upstream v2.8.2. Engine passes optional `references` (array of `{ title, url }`) through all result events; UI renders as a compact link list inside the "Learn more" toggle. Either `references` or `detailedExplanation` triggers the toggle independently.
- [x] **Bulk-add references** — Added `references` across all content files (all ready units/chapters, 9,844 total problems), with chapter/domain-appropriate canonical sources.

### OpenQuizzer v2.9: Per-Problem Tracking & Spaced Repetition

- [ ] **Upgrade engine/UI** — Copy from upstream after v2.9 ships
- [ ] No instance-specific work expected — per-problem tracking, Elo proficiency scores, and spaced repetition work with existing content.

### OpenQuizzer v3.0: File Import/Export

- [ ] **Upgrade engine/UI** — Copy from upstream after v3.0 ships

## Later (Instance-Specific Features)

Features that go beyond what OpenQuizzer provides generically.

- [ ] **Skill grid** — Visual display of Elo scores across all 12 dimensions (estimation, data modeling, API design, etc.). The underlying Elo computation comes from OpenQuizzer v2.9; this item is about an instance-specific visualization tailored to the system design domain (e.g., a radar chart or heatmap). Depends on per-problem tags (v2.7) and per-problem tracking (v2.9).
- [ ] **Interview simulation mode** — Timed 45-minute sessions, random mix across all units. Depends on OpenQuizzer timed mode (v3.0).

## Later (Curriculum Expansion)

- [x] **Unit 11: Security, Privacy & Abuse Resistance** — Completed (8 chapters, 800 problems) with chapter-level review/fix loops and canonical references.
- [x] **Unit 12: Interview Execution & Design Communication** — Completed (9 chapters, 876 problems) with chapter-level review/fix loops and canonical references.

## Content Quality

- [ ] **Problem review pass** — Manual review of flagged problems (ambiguous, math errors)
- [ ] **Difficulty calibration** — Tag problems as senior/staff/principal, filter by level
- [x] **Explanation-template rewrite (Units 9/10)** — Rewrote repeated explanation text with scenario-specific, chapter-aware explanations. Uniqueness moved from ~27/1000 to 993/1000 (Unit 9) and 996/1000 (Unit 10).
- [x] **Curated staff-level hard set** — Added a mixed hard-set chapter (76 problems) focused on ambiguity handling, trade-off defense, and failure narratives (`content/unit-12-chapter-9.json`).
- [x] **Expandable mini-lessons** — `detailedExplanation` complete for all ready units and chapters (9,844 problems).
- [x] **Further reading links** — `references` complete for all ready units and chapters (9,844 problems).

## Maybe

- [ ] **Community contributions** — Accept PRs for new problems with quality guidelines
- [ ] **Alternative tracks** — Frontend system design, ML system design, data engineering

## Won't Do

- Video explanations — text is faster and more bus-friendly
- Discussion forums — use GitHub issues
- Certification or badges — not the point
