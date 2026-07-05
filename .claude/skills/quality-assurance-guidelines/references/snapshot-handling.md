# Snapshot Handling

Apply these rules to verify visual snapshot changes are intentional and adequately reviewed.

## Snapshot Path Awareness

The project's Playwright config typically writes snapshots to a path that includes a **platform-specific** segment, which means snapshots are **OS-specific**. The reviewer MUST be aware:

- A local snapshot update (e.g., the framework's update-snapshots flag) updates only the local platform's snapshots in the diff, not the snapshots for the platform CI runs on.
- If CI regenerates snapshots and opens an automated snapshot change (CI snapshot automation, if any), that automation still needs review for visual intent.

**Guidelines:**

- MUST treat a local-platform snapshot update as incomplete evidence for the snapshots used by the CI platform.

## When Snapshots Are Regenerated

A raw snapshot diff can't tell a reviewer whether the pixels changed on purpose; the written justification is the only thing separating an intended restyle from a regression.

**Guidelines:**

- MUST flag a snapshot file change that lacks an accompanying explanation in the PR description, commit message, or review thread. The author MUST justify what visually changed and why.
- MUST flag a snapshot change paired with a non-visual code change (e.g., a refactor of a server-side helper) — it indicates either an unintentional regression or a hidden behavioral change.
- MUST flag a snapshot **deletion** that is not paired with a removed or renamed test. Silent deletion hides regressions.
- SHOULD ask the author to attach the screenshot diff or describe the visible change concretely (e.g., "header padding increased by 8px because the cover image now has rounded corners").

## When Snapshots Should Have Been Regenerated But Weren't

When the render visibly changes but no snapshot moves, the component's visual contract silently went unverified.

**Guidelines:**

- MUST flag a Critical when the diff visibly changes the rendered output of a component covered by a snapshot test (e.g., a new element added to a header component) but no snapshot file changed. Either the test does not cover the affected route, or the author skipped the regeneration step.
- SHOULD ask the author to regenerate snapshots locally (the framework's update-snapshots flag) and re-push.

## Cross-Platform Drift

Font-hinting and anti-aliasing noise between platforms is expected; the risk is a genuine layout bug hiding inside that noise.

**Guidelines:**

- MUST flag when one platform's snapshot differs from another platform's snapshot in non-trivial ways (font hinting, anti-aliasing) — these are unavoidable, but if a snapshot diff includes layout-level changes, that is a real bug, not OS drift.
- MAY recommend the author rely on CI snapshot automation (if any) for the CI-platform snapshot, while updating the local-platform snapshot locally.

## Snapshot Scope

A full-page snapshot re-fails on every unrelated visual change nearby, so it generates review churn without pinning down the contract it was meant to guard.

**Guidelines:**

- SHOULD flag a full-page screenshot assertion when a narrower locator (e.g., the changed component's root) would isolate the visual contract — broad screenshots churn on every unrelated visual change.
- SHOULD flag a snapshot taken without first awaiting all relevant async/loading boundaries to settle (e.g., snapshotting before deferred content finishes loading). The placeholder state and loaded state are different visual contracts and should be snapshotted separately if both matter.
