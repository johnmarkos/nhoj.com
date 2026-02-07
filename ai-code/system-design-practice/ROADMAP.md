# System Design Practice Roadmap

## Done

- [x] **Unit 1: Estimation** — 8 chapters, 1,007 problems
- [x] **Unit 2: Data Modeling** — 8 chapters, 800 problems
- [x] **Unit 3: API Design** — 8 chapters, 791 problems
- [x] **Unit 4: Storage Selection** — 8 chapters, 800 problems
- [x] **Unit 5: Caching** — 8 chapters, 800 problems
- [x] **Unit 6: Messaging & Async** — 8 chapters, 770 problems

## Now (In Progress)

- [ ] **Unit 7: Scaling Compute** — planned, chapter-by-chapter content creation next
  - [x] Chapter 1: Load Balancing Fundamentals — 100 problems (L4/L7 routing, health checks, drain/failover behavior, stickiness, weighted policies, canary controls)
  Scope: L4/L7 balancing goals, request routing, health checks, session affinity trade-offs, L4 vs L7 behavior.
  Key concepts: round-robin/least-connections, passive vs active health checks, sticky sessions, fail-open/fail-closed.
  - [ ] Chapter 2: Statelessness & Session Strategy
    Scope: Designing services for horizontal scale by externalizing state and handling user/session context safely.
    Key concepts: stateless app tiers, session stores, token-based auth, idempotent handlers, cache/session consistency.
  - [ ] Chapter 3: Horizontal vs Vertical Scaling Decisions
    Scope: Capacity planning and architectural trade-offs between bigger nodes and more nodes across workloads.
    Key concepts: bottleneck decomposition, CPU/memory/network saturation patterns, coordination overhead, cost curves.
  - [ ] Chapter 4: Autoscaling Signals & Policies
    Scope: Building stable autoscaling behavior using demand signals, cooldowns, and safety limits.
    Key concepts: target tracking, queue-depth scaling, predictive vs reactive scaling, hysteresis, thrash prevention.
  - [ ] Chapter 5: Hotspots, Sharding & Work Distribution
    Scope: Removing compute hotspots and balancing work across partitions/workers while preserving correctness boundaries.
    Key concepts: partition-key quality, skew mitigation, consistent hashing, work stealing, ordered vs unordered processing.
  - [ ] Chapter 6: Multi-Region Compute Strategy
    Scope: Active-active and active-passive compute designs with latency, failover, and blast-radius constraints.
    Key concepts: geo-routing, failover orchestration, regional isolation, cross-region replication impact, control planes.
  - [ ] Chapter 7: Compute Selection & Platform Trade-offs
    Scope: Choosing between VMs, containers, serverless, and managed runtimes by workload profile and ops model.
    Key concepts: cold starts, bin packing, noisy neighbors, deployment velocity, portability vs managed convenience.
  - [ ] Chapter 8: Scaling Compute Scenarios
    Scope: Integrated design scenarios combining load balancing, autoscaling, statelessness, hotspot mitigation, and regional strategy.
    Key concepts: end-to-end diagnosis, bottleneck triage, staged migration plans, SLO/cost trade-offs under incident pressure.

## Next (Units 7-10)

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
