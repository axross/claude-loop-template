# Frontmatter and Naming

Apply this reference when authoring or editing a `SKILL.md` frontmatter block or choosing the directory name for a skill.

## Required Fields

The required frontmatter fields are the discovery contract. The runtime reads `name` and `description` before loading the body, so mistakes here can make a correct skill invisible.

**Example:**

```yaml
---
name: code-review-guidelines
description: Apply this skill when reviewing a pull request or local diff...
---
```

**Guidelines:**

- MUST include a `name` field.
- MUST include a non-empty `description` field.
- MUST keep `name` 1-64 characters and match `^[a-z0-9]+(-[a-z0-9]+)*$`.
- MUST make the `name` field exactly match the parent directory name.
- MUST keep `description` 1-1024 characters.

## Optional Fields

Optional spec fields are useful only when they carry real runtime or distribution meaning. Most project-local skills need no optional fields.

**Guidelines:**

- MAY include `license` when the skill is licensed differently from the surrounding project.
- MAY include `compatibility` when the skill has concrete environment requirements.
- MAY include `metadata` as a string-to-string map for client-specific extensions.
- MAY include `allowed-tools` to pre-approve tools; its semantics are host-defined — some hosts (e.g., Claude Code) enforce it after a workspace-trust prompt, others ignore it.
- MAY include additional invocation-control frontmatter fields a host defines (e.g., Claude Code's `argument-hint`, `disable-model-invocation`, `user-invocable`) when targeting that host; omit them elsewhere.
- SHOULD omit optional fields that do not change how the skill is discovered, distributed, or executed.

## Host-Project Harness Fields

Host projects sometimes add non-spec fields that their local harness enforces. Treat these as runtime configuration, not clutter.

**Example:**

```yaml
---
name: orchestration-guidelines
description: Apply this skill when coordinating a multi-step local workflow...
user-invocable: false
---
```

**Guidelines:**

- MUST preserve existing harness fields when refining a skill.
- MUST NOT add a new harness field to only one skill unless the host project explicitly uses per-skill variation.
- SHOULD apply new harness fields project-wide when they represent runtime policy.
- MAY remove or replace harness fields when porting to a host project that does not support them.
- MUST document harness-field substitutions in the receiving project's master skill index when porting.

## Naming Rules

Kebab-case names are portable and predictable. The name should communicate the durable responsibility, not an incidental implementation detail.

**Guidelines:**

- MUST use kebab-case for skill directories and the `name` field.
- MUST NOT use uppercase letters, underscores, dots, spaces, leading hyphens, trailing hyphens, or consecutive hyphens.
- SHOULD describe the responsibility, such as `application-security-requirements`.
- SHOULD avoid actor names such as `security-reviewer` unless the host's taxonomy is explicitly actor-based.
- SHOULD avoid names that overlap conceptually with existing siblings.

## Naming for Discoverability

Discovery starts with the skill name and description. A name that already implies its trigger leaves the description more room for edge cases and user phrasings.

**Guidelines:**

- SHOULD choose a name that a future contributor can map to the right skill on the first try.
- SHOULD keep naming conventions consistent across the skill set.
- SHOULD prefer responsibility suffixes such as `-guidelines`, `-requirements`, `-principles`, or `-best-practices` when they fit the host project's voice.
- MUST rename a skill when its existing name would misroute likely prompts after a scope change.
