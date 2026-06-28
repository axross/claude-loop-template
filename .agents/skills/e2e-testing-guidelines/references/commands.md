# E2E Test Commands

Use this reference to choose the {{E2E_TEST_FRAMEWORK}} command that matches the target environment and snapshot task.

## Running E2E Tests

Run:

```bash
{{E2E_TEST_CMD}}
```

**Guidelines:**

- MUST use `{{E2E_TEST_CMD}}` for the default local end-to-end verification run.

## Updating Test Snapshots

Add the framework's snapshot-update flag to the test command:

```bash
{{E2E_TEST_CMD}} -- --update-snapshots
```

**Guidelines:**

- MUST update snapshots only when the visual output change is intentional.
- SHOULD pair snapshot updates with the reason the expected output changed.

## Test Against Local Production Build

Run:

```bash
{{BUILD_CMD}} && {{START_CMD}}
```

And then run the tests in another terminal session:

```bash
{{E2E_TEST_CMD}}
```

**Guidelines:**

- SHOULD use the local production build flow when verifying production-only behavior after `{{BUILD_CMD}}`.
- MUST keep the production server running while the e2e command executes in the second terminal session.

## Test Against a Deployed Environment

Set the framework's base-URL env var to target a deployed environment ({{PROJECT_NAME}}) instead of the local app:

```bash
E2E_BASE_URL=https://example.com {{E2E_TEST_CMD}}
```

**Guidelines:**

- SHOULD set the base-URL env var only when intentionally testing a deployed environment instead of the local app.
