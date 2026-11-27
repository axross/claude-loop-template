---
name: living-project-documentation
description: Maintaining a project's own docs as its engineering changes. Use for docs/ upkeep, glossary and spec changes, settled decisions, stale runbooks, and bootstrapping or migrating an Open Knowledge Format (OKF) bundle. Product requirement document authoring owns change plans, and technical writing owns sentence-level editing. Helps readers find the page that defines a term, specifies behavior, explains a boundary, or governs an operation. Covers legacy layouts, provenance, offline exports and navigation checks.
user-invocable: true
---

# Living Project Documentation

Use this capability to find the document that settles a reader's engineering
question and keep its answer true as the project changes. A plan records
intent. Living documentation describes the behavior, constraints and
procedures that actually hold. Update their owning pages in place. In a Git
project, commits and pull requests carry the history of changes and checks.
The [OKF v0.3 specification](https://github.com/open-knowledge-format/open-knowledge-format/blob/527e81aff55992be21507e97004286789126f88c/SPEC.md)
defines the bundle format. Here, `docs/` means the project's documentation root.

The requirement keywords used in this skill and its references follow
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Organizing a bundle

See [documentation-structure.md](./references/documentation-structure.md) for:

- authoring an OKF v0.3 concept and distinguishing format requirements from this skill's discovery defaults
- choosing the subject that owns a decision, reviewing its page type, and routing readers from a subject index or glossary

See [conventions-and-operations.md](./references/conventions-and-operations.md) for:

- placing a team's engineering choice, an implementation guarantee or an architectural boundary
- tracing permission, activation, verification and recovery when several procedures share an authority

## Adopting or migrating documentation

See [bootstrapping.md](./references/bootstrapping.md) for:

- starting with a single reader question in a new project
- inventorying a populated tree, choosing which claims to separate, retaining claims used together and preserving evidence identity

See [cross-references.md](./references/cross-references.md) for:

- settling support for published paths and fragments, updating callers and checking record identifiers
- making navigation work both inside the checkout and in an exported bundle

The [Scheduler example](./assets/docs-example/index.md) shows how readers enter through a subject, a familiar term or a deployment step and find the page that owns their decision. Its [rollback procedure](./assets/docs-example/operating/deployment.md#rolling-back) keeps the recovery command beside the condition that requires a restore.

## Consulting and maintaining docs

See [consulting-and-upkeep.md](./references/consulting-and-upkeep.md) for:

- consulting relevant owners before a plan and tracing dependent readers
- following a question from real entry points before and after a move, including the exception that changes the answer

See [validators.md](./references/validators.md) for:

- running one whole-root check for OKF conformance and engineering rules from the first day of migration
- interpreting evidence warnings and the editorial type list, using focused checks and qualifying a standalone export
