# Manual Verification Evidence

Apply these rules to verify the author exercised the change in the running app before relying on the e2e suite. Manual verification is the **first line** of confirmation per [development-guidelines › verification](../../development-guidelines/references/verification.md).

## Required Manual Checks

The reviewer MUST ask the author to confirm (in the PR description or the review thread) that the following were checked when the diff touches the listed surface. Rows marked *(optional)* apply only if the project has the corresponding capability.

| Diff touches | Required manual check |
|---|---|
| Any user-facing view, screen, or route-local component | The affected surface was loaded in the running app via `{{DEV_CMD}}` |
| Any data-driven surface that supports non-default content states *(optional)* | The surface was exercised in each non-default content state the data layer supports (e.g., a draft or unpublished state) |
| A live-preview / CMS preview path *(optional)* | The preview path was loaded inside the data layer's preview/admin surface |
| Not-found handling or any routing change | A non-existent identifier was requested and the not-found UI rendered correctly |
| Metadata generation, if the project produces any (e.g., page metadata, sitemap, robots, social-share image) *(optional)* | The metadata response was inspected (e.g., view-source, the generated sitemap/robots endpoint, social-share preview) |
| The content/markup rendering pipeline *(optional)* | A record containing the affected construct was rendered end-to-end |
| Error-tracker / instrumentation config *(optional)* | The app starts without throwing, and a test exception was confirmed to reach the error tracker (or the author confirmed reporting is intentionally disabled in dev) |

**Guidelines:**

- MUST flag a Major when the diff touches a row in the table above and the author has not confirmed the corresponding check.

## Dev-Server Output Inspection

New warnings in the dev log are the app's earliest signal that something regressed or is misconfigured, well before it becomes a visible failure.

**Guidelines:**

- MUST flag a Major when the diff introduces new warning-level log lines that were not in the `{{DEV_CMD}}` output before the change (or removes existing warnings without explanation).
- MUST flag a Critical when the diff causes the running app to throw an uncaught exception during a normal interaction — the error tracker may capture it, but users will see the top-level error UI.
- SHOULD ask the author to include the `{{DEV_CMD}}` output snippet for the affected surface in the PR description when the change adds new data-layer calls or new logging.

## Local Production Build

Dev and production diverge on transforms, caching, and asset handling, so a surface that works under `{{DEV_CMD}}` can still break once built.

**Guidelines:**

- SHOULD ask the author to run `{{BUILD_CMD}}` then `{{START_CMD}}` and reload the affected surface when the diff touches:
  - build/runtime configuration
  - anything affecting compiler/transform output where dev and prod behavior can differ
  - caching behavior that differs between dev and prod
  - asset/image optimization configuration

## What Manual Verification Cannot Replace

A manual pass confirms the change worked once, on one machine; only the e2e suite re-runs that check on every future change in CI.

**Guidelines:**

- MUST NOT accept "I tested it manually" as a substitute for the e2e coverage required by [e2e-coverage.md](./e2e-coverage.md). Manual is the first line; e2e is the second and the one that runs in CI.
- MUST NOT accept "the app didn't error" as a substitute for the lint gate per [lint-and-format-gate.md](./lint-and-format-gate.md). Lint runs separately.
