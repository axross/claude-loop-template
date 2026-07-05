# Severity Classification

Apply these rules to label every finding before reporting it. Severity drives both the final verdict and the order findings appear in the report.

## Severity Definitions

Four severities order every finding and drive the verdict. Each pairs a merge impact with the class of defect that earns it.

- **Critical** — MUST block merge. A defect that will cause data loss, a security breach, a production outage, a broken `main` branch (lint/build/test failure), or a violation of a developer-facing MUST rule that any user hits on the first request.
- **Major** — SHOULD block merge unless deferred deliberately. A defect that degrades correctness, performance, or reliability in a way users notice, or violates a developer-facing SHOULD rule with no documented justification.
- **Minor** — Non-blocking but worth addressing. Readability, naming, or small refactor opportunities; missing-but-non-critical test coverage; non-load-bearing convention drift.
- **Nit** — Optional polish. Style preferences, alternative phrasings, micro-optimizations with no measurable benefit.

**Guidelines:**

- MUST classify every finding as exactly one of the four severities above.
- MUST treat Critical as merge-blocking, and Major as merge-blocking unless deferred deliberately with a stated reason.

## Required Severity Floors

These categories use fixed minimum severities, regardless of perceived "smallness":

| Category | Minimum severity |
|---|---|
| Hardcoded secret, token, or credential committed to the repo | Critical |
| Missing or incorrect access control on a non-public data-layer field or record | Critical |
| Unsanitized user input flowing into a data-layer query, request handler, or content-rendering pipeline | Critical |
| New request handler / server-side action that reads or mutates data without verifying the request's authenticated identity | Critical |
| Lint error introduced ({{LINT_CMD}} would fail) | Critical |
| New test failure introduced, or removal of an existing assertion that covered changed behavior | Critical |
| Missing `await` on a Promise returned from a data-layer or network call | Critical |
| Importing a server-only module from a client-side module (or otherwise crossing the server/client boundary unsafely) | Critical |
| New dependency added without justification per [development-guidelines › change-management](../../development-guidelines/references/change-management.md) | Major |
| Snapshot regenerated without explanation when the observable change was intentional but undocumented | Major |
| Data fetched on every request without caching when the data is cacheable | Major |
| Client-side code pulled into a path that was previously server-only, materially increasing client bundle weight, with no interactivity justification | Major |
| Missing stable test hook (e.g., a test id) on a new element that an e2e test would target | Major |
| `try`/`catch` placed in a nested helper instead of the root call site | Major |
| A swallowed/logged-only error used instead of reporting it to the error tracker, where the project requires reporting | Major |
| Magic value introduced where a shared constant or design token already exists | Minor |
| Inconsistent file/identifier naming (e.g., a file that breaks the directory's established naming convention) | Minor |

**Guidelines:**

- MUST classify each listed category at no lower than its minimum severity.
- MAY raise severity above the floor when the concrete impact is worse than the table's minimum.
<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — keep the next bullet if the project adopts the posted-review channel (REVIEW.md) OR delete it; see the INIT.md Step-4 bullet. -->
- MUST NOT surface CI-enforced rows — any category the project's posted-review policy excludes as CI-enforced, such as the lint-error row — in a **posted** PR review; the policy's do-not-report list excludes them (see the [Repository Review Policy Overlay](../SKILL.md#repository-review-policy-overlay)). The severity floors above govern only internal self-review triage.

## Verdict Mapping

The reviewer MUST emit one of these three verdicts in the report Summary, derived from the severity counts:

- **Request Changes** — at least one Critical finding, OR more than two Major findings.
- **Approve with Nits** — zero Critical, at most two Major, and at least one Minor or Nit.
- **Approve** — zero Critical, zero Major, zero Minor, and at most a few Nits.

**Guidelines:**

- MUST derive the review verdict from the severity counts exactly as mapped above.
<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — keep the next bullet if the project adopts the posted-review channel (REVIEW.md) OR delete it; see the INIT.md Step-4 bullet. -->
- SHOULD, for a **posted** PR review, replace this three-verdict output with the posted-review policy's one-line Important/Nit tally per the [Repository Review Policy Overlay](../SKILL.md#repository-review-policy-overlay).

## When in Doubt

The two directions of misclassification are not symmetric: an over-labeled finding costs a little of the author's attention, while an under-labeled one can ship a production incident.

**Guidelines:**

- SHOULD escalate uncertain severity upward, not downward. A finding labeled Major that turns out to be Minor wastes the author's attention; a Critical mislabeled as Minor causes a production incident.
- MUST state the assumption that drove the severity choice when uncertain (e.g., "Critical because I'm assuming this route is public; downgrade to Major if it's behind admin auth").
