# Bootstrapping and Migrating Documentation

## Detect before proposing

A documentation tree can contain current guidance, observations recorded at a
particular revision, and files left out of a distribution. Its name alone
does not identify those roles or establish that the project has adopted OKF.

**Guidelines:**

- MUST locate the documentation root, index, glossary, tools, external entry points and export boundary before proposing a layout.
- MUST preserve a working legacy layout until the project adopts migration.

## Start with a reader

One recurring question is enough to begin. For a new bundle the root index can
begin with this frontmatter, followed by a topic heading and a link to the
concept.

```yaml
---
okf_version: "0.3"
title: Scheduler engineering
description: Job execution and delivery guarantees for Scheduler contributors.
---
```

In a small library, the rest of that index can be a single link:
`[When will a failed job run again?](./retries.md)`. The whole bundle is
`index.md` and `retries.md`. The concept could read:

```markdown
---
type: Specification
title: Job retries
description: Retry timing, attempt limits and the state callers observe between attempts.
---

# Job retries

A failed job waits one minute for a second attempt and appears as queued.
If the second attempt fails, the job ends as failed.
```

Here the retry contract owns both timing and exhaustion. When readers also
need to count attempts, a growing project can group a Definition and a
Specification under scheduling. The [Scheduler subject index](../assets/docs-example/scheduling/index.md)
shows that choice in a larger service with its own retry limits. Link both
the human contributor guide and agent instructions to the same maintained
[placement convention](../assets/docs-example/contributing/documentation.md#choose-a-subject).

**Guidelines:**

- SHOULD answer the first question from the implementation or an adopted decision, give the answer a primary type, and link it from the index.
- SHOULD let a new decision earn its own page. Link it from the flat root or from the subject where readers already seek it.

## Migrate one reading route

A metric's formula, its result-buffer contract and its presentation can change
independently. A sampled stage can compute values for several participants
while returning a score for only one. A caller needs the result Specification
to know whose score is available. By contrast, a configuration name, its
requiredness and its failure behavior together tell the operator what to set.
A testing convention and the counterexample that motivated it also belong
together.

**Guidelines:**

- MUST inventory claims and their owners, readers, callers, paths and fragments, exported assets, metadata and supporting evidence before editing. Note what each consequential claim's evidence establishes.
- SHOULD split claims when they serve different decisions and can change independently. Keep facts that a reader must apply together on one page; page length and heading count alone do not justify a split.
- MUST type each living page while retaining existing metadata and established type names. Update scope statements and [reading routes](./cross-references.md) after extraction.
- MUST preserve the action and any condition that changes it at the point of decision, including authority, cost, recovery or a safe no-op. Keep an ordered trace together when its sequence explains the outcome. Prefer a heading or link when splitting would make readers reconstruct one decision.
- MUST read each extracted page independently, exercise a boundary case and [trace the affected entry points](./consulting-and-upkeep.md#verify-a-readers-route).
- SHOULD report one justified split and one justified decision to keep content together when evaluating a migration.

## Preserve evidence identity

An approval that names a file by SHA-256 binds to its bytes, including its first
line and newline convention. When retiring a dated feasibility study, move any still-useful check into the
operator's Procedure. Its next execution produces evidence for that change's
pull request. A reader investigating the old result can open the original
study at its commit.

**Guidelines:**

- MUST preserve any bytes an existing approval or distribution contract binds. If current guidance relies on that evidence, cite its pinned source and acceptance from the typed page that owns the claim. An existing Specification or Procedure can be its companion.
- MUST distinguish implemented behavior, an adopted target awaiting implementation, a revision-specific observation and an unverified hypothesis in the wording of the claim. State which revision, environment and conditions the evidence supports. Preserve recorded provenance without inferring verification, authorship, ownership, approval or license from migration.
- SHOULD remove superseded reports from the live tree once active evidence obligations and reader routes are accounted for. Direct historical lookups to the original commit or pull request.
- MUST record hashes before migration and compare the exported evidence and linked assets byte-for-byte with their originals.
- MUST report intentional untyped evidence by path during verification so an accidental omission elsewhere remains visible.
