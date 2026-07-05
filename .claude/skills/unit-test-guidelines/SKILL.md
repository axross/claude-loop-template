---
name: unit-test-guidelines
description: Apply this skill when writing, refactoring, reviewing, or running Vitest unit tests in this project. Covers test framework configuration, explicit test-API imports, colocated test files, describe/case naming and grouping conventions, behavior-focused test design, fixture quality, AHA test abstraction, mocks and fakes, async assertions, snapshot discipline, schema/codec tests, type-only modules, the optional coverage gate (thresholds and ignore pragmas), and when unit tests should yield to integration or e2e coverage.
---

# Unit Test Guidelines

Use this skill for Vitest-based unit tests. Unit tests are valuable when they exercise a small exported contract quickly, independently, and from a caller's point of view. They are harmful when they overfit implementation details or replace higher-confidence integration/e2e coverage.

## Testing Scope

See [testing-scope.md](./references/testing-scope.md) for:

- deciding whether a behavior belongs in unit, integration, or e2e coverage
- keeping pure helper tests small while routing browser, data-layer, and framework behavior to broader tests
- recognizing when a unit test would be lower confidence than an integration or e2e check

## Spec Structure and Naming

See [spec-structure-and-naming.md](./references/spec-structure-and-naming.md) for:

- adding, renaming, regrouping, or reviewing `describe(...)` and test-case blocks
- naming subjects by kind: callables with `()`, UI components in angle brackets, non-callable contracts with no suffix
- writing scenario names that read as clear verification sentences
- grouping repeated conditions or situations without duplicating function names

## Behavior and Implementation Details

See [behavior-and-implementation-details.md](./references/behavior-and-implementation-details.md) for:

- avoiding tests that overfit private helpers, dependency internals, callback mechanics, or call shapes
- keeping assertions focused on exported behavior from a caller's point of view
- deciding when an implementation detail is actually part of the public contract

## Fixtures, Fakes, and AHA

See [fixtures-fakes-and-aha.md](./references/fixtures-fakes-and-aha.md) for:

- creating fixtures, setup helpers, boundary fakes, mocks, spies, or shared constants
- choosing duplication over premature abstraction when test cases need local clarity
- keeping reusable test helpers obvious, narrow, and behavior-oriented

## Assertions, Snapshots, and Side Effects

See [assertions-snapshots-and-side-effects.md](./references/assertions-snapshots-and-side-effects.md) for:

- choosing assertions for values, async errors, side effects, and mock calls
- asserting a branch's distinguishing observable output plus a negative case, not merely that something renders
- deciding when snapshots are appropriate and how to keep them focused
- verifying observable outcomes without relying on incidental implementation details

## Schemas and Types

See [schemas-and-types.md](./references/schemas-and-types.md) for:

- testing schemas, codecs, decoded response shapes, and collection/list response decoding
- handling type-only modules and compile-time contracts
- balancing runtime schema checks with compile-time type expectations

## Review Checklist

See [review-checklist.md](./references/review-checklist.md) for:

- implementation self-review or code review for Vitest unit tests
- checking structure, naming, fixtures, mocks, assertions, and scope
- the optional coverage gate: the project's coverage command, INIT-recorded thresholds, and ignore-pragma discipline
- reporting residual risk when unit tests cannot cover the behavior with enough confidence

## Project Defaults

These defaults are intentionally short. Follow the linked references for examples, edge cases, and review criteria.

**Guidelines:**

- MUST colocate Vitest tests following the project's colocated unit-test file naming convention unless an existing local pattern requires a different location.
- MUST import the test framework's APIs explicitly if Vitest requires it, rather than relying on implicit global-scope symbols.
- MUST use the project's chosen test-case function consistently and not mix it with an alternative spelling within the same project.
- MUST run unit tests through `npm run test:unit` unless investigating a targeted failure.
- MUST run `npm run format` and `npm run lint` after adding or changing unit tests, plus `npm run typecheck` when the project has a type-check step.
- SHOULD prefer integration or e2e tests when confidence depends on framework runtime wiring, the data layer, browser behavior, rendering, routing, or user-facing UI.
