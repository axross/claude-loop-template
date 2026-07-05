# Naming and Organization

Apply these rules to verify that changed files live in the right place with the right name.

## File Naming

A file that breaks the surrounding naming convention is harder to locate and makes readers and tooling second-guess what kind of module it is.

**Guidelines:**

- MUST flag any new source/style file whose name does not match the project's file-naming convention (e.g., a kebab-case project receiving `RecordHeader.tsx` or `record_header.tsx`).
- MUST flag a new component file that lacks a required co-located sibling file when the project's convention mandates one (e.g., a paired style-module file when the component renders styled DOM).
- SHOULD flag a co-located sibling file whose base name does not match its primary file (e.g., `record-header.tsx` paired with `header.module.css` when the convention is matched base names).

## Directory Tier

Place shared logic at the lowest tier that has more than one caller. Most projects have a progression from route-local code, to a group-shared tier, to a global/shared tier, plus possibly a separate realm for the data/content layer. The reviewer MUST verify a new module lives at the **lowest** tier that has more than one caller:

| Tier | When to use |
|---|---|
| Route-local | Used only by the files of one route/feature |
| Group-shared | Used by ≥ 2 routes/features within the same group |
| Global / shared | Used broadly across the application |
| Data/content-layer realm | Runs inside the `{{CMS_OR_DATA_LAYER}}` realm only |

**Guidelines:**

- MUST flag a new file placed in a group-shared or global tier that is consumed by only one route/feature — it SHOULD live in that route's local tier instead.
- MUST flag a new file placed in a route-local tier that is also imported by another route/feature — it SHOULD be promoted to the lowest shared tier covering all its callers.
- MUST flag a new file placed in the `{{CMS_OR_DATA_LAYER}}`-owned realm that does not belong there, per [development-guidelines › change-management](../../development-guidelines/references/change-management.md).
- MUST flag any helper or component placed where the framework would misinterpret it (e.g., a non-route file dropped directly into a directory the framework treats as a route segment).

## Route File Layout

When the diff adds or moves a route/feature, the reviewer MUST verify it against the project's own routing skill, if defined. Typical co-location expectations include:

- A props/types module co-located with the route entry, declaring the route's input shape (params and query, including any framework-required async typing).
- A not-found / fallback module co-located when the route can fail to resolve (e.g., a dynamic record id/slug that may not exist).
- Social-image / metadata asset files co-located with the route they belong to.
- A request handler living in its own sub-directory, never colliding with a route's page entry.

**Guidelines:**

- MUST verify added or moved route files against the project's own routing skill, if defined, before approving their placement. (Routing conventions are project-specific and may be defined as a dedicated skill during INIT.)

## Identifier Naming

A symbol named or cased unlike its neighbors makes the reader stop to check whether the difference carries meaning.

**Guidelines:**

- MUST flag identifier-naming inconsistency within the changed file's neighborhood. Examples to flag:
  - A new symbol cased differently from its siblings (e.g., `PascalCase` where siblings use `camelCase`, or vice versa) — match the existing file.
  - A data-access function that breaks the sibling naming pattern (e.g., `fetchRecord` when siblings are `getRecord`, `getRecords`, `getSettings`).
  - A logging-module label/tag that duplicates an existing module's label when the project requires unique per-module labels, per [observability-guidelines › logging](../../observability-guidelines/references/logging.md).
- SHOULD flag opaque abbreviations in new identifiers (`rec` for "record", `usr` for "user"). Prefer full words.
- SHOULD flag a value that breaks the project's established suffix/alias convention for its kind (e.g., an unresolved async value not carrying the expected naming alias), per the project's own component skill, if defined.
