---
name: development-guidelines
description: Apply this skill at the start of EVERY task in this project. Covers the format/lint loop, scoped change management, current-docs lookup triggers, run-script commands, type-safety discipline, source-comment and doc-comment conventions, verification requirements, end-to-end test expectations, and Conventional Commits. Use even when the user does not mention formatting, linting, testing, type casts, comments, doc-comments, dependencies, docs, commands, or commit wording.
---

# Development Guidelines

Apply these rules at the start of every task, regardless of the nature of the work.

## Code Quality

See [code-quality.md](./references/code-quality.md) for:

- The formatter/linter format/lint workflow
- Language compliance requirements
- Type-safety discipline (unchecked casts and non-null assertions)
- Doc-comment and line-comment conventions in source files
- Import hygiene

## Change Management

See [change-management.md](./references/change-management.md) for:

- Staying within the scope of the task
- Making incremental, verifiable changes
- Following existing patterns before introducing new ones
- Adding dependencies and handling generated code

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
- Format, lint, typecheck, and unit-test commands

## Commit Messages

See [commit-messages.md](./references/commit-messages.md) for:

- Overall `<type>[scope][!]: <description>` header format
- Required types (`feat`, `fix`) and allowed additional types (`build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `revert`)
- Scope, description, body, and footer conventions
- Breaking-change markers (`!` and `BREAKING CHANGE:` footer) and their SemVer correlation
- Pull request titles (the same header format applies to PR titles, not just commits)

## Topic-Specific Guidelines

Consult the appropriate skill for detailed guidance on each area:

| Topic                                                | Skill                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Error handling, error-reporting, and logging         | [Observability Guidelines](../observability-guidelines/SKILL.md) |
| End-to-end test structure, conventions, and commands | [E2E Testing Guidelines](../e2e-testing-guidelines/SKILL.md)     |

Project-specific topic skills — [Project Structure](../project-structure/SKILL.md) and [Component and UI Guidelines](../component-and-ui-guidelines/SKILL.md) — own repository layout and component/UI rules. Consult them when implementation touches the area they own.

**Guidelines:**

- MUST consult the matching topic skill when implementation touches that area.
- SHOULD load only the references relevant to the changed files or requested behavior.
- MUST defer detailed project rules to the owning topic skill instead of restating them here.
