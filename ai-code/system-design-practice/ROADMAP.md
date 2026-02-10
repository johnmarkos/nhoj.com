# System Design Practice Roadmap

## Done

- [x] **Unit 1: Estimation** — 8 chapters, 1,007 problems
- [x] **Unit 2: Data Modeling** — 8 chapters, 800 problems
- [x] **Unit 3: API Design** — 8 chapters, 791 problems
- [x] **Unit 4: Storage Selection** — 8 chapters, 800 problems
- [x] **Unit 5: Caching** — 8 chapters, 800 problems
- [x] **Unit 6: Messaging & Async** — 8 chapters, 770 problems
- [x] **Unit 7: Scaling Compute** — 8 chapters, 800 problems

## Now (In Progress)

- [ ] **Unit 8: Consistency & Coordination** — planned, chapter-by-chapter content creation
  - [ ] Chapter 1: Consistency Models Fundamentals
        Scope: Core read/write consistency guarantees and how they affect user-visible behavior under replication.
        Key concepts: linearizability, sequential consistency, causal consistency, eventual consistency, session guarantees.
  - [ ] Chapter 2: Quorums, Replication & Read/Write Paths
        Scope: Replicated data-path choices and how quorum math impacts latency, durability, and stale-read risk.
        Key concepts: leader/follower replication, quorum reads/writes, tunable consistency, read repair, anti-entropy.
  - [ ] Chapter 3: Time, Ordering & Causality
        Scope: Coordinating distributed events when wall clocks are unreliable and ordering must be explicit.
        Key concepts: logical clocks, vector clocks, Lamport timestamps, clock skew, causal ordering.
  - [ ] Chapter 4: Transactions & Isolation in Distributed Systems
        Scope: Balancing correctness and throughput when multi-key invariants cross services and storage boundaries.
        Key concepts: ACID vs BASE trade-offs, isolation anomalies, optimistic/pessimistic concurrency control, distributed transactions.
  - [ ] Chapter 5: Coordination Patterns & Distributed Locking
        Scope: Safe coordination for leases, elections, and critical sections without creating fragile single points.
        Key concepts: leases, fencing tokens, leader election, lock safety/liveness, split-brain avoidance.
  - [ ] Chapter 6: Consensus & Membership
        Scope: Reliable agreement and cluster reconfiguration under crash/partition faults.
        Key concepts: Raft/Paxos intuition, quorum intersection, log replication, membership changes, failure detection.
  - [ ] Chapter 7: Conflict Resolution & Convergence
        Scope: Handling concurrent writes and reconciling divergent state in eventually consistent systems.
        Key concepts: last-write-wins trade-offs, CRDT intuition, merge semantics, idempotency, compensating logic.
  - [ ] Chapter 8: Consistency & Coordination Scenarios
        Scope: Integrated incident/design scenarios that combine consistency guarantees, quorum policy, and coordination under failure.
        Key concepts: end-to-end trade-off diagnosis, invariant protection, partition-mode behavior, latency/correctness/cost decisions.

## Next (Units 9-10)

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
