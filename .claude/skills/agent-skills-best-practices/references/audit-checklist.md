# Audit Checklist

Apply this reference when auditing a skill tree for structure, discoverability, links, and source-of-truth boundaries.

## Audit Order

A useful audit moves from inventory to mechanics to judgment. Mechanical checks catch broken structure; content review catches overlap, stale assumptions, and missing project-specific guidance.

1. Inventory skills and reference files.
2. Verify the master index and parent `SKILL.md` links.
3. Check parent routing-section format, section anatomy, and RFC-2119 guideline bullets.
4. Check relative links outside code fences.
5. Review content ownership and project fit.
6. Report prioritized improvement items.

**Guidelines:**

- MUST inventory every `SKILL.md` and reference file under the skill root.
- MUST verify each skill directory has exactly one parent `SKILL.md`.
- MUST verify every reference file is linked from its parent `SKILL.md`.
- SHOULD audit mechanical structure before judging writing quality.
- SHOULD report improvement items in priority order instead of listing every small observation.

## Structural Checks

Structural checks should be repeatable. They should ignore fenced code blocks so embedded examples do not create false positives.

**Example:**

```sh
find .claude/skills -name '*.md' -print | sort
```

**Guidelines:**

- MUST check that every parent `SKILL.md` reference-routing section uses `## Section/Topic Name`, `See [file.md](./references/file.md) for:`, and descriptive bullets without RFC-2119-style requirement keywords.
- MUST check that every substantive rule section has a `**Guidelines:**` block after its explanation or demonstration.
- MUST check that every guideline bullet begins with an RFC-2119 keyword.
- MUST check that relative Markdown links outside fenced code blocks resolve; this skill's `scripts/check-links.sh` automates the check (see [cross-referencing.md](./cross-referencing.md)).
- SHOULD check for stale plain labels such as `Guidelines:` or `Example:` when the project standard is bold subheading-like labels.
- SHOULD check for stale fenced `text` examples when a blockquote or table would be clearer.

## Content Review

Content review asks whether each skill owns one coherent responsibility and gives the agent project-specific information it would not reliably infer.

**Review Questions:**

> Does this rule belong here, or should this skill link to a source-of-truth skill?

> Does the guidance describe this repository, not the project it was imported from?

> Does the skill explain a local command, fragile behavior, or convention that affects real work?

**Guidelines:**

- MUST identify duplicated source-of-truth rules across sibling skills.
- MUST identify stale project assumptions, old framework guidance, missing commands, or paths that do not exist.
- SHOULD flag generic advice that does not add project-specific value.
- SHOULD prefer cross-links over copied doctrine when another skill owns the detailed rule.
- SHOULD note where examples, tables, diagrams, or command snippets would make abstract guidance easier to apply.

## Report Shape

The audit report should separate pass/fail mechanics from improvement planning. This keeps the user from confusing structural breakage with optional polish.

**Guidelines:**

- MUST state which structural checks passed, failed, or were not run.
- MUST list broken links, missing guideline blocks, or non-RFC guideline bullets as blockers.
- SHOULD group improvement items by skill or source-of-truth theme.
- SHOULD identify a recommended implementation order when multiple skills need coordinated edits.
- MUST state whether files were changed or the audit was analysis-only.
