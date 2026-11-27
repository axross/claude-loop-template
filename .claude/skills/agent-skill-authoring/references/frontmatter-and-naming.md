# Frontmatter and Naming

Apply this reference when authoring or editing a `SKILL.md` frontmatter block or choosing the directory name for a skill.

## Required Fields

The [Agent Skills specification](https://agentskills.io/specification) requires `name` and `description`. They form the portable discovery contract; an individual host accepting their omission does not relax that contract. The specification limits `description` to 1,024 characters; this skill's validator enforces the stricter 1,024-byte limit for compatibility, so non-ASCII text can reach that limit sooner.

**Example:**

```yaml
---
name: code-review-guidelines
description: The review methodology for pull requests and local diffs...
---
```

Every constraint on those two fields — that both are present, that `name` is kebab-case, within 64 characters, and matches its directory, and that `description` stays within its length cap — is decided mechanically by `scripts/check-skill-frontmatter.mjs`, which the parent `SKILL.md` requires you to run after editing frontmatter. This section therefore states the contract and carries no rules of its own.

## Frontmatter Is YAML, and a Description Is a YAML Scalar

Frontmatter is parsed as YAML, so a `description` is not free text: a handful of constructs make a parser read the value as structure rather than as prose. The failure is severe and quiet. A host either refuses the skill outright — `Nested mappings are not allowed in compact mappings` — or, worse, loads it carrying a value the author never wrote, because ` #` opens a comment and truncates everything after it and a leading `&` is read as an anchor and dropped.

**Example:**

```yaml
# Breaks: the colon before a space opens a nested mapping.
description: The agentskills.io format: capability framing and discovery metadata.

# Works: quoting makes the same text a plain scalar again.
description: "The agentskills.io format: capability framing and discovery metadata."
```

The hazards are a colon before a space or at the end of the value, a `#` at the start or after a space, and an opening ``[ { ] } , & * ! | > % @ ` " '`` — or an opening `-`, `?`, or `:` before a space. A colon with no space after it is fine, which is why `Top 10:2025` needs no quoting.

Inside a double-quoted value only YAML's own escapes are legal: `\0`, `\a`, `\b`, `\t`, `\n`, `\v`, `\f`, `\r`, `\e`, `\"`, `\/`, `\\`, `\N`, `\_`, `\L`, `\P`, a literal escaped space, and the numeric `\xNN`, `\uNNNN`, and `\UNNNNNNNN` forms. Anything else — `\d`, `\s`, `\w` and the rest of the regex-flavored set a reader reaches for by habit — is a parse error, not a literal backslash.

**Guidelines:**

- MUST quote a `description` that carries any of the constructs above, rather than rewording to avoid them — the text is the routing signal, and quoting costs nothing but two characters.
- MUST escape a literal `"` as `\"` inside a double-quoted value, and double a literal `'` to `''` inside a single-quoted one; an unpaired quote ends the scalar early and the rest of the line becomes a parse error.
- MUST use single quotes, or a numeric escape, to carry a backslash sequence YAML does not define; a double-quoted value containing `\d` or `\s` is rejected outright rather than read as a literal backslash.
- SHOULD leave a description unquoted when it carries no hazard, since quoting every value forces escape handling on the many descriptions that need none.
- MUST NOT treat a passing `scripts/check-skill-frontmatter.mjs` run as proof that a host will load the skill unless that run includes this check; a validator reading frontmatter with a regex cannot see a construct that only a parser resolves.

## Invocation-Control and Discovery Fields

Two archetypes describe how a skill is used: a **guideline skill** supplies reference rules consulted during work; a **workflow entry-point skill** supplies a runnable workflow a human launches. These terms describe purpose, not required metadata.

The [Claude Code skill reference](https://code.claude.com/docs/en/skills#frontmatter-reference) documents optional controls such as `user-invocable`, `disable-model-invocation`, `argument-hint`, `arguments`, and `when_to_use`. These are host extensions, not portable Agent Skills requirements. A guideline skill can remain model-discoverable without declaring a slash-command policy.

When a project selects Claude Code invocation controls, `user-invocable: false` hides a skill from its slash menu and prevents direct slash invocation. `disable-model-invocation: true` prevents automatic loading instead. These controls affect different callers; neither follows merely from calling a skill a guideline or a workflow. Consult the host reference for defaults and argument substitution rather than applying these controls to another host by analogy.

**Guidelines:**

- MUST state a skill's trigger in `description`, front-loaded, per [description-writing.md](./description-writing.md), rather than relying on a host extension to carry it.
- MUST treat invocation controls as optional host configuration, required only when an applicable project policy selects them, not by skill archetype alone.
- SHOULD use `user-invocable: false` when a Claude Code project explicitly wants model-only invocation, and an `argument-hint` when a human-invoked skill accepts arguments.
- MUST verify argument substitution against the selected host before using `arguments` or `$ARGUMENTS`; neither syntax is a portable execution contract.
- SHOULD reserve `disable-model-invocation: true` for a Claude Code skill whose intended invocation policy excludes automatic loading.
- MUST re-verify that discovery still routes to the skill after changing `name`, `description`, or an invocation-control field, since those fields — not the body — are what a runtime reads to decide whether to load it at all.

## Other Optional Fields

The [Agent Skills specification](https://agentskills.io/specification) defines optional `license`, `compatibility`, `metadata`, and experimental `allowed-tools`. Being in the standard does not guarantee uniform runtime behavior: `allowed-tools` is a space-separated string in the specification, but its enforcement depends on the host.

**Guidelines:**

- MAY include `license` when the skill is licensed differently from the surrounding project.
- MAY include `compatibility` when the skill has concrete environment requirements.
- MAY include `metadata` as a string-to-string map for client-specific extensions.
- MAY include `allowed-tools` where the selected host documents its effect; a declaration does not establish tool availability or permission beyond that host's contract.
- SHOULD omit optional fields that do not change how the skill is discovered, distributed, or executed.

## Host-Project Harness Fields

Host extensions are runtime configuration, not clutter to remove blindly. Support depends on the receiving host and distribution path, not just the authoring host: [Claude Code's documentation](https://code.claude.com/docs/en/skills#using-skill-frontmatter-outside-claude-code) describes upload and packaging paths that reject fields its local skill loader accepts. Unknown fields are not guaranteed to be ignored.

**Example:**

```yaml
---
name: orchestration-guidelines
description: The coordination rules for multi-step local workflows...
user-invocable: false
---
```

**Guidelines:**

- MUST preserve existing supported harness fields during unrelated refinements; change them only as part of an explicit metadata or invocation-policy change.
- MUST check the receiving host's authoritative documentation and distribution requirements before claiming an extension is supported; one parser accepting it proves neither portability nor execution behavior.
- MUST NOT add host extensions across a library by default or require them for portable compliance; apply only the scope selected by project policy.
- MUST fold an orphaned host discovery field back into `description` when porting to a host that does not read it, so the trigger survives the port rather than going silently unread.
- MUST record any extension removal or substitution and its compatibility consequence where the receiving project records skill configuration; do not invent an equivalent field.
- MUST route installation, reload, and active source/content confirmation to the project's skill-management practices when validating a port; a structure check alone cannot prove loading.

## Naming Rules

Kebab-case names are portable and predictable. The name should communicate the durable responsibility, not an incidental implementation detail. The kebab-case form itself — and the uppercase, underscore, dot, space, and stray-hyphen shapes it excludes — is decided by `scripts/check-skill-frontmatter.mjs`, which the parent `SKILL.md` requires you to run; what follows is the part a regex cannot judge.

**Guidelines:**

- SHOULD describe the responsibility, such as `application-security` or `software-instrumentation`.
- SHOULD avoid actor names such as `security-reviewer` unless the host's taxonomy is explicitly actor-based.
- SHOULD avoid names that overlap conceptually with existing siblings.

## Naming for Discoverability

Discovery starts with the skill name and description. A name that already implies its trigger leaves the description more room for edge cases and user phrasings.

**Guidelines:**

- SHOULD choose a name that a future contributor can map to the right skill on the first try.
- SHOULD keep naming conventions consistent across the skill set.
- SHOULD name the skill as a capability — what it lets an agent do — per [capability-framing.md](./capability-framing.md), which owns the preference and the suffixes to avoid.
- SHOULD use a plain verb name (`address`, `handoff`) for a workflow entry-point skill whose `/<name>` invocation reads as a command.
- MUST rename a skill when its existing name would misroute likely prompts after a scope change.
