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

## Now (In Progress)

- [ ] **Unit 9: Reliability** — planned, chapter-by-chapter content creation
  - [x] Chapter 1: Failure Modes & Fault Domains
        Scope: Identifying realistic failure classes and mapping blast radius across service, node, zone, and region boundaries.
        Key concepts: fail-stop vs partial failure, correlated failures, fault domains, dependency failure taxonomy, blast-radius reasoning.
  - [x] Chapter 2: Timeouts, Retries & Backoff Control
        Scope: Designing retry behavior that improves success rates without causing retry storms or cascading overload.
        Key concepts: timeout budgets, capped retries, exponential backoff with jitter, retry amplification, idempotency coupling.
  - [x] Chapter 3: Circuit Breakers, Load Shedding & Admission Control
        Scope: Protecting systems under stress by bounding concurrency and failing safely before saturation cascades.
        Key concepts: circuit states, fail-open/fail-closed trade-offs, token/leaky-bucket admission, priority shedding, brownout control.
  - [ ] Chapter 4: Redundancy, Replication & Failover Strategy
        Scope: Building availability with N+1 capacity, multi-AZ/region redundancy, and safe failover/failback procedures.
        Key concepts: active-active vs active-passive reliability trade-offs, hot/warm/cold standby, failover runbooks, quorum-aware failback.
  - [ ] Chapter 5: Graceful Degradation & Dependency Isolation
        Scope: Preserving core user journeys when dependencies degrade by using fallback modes and strict dependency boundaries.
        Key concepts: critical-path isolation, fallback data quality tiers, feature kill switches, bulkheads, graceful capability degradation.
  - [ ] Chapter 6: Data Safety, Durability & Recovery
        Scope: Preventing irreversible data loss and planning restoration with explicit RPO/RTO guarantees.
        Key concepts: backups/snapshots, point-in-time recovery, durability classes, restore drills, data integrity verification.
  - [ ] Chapter 7: Reliability Engineering Operations
        Scope: Operating reliability as a continuous process with measurable SLOs, error budgets, and incident learning loops.
        Key concepts: SLI/SLO design, error-budget policy, alert quality, incident command patterns, postmortem action tracking.
  - [ ] Chapter 8: Reliability Scenarios
        Scope: Integrated reliability incidents combining retry storms, partial outages, failover decisions, and degradation strategy under pressure.
        Key concepts: end-to-end incident triage, cascading-failure containment, recovery sequencing, SLO/cost trade-off decisions.

## Next (Unit 10)

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
