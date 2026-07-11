# Frontmatter and Naming

Apply this reference when authoring or editing a `SKILL.md` frontmatter block or choosing the directory name for a skill.

## Required Fields

The required frontmatter fields are the discovery contract. The runtime reads `name` and `description` before loading the body, so mistakes here can make a correct skill invisible.

**Example:**

```yaml
---
name: code-review-guidelines
description: The review methodology for pull requests and local diffs...
---
```

**Guidelines:**

- MUST include a `name` field.
- MUST include a non-empty `description` field.
- MUST keep `name` 1-64 characters and match `^[a-z0-9]+(-[a-z0-9]+)*$`.
- MUST make the `name` field exactly match the parent directory name.
- MUST keep `description` 1-1024 characters.

## Invocation-Control and Discovery Fields

Claude Code merged custom slash commands into skills: a skill at `.claude/skills/<name>/SKILL.md` is invocable as `/<name>` by the human, and the model can also load it when its discovery metadata matches the task. A set of Claude-Code-defined frontmatter fields controls both directions. They are not part of the portable agentskills.io spec — treat them as harness fields (see [Host-Project Harness Fields](#host-project-harness-fields)) — but this project targets Claude Code and manages them deliberately on every skill.

| Field | Meaning | Default |
| ----- | ------- | ------- |
| `when_to_use` | Trigger context appended to `description` in the model's skill listing; tells the agent when to load or invoke the skill | — |
| `argument-hint` | Hint shown in the `/` autocomplete telling the human what arguments the skill expects | — |
| `arguments` | Named positional arguments substituted as `$name`; values are shell-quoted, so a multi-word value lands in one argument only when the invoker quotes it | — |
| `user-invocable` | `false` hides the skill from the `/` menu; the model can still load it | `true` |
| `disable-model-invocation` | `true` keeps the skill and its discovery metadata out of the model's reach; only a human can invoke it | `false` |

This project distinguishes two skill archetypes and sets these fields by archetype: a **guideline skill** is reference rules the agent consults while working (the bulk of the skill root); a **workflow entry-point skill** is a runnable workflow a human launches as `/<name>`, such as a delivery driver or a session-handoff wrapper.

**Guidelines:**

- MUST give every skill a `when_to_use` stating when to apply it, alongside a `description` stating what it is and covers, per the [description-writing](./description-writing.md) reference.
- MUST keep the combined `description` + `when_to_use` length at or under 1,536 characters; the Claude Code skill listing truncates there.
- MUST set `user-invocable: false` on guideline skills — they are reference material the model routes to, not workflows a human launches from the `/` menu.
- MUST give every workflow entry-point skill an explicit `user-invocable: true` (the default, written out for contrast with its siblings) and an `argument-hint`, and state in `when_to_use` both when to invoke the skill and when not to.
- MUST declare `arguments` only when the skill's invocation takes discrete single-token parameters; a free-form or multi-word target MUST keep `$ARGUMENTS` instead, because shell-style quoting would otherwise split it across positional arguments.
- SHOULD reserve `disable-model-invocation: true` for skills that must never run without an explicit human invocation; this project's entry points instead stay model-invocable and draw the boundary with a do-not-invoke clause in `when_to_use`.

## Other Optional Fields

Optional spec fields are useful only when they carry real runtime or distribution meaning. Most project-local skills need none of them.

**Guidelines:**

- MAY include `license` when the skill is licensed differently from the surrounding project.
- MAY include `compatibility` when the skill has concrete environment requirements.
- MAY include `metadata` as a string-to-string map for client-specific extensions.
- MAY include `allowed-tools` to pre-approve tools; its semantics are host-defined — some hosts (e.g., Claude Code) enforce it after a workspace-trust prompt, others ignore it.
- SHOULD omit optional fields that do not change how the skill is discovered, distributed, or executed.

## Host-Project Harness Fields

Host runtimes define non-spec fields their harness enforces — the invocation-control fields above are Claude Code's. Treat these as runtime configuration, not clutter, and mind them when porting a skill between hosts.

**Example:**

```yaml
---
name: orchestration-guidelines
description: The coordination rules for multi-step local workflows...
when_to_use: Apply when coordinating a multi-step local workflow...
user-invocable: false
---
```

**Guidelines:**

- MUST preserve existing harness fields when refining a skill.
- MUST NOT add a new harness field to only one skill unless the host project explicitly uses per-skill variation.
- SHOULD apply new harness fields project-wide when they represent runtime policy, as this project does with `when_to_use` and `user-invocable`.
- MAY remove or replace harness fields when porting to a host project that does not support them; fold an orphaned `when_to_use` back into the `description` so the trigger text survives the port.
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
- SHOULD prefer responsibility suffixes such as `-guidelines`, `-requirements`, `-principles`, or `-best-practices` when they fit the host project's voice, and a plain verb name (`address`, `handoff`) for a workflow entry-point skill whose `/<name>` invocation reads as a command.
- MUST rename a skill when its existing name would misroute likely prompts after a scope change.
