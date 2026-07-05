# Flakiness Tolerance

Apply these rules to verify the change does not introduce or paper over test flakiness. When the project's Playwright config is set so flakiness fails the suite (e.g., repeating each test and failing on flaky results rather than silently retrying), an intermittent test is a failure, not a warning.

## Flakiness Workarounds to Reject

Each of these hides a real race instead of fixing it, so the nondeterminism ships and resurfaces later in CI.

**Guidelines:**

- MUST flag a Critical when a new or modified test contains:
  - a fixed sleep (an arbitrary timeout/wait of N milliseconds) — fixed sleeps are an anti-pattern. Use the framework's auto-waiting assertions, response/load-state waits, or visibility expectations instead.
  - a `try`/`catch` around an assertion to "make the test pass when it sometimes fails".
  - a skip/fixme marker added to suppress an intermittent failure rather than to skip a known-broken test with a tracked issue.
  - a retry loop wrapping an assertion.
- MUST flag a Critical when the diff modifies the Playwright config to weaken anti-flake settings (repeat-each, fail-on-flaky, forbid-focused-tests) or to add retries. Defer the change to the human owner per [escalation.md](../../code-review-guideline/references/escalation.md).

## Root-Cause Investigation

Retargeting the assertion only moves the flake out of sight; the underlying race is still live and will fire again under different timing.

**Guidelines:**

- MUST flag when a flake is "fixed" by changing the assertion target rather than fixing the underlying race (e.g., loosening an exact-text assertion to a partial-text assertion).
- SHOULD ask the author to identify the specific race (e.g., "did the response arrive before the assertion ran?", "was a loading boundary still pending?") in the PR description.

## Focused and Skipped Tests

A stray focused marker hard-fails CI, and a silent skip quietly shrinks the suite until no one remembers what stopped running.

**Guidelines:**

- MUST flag a Critical for any committed focused-test marker (a test/suite/step marked to run exclusively) — CI's forbid-focused-tests setting will fail the build.
- MUST flag a Major for any committed skip/fixme marker without a tracked-issue comment explaining what's skipped, why, and when it's expected to be re-enabled.

## Authentication and Session State

State that a test assumes but never sets up — a logged-in session, a clean fixture — is exactly the state that differs between a developer's machine and CI, or between the first run and the next.

**Guidelines:**

- SHOULD flag a test that hits authenticated or non-default-state endpoints without the project's authenticated session/storage-state setup — it will succeed when run locally with a logged-in session and fail in CI, which is a flakiness pattern.
- SHOULD flag a test that mutates shared state (e.g., creates a record, updates a field) without a corresponding teardown/cleanup hook — a repeated run will see the mutation and behave differently.

## Network and External Dependencies

Anything the test doesn't control — a remote host's availability, the wall clock — turns a pass into a coin flip across repeated runs.

**Guidelines:**

- SHOULD flag a test that depends on a live external URL without a route mock or fixture — external availability flakes the test.
- SHOULD flag a test that asserts on clock-derived UI (e.g., "5 minutes ago") without freezing the clock — time-dependent assertions are inherently flaky across repeated runs.
