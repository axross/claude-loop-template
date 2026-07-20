# Verification Strategy Framing

Apply this reference when drafting or reviewing the "Verification strategy" section of a spec — how the finished change will be proven to satisfy its acceptance criteria: which automated gates run, which manual checks apply, and what test coverage the change needs. This section states the *method* of verification; the **Acceptance criteria** section states the *observable outcomes* that method must confirm. Sourced from Definition-of-Done and test-strategy practice: the DoD-versus-acceptance-criteria distinction in [Scrum DoD guidance](https://www.scrum.org/resources/blog/done-understanding-definition-done), the [ISTQB test-strategy vocabulary](https://www.istqb.org/), and the project's own verification rules in [AGENTS.md › Verification](../../../../AGENTS.md#verification).

## Verification Strategy vs. Acceptance Criteria

The two sections are complementary, not duplicates. An acceptance criterion is a behavior a reviewer confirms is true of the finished change; the verification strategy is the set of commands, suites, and manual steps that establish it. A spec that folds one into the other loses the distinction between *what* must hold and *how* it is shown to hold.

**Guidelines:**

- MUST describe the verification method (commands, suites, manual checks) in this section, and leave the observable outcomes to [acceptance-criteria.md](./acceptance-criteria.md).
- MUST NOT restate each acceptance criterion here; reference the gates and checks that cover them instead.
- SHOULD map the strategy back to the change's surface — name the checks that exercise the code the change actually touches, not a blanket suite run.

## Name the Gates the Change Requires

Verification is scoped to the changed surface: a docs edit needs link and format checks, while a route, data-layer, or runtime change needs stronger evidence. The project's own verification rules fix which gate applies to which surface; this section names the subset the change triggers rather than reasserting the whole policy.

**Guidelines:**

- MUST name the automated gates the changed surface requires — format/lint always; the unit suite when the change affects code it covers; the end-to-end suite when a user-facing surface changes; the build when routes, metadata, data-layer or runtime config, dependencies, or public type signatures change — per [AGENTS.md › Verification](../../../../AGENTS.md#verification).
- MUST defer the *design* of new test coverage to the testing skills — the project's end-to-end testing guidelines for browser/route coverage and its unit-test guidelines for unit coverage — rather than specifying test cases inline here.
- MUST state, when a normally-applicable gate does not apply (no unit suite exists, no user-facing surface changed), that it was considered and why it is skipped, rather than silently omitting it.

## Manual Checks and Evidence

Some behavior is not covered by an automated gate — crawler metadata, custom-protocol handling, responsive layout, content-preview rendering, not-found and empty states. The verification strategy names the focused manual checks these require, and commits to recording the evidence so a reviewer sees what actually ran.

**Guidelines:**

- SHOULD name the focused manual checks the change requires when browser behavior, metadata, responsive layout, or non-default content/error states change and no automated gate covers them.
- MUST commit to recording verification evidence — commands run, manual checks performed, failures, and any gate that could not run — so completion is auditable, per [AGENTS.md › Verification](../../../../AGENTS.md#verification).
- SHOULD call out any acceptance criterion the planned strategy leaves unverified, as residual risk, rather than implying full coverage.
