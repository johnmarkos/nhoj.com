# Changelog

## Phase 5: OpenQuizzer instance

- Extracted instance-specific content into `config.js` (title, description, back-link, units)
- `index.html` is now byte-identical to OpenQuizzer template
- Upgrade path: copy `openquizzer.js`, `openquizzer.test.js`, `index.html` from OpenQuizzer
- OpenQuizzer repo is now canonical for engine + UI; this project is an instance

## Phase 4: Template repo

- Created OpenQuizzer template repo on GitHub
- Generalized index.html into a reusable template
- Sample content demonstrating all 5 question types
- README with quick start, content format, API docs

## Phase 3: Tests & review

- 48 tests covering engine (state machine, grading, parsing, session flows)
- Code review caught 2 bugs (allProblems by-reference, div-by-zero) and 4 dead code items

## Phase 2: Engine extraction

- Extracted quiz engine into `openquizzer.js` ES module
- State machine, all 5 question types, event system
- `index.html` imports engine, renders based on events

## Phase 1: Audit

- Added `// GENERIC` / `// DOMAIN` / `// MIXED` comments to identify the engine/UI boundary

## Unit 2: Data Modeling (800 problems)

1. Entity Identification (100 problems)
2. Relationships (100 problems)
3. Keys & Indexes (100 problems)
4. Normalization (100 problems)
5. Denormalization (100 problems)
6. Access Patterns (100 problems)
7. Schema Evolution (100 problems)
8. Modeling Scenarios (100 problems)

## Unit 1: Estimation (1,007 problems)

1. Reference Numbers
2. Time Math
3. Storage Math
4. Bandwidth Math
5. QPS & Load
6. Growth Projections
7. Reasonableness Checks
8. Compound Scenarios
