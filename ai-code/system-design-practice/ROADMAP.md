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

## Now (In Progress)

- [ ] **Unit 10: Classic Designs Decomposed** — chapter-by-chapter content creation
  - [x] Chapter 1: Twitter/X Timeline Write & Fanout
        Scope: Decomposing tweet ingest, home-timeline fanout choices, and read-path assembly under scale and failure.
        Key concepts: fanout-on-write vs fanout-on-read, celebrity handling, timeline materialization, hot-key mitigation.
  - [x] Chapter 2: Twitter/X Timeline Ranking, Serving & Reliability
        Scope: Ranking pipeline decomposition, cache policy, freshness/consistency boundaries, and operational controls.
        Key concepts: ranking stages, cache layering, freshness SLA, invalidation, feed-serving fault containment.
  - [ ] Chapter 3: URL Shortener Core Architecture
        Scope: Atomic design of short-link creation, key generation, redirect serving, and correctness constraints.
        Key concepts: ID generation (counter/hash/snowflake), collision handling, redirect latency path, abuse controls.
  - [ ] Chapter 4: URL Shortener Scale, Analytics & Operations
        Scope: Scaling redirect traffic, event/analytics pipeline decomposition, and reliability/cost governance.
        Key concepts: write/read amplification, click analytics pipeline, cold/hot partitioning, retention trade-offs.
  - [ ] Chapter 5: Chat Core Messaging Architecture
        Scope: Message lifecycle from send to deliver/ack across direct and group chat with ordering semantics.
        Key concepts: session routing, ordering keys, delivery guarantees, group fanout strategy, offline inbox design.
  - [ ] Chapter 6: Chat Presence, Sync & Reliability
        Scope: Presence modeling, multi-device sync, media path decomposition, and degradation/failover behavior.
        Key concepts: presence heartbeat/state model, unread counters, attachment flows, replay safety, E2EE boundaries.
  - [ ] Chapter 7: Notification System Core Architecture
        Scope: Multi-channel notification pipeline decomposition from event ingest to policy and channel dispatch.
        Key concepts: preference evaluation, deduplication/idempotency, scheduling windows, channel adapters, rate governance.
  - [ ] Chapter 8: Notification System Scale & Scenarios
        Scope: Incident-style scenarios combining spikes, dependency failures, retries, and priority-driven delivery controls.
        Key concepts: queue tiering, retry budgets, SLA segmentation, fallback channels, campaign-throttle coordination.

## Next (Unit 10)

- [ ] **Post-Unit 10 feature push** — spaced repetition, skill grid, progress persistence, interview simulation

## Features (After Content Complete)

- [ ] **Spaced repetition** — Track problem history, surface weak areas (depends on OpenQuizzer v1.1)
- [ ] **Skill grid** — FitStar-style Elo per dimension (estimation, data modeling, API design, etc.)
- [ ] **Progress persistence** — localStorage to resume across sessions
- [ ] **Interview simulation mode** — Timed sessions, random mix across all units

## Content Quality

- [ ] **Problem review pass** — Manual review of flagged problems (ambiguous, math errors)
- [ ] **Difficulty calibration** — Tag problems as L5/L6/L7, filter by level
- [ ] **Source citations** — Link problems to DDIA chapters, papers, or blog posts where relevant

## Maybe

- [ ] **Community contributions** — Accept PRs for new problems with quality guidelines
- [ ] **Alternative tracks** — Frontend system design, ML system design, data engineering
- [ ] **Mock interview mode** — 45-minute timed session with problem mix matching real interviews

## Won't Do

- Video explanations — text is faster and more bus-friendly
- Discussion forums — use GitHub issues
- Certification or badges — not the point
