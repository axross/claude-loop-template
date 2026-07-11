---
name: e2e-testing-guidelines
description: Conventions for {{E2E_TEST_FRAMEWORK}} end-to-end tests. Covers the test directory layout and file naming, structured test/step naming, stable test-id chained/scoped locators with a role-then-copy fallback hierarchy (text matching only when asserting the copy itself), framework-native auto-waiting assertions over manual DOM reads, polling/wait-for-condition helpers (never fixed sleeps) for async settling such as scroll-driven or animation transitions, authenticated state reuse and reusable API/setup helper conventions, the snapshot update flow, the optional scenario-coverage journey catalog with scenario/facet tagging, and commands for running tests against dev, local production, and a deployed environment.
when_to_use: Use whenever writing, reviewing, refactoring, or running end-to-end tests, or whenever a change requires verification via the e2e suite — even when the user only mentions e2e tests, snapshots, test IDs, polling/waiting, focus assertions, or a failing test run.
user-invocable: false
---

# E2E Testing Guidelines

Apply these rules when running, writing or reviewing {{E2E_TEST_FRAMEWORK}} end-to-end tests in this project.

## End-to-End Test Commands

See [commands.md](./references/commands.md) for:

- Running end-to-end tests

## End-to-End Test Structure

See [structure.md](./references/structure.md) for:

- The route-tree directory layout (default) and the purpose-based layout for single-route or journey-centric apps (smoke / happy-path / regressions / feature-area)
- Test-file naming
- Test-case naming and step granularity (multi-phase scenarios use steps; short atomic tests omit them)

## End-to-End Test Conventions

See [conventions.md](./references/conventions.md) for:

- The locator fallback hierarchy (test IDs first, roles for accessible controls, text only for copy assertions)
- Framework-native auto-waiting assertions and polling/wait-for-condition helpers
- Setup/cleanup hooks
- API-call and authenticated-state helper conventions (INIT-optional; for projects with a backend/API surface)

## E2E Scenario Coverage

<!-- INIT:OPTIONAL key=SCENARIO_COVERAGE — keep if the project adopts journey-catalog e2e coverage OR delete this section, ./references/scenario-coverage.md, and the marked "Scenario Coverage" sites in quality-assurance-guidelines; see the INIT.md Step-4 bullet. -->
*If this project does not adopt scenario coverage, delete this section during INIT.*

See [scenario-coverage.md](./references/scenario-coverage.md) for:

- The scenario-coverage metric (user journeys asserted, **not** e2e line coverage) and why line coverage was rejected
- The human-authored journey catalog and the scenario join tag plus area/priority/smoke facet tags
- The phased gate (`must`-priority journeys at 100% first) and the coverage reporter built during INIT
