---
name: e2e-testing-guidelines
description: Use this skill whenever writing, reviewing, refactoring, or running {{E2E_TEST_FRAMEWORK}} end-to-end tests in this project, or whenever a change requires verification via the e2e suite. Covers the test directory layout, test-file naming, structured test/step naming, stable test-id chained/scoped locators (never text matching), framework-native auto-waiting assertions over manual DOM reads, polling/wait-for-condition helpers (never fixed sleeps) for async settling such as scroll-driven or animation transitions, authenticated state reuse for API helpers, reusable API/setup helper conventions, the snapshot update flow, and commands for running tests against dev, local production, and a deployed environment. Use even when the user only mentions e2e tests, snapshots, test IDs, polling/waiting, focus assertions, or a failing test run.
---

# E2E Testing Guidelines

Apply these rules when running, writing or reviewing {{E2E_TEST_FRAMEWORK}} end-to-end tests in this project.

## End-to-End Test Commands

See [commands.md](./references/commands.md) for:

- Running end-to-end tests

## End-to-End Test Structure

See [structure.md](./references/structure.md) for:

- Understanding the end-to-end test structure
- Writing end-to-end tests
- Reviewing end-to-end tests
- Refactoring end-to-end tests

## End-to-End Test Conventions

See [conventions.md](./references/conventions.md) for:

- Writing end-to-end tests
- Reviewing end-to-end tests
- Refactoring end-to-end tests
