# AGENTS.md

> **Template note.** This file is a reusable, framework-agnostic starting
> point — the working agreement and skill index a Claude Code project loads
> through `CLAUDE.md`. Before using it in a real project, run the
> adaptation pass described in [INIT.md](./INIT.md): fill in the `{{...}}` tokens,
> complete the Project Overview, resolve each optional capability (add the tool
> or remove its skill — don't assume deletion), and add project-specific skills
> (structure, components, routing, UI, domain). Delete this note when the
> template has been adapted.

## Requirement Level Keywords

Apply these keywords consistently in this document and the documents linked from this document.

| Keyword | Synonym | Meaning |
| ------- | ------- | ------- |
| "MUST" | "REQUIRED" | Non-negotiable requirement; no exceptions. |
| "MUST NOT" |  | Non-negotiable prohibition; no exceptions. |
| "SHOULD" | "RECOMMENDED" | Strongly preferred; deviation is allowed only after weighing the implications. |
| "SHOULD NOT" | "NOT RECOMMENDED" | Strongly discouraged; allowed only after weighing the implications. |
| "MAY" | "OPTIONAL" | Genuinely optional; no preference implied. |

## Project Overview

<!-- INIT: replace this block with a short, durable description of the project.
     Keep it to a few bullets; deep detail belongs in a project-specific
     structure skill, not here. -->

- **{{PROJECT_NAME}}** is a {{PROJECT_KIND}}. {{PROJECT_OVERVIEW}}
- Primary language: {{PRIMARY_LANGUAGE}}. App framework: {{APP_FRAMEWORK}}.
- Tooling: {{PACKAGE_MANAGER}} for packages, {{LINTER}} for linting, {{FORMATTER}} for formatting.
- For run-scripts, current-docs lookup rules, and verification commands, consult [Development Guidelines](.claude/skills/development-guidelines/SKILL.md).
- For repository layout, stack, services, and file placement, consult the project's own structure skill once it is created during INIT.

## Skill Index

`AGENTS.md` is the master routing index for project skills. Consult the relevant skill before acting on matching work. This index ships with a generic, cross-project core; add project-specific skills (structure, components, routing, UI design, domain rules) and list them here during INIT.

| Skill | When to apply |
| ----- | ------------- |
| [Agent Skills Best Practices](.claude/skills/agent-skills-best-practices/SKILL.md) | Creating, refining, splitting, renaming, deleting, or auditing project skills or this skill index |
| [Application Security Requirements](.claude/skills/application-security-requirements/SKILL.md) | Reviewing secrets, environment variables, input validation, access control, injection in rendered content, SSRF/outbound fetching, auth/session behavior, privacy exposure, analytics/error-reporting data, or dependency/supply-chain risk |
| [Code Review Guideline](.claude/skills/code-review-guideline/SKILL.md) | Reviewing a diff, pull request, local change, or post-implementation self-review |
| [Development Guidelines](.claude/skills/development-guidelines/SKILL.md) | Implementing, refactoring, running commands, preparing commits, writing pull request descriptions, adding dependencies, writing source comments or doc-comments, checking current docs, or changing the data layer |
| [E2E Testing Guidelines](.claude/skills/e2e-testing-guidelines/SKILL.md) | Writing, running, reviewing, or maintaining end-to-end tests, snapshots, route coverage, or browser assertions |
| [GitHub Operation Guidelines](.claude/skills/github-operation-guidelines/SKILL.md) | Reading from or writing to GitHub — issues, pull requests, comments, labels, reviews, or branches — through a proxied single-operator identity: agent-comment markers, issue-vs-PR targets, commit messages and pull request titles under squash merge, pull request template and description authoring, history preservation (no amend/force-push), untrusted content |
| [Maintainable Code Guidelines](.claude/skills/maintainable-code-guidelines/SKILL.md) | Reviewing readability, naming, abstraction boundaries, complexity, dead code, or scope discipline |
| [Observability Guidelines](.claude/skills/observability-guidelines/SKILL.md) | Throwing, catching, reporting, or logging errors with the project's error tracker and structured logger |
| [Performance and Reliability Requirements](.claude/skills/performance-and-reliability-requirements/SKILL.md) | Reviewing data-access cost, server/client boundaries, caching, asset/image optimization, bundle weight, or runtime failure behavior |
| [Product Requirement Guidelines](.claude/skills/product-requirement-guidelines/SKILL.md) | Writing, refining, or reviewing a product requirement, feature spec, or issue description; framing scope/non-goals, testable acceptance criteria, or a spec's UI-design or architecture sections |
| [Quality Assurance Guidelines](.claude/skills/quality-assurance-guidelines/SKILL.md) | Reviewing verification evidence, e2e coverage, snapshots, flakiness, lint/format evidence, or manual checks |
| [Unit Test Guidelines](.claude/skills/unit-test-guidelines/SKILL.md) | Writing, refactoring, reviewing, or running unit tests, including mocks/fakes, fixtures, schema tests, and behavior-focused assertions |

<!-- INIT: add rows for project-specific skills you create, e.g.
| [Project Structure](.claude/skills/project-structure/SKILL.md) | Navigating the repository, deciding where a new module, route, component, or test belongs, or checking stack, tooling, and directory conventions |
| [Component Guidelines](.claude/skills/component-guidelines/SKILL.md) | Writing, placing, reviewing, or refactoring a component or hook — tier placement, generic-shell vs domain-wrapper splits, promoting repeated UI, styling extension, test hooks |
| [Routing Guidelines](.claude/skills/routing-guidelines/SKILL.md) | Creating, moving, renaming, or reviewing routes — URL structure, route-file conventions, layouts, redirects, metadata, or route-level loading and error surfaces |
| [UI Design Principles](.claude/skills/ui-design-principles/SKILL.md) | Deciding how a surface should look — color roles, elevation, control selection, modal patterns, spacing/typography, responsive behavior, copy, accessibility, theming |
-->

## Response Approach

Use this workflow for single-agent work in this project. The agent owns planning, implementation, investigation, verification, review, and reporting directly.

### Overall Strategy

Non-trivial work should move through the same decision sequence even when some steps are brief.

1. Classify the request and load the relevant project guidance.
2. Define success criteria, constraints, affected surface, dependencies, and verification expectations.
3. Inspect the smallest useful code and documentation context.
4. Draft an ordered local workflow with acceptance criteria.
5. Implement, investigate, or review within the narrowest scope that satisfies the request.
6. Self-review the result as a separate phase.
7. Run or report the relevant verification.
8. Update or propose skill guidance when the work exposes reusable project learning.
9. Summarize outcome, verification status, trade-offs, and open follow-ups.

**Guidelines:**

- MUST consult [Development Guidelines](.claude/skills/development-guidelines/SKILL.md) at the start of every task.
- MUST classify non-trivial work as user-facing, implementation-only, review-only, skill-maintenance, exploratory, or mixed workflow before editing files.
- MUST consult every skill whose routing condition matches the changed surface or requested review lens.
- MUST ask a concrete question when progress depends on a product, platform, privacy, compatibility, or scope decision that cannot be inferred from local context.
- SHOULD compress the sequence for small answer-only requests without skipping relevant safety checks.

### Planning and Execution

Planning exists to make the work checkable. It should name what changes, what must stay unchanged, and how the result will be verified.

**Guidelines:**

- MUST restate success criteria, constraints, affected surface, and verification expectations before non-trivial edits.
- MUST preserve public behavior during refactors unless the requested change intentionally modifies it.
- MUST keep edits scoped to the smallest surface that satisfies the acceptance criteria.
- SHOULD inspect independent discovery targets in parallel when their outputs do not depend on each other.
- SHOULD revise the plan when new evidence changes affected files, risks, or acceptance criteria.

### User-Facing Work

User-facing changes need design intent before implementation mechanics. The single agent owns both, but the phases must stay distinct. _This subsection applies only to projects with a user-facing surface; delete it during INIT for libraries, CLIs, or services without one._

**Guidelines:**

- MUST establish design intent before implementing user-facing changes: hierarchy, interaction states, accessibility intent, responsive behavior, and copy constraints.
- MUST consult the project's own UI/design and component skills (created during INIT) for design decisions and implementation mechanics.
- MUST express design intent in user-facing terms before translating it into components, styles, or tests.
- MUST verify that text, layout, focus behavior, loading states, and responsive behavior remain coherent across relevant viewports or surfaces.
- SHOULD keep design-system rules in design vocabulary and link to implementation-mechanics skills instead of duplicating them.

### Review Independence Gates

A single agent cannot provide true independent review. This project compensates with a mandatory separate review phase for ordinary work and external review gates for high-risk work.

**Guidelines:**

- MUST perform a reviewer-mode reset after non-trivial implementation: stop editing, reread the request, inspect `git status` and `git diff`, and review only the produced diff.
- MUST apply [Code Review Guideline](.claude/skills/code-review-guideline/SKILL.md) during self-review, including severity labels, file-line evidence, concrete fixes, and an explicit verdict when findings exist.
- MUST load topic-specific review lenses when relevant: maintainability, quality assurance, security, performance/reliability, observability, e2e testing, and any project-specific lenses (structure, components, routing, UI, domain) defined during INIT.
- MUST judge the actual diff and observed behavior, not the implementation intent.
- MUST fix Critical or Major self-review findings before claiming completion.
- MUST perform a second-pass re-review after fixing any blocking self-review finding.
- MUST report verification evidence before completion: commands run, manual checks, failures, skipped checks, and residual risk.
- MUST escalate high-risk changes to user review, CI/PR review, or an explicitly requested secondary review before calling them merge-ready.
<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — Fixed: the independent-review channel is fixed infrastructure (INIT.md Step 4), so KEEP the next bullet; just delete this marker. -->
- SHOULD route that escalation through the project's independent-review channel — the posted-review policy in [REVIEW.md](./REVIEW.md).
- SHOULD treat auth, access control, injection/output-encoding, SSRF/outbound fetching, data-layer migrations, public route/API contracts, production config, data-loss risk, and large refactors as high-risk.

### Verification

Verification should match the changed surface. Documentation-only changes need link and format checks; routes, user-facing output, data-layer, and runtime changes need stronger evidence.

**Guidelines:**

- MUST run the relevant verification commands after non-trivial changes, or report why they could not run.
- MUST run `{{FORMAT_CMD}}` and `{{LINT_CMD}}` after code or documentation edits.
- MUST run `{{UNIT_TEST_CMD}}`, when the project has a unit suite, after a change affects code it covers.
- MUST run `{{E2E_TEST_CMD}}`, when the project has an e2e suite, after a change affects a user-facing output surface or e2e coverage.
- MUST run `{{BUILD_CMD}}`, when the project has a build step, after a change affects routes, metadata, data-layer config, runtime config, dependencies, or public type signatures.
- SHOULD perform focused manual checks when browser behavior, crawler metadata, custom protocol behavior, responsive layout, or content-preview behavior changes.
- MUST report unverified acceptance criteria and residual risk in the final summary.

### Skill Maintenance

Skill maintenance keeps reusable workflow learning close to the project rules. It should happen when a change reveals durable guidance, not after every narrow fix.

**Guidelines:**

- MUST consult [Agent Skills Best Practices](.claude/skills/agent-skills-best-practices/SKILL.md) when adding, renaming, moving, deleting, splitting, or cross-linking skills, changing reference files, or updating this index.
- MUST keep this skill index synchronized when skills are added, renamed, moved, or removed.
- MUST make one skill the source of truth for a rule instead of copying detailed guidance across multiple skills.
- SHOULD propose or implement skill updates when the workflow exposes a reusable convention, outdated guidance, recurring review issue, or missing project rule.
- SHOULD skip skill maintenance when the workflow produced no generalizable learning, and state that it was skipped.

### Communication

User-facing communication should expose decisions, blockers, verification, and outcomes without narrating every local inspection step.

**Guidelines:**

- MUST keep progress updates concise and focused on decisions, blockers, and outcomes.
- MUST summarize changed files, verification status, trade-offs, unresolved risks, and deferred follow-ups at completion.
- MUST state whether skill maintenance was performed, skipped, or blocked when skill guidance governed the work.
- SHOULD include detailed plans, command logs, or iteration logs only when the user asks for auditability or when the outcome depends on them.
- MUST ask a concrete question when progress depends on a product, platform, privacy, or scope decision.
