# Cross-Referencing and Index Sync

Apply this reference whenever a skill cites another skill, a reference file is added or renamed, or a skill is added, renamed, moved, or removed.

## Relative-Path Links

Relative links keep skills portable when the skill root moves. Use links from the file doing the citing, not from the repository root, except for root-level index documents.

**Example:**

```markdown
Consult [Quality Assurance Guidelines](../../quality-assurance-guidelines/SKILL.md) when a review finding depends on test coverage.
```

**Guidelines:**

- MUST use relative paths for cross-skill links.
- MUST use leading-dot relative paths for links inside the same skill, such as `./references/topic.md`.
- MUST NOT use repo-root absolute paths for skill-to-skill links.
- MAY use root-relative paths for repo-root documents when the host renderer resolves them reliably.
- MUST verify that every changed relative link resolves on disk.

## No Content Duplication

Duplicated rules rot independently. A citing skill may summarize a neighbor's rule, but the detailed requirement should live in one source skill.

**Guidelines:**

- MUST keep each rule's detailed wording in exactly one source skill.
- MUST NOT copy full rule wording into multiple skills for convenience.
- SHOULD provide a one-line summary plus a link when another skill needs context.
- MUST move duplicated guidance back to one owner when overlap appears.

## Triggering Conditions on Cross-Skill Links

A cross-skill link should tell the agent when to consult the neighbor. This avoids loading broad doctrine for tasks that do not need it.

**Guidelines:**

- MUST state the condition under which a cross-skill link should be followed.
- SHOULD make the trigger specific enough that the agent can decide not to follow it.
- MUST NOT use bare "See also" links without a routing condition.
- SHOULD put cross-skill links near the section where the adjacent topic arises.

## Master Skill Index Sync

The master index is the host project's routing table. If it points to missing skills or omits new ones, discovery fails before skill content can help.

**Guidelines:**

- MUST update the master skill index when a skill is added, renamed, moved, or removed.
- MUST add a new skill to the appropriate topic or role section when the host index uses those sections.
- MUST NOT leave the master index pointing at deleted or renamed paths.
- SHOULD keep index descriptions concise and trigger-focused.
- MUST verify every master-index link touched by the change.

## Parent SKILL.md Sync

The parent `SKILL.md` is the routing table for Markdown topic files under `references/`. Reference-file changes are incomplete until the parent route is accurate and every `./references/...` link resolves.

**Guidelines:**

- MUST update the parent `SKILL.md` when adding, deleting, or renaming a reference file.
- MUST ensure every reference file is linked from the parent `SKILL.md`.
- MUST keep split skill topic files under `references/` and link them as `./references/<topic>.md` from the parent `SKILL.md`.
- MUST refresh the parent description when new reference content changes the skill's discovery scope.
- MUST delete or wire in orphan reference files.

## Link Resolution Check

Link checks catch quiet skill failures. They are especially important after renames because broken links may not fail tests.

**Example Verification Flow:**

```mermaid
flowchart LR
  A[Rename skill] --> B[Update name frontmatter]
  B --> C[Update cross-skill links]
  C --> D[Update master index]
  D --> E[Verify links resolve]
```

**Guidelines:**

- MUST verify relative links before finalizing a skill-tree change.
- MUST update directory name, `name` frontmatter, cross-references, master-index entries, and role-profile references together during a rename.
- SHOULD include touched skill paths in the change summary for rename or consolidation work.
- MUST NOT finalize a skill move while any old path remains in the index.
