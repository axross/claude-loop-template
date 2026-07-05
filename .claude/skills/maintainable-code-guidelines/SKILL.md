---
name: maintainable-code-guidelines
description: Use this skill when reviewing maintainability and design of changed code. Covers naming and file organization, route-local vs shared abstraction boundaries, complexity/readability limits, magic-number and dead-code discipline, scope control, and SOLID/DRY/KISS/YAGNI judgment across the project's modules and data/content layer. This is the reviewer's lens on top of the project's development, structure, and any project-defined component/routing rules. Use for "readable", "too long", "refactor", "abstraction", or "should this live elsewhere".
---

# Maintainable Code Guidelines

Apply these rules when reviewing the maintainability and design of any changed code. This is the reviewer's lens — flag violations and link to the developer-facing rule rather than restating it.

## Naming and Organization

See [naming-and-organization.md](./references/naming-and-organization.md) for:

- File names match the project's established file-naming convention (e.g., kebab-case) and any required co-located sibling files (such as a style-module pairing)
- Components, helpers, and data-access modules live in the correct directory tier (route-local before group-shared before global)
- New routes follow the project's own routing skill, if defined, and co-locate their required sibling files (props/types, not-found, social-image files)
- Identifier names match in/around the changed file's existing conventions

## Abstraction Boundaries

See [abstraction-boundaries.md](./references/abstraction-boundaries.md) for:

- New shared logic lives at the lowest tier that has more than one caller (route-local before group-shared before global)
- The server / client component boundary is split per the project's own component skill, if defined
- Domain-specific pipelines (such as a content-rendering pipeline) stay behind a single owning module, per the project's own domain skill, if defined

## Complexity and Readability

See [complexity-and-readability.md](./references/complexity-and-readability.md) for:

- The project's configured `{{LINTER}}` complexity/length thresholds are not silently bypassed
- Magic numbers and strings have a named constant or design token, with `{{LINTER}}`'s inline suppression directive (and a justifying comment) only when justified
- Dead code (unused imports, unreachable branches, commented-out blocks) is removed
- Missing doc-comments on changed public types/functions, restating comments, and comment-voice violations (rules owned by development-guidelines › code-quality)
- Inline `{{PRIMARY_LANGUAGE}}` types are extracted into named aliases when reused

## Scope Discipline

See [scope-discipline.md](./references/scope-discipline.md) for:

- The diff matches the stated user goal — no drive-by refactors per [development-guidelines › change-management](../development-guidelines/references/change-management.md)
- Pre-existing problems are flagged separately, not bundled into this change
- New abstractions are justified by ≥ 2 concrete call sites (YAGNI)
- Repeated logic across the diff is consolidated only when the duplication is truly the same concern (DRY without coupling unrelated callers)
