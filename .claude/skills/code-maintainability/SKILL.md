---
name: code-maintainability
description: Writing, refactoring, or reviewing code for maintainability or design — keeping what you change readable, cohesive, and cheap to change next time. Triggers on "readable", "too long", "refactor", "abstraction", "cohesion", "magic number", "dead code", "what should this be called", or "should this live elsewhere". While authoring, each concern is a practice to uphold; while reviewing, a finding to raise against the diff. Covers cohesion as the test of what belongs in one unit, naming and file organization, abstraction boundaries, complexity limits, dead code, and SOLID/DRY/KISS/YAGNI judgment.
user-invocable: false
---

# Code Maintainability

Use this capability whenever you write, refactor, or review changed code, to keep it readable and cheap to change. Each concern below is one lens with two modes: a practice to uphold while you author the code, and a finding to raise while you review a change. Hold the line the same way in both modes — the standard does not soften because you wrote the code yourself.

Where the project's development or structure conventions own a rule — or a project-defined component, routing, or domain skill does — this capability applies the maintainability lens and defers to that owner by name rather than restating it. Rules gated on "if the project has such a convention" are conditional: skip them cleanly on a project that has none.

**Guidelines:**

- MUST defer each rule to its owning skill by name where one exists (the project's development, structure, component, routing, or domain conventions), summarizing rather than duplicating its wording.
- MUST treat a concern gated on a project-specific convention as inapplicable — not a violation — on a project that does not ship that convention.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Naming and Organization

See [naming-and-organization.md](./references/naming-and-organization.md) for:

- Keeping file names on the project's established file-naming convention (e.g., kebab-case) and the co-located sibling files that convention requires (such as a paired style-module file)
- Placing components, helpers, and data-access modules in the correct directory tier (route-local before group-shared before global), with a decision flowchart for the tier
- Following the project's own routing convention, if it defines one, and co-locating a route's required sibling files (props/types, not-found, social-image)
- Matching identifier names and casing to the conventions in and around the changed file
- The fallback identifier vocabulary for a name nothing else governs, and how it yields to a project convention, an owning capability, or a platform/host API the value crosses into
- Naming an identifier at risk of an undisambiguated domain-specific meaning, even under an established project convention: the living-project-documentation capability's closest-composing naming principle, its locality carve-out, and what still holds when that capability is absent

## Abstraction Boundaries

See [abstraction-boundaries.md](./references/abstraction-boundaries.md) for:

- Deciding or reviewing what belongs inside one function, class, or module, and why the cohesion scale is non-linear — functional far stronger than the rest, coincidental and logical far weaker than the intermediate levels
- Placing new shared logic at the lowest tier that has more than one caller (route-local before group-shared before global)
- Splitting the server / client boundary per the project's own component convention, if it defines one
- Keeping a domain-specific pipeline (such as a content-rendering chain) behind its single owning module, per the project's own domain convention, if it defines one
- Keeping tier imports pointed the right way, so shared code never depends on route-local code

## Complexity and Readability

See [complexity-and-readability.md](./references/complexity-and-readability.md) for:

- Staying within the project's configured linter and complexity or length budget, including assessing a function that exceeds it
- Giving magic numbers and strings a named constant or design token, reserving an inline lint-suppression directive (with a justifying comment) for the rare justified case
- Deciding whether to remove or keep apparently dead code (unused imports, unreachable branches, commented-out blocks)
- Why an explanatory comment and a doc-comment are both the last resort rather than the plan — the best version of a passage carries none — why a doc-comment that exists because the exported name or the exported set is unclear is a boundary defect before it is a documentation task, and why a unit, a nullability, or a bound's inclusivity belongs in the type or the name before either
- The ordered remedy set tried before a comment is admissible — the name and the type, then the interface, then how the unit is divided — and re-examining that division, citing [abstraction-boundaries.md](./references/abstraction-boundaries.md)'s cohesion judgment, before accepting a comment neither the type nor the name could remove
- Why a boundary doc-comment that has to describe implementation details signals a shallow interface, not a well-documented one
- Deferring doc-comment, restating-comment, and comment-voice rules to the project's development conventions, and extracting a repeated inline type into a named alias in a statically-typed language

## Scope Discipline

See [scope-discipline.md](./references/scope-discipline.md) for:

- Keeping the change matched to its stated goal, including assessing a file the goal does not name — no drive-by refactors, per the project's development conventions
- Flagging pre-existing problems separately instead of bundling them into this change
- Assessing a new helper, prop, configuration option, or generic type parameter for speculative scope
- Justifying a new abstraction with two or more concrete call sites (YAGNI), and extracting or consolidating repeated logic only when it is truly the same concern (DRY without coupling unrelated callers)
