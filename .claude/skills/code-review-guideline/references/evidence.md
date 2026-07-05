# Evidence-Based Reporting

Apply these rules so every finding is verifiable, actionable, and traceable back to either project code or a guideline rule.

## Citation Requirements

A finding the author cannot locate is one they cannot act on, so every finding is anchored to a precise, repo-relative `file:line`.

**Guidelines:**

- MUST cite a `file:line` (or `file:line-line` for a range) for every finding. Use repo-relative paths from the project root (e.g., `{{SOURCE_DIR}}/records/[id]/get-record.ts:42`).
- MUST quote the offending code (one-to-five lines) directly under the citation when the surrounding context is needed to understand the finding.
- MUST link to the violated guideline section when the finding is a guideline violation, using a relative path from the report context (e.g., `[development-guidelines › change-management](../../development-guidelines/references/change-management.md)`).
- MUST NOT invent line numbers or paths. If unsure, re-read the file.

## Fix Snippet Format

A concrete diff turns a finding into something the fixer can apply directly, instead of re-deriving the solution from a prose description.

**Example:**

````
[CRITICAL] {{SOURCE_DIR}}/records/get-record.ts:53 — Unsanitized `id` used in a data-layer query filter without an explicit string assertion.
Risk: A non-string `id` (e.g., an array via request-param coercion) bypasses the equals filter and could leak records the caller is not authorized to read.
Fix:
```ts
- where: {
- 	id: { equals: id },
+ where: {
+ 	id: { equals: String(id) },
```
````

**Guidelines:**

- MUST provide a concrete fix snippet for every Critical and Major finding. Minor findings SHOULD include a fix; Nits MAY omit it when the suggestion is self-evident.
- MUST format fixes as a unified-diff style block with `-` for the line to remove and `+` for the line to add. Use the same indentation (tabs) as the surrounding source.

## Report Structure

The reviewer MUST emit findings in this exact section order so downstream agents and humans can parse them:

1. **Summary** — 2-4 sentences. MUST end with the verdict (Request Changes / Approve with Nits / Approve) per [severity.md](./severity.md).
2. **Strengths** — short bullet list of what the change does well. MUST contain at least one item unless the change is trivially small.
3. **Critical Findings** — numbered list. Each entry: `[CRITICAL] file:line — short title`, then a "Risk:" line, then a "Fix:" snippet, then a "Guideline:" line linking the violated rule (when applicable).
4. **Major Findings** — same structure as Critical, prefixed `[MAJOR]`.
5. **Minor Findings & Nits** — concise bullets, prefixed `[MINOR]` or `[NIT]`, with `file:line`. Fix snippet optional.
6. **Pre-existing Observations** — bullets for issues outside the diff scope per [scoping.md](./scoping.md). Do not assign severity here.
7. **Verification Evidence** — commands, manual checks, screenshots, logs, or reasoned checks the reviewer used; MUST include skipped required checks and residual risk.
8. **Recommended Actions** — ordered checklist the author MUST complete before re-requesting review (e.g., "Run {{LINT_CMD}} after applying fix #1", "Re-run {{E2E_TEST_CMD}} and confirm the affected snapshots are unchanged").

**Guidelines:**

- MUST emit review report sections in the exact order shown above.

## What Counts as Evidence

Evidence is what lets a reader confirm a finding without taking the reviewer's word for it, which is what separates the items below from mere assertion.

- A guideline rule citation is evidence. A vague appeal to "best practices" is not — replace it with a specific rule or remove the finding.
- A reproduced failure path (e.g., "if `params.id` is an array then line 22 returns `true` and …") is evidence. A "smells wrong" hunch is not.
- A completed command, manual browser check, inspected diff, or log snippet is evidence only when the report states what was checked and what result was observed.

**Guidelines:**

- SHOULD treat a failing or missing-but-required check (e.g., {{LINT_CMD}} would error on the changed file) as evidence and state the expected outcome explicitly.
- MUST name every skipped required check and explain why it was skipped; skipped checks are residual risk, not success evidence.

## When the Reviewer Cannot Verify

An issue the reviewer could not actually confirm can send the author chasing a non-bug if it is presented with full confidence.

**Guidelines:**

- MUST mark findings as "needs verification" and lower severity by one step when the reviewer cannot confirm the issue without running code (e.g., a perf claim without measurement).
- SHOULD suggest the specific command or test the author should run to confirm or refute the finding.
