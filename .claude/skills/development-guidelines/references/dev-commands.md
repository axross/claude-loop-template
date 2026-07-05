# Dev Commands

Apply this reference when choosing which project command to run or when updating the command surface in the project's manifest. The project pins a minimum runtime/toolchain version in its manifest; respect that pin when running or upgrading.

## Application Commands

These commands run the application locally or as a production build.

| Command | Purpose |
| ------- | ------- |
| `{{DEV_CMD}}` | Starts the development server (commonly at a local URL such as `http://localhost:3000`). |
| `{{BUILD_CMD}}` | Builds the production bundle. |
| `{{START_CMD}}` | Starts the production build produced by `{{BUILD_CMD}}`. |

**Guidelines:**

- MUST use `{{DEV_CMD}}` for manual verification of UI, route, metadata, and data-driven output changes.
- MUST run `{{BUILD_CMD}}`, when the project has a build step, after changes affect routes, metadata, data-layer config, runtime config, dependencies, or public type signatures.
- SHOULD use `{{BUILD_CMD}}` followed by `{{START_CMD}}` when verifying production-only caching, asset, or compiler behavior.

## Quality Commands

These commands enforce formatting, linting, and end-to-end behavior.

| Command | Purpose |
| ------- | ------- |
| `{{FORMAT_CMD}}` | Formats the code and documentation with {{FORMATTER}}. |
| `{{LINT_CMD}}` | Runs {{LINTER}}, including formatting and lint rules. |
| `{{TYPECHECK_CMD}}` | Type-checks the project. <!-- INIT:OPTIONAL key=TYPED_LANGUAGE — fill the token OR delete this row for an untyped language. --> |
| `{{UNIT_TEST_CMD}}` | Runs the {{UNIT_TEST_FRAMEWORK}} unit suite. <!-- INIT:OPTIONAL key=UNIT_TESTS — fill the tokens OR delete this row if the project has no unit suite. --> |
| `{{E2E_TEST_CMD}}` | Runs the {{E2E_TEST_FRAMEWORK}} end-to-end suite. |
| `{{E2E_TEST_CMD}} -- --update-snapshots` | Regenerates end-to-end snapshots for the local platform (flag syntax depends on {{E2E_TEST_FRAMEWORK}}). |

**Guidelines:**

- MUST run `{{FORMAT_CMD}}` and `{{LINT_CMD}}` after code or documentation edits.
- MUST run `{{UNIT_TEST_CMD}}`, when the project has a unit suite, after a change affects code it covers.
- MUST run `{{E2E_TEST_CMD}}`, when the project has an e2e suite, after a change affects a UI output surface or e2e coverage.
- MUST NOT use snapshot updates to hide unexpected visual regressions; pair each snapshot update with a reason the visual change is intentional.
- SHOULD report skipped quality commands, including the reason and residual risk, before completion.

## Data-Layer Commands

<!-- INIT:OPTIONAL key=DATA_LAYER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no {{CMS_OR_DATA_LAYER}} or no migration workflow, delete this section during INIT.*

Data-layer commands alter or inspect the schema migration state. The target store is selected by environment variables. Replace the command names below with the project's actual migration commands during INIT.

| Example command (rename during INIT) | Purpose |
| ------------------------------------- | ------- |
| `{{PACKAGE_MANAGER}} run <migrate-status>` | Shows the current migration status. |
| `{{PACKAGE_MANAGER}} run <migrate-create>` | Creates a new migration entry after schema changes. |
| `{{PACKAGE_MANAGER}} run <migrate-apply>` | Applies pending migrations to the selected store. |

**Guidelines:**

- MUST create a migration immediately after changing the data-layer schema.
- MUST apply pending migrations locally before testing schema changes.
- MUST NOT edit an already-applied migration file; create a new migration instead.
- SHOULD check migration status when investigating migration drift.
