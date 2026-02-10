# Changelog

## Unit 10: Classic Designs Decomposed (in progress)

- Chapter 7 completed and validated with config/content tests: added 100 mixed-type problems (`cd-nc-001` to `cd-nc-100`) and marked the chapter as ready in `config.js`.
- Chapter 7 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 6 completed and validated with config/content tests: added 100 mixed-type problems (`cd-cp-001` to `cd-cp-100`) and marked the chapter as ready in `config.js`.
- Chapter 6 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 5 completed and validated with config/content tests: added 100 mixed-type problems (`cd-cc-001` to `cd-cc-100`) and marked the chapter as ready in `config.js`.
- Chapter 5 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 4 completed and validated with config/content tests: added 100 mixed-type problems (`cd-ua-001` to `cd-ua-100`) and marked the chapter as ready in `config.js`.
- Chapter 4 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 3 completed and validated with config/content tests: added 100 mixed-type problems (`cd-us-001` to `cd-us-100`) and marked the chapter as ready in `config.js`.
- Chapter 3 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 2 completed and validated with config/content tests: added 100 mixed-type problems (`cd-tr-001` to `cd-tr-100`) and marked the chapter as ready in `config.js`.
- Chapter 2 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

- Chapter 1 completed and validated with config/content tests: added 100 mixed-type problems (`cd-tw-001` to `cd-tw-100`) and marked the chapter as ready in `config.js`.
- Chapter 1 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger classic-design trade-off reasoning.

1. Twitter/X Timeline Write & Fanout (100 problems)
2. Twitter/X Timeline Ranking, Serving & Reliability (100 problems)
3. URL Shortener Core Architecture (100 problems)
4. URL Shortener Scale, Analytics & Operations (100 problems)
5. Chat Core Messaging Architecture (100 problems)
6. Chat Presence, Sync & Reliability (100 problems)
7. Notification System Core Architecture (100 problems)
8. Notification System Scale & Scenarios (100 problems)

## Unit 9: Reliability (complete — 800 problems)

1. Failure Modes & Fault Domains (100 problems) — Fail-stop vs partial-failure diagnosis, correlated-failure containment, fault-domain blast-radius mapping, dependency failure taxonomy, and fault-domain-aware mitigation selection
2. Timeouts, Retries & Backoff Control (100 problems) — Timeout budgeting, capped retries, exponential backoff with jitter, retry amplification controls, and idempotency-safe retry policy design
3. Circuit Breakers, Load Shedding & Admission Control (100 problems) — Circuit state tuning, priority-aware shedding, per-boundary concurrency limits, and brownout controls to prevent overload cascades
4. Redundancy, Replication & Failover Strategy (100 problems) — N+1 capacity planning, multi-AZ/region redundancy, failover/failback gating, and freshness/quorum-aware promotion safety
5. Graceful Degradation & Dependency Isolation (100 problems) — Critical-path isolation, fallback quality tiers, kill switches, bulkhead boundaries, and degraded-mode behavior contracts
6. Data Safety, Durability & Recovery (100 problems) — RPO/RTO policy design, backup and snapshot safety, point-in-time recovery planning, restore drills, and integrity verification
7. Reliability Engineering Operations (100 problems) — SLI/SLO design, error-budget policy, alert quality, incident command patterns, and postmortem action closure discipline
8. Reliability Scenarios (100 problems) — Integrated reliability incident practice across retries, partial outages, failover/failback, graceful degradation, and recovery sequencing under pressure

- Chapter 1 completed and validated with config/content tests: added 100 mixed-type problems (`rel-fd-001` to `rel-fd-100`) and marked the chapter as ready in `config.js`.
- Chapter 1 review/fix pass completed: removed repetitive prompt-openings, eliminated duplicate patterns, and tightened multi-select distractor quality to ensure discriminating reliability judgment.
- Chapter 2 completed and validated with config/content tests: added 100 mixed-type problems (`rel-tr-001` to `rel-tr-100`) and marked the chapter as ready in `config.js`.
- Chapter 2 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 3 completed and validated with config/content tests: added 100 mixed-type problems (`rel-ca-001` to `rel-ca-100`) and marked the chapter as ready in `config.js`.
- Chapter 3 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 4 completed and validated with config/content tests: added 100 mixed-type problems (`rel-rf-001` to `rel-rf-100`) and marked the chapter as ready in `config.js`.
- Chapter 4 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 5 completed and validated with config/content tests: added 100 mixed-type problems (`rel-gd-001` to `rel-gd-100`) and marked the chapter as ready in `config.js`.
- Chapter 5 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 6 completed and validated with config/content tests: added 100 mixed-type problems (`rel-dr-001` to `rel-dr-100`) and marked the chapter as ready in `config.js`.
- Chapter 6 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 7 completed and validated with config/content tests: added 100 mixed-type problems (`rel-ops-001` to `rel-ops-100`) and marked the chapter as ready in `config.js`.
- Chapter 7 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.
- Chapter 8 completed and validated with config/content tests: added 100 mixed-type problems (`rel-scn-001` to `rel-scn-100`) and marked the chapter as ready in `config.js`.
- Chapter 8 review/fix pass completed: removed repetitive prompt patterns, verified answer-key correctness, and tightened explanations for stronger reliability trade-off reasoning.

## OpenQuizzer upgrade — meta tag customization (2026-02-08)

- Synced `openquizzer.js`, `openquizzer.test.js`, and `index.html` from OpenQuizzer (UI wiring contract tests, Prettier formatting, selection-based reordering, probability weighting, session length caps, partial-session results).
- Customized static `<title>` and `<meta description>` in `index.html` so Slack/social link previews show "System Design Practice" instead of generic "Quiz" placeholder.
- Replaced template placeholder integrity tests in `openquizzer.test.js` with instance-specific checks that verify meta tags match CONFIG.
- Fixed root `package.json` from `"type": "commonjs"` to `"type": "module"` so ES module test files load correctly under Node v24.
- Test count: 100 engine + UI wiring, 6 config, 2 bootstrap (108 total).

## Unit 8: Consistency & Coordination (complete — 800 problems)

1. Consistency Models Fundamentals (100 problems) — Linearizability/sequential/causal/eventual consistency trade-offs, user-visible anomaly diagnosis, session guarantees, bounded staleness, and endpoint-level guarantee selection by invariant criticality
2. Quorums, Replication & Read/Write Paths (100 problems) — Leader/follower read-path design, quorum overlap math, endpoint-tiered tunable consistency, lag-aware routing, degraded-mode replication policy, and stale-read mitigation controls
3. Time, Ordering & Causality (100 problems) — Clock-skew/reordering anomaly diagnosis, logical and causal ordering controls, Lamport/vector clock use, replay safety guards, and conflict-aware concurrent-update handling
4. Transactions & Isolation in Distributed Systems (100 problems) — Isolation anomaly triage, invariant-scoped strictness, optimistic/pessimistic concurrency control, saga/outbox patterns, and compensation/rollback safety
5. Coordination Patterns & Distributed Locking (100 problems) — Lease and fencing-token correctness, leader election safety, lock liveness/fairness controls, stale-owner rejection, and singleton-job coordination under failure
6. Consensus & Membership (100 problems) — Quorum/term safety, stale-leader write prevention, election stability tuning, membership reconfiguration discipline, and commit-visibility correctness under faults
7. Conflict Resolution & Convergence (100 problems) — Concurrent-write conflict diagnostics, domain-specific merge semantics, CRDT fit decisions, replay-safe convergence controls, and unresolved-conflict escalation policy
8. Consistency & Coordination Scenarios (100 problems) — Integrated incident-driven practice spanning consistency models, quorum/read-write paths, causal ordering, transactions, coordination safety, consensus behavior, and convergence trade-offs

- Chapter 1 completed and validated with config/content tests: added 100 mixed-type problems (`cc-cm-001` to `cc-cm-100`) and marked the chapter as ready in `config.js`.
- Chapter 1 review/fix pass completed: removed duplicate prompt patterns in multiple-choice items, eliminated uncertainty-marker wording artifacts, and tightened consistency-model mitigation framing for endpoint-level guarantee selection.
- Chapter 2 completed and validated with config/content tests: added 100 mixed-type problems (`cc-qr-001` to `cc-qr-100`) and marked the chapter as ready in `config.js`.
- Chapter 2 review/fix pass completed: removed duplicate prompt patterns in multiple-choice items, diversified quorum/replication scenario framing, and tightened mitigation explanations around endpoint-tiered read/write-path policy choices.
- Chapter 3 completed and validated with config/content tests: added 100 mixed-type problems (`cc-tc-001` to `cc-tc-100`) and marked the chapter as ready in `config.js`.
- Chapter 3 review/fix pass completed: removed duplicate prompt patterns in multiple-choice items, eliminated residual wording artifacts, and tightened mitigation framing around causal/logical ordering controls under skew/reordering conditions.
- Chapter 4 completed and validated with config/content tests: added 100 mixed-type problems (`cc-ti-001` to `cc-ti-100`) and marked the chapter as ready in `config.js`.
- Chapter 4 review/fix pass completed: verified duplicate-free prompt distribution, removed wording-marker artifacts, and tightened mitigation framing around invariant-scoped isolation, saga/outbox boundaries, and retry-safe transactional behavior.
- Chapter 5 completed and validated with config/content tests: added 100 mixed-type problems (`cc-cl-001` to `cc-cl-100`) and marked the chapter as ready in `config.js`.
- Chapter 5 review/fix pass completed: verified duplicate-free prompt distribution, cleaned wording-marker artifacts, and tightened mitigation framing around fencing enforcement, lease validity, and split-brain-safe coordination behavior.
- Chapter 6 completed and validated with config/content tests: added 100 mixed-type problems (`cc-cs-001` to `cc-cs-100`) and marked the chapter as ready in `config.js`.
- Chapter 6 review/fix pass completed: verified duplicate-free prompt distribution and tightened mitigation framing around quorum/term discipline, safe membership reconfiguration, and stale-leader write prevention.
- Chapter 7 completed and validated with config/content tests: added 100 mixed-type problems (`cc-cr-001` to `cc-cr-100`) and marked the chapter as ready in `config.js`.
- Chapter 7 review/fix pass completed: verified duplicate-free prompt distribution and tightened mitigation framing around domain-specific merge semantics, replay-safe convergence controls, and conflict-escalation boundaries.
- Chapter 8 completed and validated with config/content tests: added 100 mixed-type problems (`cc-scn-001` to `cc-scn-100`) and marked the chapter as ready in `config.js`.
- Chapter 8 review/fix pass completed: verified duplicate-free prompt distribution and tightened integrated scenario framing around bottleneck-first consistency diagnosis, policy guardrails, and end-to-end mitigation sequencing.

## Unit 7: Scaling Compute (complete — 800 problems)

1. Load Balancing Fundamentals (100 problems) — L4 vs L7 routing decisions, health-check strategy, connection draining, stickiness trade-offs, weighted balancing, fail-open/fail-closed behavior, and canary traffic controls
2. Statelessness & Session Strategy (100 problems) — Session externalization, JWT vs opaque tokens, idempotency patterns, Redis session management, token refresh/revocation, CORS/cookie security, rate limiting state, saga patterns, connection pooling, graceful degradation
3. Horizontal vs Vertical Scaling Decisions (100 problems) — Bottleneck decomposition, CPU/memory/network saturation patterns, coordination overhead, scaling economics, blast-radius trade-offs, and phased scaling response strategy
4. Autoscaling Signals & Policies (100 problems) — Target tracking, queue-depth and queue-age scaling, predictive vs reactive controls, hysteresis/cooldowns, dependency-aware guardrails, and thrash prevention under bursty demand
5. Hotspots, Sharding & Work Distribution (100 problems) — Hot partition diagnosis, partition-key quality, consistent hashing/virtual nodes, fairness controls, work stealing, re-sharding safety, and ordering-vs-throughput trade-offs
6. Multi-Region Compute Strategy (100 problems) — Active-active vs active-passive topologies, geo-routing policy, failover/failback orchestration, regional isolation, replication lag/RPO trade-offs, and control-plane blast-radius management
7. Compute Selection & Platform Trade-offs (100 problems) — Platform-fit decisions across VMs/containers/serverless/managed runtimes, cold-start and runtime-limit trade-offs, noisy-neighbor controls, deployment velocity, and lock-in vs portability boundaries
8. Scaling Compute Scenarios (100 problems) — Integrated incident-driven scenarios spanning bottleneck triage, autoscaling policy, hotspot mitigation, compute platform selection, and multi-region failover/failback trade-offs

- Chapter 1 completed and validated with config/content tests: added 100 mixed-type problems and marked the chapter as ready in `config.js`.
- Chapter 1 review/fix pass completed: removed exact/near-duplicate scenario prompts and diversified two-stage operational contexts to reduce thematic saturation.
- Chapter 2 completed and validated with config/content tests: added 100 mixed-type problems and marked the chapter as ready in `config.js`.
- Chapter 2 review/fix pass completed: fixed arithmetic errors in 3 numeric problems, replaced 2 near-duplicate problems, clarified edge cases in refresh token calculations, added systems context to pure arithmetic problem.
- Chapter 3 completed and validated with config/content tests: added 100 mixed-type problems (`sc-hv-001` to `sc-hv-100`) and marked the chapter as ready in `config.js`.
- Chapter 3 review/fix pass completed: replaced repetitive templated prompts with diversified bottleneck-driven scenarios, expanded unique multi-select/ordering/numeric trade-off coverage, and tightened two-stage diagnosis/action framing to reduce near-duplicate saturation.
- Chapter 4 completed and validated with config/content tests: added 100 mixed-type problems (`sc-as-001` to `sc-as-100`) and marked the chapter as ready in `config.js`.
- Chapter 4 review/fix pass completed: corrected strong answer-position bias in multiple-choice/two-stage items, diversified two-stage diagnosis-action framing, and tightened explanations to map directly to each scenario's failure mode.
- Chapter 5 completed and validated with config/content tests: added 100 mixed-type problems (`sc-hs-001` to `sc-hs-100`) and marked the chapter as ready in `config.js`.
- Chapter 5 review/fix pass completed: removed duplicate prompt patterns in multiple-choice and two-stage items, diversified follow-up scenario framing, and tightened stage explanations around partition-skew diagnosis and mitigation selection.
- Chapter 6 completed and validated with config/content tests: added 100 mixed-type problems (`sc-mr-001` to `sc-mr-100`) and marked the chapter as ready in `config.js`.
- Chapter 6 review/fix pass completed: removed duplicate prompt patterns in multiple-choice/two-stage items, diversified regional incident follow-up framing, and tightened stage explanations around failover/isolation diagnosis and mitigation choice.
- Chapter 7 completed and validated with config/content tests: added 100 mixed-type problems (`sc-pt-001` to `sc-pt-100`) and marked the chapter as ready in `config.js`.
- Chapter 7 review/fix pass completed: removed duplicate prompt patterns in multiple-choice/two-stage items, diversified platform-fit follow-up framing, and tightened stage explanations around compute-model mismatch diagnosis and mitigation choice.
- Chapter 8 completed and validated with config/content tests: added 100 mixed-type problems (`sc-scn-001` to `sc-scn-100`) and marked the chapter as ready in `config.js`.
- Chapter 8 review/fix pass completed: removed duplicate scenario prompt patterns in multiple-choice items, diversified integrated incident context framing, and tightened mitigation explanations around bottleneck-first response sequencing.

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
- `index.html` copied from OpenQuizzer template with instance-specific `<title>` and `<meta description>`
- Upgrade path: copy `openquizzer.js`, `openquizzer.test.js`, `index.html` from OpenQuizzer, customize meta tags and tests
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
