# Complexity and Readability

Apply these rules to verify that changed code is straightforward to read and within the project's enforced complexity budget.

## Lint Complexity Thresholds

The project enforces complexity/length/typing thresholds in its `ESLint` configuration; use the table as the reviewer's severity map. The numbers below are illustrative example values — read the project's actual configured thresholds.

| Concern                      | Example project setting | Flag when                                                                                                                                                     |
| ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cognitive complexity         | `error` at e.g. 24      | A new or modified function exceeds the configured threshold — Critical (lint will fail)                                                                       |
| Lines per function           | `info` at e.g. 120      | A new or modified function exceeds the configured length — Major (may not fail lint, but indicates the function should be split)                              |
| Magic numbers                | `warn`                  | A literal number with no semantic meaning appears outside a named constant or design token — Minor, unless the magic value affects security/auth (then Major) |
| Unsafe `any`-equivalent type | `error`                 | An untyped escape hatch (e.g., `any`) appears in changed code — Critical per the project's own component/typing conventions, if defined                       |

**Guidelines:**

- MUST flag changed functions that breach the project's configured `ESLint` complexity/length thresholds — these MUST NOT be silently bypassed.
- MUST use the severity shown in the table when a threshold maps to a project-specific review finding.

## Magic Values

A bare literal forces every later reader to reverse-engineer what it means, and scatters a value that should have one authoritative definition.

**Guidelines:**

- MUST flag a magic number / string that is not paired with either a design token, a named constant, or `ESLint`'s inline suppression directive (with a justification comment) that explains the meaning.
- MUST NOT flag values expressed via the project's approved named tokens (e.g., a caching-duration helper that takes `"hours"` / `"days"`).
- SHOULD flag a hard-coded URL or origin (e.g., `"https://example.com"`, `"http://localhost:3000"`) that should come from a single configured origin/runtime-config source.

## Dead Code

Commented-out code cannot be tested or type-checked and only rots, and version control already preserves anything worth recovering.

**Guidelines:**

- MUST flag commented-out code blocks introduced by the change. Remove or restore them — do not leave them as TODO breadcrumbs.
- MUST flag an unused import in a changed file (the linter will too, but call it out so it does not slip through).
- MUST flag an exported symbol from a changed module that has zero callers in the diff or in the existing codebase. Either remove the export or add the caller in the same change.
- SHOULD flag an empty `try`/`catch` (e.g., `catch { /* swallow */ }`) — see [observability-guidelines › error-handling](../../observability-guidelines/references/error-handling.md) for the rethrow rule.

## Comments and Doc-Comments

The project's comment and doc-comment rules are owned by [development-guidelines › code-quality › Comments](../../development-guidelines/references/code-quality.md); this lens flags violations of them and links back rather than restating them.

**Guidelines:**

- MUST flag a changed/added type or function that lacks the doc-comment [code-quality › Doc-Comments](../../development-guidelines/references/code-quality.md) requires of it (including undocumented throwing conditions) — Minor, Major when it is an exported API.
- MUST flag a line comment that violates the project's chosen comment voice — Nit.
- SHOULD flag a line comment that merely restates the code it precedes.

## Type Reuse

A repeated inline shape has to be changed in every copy when it evolves, whereas a single named alias documents the concept in one place.

**Guidelines:**

- MUST flag an inline object type repeated more than once in the diff — extract into a named type alias.
- MUST flag a new prop/parameter type that ignores the project's established base-type conventions for the kind of value it wraps (e.g., a component rendering a DOM element not extending the underlying element's prop type), per the project's own component skill, if defined.
- SHOULD flag a type-declaration form that violates the project's established preference (e.g., the project may prefer one of `interface` vs `type` for plain object shapes) — match the existing convention.

## Control Flow

Deep nesting forces a reader to hold every branch condition at once, while early returns let each case be understood and dismissed on its own.

**Guidelines:**

- SHOULD flag a deeply nested ternary or `if`/`else` chain that can be flattened with early returns — improves the cognitive complexity score.
- SHOULD flag a `switch` with no `default` branch when the discriminant is a string union — the linter may warn, but call it out so the author considers an exhaustive check.
- SHOULD flag concurrently-awaited independent values (e.g., a `Promise.all([…])` immediately destructured) that the framework would let you pass as unresolved values to defer their resolution, per the project's own component skill, if defined.
