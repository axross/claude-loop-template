---
name: agent-skills-best-practices
description: Apply this skill whenever creating, refining, restructuring, renaming, or auditing an agent skill under the host project's skill root (e.g., `.claude/skills/`) - drafting a `SKILL.md`, splitting a skill into reference files, tightening a `description`, or deciding where a new rule belongs. Covers agentskills.io frontmatter, host-project harness fields, kebab-case naming, description writing for discovery, section anatomy with concise examples plus RFC-2119 guideline bullets, progressive disclosure, name-based cross-references, archetype skeletons for the INIT-created project skills (structure, component, UI/design), audit checks, and keeping the host project's master skill index in sync.
---

# Agent Skills Best Practices

Apply this skill whenever creating, refining, splitting, consolidating, renaming, or auditing any agent skill under the host project's skill root.

This skill governs authoring discipline for skills written in the agentskills.io format. For the host project's active skill inventory and topic-to-skill routing, defer to the project's master skill index and the directory listing under the skill root.

## Scoping and MECE

See [scoping-and-mece.md](./references/scoping-and-mece.md) for:

- choosing a coherent skill boundary, skill name, split, consolidation, or source-of-truth location
- checking overlap with neighboring skills before adding new guidance
- using section length and topic growth as signals for restructuring

## Frontmatter and Naming

See [frontmatter-and-naming.md](./references/frontmatter-and-naming.md) for:

- creating or editing discovery-critical `SKILL.md` frontmatter
- choosing the skill directory name and keeping it aligned with the `name` field
- porting or preserving host-project harness fields

## Description Writing

See [description-writing.md](./references/description-writing.md) for:

- drafting, trimming, or auditing the `description` field
- making discovery metadata say both what the skill covers and when to apply it
- adding likely user phrasings and symptom-based triggers without over-broadening the skill

## Body Content Style

See [body-content-style.md](./references/body-content-style.md) for:

- writing or revising substantive skill-body or reference-file sections
- balancing concise topic explanation, examples, and guideline bullets
- placing normative RFC-2119 requirement bullets in detailed reference content rather than parent routing sections

## Progressive Disclosure

See [progressive-disclosure.md](./references/progressive-disclosure.md) for:

- deciding when a skill should stay single-file or split into `references/`
- using the parent routing-section format: `## Topic`, `See [file.md](./references/file.md) for:`, then descriptive situation bullets
- keeping parent routing bullets free of RFC-2119-style requirement keywords so they remain routing cues, not duplicated rules

## Cross-Referencing and Index Sync

See [cross-referencing.md](./references/cross-referencing.md) for:

- adding, renaming, moving, deleting, or linking skills and reference files
- choosing one source of truth instead of copying detailed rules across skills
- using name-based cross-skill references, verifying intra-skill relative links, and keeping the host project's master skill index synchronized

## Project Skill Archetypes

See [project-skill-archetypes.md](./references/project-skill-archetypes.md) for:

- creating the INIT-called-for project skills: structure, component, and UI/design
- the three-way ownership triangle and each archetype's skeleton, topics checklist, or table patterns
- growing archetype skeletons with worked examples and mechanical boundary checks

## Audit Checklist

See [audit-checklist.md](./references/audit-checklist.md) for:

- auditing multiple skills or reporting skill-tree quality
- checking inventory, index sync, section anatomy, RFC-2119 bullets, name-based cross-skill references, and relative links
- identifying overlap, stale assumptions, orphan references, and missing source-of-truth links
