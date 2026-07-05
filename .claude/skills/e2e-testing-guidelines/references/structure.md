# E2E Test Structure

_Code examples below use Playwright APIs as the concrete shape. Translate them to `{{E2E_TEST_FRAMEWORK}}`'s equivalents during INIT; the structure conventions in the prose are framework-neutral._

## Project Structure

Tests are easiest to find when their location mirrors the surface they cover. The default layout groups suites by route, so a route change points directly at the tests that guard it, while helpers and setup files stay in shared locations every suite can reach.

```
<root>
├── {{TEST_DIR}}/
│   ├── .data/                         # local temporary data
│   ├── helpers/                       # test helpers
│   └── tests/
│       ├── setup.test.ts              # setup test
│       ├── metadata.test.ts           # app-global metadata test
│       ├── routes                     # route/feature-specific tests
│       │   ├── index/
│       │   │   ├── page.test.ts       # visual/functional tests for the route
│       │   │   └── thumbnail.test.ts  # supporting endpoint tests
│       │   └── items/
│       │       ├── ...
│       │       └── id/
│       │           └── ...
│       └── ...
└── ...
```

**Guidelines:**

- MUST place route/feature-specific e2e tests under `{{TEST_DIR}}/tests/routes/`.
- MUST keep reusable e2e helpers under `{{TEST_DIR}}/helpers/`.
- SHOULD keep setup and global metadata tests directly under `{{TEST_DIR}}/tests/` when they are not route/feature-specific.

### Purpose-Based Layout

A route tree adds empty hierarchy when the app has one route or its value lives in cross-route journeys. Purpose-named suites keep the cheapest signal first: smoke proves the app boots and the core loop works, happy-path walks the main journeys end to end, regressions hold named guards for previously shipped bugs, and feature-area suites cover one surface in depth.

```
{{TEST_DIR}}/
└── tests/
    ├── smoke.test.ts          # boots + core loop, the first gate
    ├── happy-path.test.ts     # main journeys end to end
    ├── regressions.test.ts    # named guards for shipped bugs
    └── <feature>.test.ts      # feature-specific suite
```

**Guidelines:**

- SHOULD organize suites by purpose (`smoke`, `happy-path`, `regressions`, `<feature-area>`) instead of by route in single-route or journey-centric apps.
- MUST treat the smoke suite as the first gate: if it fails, deeper suites are not worth running.
- SHOULD guard each previously shipped bug with a named regression test instead of folding the check into an unrelated case.

## Test File Structure

File names are kebab-case with the project's test extension so the framework's test-file matcher picks them up without extra configuration.

**Guidelines:**

- MUST use kebab-case for file names.
- MUST use the project's `.test.ts` (or equivalent) extension for test files.

## Test Case Structure

One behavior per test keeps failures diagnosable, and named steps turn a multi-phase journey's report into a readable narrative. Steps earn their keep only when a test has phases to narrate — wrapping a single arrange → act → assert in one step adds noise, not structure.

**Guidelines:**

- MUST define one test case per behavior.
- MUST name test cases concisely.
- MUST wrap each meaningful action/assertion group of a multi-phase scenario (two or more distinct arrange/act/assert phases) in a step, using the framework's step API, at human-understandable granularity; steps can nest.
- MAY omit steps in a short atomic test (a single arrange → act → assert).
- MUST NOT pad an atomic test with a one-step wrapper just to satisfy step structure.
- MUST name test steps concisely.
