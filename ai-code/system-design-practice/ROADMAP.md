# System Design Practice Roadmap

## Done

- [x] **Unit 1: Estimation** — 8 chapters, 1,007 problems
- [x] **Unit 2: Data Modeling** — 8 chapters, 800 problems
- [x] **Unit 3: API Design** — 8 chapters, 800 problems
- [x] **Unit 4: Storage Selection** — 8 chapters, 800 problems

## Now (In Progress)

- [ ] **Weighting system** — Ensure numeric, ordering, multi-select, two-stage appear proportionally despite MC dominance

## Next (Units 5-6)

- [ ] **Unit 5: Caching**
  - Chapter 1: Cache Fundamentals — Hit/miss ratios, latency benefits, cache hierarchy (CPU, in-memory, distributed)
  - Chapter 2: Cache Placement — Browser, CDN, reverse proxy, application-level, database query cache
  - Chapter 3: Caching Strategies — Cache-aside, read-through, refresh-ahead, write-through, write-behind, write-around
  - Chapter 4: TTLs & Expiration — Time-to-live design, absolute vs sliding expiration, stale-while-revalidate
  - Chapter 5: Cache Invalidation — Event-driven invalidation, cache busting, versioned keys, invalidation cascades
  - Chapter 6: Eviction Policies — LRU, LFU, FIFO, random, ARC, size-based eviction
  - Chapter 7: Distributed Caching — Redis vs Memcached, consistent hashing, cache stampede, hot keys, replication
  - Chapter 8: Caching Scenarios — When to cache, sizing decisions, debugging cache issues, multi-tier caching
- [ ] **Unit 6: Messaging & Async** — Queues, pub/sub, event-driven architecture, exactly-once delivery

## Later (Units 7-10)

- [ ] **Unit 7: Scaling Compute** — Load balancing, horizontal scaling, statelessness, autoscaling
- [ ] **Unit 8: Consistency & Coordination** — CAP theorem, transactions, distributed consensus, eventual consistency
- [ ] **Unit 9: Reliability** — Failure modes, redundancy, graceful degradation, circuit breakers, retries
- [ ] **Unit 10: Classic Designs Decomposed** — Twitter, URL shortener, chat, notification system — as atomic questions

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
