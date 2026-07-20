# Preview Environments

<!-- INIT:OPTIONAL key=PREVIEW_ENVIRONMENTS — keep & adapt when the project has (or adds) per-PR preview environments (INIT Steps 1d, 4, 5) OR delete this file and every inbound link. -->
*If this project skipped per-PR preview environments, delete this file during INIT. When kept, replace the illustrative tool names below with the project's real hosting/distribution stack, and author the concrete workflow per INIT Step 5.*

Apply these guidelines when creating, changing, configuring, or reasoning about the per-pull-request preview-environment pipeline. The pipeline gives every pull request a **stable, reviewable environment**, so a human can check a change's actual look and behavior before merge:

- **Web client / server projects** — a live deployment behind a **stable per-PR URL** that stays constant across pushes and always serves the newest build.
- **Mobile apps** — a **signed, installable preview build** distributed through a tester channel, with a stable install link surfaced on the pull request.

The concrete workflow is authored during INIT for the project's actual stack (see the two shapes below); these rules govern the pipeline regardless of which platform hosts it. The data-exposure boundaries of a preview (what data may reach it, and what must never) are owned by the project's application-security requirements (privacy-and-exposure rules); consult them before changing what a preview receives or serves.

## Core Pipeline Rules (All Platforms)

```text
pull_request (opened / synchronize / reopened)   [or a manual dispatch, for mobile]
        │
        ▼
  preflight ── required secrets/vars absent? ──▶ skip (no-op, green)
        │ present
        ▼
  deploy / build
   1. provision this PR's isolated backing resources (fresh, from fixtures)
   2. deploy the preview build, injecting only this PR's credentials
   3. re-point the PR's STABLE link (URL alias / distribution link) at it
   4. post a NEW comment: the stable link + the deployed short SHA

pull_request (closed) ──▶ teardown: destroy the PR's resources;
                          post a distinct teardown comment
```

**Guidelines:**

- MUST surface a **stable per-PR link** — one link per pull request for its whole life, re-pointed at the newest build on each deploy — never a per-commit link that changes on every push. A reviewer can bookmark one link across all review rounds.
- MUST make the stable-link step **fail loud**: if re-pointing the stable link fails, the job fails rather than silently falling back to a per-commit link — surfacing a stable link is the point of the pipeline.
- MUST post a **new** comment on each successful deploy (never edit a prior sticky comment), recording the deployed short commit SHA alongside the stable link, and post a **distinct** teardown comment on close. Editing a comment does not re-surface it in the PR timeline; appending gives a visible chronological deploy history whose entries all point at the same stable link.
- MUST gate the pipeline on a **preflight** configuration check: when any required secret/var is absent (an unconfigured repository, a forked pull request — forks never receive secrets), downstream jobs skip cleanly and the run stays green. Merging the workflow changes nothing until the maintainer completes the one-time account setup.
- MUST provision any backing data a preview needs (database, storage, seed content) as **fresh, per-PR-isolated resources seeded from repository fixtures** — never copied or branched from production — and inject **only that PR's credentials** into the preview; production credentials stay scoped to the production environment and never reach a preview (see the project's application-security requirements, privacy-and-exposure rules).
- MUST keep provisioning **idempotent across `synchronize` events**: re-running creation tolerates already-existing resources (reusing them, so state created in the preview survives re-deploys) and re-applying schema/setup is a no-op once applied.
- MUST destroy the PR's provisioned resources on close (**teardown**), tolerating already-absent resources so re-runs and manual cleanups do not fail. (A pipeline that provisions no per-PR backing resources — a distributed mobile build, for example — has nothing to destroy and needs no teardown job or teardown comment.)
- MUST document the required secrets/vars — the maintainer's one-time hosting/distribution account setup — in the project README, and verify the pipeline end-to-end on a throwaway PR after that setup (deploy comment, stable link resolving to the latest build, a second push appending a second comment, teardown on close).
- SHOULD group runs per pull request with a concurrency group and `cancel-in-progress`, so a newer commit supersedes an in-flight deploy.
- SHOULD grant `issues: write` to any job whose scripted step posts a PR comment — PR comments post through the Issues API, and an explicit `permissions:` block defaults every unlisted scope to `none`, so omitting it fails the job.

## Web Client / Server Shape: Stable Per-PR URL

The hosting platform's deploy command typically returns a **per-commit** URL. The pipeline deploys, then re-points a deterministic per-PR alias at that fresh deployment, and comments the alias — so the URL a reviewer sees never changes while always serving the newest build.

```yaml
# Sketch (adapt to the project's hosting platform during INIT):
- name: Deploy Preview            # per-commit deployment; capture its URL
  run: url="$(<deploy command>)" && echo "url=${url}" >> "${GITHUB_OUTPUT}"
- name: Assign Stable Preview Alias
  # Deterministic label, e.g. <prefix>-pr-<n>, where <prefix> defaults to the
  # sanitized repository name with an optional override variable. Fail loud.
  run: <alias command> "${DEPLOYMENT_URL}" "<prefix>-pr-${PR_NUMBER}.<host>"
- name: Comment Preview URL       # a NEW comment: stable URL + short SHA
```

**Guidelines:**

- MUST derive the alias deterministically from the PR number (e.g. `<prefix>-pr-<n>`), matching any per-PR naming already used for the PR's backing resources, and keep the label valid for the host (commonly lowercase `[a-z0-9-]`, length-capped).
- SHOULD default the alias prefix to the sanitized repository name with an **optional** override variable — optional, so the override is never part of the preflight required-config gate.
- MUST NOT rely on the host's git-integration-generated branch URLs when the pipeline deploys via bare CLI with per-deploy injected credentials — those URLs are only generated for git-connected projects; an explicit alias command is the reliable mechanism.

## Mobile App Shape: Stable Install Link

A mobile preview is an **installable artifact**, not a URL: a signed build distributed through a tester channel (e.g. Firebase App Distribution, TestFlight), whose distribution link is surfaced on the pull request so a human can verify the change on a physical device.

```yaml
# Sketch (adapt to the project's build/distribution stack during INIT):
on:
  workflow_dispatch:              # dispatched when a PR looks ready for merge
    inputs:
      pr: { description: "PR number to comment the install link on" }
jobs:
  build:    # signed release-mode build of the PR's branch (cache the expensive
            # native-project generation across runs where the toolchain allows)
  distribute: # upload to the tester channel; capture the install/testing link
  report:   # write the link to the run summary; given a `pr` input, also post
            # it as a NEW PR comment
```

**Guidelines:**

- MUST distribute a **signed, release-mode** build through the tester channel and surface its install link both in the run summary and — when a PR number is provided — as a fresh PR comment, so the link is reachable from the pull request itself.
- SHOULD trigger mobile preview builds by **manual dispatch** (from the Actions UI, CLI, or an agent, against the PR's branch) rather than on every push: signed builds are expensive, and on-device verification is a deliberate human-in-the-loop step when a PR looks ready for merge. A project MAY automate per-push builds later; the stable-link and fresh-comment rules apply the same way.
- MUST NOT make the preview build a merge gate: merges are gated by the merge-checks workflow; on-device sign-off is a manual step before merging, not a required status check.
- SHOULD fail cleanly with a pointer to the missing configuration when the signing/distribution secrets are absent. A dispatched run was explicitly requested by a human, so a loud, well-explained failure is the right inert behavior — the preflight green-skip rule above exists to keep *event-triggered* runs green on unconfigured repositories and forks, which a manual dispatch does not need.
