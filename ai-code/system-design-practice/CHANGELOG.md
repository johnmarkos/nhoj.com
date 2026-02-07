# Changelog

## Unit 5 quality fixes (2026-02-07)

- Applied review fixes across `content/unit-5-chapter-1.json` through `content/unit-5-chapter-8.json`.
- Corrected several ambiguous or inconsistent prompts/explanations (including TTL freshness framing, invalidation race handling, and LFU aging examples).
- Converted a few misfit numeric problems to multiple-choice where the intent was conceptual, not arithmetic.
- Removed/adjusted low-quality all-correct multi-select items by adding proper distractors and tightening answer keys.

## Agent instruction migration (2026-02-07)

- Added `AGENTS.md` as the canonical instruction file by porting existing `CLAUDE.md` guidance.
- Generalized Claude-specific wording to agent-neutral language while preserving project conventions and workflows.
- Replaced `CLAUDE.md` contents with a compatibility pointer directing Claude-based agents to `AGENTS.md`.

## Unit 6: Messaging & Async (770 problems)

1. Queue Fundamentals (100 problems) — Producers/consumers, sync vs async, point-to-point, message lifecycle, visibility timeouts, backpressure, DLQs, FIFO ordering
2. Pub/Sub & Topics (100 problems) — Fan-out/fan-in, durable/ephemeral subscriptions, push vs pull, filtering, topic granularity, consumer groups, schema evolution
3. Delivery Guarantees (95 problems) — At-most/at-least/exactly-once, idempotency keys, deduplication, transactional outbox, CDC, sagas, compensating transactions
4. Patterns & Reliability (95 problems) — DLQs, retry strategies, exponential backoff with jitter, backpressure, priority queues, poison messages, circuit breakers, claim check pattern, competing consumers, graceful shutdown
5. Event-Driven Architecture (95 problems) — Event sourcing, CQRS, choreography vs orchestration, sagas, domain events, schema evolution, projection rebuilds, temporal queries, aggregate boundaries, migration strategies
6. Stream Processing (95 problems) — Partitions and consumer groups, offset management, event-time vs processing-time windows, watermarks/late data, state stores, joins, checkpointing, compaction, and recovery trade-offs
7. Technology Selection (95 problems) — Requirement-driven broker selection across Kafka, RabbitMQ, SQS, Pub/Sub, and Redis Streams; delivery guarantees, ordering, replay, cost/ops trade-offs, lock-in, and hybrid architectures
8. Messaging Scenarios (95 problems) — Integrated scenario-based practice across outbox/sagas, ordering keys, retries/DLQs, replay safety, observability, and broker trade-off decisions

- Chapter 6 review/fix pass completed: corrected multi-select distractor quality, fixed Kafka consumer timeout semantics (`max.poll.interval.ms`), and resolved wording/consistency issues in stream scaling and compaction explanations.
- Chapter 7 completed and validated with config/content tests: added 95 new problems and marked the chapter as ready in `config.js`.
- Chapter 8 completed and validated with config/content tests: added 95 mixed-type scenario problems and marked the chapter as ready in `config.js`.
- Chapter 8 review/fix pass completed: corrected strong answer-position bias by rebalancing option order and answer indices across multiple-choice, two-stage, and multi-select items.

## Unit 5: Caching (800 problems)

1. Cache Fundamentals (100 problems)
2. Cache Placement (100 problems)
3. Caching Strategies (100 problems)
4. TTLs & Expiration (100 problems)
5. Cache Invalidation (100 problems)
6. Eviction Policies (100 problems)
7. Distributed Caching (100 problems)
8. Caching Scenarios (100 problems)

## Unit 4: Storage Selection (800 problems)

1. Relational Databases (100 problems)
2. Document Stores (100 problems)
3. Key-Value Stores (100 problems)
4. Wide-Column & Time-Series (100 problems)
5. Graph & Search Engines (100 problems)
6. Object Storage (100 problems)
7. Hybrid Architectures (100 problems)
8. Storage Selection Scenarios (100 problems)

## Unit 3: API Design (791 problems)

1. REST Fundamentals (94 problems)
2. API Modeling (100 problems)
3. Pagination & Filtering (100 problems)
4. Rate Limiting & Quotas (100 problems)
5. Versioning & Evolution (100 problems)
6. Error Handling (97 problems)
7. GraphQL & Alternatives (100 problems)
8. API Design Scenarios (100 problems)

## Problem ID display

- Synced index.html from OpenQuizzer v2.1 with configurable problem ID feature
- Enabled `showProblemId: true` in config — each question now shows its ID (e.g. ref-001, qps-042) for easy reference when reporting issues

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
