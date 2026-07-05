# Verification

Apply these guidelines to confirm that any change produces the correct application output before considering the task done.

## Identifying Affected Output Surfaces

Use this table to determine which output surfaces a change puts at risk. Adapt the "Changed area" entries to the project's actual file layout during INIT.

| Changed area | Output surface at risk |
|---|---|
| Page/view files and the components they render | Rendered pages/views |
| Data-access functions or data-fetching logic | Rendered output, content fidelity |
| Route/navigation definitions and error/not-found handlers | Routing and navigation |
| Metadata generation, sitemap, robots, and social-preview assets | Metadata and discoverability |
| Content-processing pipeline (if any) | Content fidelity |
| {{ERROR_TRACKER}} config and {{LOGGER}} setup | Observability <!-- INIT:OPTIONAL key=ERROR_TRACKER_OR_LOGGER — fill the tokens OR trim/delete this row for the tool(s) the project lacks. --> |

- Changes that touch none of the above — type definitions, data-layer config, migration files, or utilities with no UI call path — do not put any output surface at risk.

**Guidelines:**

- MUST map changed files to their at-risk output surfaces before choosing the verification path.

## Manual Verification

Manual verification is the first line of confirmation. Run it before the automated suite.

**Guidelines:**

- MUST start the development server (`{{DEV_CMD}}`) and navigate to the affected route/view after every change that touches an output surface.
- MUST verify any non-default content state the data layer supports (e.g., a draft/preview state, if the project has one) in addition to the default state, when the surface displays data-layer-managed content.
- MUST verify the not-found / error state renders when the change affects routing or error handling (e.g., navigate to a non-existent record).

## Automated Verification

The e2e suite drives the real application through the full render pipeline, so it is the evidence that an output surface still behaves after a change.

**Guidelines:**

- MUST run the full end-to-end test suite, when the project has one, after any change that touches an output surface:
  ```bash
  {{E2E_TEST_CMD}}
  ```
- MUST follow the e2e authoring and coverage rules owned by [e2e-testing-guidelines](../../e2e-testing-guidelines/SKILL.md) and [quality-assurance-guidelines › e2e-coverage](../../quality-assurance-guidelines/references/e2e-coverage.md) — new-route/feature coverage, stable test-targetable identifiers, and co-location under `{{TEST_DIR}}` — rather than restating them here.

## E2E Tests vs Unit Tests

This project relies on end-to-end tests as the primary verification mechanism. E2E tests run against the real application with a real data store and cover the full rendering pipeline from data fetching through to the rendered output.

**Guidelines:**

- SHOULD NOT write unit tests as a substitute for E2E coverage. Unit tests cannot verify that the rendered output is correct.
- MAY write unit tests for pure logic (e.g., utility functions, data transformations) where the logic is complex enough that E2E tests alone would not adequately exercise edge cases.

## Flakiness

The end-to-end suite should be configured to detect non-deterministic tests (for example, by repeating each test and failing the run when results are inconsistent) rather than tolerating intermittent passes.

**Guidelines:**

- MUST investigate the root cause of flaky failures — timing issues, race conditions, or test isolation problems — rather than re-running the suite and hoping for green.
- MUST NOT weaken or disable the suite's flakiness-detection settings to work around flakiness.

## Responding to Failures

A red test is usually reporting a real regression; muting it ships the defect while destroying the signal that would have caught the next one.

- Snapshots are typically platform-specific; regenerating them on one platform does not update the snapshots used on others (such as the CI runner). See [quality-assurance-guidelines › snapshot-handling](../../quality-assurance-guidelines/references/snapshot-handling.md) for the full snapshot-review discipline.

**Guidelines:**

- MUST NOT delete test cases or weaken assertions to make a failure pass.
- SHOULD update snapshot expectations only when the output change is intentional and the new output satisfies the relevant feature requirement. Use the snapshot-update command (see [dev-commands.md](./dev-commands.md)) to regenerate them.
- SHOULD surface pre-existing failures to the user rather than working around them.

## CI Pipeline

The CI pipeline runs the full test suite automatically before deployment (a typical shape is `lint → e2e-tests → deployment`).

- CI should run E2E tests against a locally started instance of the app (the app is launched within the CI runner), not against a live deployed URL, unless a base-URL override is explicitly configured.
- If CI regenerates snapshots and opens a PR for any differences, those snapshot changes still require review — an auto-created snapshot PR does not mean the visual change is acceptable.

**Guidelines:**

- MUST treat CI-created snapshot PRs as review-required evidence, not automatic approval of the visual change.
