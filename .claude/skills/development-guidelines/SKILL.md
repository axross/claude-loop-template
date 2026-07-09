---
name: development-guidelines
description: Apply this skill at the start of EVERY task in this project. Covers the format/lint loop, scoped change management, current-docs lookup triggers, run-script commands, type-safety discipline, source-comment and doc-comment conventions, verification requirements, data-layer/migration handling, end-to-end test expectations, Conventional Commits, and pull request descriptions. Use even when the user does not mention formatting, linting, testing, type casts, comments, doc-comments, dependencies, migrations, docs, commands, commit wording, or pull request bodies.
---

# Development Guidelines

Apply these rules at the start of every task, regardless of the nature of the work.

## Code Quality

See [code-quality.md](./references/code-quality.md) for:

- The formatter/linter format/lint workflow
- Language compliance requirements
<!-- INIT:OPTIONAL key=TYPED_LANGUAGE — keep the next bullet for a typed language OR delete it (and the "type-safety discipline" / "type casts" phrases in this file's frontmatter description) together with the marked section in ./references/code-quality.md. -->
- Type-safety discipline (unchecked casts and non-null/force-unwrap assertions), for typed languages
- Doc-comment and line-comment conventions in source files
- Import hygiene

## Change Management

See [change-management.md](./references/change-management.md) for:

- Staying within the scope of the task
- Making incremental, verifiable changes
- Following existing patterns before introducing new ones
- Adding dependencies and modifying the data layer

## Verification

See [verification.md](./references/verification.md) for:

- Which output surfaces are put at risk by a given change
- Manual and automated verification steps
- How to maintain test coverage and respond to failures
- CI pipeline behavior

## Current External Documentation

See [current-docs.md](./references/current-docs.md) for:

- When to consult current official docs for the fast-moving frameworks, services, and tools the project uses
- Which project surfaces are sensitive enough to require a docs refresh before changing them

## Dev Commands

See [dev-commands.md](./references/dev-commands.md) for:

- Development, build, and production-start commands
- End-to-end test command and snapshot update flow
- Data-layer / migration commands (if the project has a data layer)
- Format and lint commands

## Commit Messages

See [commit-messages.md](./references/commit-messages.md) for:

- Overall `<type>[scope][!]: <description>` header format
- Required types (`feat`, `fix`) and allowed additional types (`build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `revert`)
- Scope, description, body, and footer conventions
- Breaking-change markers (`!` and `BREAKING CHANGE:` footer) and their SemVer correlation
- Pull request titles (the same header format applies to PR titles, not just commits)

## Pull Request Descriptions

See [pull-request-descriptions.md](./references/pull-request-descriptions.md) for:

- What a pull request body contains, and why the "why" leads
- Using the repository's pull request template (`.github/pull_request_template.md`), including bodies authored programmatically
- Issue linking, verification evidence, risk disclosure, and reviewer guidance
- Keeping the description current across review rounds

## Topic-Specific Guidelines

Consult the appropriate skill for detailed guidance on each area:

| Topic | Skill |
|---|---|
| Error handling, error-reporting, and logging | [Observability Guidelines](../observability-guidelines/SKILL.md) |
| End-to-end test structure, conventions, and commands | [E2E Testing Guidelines](../e2e-testing-guidelines/SKILL.md) |

Project-specific topic skills — covering repository structure, routing, UI components, visual design, the data/content layer, and any domain rules — are created per-project during INIT. Consult those skills when implementation touches the area they own, if they have been defined.

**Guidelines:**

- MUST consult the matching topic skill when implementation touches that area.
- SHOULD load only the references relevant to the changed files or requested behavior.
- MUST defer detailed project rules to the owning topic skill instead of restating them here.
