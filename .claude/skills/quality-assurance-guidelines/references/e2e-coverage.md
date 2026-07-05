# E2E Coverage

Apply these rules to verify the change has the right e2e coverage. The project relies on Playwright e2e tests as the **primary** verification mechanism per [development-guidelines › verification](../../development-guidelines/references/verification.md).

## Coverage Floor

A new route or surface with no test is a hole in the project's primary verification mechanism — nothing re-checks it after the next change.

**Guidelines:**

- MUST flag a Critical when the diff adds a new route or top-level entry point without a co-located test file in the test directory (e2e/).
- MUST flag a Major when the diff adds a new visually distinct surface to an existing route without a new test case (or sub-step) covering it.
- MUST flag a Major when the diff adds a new user-facing feature (a new interactive element, a new server action, a new endpoint) without an e2e assertion that exercises the user-observable outcome.
- SHOULD NOT demand unit tests for pure logic unless the logic is complex enough that e2e would not adequately exercise edge cases — the project explicitly de-prioritizes unit tests per [development-guidelines › verification](../../development-guidelines/references/verification.md).

## Test-ID Hooks

Because the suite locates elements primarily by stable test id (with role and copy as narrow fallbacks per [e2e-testing-guidelines › conventions](../../e2e-testing-guidelines/references/conventions.md)), an element that ships without a stable hook is invisible to most future tests.

**Guidelines:**

- MUST flag a Major when the diff introduces a new visually distinct element (a new section, a new button, a new image, a new list) without a stable test id attribute. The e2e suite cannot target it otherwise.
- MUST flag a Critical when the diff **removes** a test id that an existing e2e test references. Cross-check by searching the test directory.
- MUST flag any locator in a new or modified test that violates the locator fallback hierarchy of [e2e-testing-guidelines › conventions](../../e2e-testing-guidelines/references/conventions.md) — e.g., text matching where the assertion is not about the copy itself.
- MUST flag a test id value that does not follow the project's required casing convention.
- SHOULD flag a test id value chosen to be globally unique (e.g., `"record-header-title"`) instead of scope-relative (`"title"`) when the project chains locators by nesting, per the project's testable-component conventions, if defined.

## Loading State Coverage

The loading half of a split component is a distinct user-visible state; without a way to target its placeholder, that state ships unverified.

**Guidelines:**

- SHOULD flag a new component using a loading/loaded split pattern that lacks a corresponding loading-state test id propagation in its orchestrator — without it, e2e cannot assert the placeholder is visible.
- MAY suggest adding a sub-step that asserts the loading placeholder is visible before the loaded state appears, when the loading state is user-visible.

## Test File Conventions

Consistent names and locations are what let the runner discover route tests and what let the next reader find them.

**Guidelines:**

- MUST flag a new test file that does not follow the project's test-file naming convention.
- MUST flag a new route-specific test file placed outside the test directory (e2e/) layout the project uses for route tests.
- MUST flag a multi-phase test body that does not group its phases into discrete steps per [e2e-testing-guidelines › structure](../../e2e-testing-guidelines/references/structure.md) — short atomic tests may omit steps.
- MUST flag a chained-locator chain that re-roots at the page level mid-test instead of narrowing from a previously captured locator — defeats the readability of the nesting pattern.

## Test Helpers

Inline setup duplicated across tests drifts out of sync as the resource changes; a shared helper keeps every test on the same, current path.

**Guidelines:**

- MUST flag a setup or API call made inline in a test body when an existing shared helper exists for that resource. Use the helper.
- MUST flag a new helper that does not live in the project's shared test-helper location or does not follow the helper signature/conventions per [e2e-testing-guidelines › conventions](../../e2e-testing-guidelines/references/conventions.md).
