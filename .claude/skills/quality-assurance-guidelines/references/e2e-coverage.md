# E2E Coverage

Apply these rules to verify the change has the right e2e coverage. The project relies on {{E2E_TEST_FRAMEWORK}} e2e tests as the **primary** verification mechanism per [development-guidelines › verification](../../development-guidelines/references/verification.md).

## Coverage Floor

A new route or surface with no test is a hole in the project's primary verification mechanism — nothing re-checks it after the next change.

**Guidelines:**

- MUST flag a Critical when the diff adds a new route or top-level entry point without a co-located test file in the test directory ({{TEST_DIR}}).
- MUST flag a Major when the diff adds a new visually distinct surface to an existing route without a new test case (or sub-step) covering it.
- MUST flag a Major when the diff adds a new user-facing feature (a new interactive element, a new server action, a new endpoint) without an e2e assertion that exercises the user-observable outcome.
- SHOULD NOT demand unit tests for pure logic unless the logic is complex enough that e2e would not adequately exercise edge cases — the project explicitly de-prioritizes unit tests per [development-guidelines › verification](../../development-guidelines/references/verification.md).

## Test-ID Hooks

Because the suite locates elements only by stable test id — never by text — an element that ships without one is invisible to every future test.

**Guidelines:**

- MUST flag a Major when the diff introduces a new visually distinct element (a new section, a new button, a new image, a new list) without a stable test id attribute. The e2e suite cannot target it otherwise.
- MUST flag a Critical when the diff **removes** a test id that an existing e2e test references. Cross-check by searching the test directory.
- MUST flag any use of text-content matching in a new or modified test where the project rule is stable-test-id locators only, per [e2e-testing-guidelines › conventions](../../e2e-testing-guidelines/references/conventions.md).
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
- MUST flag a new route-specific test file placed outside the test directory ({{TEST_DIR}}) layout the project uses for route tests.
- MUST flag a test body that does not group each action into discrete steps per [e2e-testing-guidelines › structure](../../e2e-testing-guidelines/references/structure.md).
- MUST flag a chained-locator chain that re-roots at the page level mid-test instead of narrowing from a previously captured locator — defeats the readability of the nesting pattern.

## Scenario Coverage

<!-- INIT:OPTIONAL key=SCENARIO_COVERAGE — keep if the project adopts journey-catalog e2e coverage OR delete this section (with the marked sites in e2e-testing-guidelines and this skill's SKILL.md); see the INIT.md Step-4 bullet. -->
*If this project does not adopt scenario coverage, delete this section during INIT.*

Scenario coverage tracks which real user journeys the e2e suite **asserts**, via a human-authored journey catalog and per-test scenario tags — not e2e line coverage. Its denominator is the catalog itself, so review guards the catalog's completeness as much as the tests. See [e2e-testing-guidelines › scenario-coverage](../../e2e-testing-guidelines/references/scenario-coverage.md) for the mechanism.

**Guidelines:**

- MUST require scenario-coverage evidence when a change adds or alters a user-facing journey: the overall and per-priority `covered/total` from the project's coverage command, plus any newly surfaced gaps.
- MUST flag a Major when a change adds a new user-facing journey without a corresponding catalog row — an incomplete catalog inflates the percentage.
- MUST treat a new `must`-priority scenario as a blocker until a passing tagged test asserts it; `should` / `may` gaps are reported, not blocking.
- MUST flag a stale or mistyped scenario tag, a facet tag that disagrees with the catalog, and a scenario tag on a test that merely passes *through* the journey without asserting its outcome — the tag belongs on the asserting test.
- SHOULD note surfaced `should` / `may` gaps as follow-up work rather than silently expanding the change's scope to close them.

## Test Helpers

Inline setup duplicated across tests drifts out of sync as the resource changes; a shared helper keeps every test on the same, current path.

**Guidelines:**

- MUST flag a setup or API call made inline in a test body when an existing shared helper exists for that resource. Use the helper.
- MUST flag a new helper that does not live in the project's shared test-helper location or does not follow the helper signature/conventions per [e2e-testing-guidelines › conventions](../../e2e-testing-guidelines/references/conventions.md).
- MUST flag a test that calls auth-requiring helpers without the project's authenticated session/storage-state setup when the resource requires authentication (anything that hits authenticated or non-default-state endpoints).
