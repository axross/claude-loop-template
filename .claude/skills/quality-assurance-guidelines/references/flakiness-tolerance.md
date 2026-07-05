# Flakiness Tolerance

Apply these rules to verify the change does not introduce or paper over test flakiness. When the project's {{E2E_TEST_FRAMEWORK}} config is set so flakiness fails the suite (e.g., repeating each test and failing on flaky results rather than silently retrying), an intermittent test is a failure, not a warning.

## Flakiness Workarounds to Reject

Flakiness Workarounds to Reject review focuses on critical-severity cases where a new or modified test contains:

**Guidelines:**

- MUST flag a Critical when a new or modified test contains:
  - a fixed sleep (an arbitrary timeout/wait of N milliseconds) — fixed sleeps are an anti-pattern. Use the framework's auto-waiting assertions, response/load-state waits, or visibility expectations instead.
  - a `try`/`catch` around an assertion to "make the test pass when it sometimes fails".
  - a skip/fixme marker added to suppress an intermittent failure rather than to skip a known-broken test with a tracked issue.
  - a retry loop wrapping an assertion.
- MUST flag a Critical when the diff modifies the {{E2E_TEST_FRAMEWORK}} config to weaken anti-flake settings (repeat-each, fail-on-flaky, forbid-focused-tests) or to add retries. Defer the change to the human owner per [escalation.md](../../code-review-guideline/references/escalation.md).

## Root-Cause Investigation

Root-Cause Investigation sets the required project default: flag when a flake is "fixed" by changing the assertion target rather than fixing the underlying race (e.g., loosening an exact-text assertion to a partial-text assertion).

**Guidelines:**

- MUST flag when a flake is "fixed" by changing the assertion target rather than fixing the underlying race (e.g., loosening an exact-text assertion to a partial-text assertion).
- SHOULD ask the author to identify the specific race (e.g., "did the response arrive before the assertion ran?", "was a loading boundary still pending?") in the PR description.

## Focused and Skipped Tests

Focused and Skipped Tests sets the required project default: flag a Critical for any committed focused-test marker (a test/suite/step marked to run exclusively) — CI's forbid-focused-tests setting will fail the build.

**Guidelines:**

- MUST flag a Critical for any committed focused-test marker (a test/suite/step marked to run exclusively) — CI's forbid-focused-tests setting will fail the build.
- MUST flag a Major for any committed skip/fixme marker without a tracked-issue comment explaining what's skipped, why, and when it's expected to be re-enabled.

## Authentication and Session State

Authentication and Session State describes the preferred project default: flag a test that hits authenticated or non-default-state endpoints without the project's authenticated session/storage-state setup — it will succeed when run locally with a logged-in session and fail in CI, which is a flakiness pattern.

**Guidelines:**

- SHOULD flag a test that hits authenticated or non-default-state endpoints without the project's authenticated session/storage-state setup — it will succeed when run locally with a logged-in session and fail in CI, which is a flakiness pattern.
- SHOULD flag a test that mutates shared state (e.g., creates a record, updates a field) without a corresponding teardown/cleanup hook — a repeated run will see the mutation and behave differently.

## Network and External Dependencies

Network and External Dependencies describes the preferred project default: flag a test that depends on a live external URL without a route mock or fixture — external availability flakes the test.

**Guidelines:**

- SHOULD flag a test that depends on a live external URL without a route mock or fixture — external availability flakes the test.
- SHOULD flag a test that asserts on clock-derived UI (e.g., "5 minutes ago") without freezing the clock — time-dependent assertions are inherently flaky across repeated runs.
