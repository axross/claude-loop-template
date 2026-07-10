# Review Instructions

<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — keep this file if the project adopts a posted-review channel OR delete it together with every other key=INDEPENDENT_REVIEW site; the INIT.md Step-4 bullet is the authoritative deletion list. -->
*If this project posts no independent reviews — no managed review product, no CI reviewer, no local review command — delete this file and the rest of the independent-review capability during INIT.*

Review **policy** for this repository — the highest-priority, review-only
instructions. Every reviewer entry point reads this file: a managed review
product (e.g. Claude Code's managed Code Review) natively, and the CI
reviewer ([`claude-review.yaml`](.github/workflows/claude-review.yaml)) via a
system-prompt bootstrap. This file overrides reviewer defaults and complements
the review
**methodology** in
[Code Review Guideline](.claude/skills/code-review-guideline/SKILL.md); where
the two differ about what a posted review reports, this file wins (see that
skill's [Repository Review Policy Overlay](.claude/skills/code-review-guideline/SKILL.md#repository-review-policy-overlay)).

This is a **strict** review: run every mandatory check below, verify the linked
issue's acceptance criteria, and report every finding — do not wave anything
through.

## Severity Vocabulary for Posted Reviews

A posted review uses exactly two labels. The internal Critical/Major/Minor/Nit
triage and the Approve / Request-Changes verdict vocabulary stay out of posted
output — they exist for self-review, not for the pull-request thread.

- **Important** — MUST be addressed before merge: a finding that breaks
  behavior, corrupts persisted state, leaks data, regresses accessibility,
  violates a MUST rule of a matching skill in the `AGENTS.md` skill index, or
  leaves an acceptance criterion unmet or unverifiable from the diff.
- **Nit** — safe to defer: style, naming, and refactoring suggestions.

**Guidelines:**

- MUST label every posted finding exactly **Important** or **Nit** — no other
  labels appear in a posted review.
- MUST label as Important every violated MUST rule of a matching
  `AGENTS.md`-indexed skill, every acceptance criterion that is unmet or cannot
  be confirmed from the diff, and every mandatory-check miss that breaks a hard
  requirement.
- MUST label style, naming, and refactoring suggestions Nit at most.

## Mandatory Checks

Run both checks on every review and raise a finding for each miss — they are
not skippable. Grade each miss by its real impact: a miss that breaks a hard
requirement is **Important**, a gap that does not is a **Nit**. Cite the owning
skill in the finding.

- **Skill conformance** — verify the change conforms to **every** skill in the
  [`AGENTS.md`](AGENTS.md) skill index whose routing condition matches the
  changed files, and flag any deviation from a skill's stated rule, citing the
  skill and the rule. A violated skill **MUST** rule is Important.
- **Acceptance criteria** — verify the diff against **every** acceptance
  criterion in the linked issue (the pull request body's `Closes #<n>`), when
  the pull request links one. Each criterion that is unmet, or that cannot be
  confirmed from the diff, is an **Important** finding named explicitly in the
  summary. If the pull request links no issue, say so in the summary.

**Guidelines:**

- MUST run both mandatory checks on every review and raise a finding for each
  miss.
- MUST give each finding a severity label, `file:line` evidence, and a concrete
  fix, per
  [Code Review Guideline](.claude/skills/code-review-guideline/SKILL.md).

## Do Not Report

Findings the project's CI already enforces mechanically are noise in a posted
review — CI blocks the merge regardless, so restating them costs the author's
attention without adding a gate. This exclusion governs **posted** reviews
only; internal self-review triage still flags these findings.

<!-- INIT: replace the first bullet with the checks this project's CI actually enforces (the jobs in .github/workflows/merge-checks.yaml — e.g. its lint and unit-test runs). -->

- Anything CI already enforces — the lint and unit-test checks run by the
  project's merge-checks workflow.
- Lockfiles and generated files.

**Guidelines:**

- MUST NOT report, in a posted review, any finding on the do-not-report list
  above.

## Reporting

Anchor each finding as an inline comment on the diff, and post one summary that
opens with a one-line tally (e.g. `2 important, 7 nits`). There is no nit cap
and nothing is summarized away — the tally counts every finding.

**Guidelines:**

- MUST report **every** finding; the same nit repeated across the diff MAY
  share one inline comment that lists each occurrence.
- MUST keep reporting to two shapes — inline comments for the findings, one
  comment for the summary — and MUST NOT scatter individual findings across
  separate top-level conversation comments.
- MUST post any pull-request review as a **COMMENT**-type review — never
  APPROVE or REQUEST_CHANGES — per
  [GitHub Operation Guidelines](.claude/skills/github-operation-guidelines/SKILL.md); this reviewer
  is advisory and does not gate merges.
