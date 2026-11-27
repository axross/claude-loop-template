# Review Instructions

<!-- INIT:OPTIONAL key=POST_PUSH_REVIEW — Fixed: INIT KEEPS this file (the post-push review channel is fixed infrastructure, see INIT.md Step 4). Just delete this marker and the italic note below, then configure it — enumerate the do-not-report list from the checks CI actually enforces. A project that wants no automated review loop disables the workflow triggers rather than deleting this file. -->
*Configure this policy during INIT: enumerate the do-not-report list from the project's CI-enforced checks.*

Review **policy** for this repository — the highest-priority, review-only
instructions. Every reviewer entry point reads this file: a managed review
product (e.g. Claude Code's managed Code Review) natively, and the CI
reviewer ([`claude-review.yaml`](.github/workflows/claude-review.yaml)) via a
system-prompt bootstrap. This file overrides reviewer defaults and complements
the review
**methodology** in
[Code Review](.claude/skills/code-review/SKILL.md); where
the two differ about what a posted review reports, this file wins (see that
skill's [Posted and CI Reviews](.claude/skills/code-review/SKILL.md#posted-and-ci-reviews)).

This is a **strict** review: run every mandatory check below, verify the
acceptance criteria the pull request body carries, and report every finding — do
not wave anything through.

**Guidelines:**

- MUST read [Code Review](.claude/skills/code-review/SKILL.md)'s `SKILL.md` and
  the references it routes to before reviewing. They own the methodology this
  file does not restate: scoping, reading beyond the diff, what counts as
  evidence, severity, and the shape of a posted review.

## Severity Vocabulary for Posted Reviews

A posted review uses the two labels, **Important** and **Nit**, that
[Code Review](.claude/skills/code-review/SKILL.md)'s
[posted-review policy](.claude/skills/code-review/references/posted-review-policy.md#two-label-severity)
defines, and none of the internal triage vocabulary.

This repository adds one floor to that definition.

**Guidelines:**

- MUST label as Important every violated MUST rule of a matching skill, in
  addition to what the posted-review policy makes Important.

## Mandatory Checks

Run every mandatory check on every review and raise a finding for each miss —
they are not skippable. Grade each miss by its real impact: a miss that breaks a
hard requirement is **Important**, a gap that does not is a **Nit**. Cite the
owning skill in the finding. [Code Review](.claude/skills/code-review/SKILL.md)
owns the finding format.

- **Skill conformance** — verify the change conforms to **every** skill whose
  discovery condition (`description`) matches the changed files, and flag any
  deviation from a skill's stated rule, citing the skill and the rule. A
  violated skill **MUST** rule is Important. A departure the register in
  [Agent Skills](docs/operations/agent-skills.md#the-register) records, with an
  adoption locator and within its scope, is not a finding.

The acceptance-criteria check runs as
[Code Review](.claude/skills/code-review/SKILL.md)'s posted-review policy
defines it, against the criteria the pull request body carries.

## Do Not Report

[Code Review](.claude/skills/code-review/SKILL.md)'s
[posted-review policy](.claude/skills/code-review/references/posted-review-policy.md#do-not-report)
owns the rule: a posted review omits a finding that a named CI check enforces
coextensively, from an enumerated list. This repository's list holds these
entries and no others:

<!-- INIT: replace the bullets below with one entry per check this project's CI actually enforces (the jobs in .github/workflows/merge-checks.yaml). Name the check, not the category — and add an entry only when the check and the finding it would silence are the same thing. -->

- The lint check run by the project's merge-checks workflow.
- The unit-test run by the project's merge-checks workflow — a test that fails
  there, not a test that is missing.
- Style findings on lockfiles and generated files, installed skill copies under
  `.claude/skills/` included.

## Adopted Review Arrangements

This repository explicitly adopts the following under
[Code Review](.claude/skills/code-review/SKILL.md)'s Project-Adopted Review
Arrangements, split by reviewer. Everything else stays at Code Review's
defaults: the two labels, the mandatory checks and the summary scope. The one
addition is that the fallback reviewer's summary also carries the round and the
reviewed commit.

- **The CI reviewer.** Only the container is adopted: diff-anchored inline
  comments plus one summary comment, with no formal review submission. The
  reviewer is identified by its bot login, and no marker, round, or commit is
  required of it.
- **The fallback reviewer subagent.** One COMMENT-type review. Its summary opens
  with the agent-comment marker line, then the tally, and, when the review is
  assigned as a round's post-push review, carries the round and the reviewed
  commit.

## Reporting

[Code Review](.claude/skills/code-review/SKILL.md)'s
[Posted and CI Reviews](.claude/skills/code-review/SKILL.md#posted-and-ci-reviews)
section owns the reporting shape: inline comments anchored to the diff, one
summary comment opening with a tally, and a summary closed to that tally, what
could not be checked, and a finding with no diff line to anchor to. The
arrangements above say where this repository differs.

**Guidelines:**

- MUST post the fallback reviewer's review as a **COMMENT**-type review — never
  APPROVE or REQUEST_CHANGES — per
  [GitHub Operation](.claude/skills/github-operation/SKILL.md); this reviewer
  is advisory and does not gate merges.
