# E2E Test Structure

_Code examples below use Playwright APIs as the concrete shape. Translate them to `{{E2E_TEST_FRAMEWORK}}`'s equivalents during INIT; the structure conventions in the prose are framework-neutral._

## Project Structure

Project Structure shows where {{E2E_TEST_FRAMEWORK}} tests, helpers, setup files, and route/feature-specific suites live in this repository.

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

## Test File Structure

Test File Structure sets the required project default: use kebab-case for file names.

**Guidelines:**

- MUST use kebab-case for file names.
- MUST use the project's `.test.ts` (or equivalent) extension for test files.

## Test Case Structure

Test Case Structure sets the required project default: define one test case per behavior with structured, human-readable naming.

**Guidelines:**

- MUST define one test case per behavior.
- MUST name test cases concisely.
- MUST wrap each action in a step (using the framework's step API) at human-understandable granularity.
- MUST name test steps concisely.
