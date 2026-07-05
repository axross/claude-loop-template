---
name: code-review-guideline
description: Apply this skill at the start of EVERY review task, including post-implementation self-review. Covers reviewer-mode reset, diff scoping with `git status`/`git diff`, severity labels, file-line evidence, fix snippets, verification evidence, second-pass re-review after fixes, escalation for high-risk changes, and topic-specific lenses for maintainability, QA, security, performance, observability, and e2e tests. Use for "review", "PR", "audit", "check this change", or self-review prompts.
---

# Code Review Guideline

Apply these rules at the start of every code review, regardless of the change type or domain.

## Reviewer-Mode Reset

Self-review is not independent review, so this project makes it a separate required phase with explicit evidence. After implementation, the reviewer stops editing, rereads the request, inspects the diff, and reviews the produced change as if another author wrote it.

**Guidelines:**

- MUST perform a reviewer-mode reset before post-implementation self-review.
- MUST inspect `git status` and the relevant `git diff` before reading surrounding files.
- MUST judge only the diff and affected behavior, not the implementation intent.
- MUST fix Critical or Major findings in a later implementation phase, then perform a second-pass re-review.
- MUST report verification evidence or skipped verification before completion.
- SHOULD escalate high-risk changes per [escalation.md](./references/escalation.md) instead of calling them merge-ready based on self-review alone.

## Review Scoping

See [scoping.md](./references/scoping.md) for:

- Discovering what changed via `git diff` / `git status` / `gh pr diff`
- Distinguishing in-scope (the diff) from out-of-scope (pre-existing)
- Reading surrounding code to understand caller/callee context
- Handling untracked files and partial diffs

## Severity Classification

See [severity.md](./references/severity.md) for:

- Critical, Major, Minor, Nit definitions with concrete project examples
- Required severity for each major issue category (security, data loss, broken e2e, etc.)
- How severity drives the final verdict (Approve / Approve with Nits / Request Changes)

## Repository Review Policy Overlay

When the review output is a **posted** pull-request review — the `/review`
command, the CI reviewer, or a managed review product —
[`REVIEW.md`](../../../REVIEW.md) at the repo root is the authoritative policy
and overrides the vocabulary in this skill where they differ. The internal
Critical/Major/Minor/Nit triage and verdict mapping still drive self-review;
the posted report follows `REVIEW.md`.

**Guidelines:**

- MUST apply [`REVIEW.md`](../../../REVIEW.md) on top of this methodology for
  any posted PR review, and let it win on conflict.
- MUST collapse the posted report to `REVIEW.md`'s label set (Important / Nit)
  and open the summary with its one-line tally, instead of the four-tier report
  sections and severity labels used internally.
- MUST suppress the internal verdict vocabulary in posted output: no
  Approve / Approve with Nits / Request Changes verdict appears in a posted
  review.
- MUST run every mandatory check `REVIEW.md` lists on a posted review and raise
  a finding for each miss, grading it by the severity floors in
  [severity.md](./references/severity.md) (a miss that breaks the requirement
  is Important).
- MUST treat every acceptance criterion of the linked issue that the diff
  leaves unmet or unverifiable as an **Important** posted finding.
- MUST report **every** finding in a posted review — `REVIEW.md` sets no nit
  cap, so do not drop or summarize findings away (repeated identical nits MAY
  share one comment).
- MUST NOT report, in a posted review, findings `REVIEW.md`'s do-not-report
  list excludes (CI-enforced checks, lockfiles, generated files), even where
  the severity floors would otherwise rate them Critical.
- MUST keep a posted review **COMMENT**-type (never APPROVE /
  REQUEST_CHANGES), per [github-operations](../github-operations/SKILL.md); the
  reviewer is advisory and does not gate merges.

## Evidence-Based Reporting

See [evidence.md](./references/evidence.md) for:

- Mandatory `file:line` citations
- Diff-style fix snippets (`-` removed / `+` added)
- The full review-report structure (Summary, Strengths, Findings by severity, Recommended Actions)
- Linking findings to the topic-specific guideline that was violated

## Review Tone

See [tone.md](./references/tone.md) for:

- Constructive, blame-free language
- Stating the "why" behind each concern
- Explicit assumption-flagging when uncertain
- Acknowledging strengths

## Escalation

See [escalation.md](./references/escalation.md) for:

- How to make findings trivially applicable by the caller without requiring another reviewer to reinterpret them
- Keeping the review phase reporting-only, without mutating the codebase or delegating the review
- How to surface recurring guideline gaps as a "Guideline gap:" note in the report
- When a finding requires the caller's decision (framed as a "Decision needed:" entry)
- When high-risk changes require user review, CI/PR review, or explicit acceptance before being called merge-ready

## Topic-Specific Guidelines

Consult the appropriate skill for detailed review checklists in each lens. These are the **reviewer's** lens; they layer on top of the developer-facing guidelines linked at the bottom and add "what to flag" rather than "how to write".

| Lens                                                                                                                                                  | Skill                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Readability, naming, complexity, abstraction boundaries, scope discipline, dead code                                                                  | [Maintainable Code Guidelines](../maintainable-code-guidelines/SKILL.md)                         |
| Verifying e2e coverage, snapshot handling, flakiness, manual verification, lint/format gate                                                           | [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md)                         |
| OWASP-lens application security — secrets, input validation, access control, XSS, SSRF, auth, supply chain                                            | [Application Security Requirements](../application-security-requirements/SKILL.md)               |
| Data-layer query cost (N+1), server/client boundary cost, caching correctness, asset/image optimization, bundle weight, error and observability hooks | [Performance and Reliability Requirements](../performance-and-reliability-requirements/SKILL.md) |

In addition to the lenses above, the reviewer MUST also load the project's own topic-specific skills when they exist and overlap the diff — for example skills covering repository structure, components, routing, UI design, or the project's domain rules. These are project-specific skills created during INIT and are not part of this template; consult whichever ones the project defines.

**Guidelines:**

- MUST choose every topic-specific lens that materially overlaps the diff before reporting findings.
- SHOULD cite the owning lens when a finding depends on a specialized project rule.
- MUST NOT treat this table as exhaustive when the diff has an obvious topic covered by a developer-facing skill below or by a project-specific skill defined during INIT.

## Developer-Facing Guidelines (defer, do not duplicate)

Developer-facing skills own how to write project-conforming code. The review skill owns how to report whether the diff followed those rules.

| Topic                                                                              | Skill                                                            |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Format/lint loop, change scope discipline, dependency / data-layer migration rules | [Development Guidelines](../development-guidelines/SKILL.md)     |
| Error handling and structured logging                                              | [Observability Guidelines](../observability-guidelines/SKILL.md) |
| End-to-end test structure, conventions, and commands                               | [E2E Testing Guidelines](../e2e-testing-guidelines/SKILL.md)     |
| Unit test structure, conventions, mocks/fixtures, and commands                     | [Unit Test Guidelines](../unit-test-guidelines/SKILL.md)         |

In addition, the reviewer MUST defer to the project's own developer-facing skills when they exist — for example skills covering repository structure and file placement, routing/URL conventions, component conventions, or UI/visual design. These are project-specific skills created during INIT and are not part of this template; cite whichever ones the project defines instead of restating their rules.

**Guidelines:**

- MUST defer to these developer-facing skills when checking that a change conforms to project conventions.
- MUST cite and link the owning guideline instead of restating its detailed rule in the review report.
