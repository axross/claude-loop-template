# Review Scoping

Apply these rules at the start of every review to bound the work and avoid drifting into unrelated code.

## Reviewer-Mode Reset

For self-review, the same agent that implemented the change must deliberately switch roles before inspecting the diff. The reset creates a fresh review boundary even though it cannot create true independence.

**Guidelines:**

- MUST stop editing before beginning a self-review pass.
- MUST reread the user's latest request and the acceptance criteria before inspecting implementation details.
- MUST run `git status` and inspect the relevant `git diff` before opening changed files.
- MUST treat prior implementation reasoning as untrusted until the diff and verification evidence support it.
- MUST perform a second-pass re-review after fixing any Critical or Major self-review finding.

## Default Scope

A review that wanders into pre-existing code loses track of what the current change is accountable for and dilutes the author's attention across problems they did not introduce.

**Guidelines:**

- MUST default to **only the changed code** — the diff between the working tree (or a PR branch) and `main`. Do not review pre-existing code unless the user explicitly asks for an audit.
- MUST run `git status` and `git diff main..HEAD` (or `git diff` for an uncommitted working tree) before reading any file, to discover the exact set of changed files and lines.
- MUST also inspect untracked files surfaced by `git status` — new files are part of the change.

## Reading Surrounding Context

Correctness lives in context: a hunk that reads correctly on its own can still break the control flow, boundaries, or callers that surround it.

**Guidelines:**

- MUST read the full file containing each changed hunk, not just the diff hunk itself. A line that looks safe in isolation can be unsafe in its surrounding control flow.
- MUST inspect every caller of a changed function and every callee a changed function added a call to.
- SHOULD read the surrounding modules a changed unit participates in (its parent, siblings, and any shared entry point) even when the diff only touches a leaf, because cross-module assumptions (server-vs-client boundaries, test-hook attributes, async/lifecycle boundaries) cross file boundaries.
- SHOULD read the matching test under e2e/ when a changed unit is covered by tests, to confirm whether the tests still cover the change.

## Out-of-Scope Findings

Charging the current change with blocking severity for problems it did not introduce holds it hostage to unrelated work.

**Guidelines:**

- SHOULD NOT report pre-existing issues outside the diff as Critical or Major. They MAY appear as Minor or Nit observations only when they directly affect the safety of the current change (e.g., a pre-existing missing `await` that the new code now depends on).
- SHOULD list pre-existing issues separately under a "Pre-existing observations" section so the author can decide whether to address them in a follow-up.

## When the Diff Is Empty or Unclear

With nothing to diff, there is no defined change to review, and any files the reviewer picks on its own would be a guess at the wrong target.

**Guidelines:**

- MUST ask the user which files or branch to review when `git diff main..HEAD` returns nothing and no PR number was supplied.
- MUST NOT guess. An empty diff with no instruction means the review request is malformed.

## Repository-Specific Boundaries

Style feedback on files the tooling produces is noise the author cannot act on, since the fix would mean changing the generator rather than the file. See [Development Guidelines › change-management](../../development-guidelines/references/change-management.md) for which paths the project treats as generated/managed.

**Guidelines:**

- MUST NOT review generated or tool-managed files (e.g., framework- or data-layer-generated directories, generated type definitions, lockfiles) for code style. See [Development Guidelines › change-management](../../development-guidelines/references/change-management.md) for the project's list.
- MUST NOT review auto-generated data-layer schema migrations for code style. Only flag a migration if it appears to drop a column or rename a field destructively without a data backfill.
- MUST consult the project's own structure / change-management skill (defined during INIT) for the exact set of paths to exclude from review, since these vary per project.
