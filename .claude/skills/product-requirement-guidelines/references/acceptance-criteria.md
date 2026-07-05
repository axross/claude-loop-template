# Acceptance Criteria Craft

Apply this reference when drafting or reviewing the checklist a reviewer uses to judge a finished change against a spec. Sourced from INVEST-adjacent testability practice and BDD/Gherkin acceptance-criteria craft: [LogRocket's INVEST guide](https://blog.logrocket.com/product-management/writing-meaningful-user-stories-invest-principle/), [Agile Alliance's INVEST glossary entry](https://agilealliance.org/glossary/invest/), [AltexSoft's acceptance-criteria guide](https://www.altexsoft.com/blog/acceptance-criteria-purposes-formats-and-best-practices/), [Adaptive US on acceptance criteria](https://www.adaptiveus.com/blog/how-to-leverage-nfrs-to-develop-acceptance-criteria), and [Cucumber's Gherkin style guide](https://cucumber.io/docs/bdd/better-gherkin/).

## Independent Verifiability

A criterion earns its place only if a reviewer can judge it from the diff or the running UI without reading implementation code to know whether it passed. INVEST's "Testable" dimension exists for exactly this reason — a story without explicit conditions of satisfaction cannot be confirmed done. Given/When/Then framing keeps each criterion phrased as observable behavior rather than implementation, and independent of other criteria so a single failure is easy to isolate.

**Guidelines:**

- MUST phrase each criterion as one observable behavior a reviewer can check from the diff or the running UI.
- MUST NOT require the reviewer to read implementation code to judge whether a criterion passed.
- SHOULD write each criterion so it can be judged independently of the others.

## Concrete Over Adjectival

"Works correctly" and "looks good" are not verifiable; a stated copy string, attribute, threshold, or state transition is. This mirrors the same requirements-smell finding that governs problem-statement language (see [problem-and-scope.md](./problem-and-scope.md)) applied to the checklist itself.

**Guidelines:**

- MUST make each criterion verifiable from the diff or running UI — not adjectival ("works correctly", "looks good") — applying [problem-and-scope.md › Concrete, Checkable Language](./problem-and-scope.md#concrete-checkable-language) to the checklist rather than restating its rule here.
- SHOULD prefer a concrete number or threshold over a relative claim ("under 3 seconds" rather than "fast").

## Coverage: Happy Path, Edge Cases, Non-Effects

Most defects live outside the primary flow, so a criteria set that only covers the happy path leaves the riskiest behavior unverified. Boundary-value analysis — testing at and just past a limit — is the standard technique for surfacing these cases. When a change sits next to something that must stay untouched, an explicit "X is unaffected" criterion closes the gap a happy-path-only checklist would leave open.

**Guidelines:**

- MUST cover the happy path.
- MUST cover the relevant edge, disabled, empty, and error states.
- MUST include an explicit "X is unaffected" criterion when the change sits next to a surface that must stay untouched.

## Right-Sized Checklists

A checklist that needs far more than a handful of criteria is usually a sign the underlying story should split; too few leaves testable gaps that surface as bugs later. Practitioner guidance converges on roughly three to seven or eight criteria as a starting rubric, not a hard ceiling. Verification gates belong in the same checklist as trailing items, since "done" includes passing the project's own format/lint/test/build commands, not only the feature behavior.

**Guidelines:**

- SHOULD right-size the checklist to roughly three to seven criteria; treat materially more as a signal to reconsider the change's scope rather than padding restatements of the same behavior.
- MUST include the verification gates the change requires (format/lint, unit/e2e suites, build) as trailing checklist items, per the project's [verification rules](../../development-guidelines/references/verification.md).
- MUST NOT restate the same observable behavior across multiple bullets.
- MUST write each criterion as a plain bullet (`-`), not a GitHub task-list checkbox (`- [ ]`) — unless the project actually checks the boxes as part of its process, an unchecked box reads as perpetually incomplete.

## Traceability

An acceptance criterion that names a behavior the rest of the spec never mentioned is either a hidden scope addition or a sign the spec is incomplete. Definition of Done and acceptance criteria are complementary, not interchangeable — DoD is the fixed, cross-cutting bar every change must clear, while acceptance criteria are the criteria specific to this change's stated requirement.

**Guidelines:**

- MUST trace every criterion back to something the spec's other sections actually specify.
- MUST NOT introduce net-new scope only in the acceptance criteria.
