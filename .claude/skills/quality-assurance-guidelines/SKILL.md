---
name: quality-assurance-guidelines
description: The reviewer's QA lens on verification evidence, on top of development verification and e2e testing rules. Covers format/lint proof, e2e coverage for new routes/features/surfaces, required test-id hooks, intentional snapshot updates, flaky-test investigation, manual checks for non-default content and not-found states, skipped checks, and residual risk.
when_to_use: Use when reviewing whether a change has adequate verification evidence — "are tests good", "did this break anything", or "should I bump snapshots".
user-invocable: false
---

# Quality Assurance Guidelines

Apply these rules when reviewing whether a change has been adequately verified before merge. This is the reviewer's lens — flag missing evidence and link to the developer-facing rule.

## Verification Evidence

See [verification-evidence.md](./references/verification-evidence.md) for:

- Commands run, exit status, and relevant output
- Manual checks matched to changed output surfaces
- Skipped required checks and residual risk
- Second-pass verification after fixing Critical or Major findings

## Lint and Format Gate

See [lint-and-format-gate.md](./references/lint-and-format-gate.md) for:

- The author ran the format and lint commands per the project's development guidelines (code-quality rules)
- No new inline linter suppressions without an inline justification
- No new lint warnings introduced into modified files

## E2E Coverage

See [e2e-coverage.md](./references/e2e-coverage.md) for:

- Every new route, feature, or visually distinct surface has co-located test coverage in the test directory
- New visually distinct UI elements expose a stable test id per the project's testable-component conventions, if defined
- Test files use the required locator and structure conventions from the project's end-to-end testing guidelines
- Shared test helpers are reused (not duplicated inline in the test file)
<!-- INIT:OPTIONAL key=SCENARIO_COVERAGE — keep the next bullet if the project adopts journey-catalog e2e coverage OR delete it; see the INIT.md Step-4 bullet. -->
- Scenario-coverage evidence: a new user-facing journey is cataloged and tagged on the asserting test, and a `must`-priority gap blocks (INIT-optional; for projects with a journey-catalog coverage metric)

## Snapshot Handling

See [snapshot-handling.md](./references/snapshot-handling.md) for:

- A regenerated snapshot is paired with an explanation of the visual change in the diff
- The author understands that a local snapshot update only updates the local platform's snapshot (the platform-specific segment in the snapshot path)
- CI snapshot automation, if any, is reviewed for visual intent, not auto-merged
- Removed snapshots are accompanied by removed or restructured tests, not silent deletion

## Flakiness Tolerance

See [flakiness-tolerance.md](./references/flakiness-tolerance.md) for:

- A test that intermittently passes was investigated, not "fixed" by retry, polling, or a fixed sleep
- Anti-flake config (repeat-each, fail-on-flaky) is not weakened
- Committed focus/skip markers are flagged

## Manual Verification Evidence

See [manual-verification.md](./references/manual-verification.md) for:

- The author exercised non-default content states when the change touches a data-driven surface
- The not-found UI was verified for routing changes
- The dev-server output was checked for new warnings or errors
