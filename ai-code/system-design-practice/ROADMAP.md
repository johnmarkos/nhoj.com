# System Design Practice Roadmap

## Now (Active)

1. OpenQuizzer v3.0 instance upgrade (when upstream ships)
   - Sync engine/UI files for file import/export support.

2. Content realism calibration
   - Continue definition-to-scenario rewrites in highest-ratio chapters (notably Unit 7, Unit 4, Unit 5, Unit 9/10, Unit 8/12).
   - Continue de-templating remaining chapter clusters where long practice sessions still feel repetitive.

3. Difficulty calibration pass
   - Refine baseline `difficulty` labels against actual interview-style complexity and ambiguity.

4. Interview simulation semantics (deferred engine work)
   - Evaluate strict session-level wall-clock enforcement once OpenQuizzer engine bandwidth is available.

## Later

1. Skill-grid refinement
   - Evolve baseline tag bars toward richer proficiency visualization (e.g., Elo-informed charting).

2. Community contributions workflow
   - Define quality gate and contribution process for external problem submissions.

3. Alternative tracks
   - Explore frontend system design, ML systems, and data engineering tracks.

## Notes

- Completed milestones are tracked in `CHANGELOG.md`.
- Baseline validation currently passes with the latest linter and test suite.
