# Description Writing

Apply this reference when authoring or revising the `description` or `when_to_use` field of a skill. Together they are the only body-adjacent text available during discovery: the runtime shows them concatenated in the skill listing, `description` first.

## Split What and When Across the Two Fields

The two fields divide one job: `description` says what the skill is and covers; `when_to_use` says when to load it, phrased as a routing instruction. A description that buries the trigger, or a `when_to_use` that restates coverage, wastes the field the reader is actually scanning.

**Example:**

```yaml
description: The security and privacy review lens for code changes. Covers secrets/env vars, input validation, ...
when_to_use: Use when reviewing security or privacy implications of a change — "is this safe", "auth", "PII", ...
```

**Guidelines:**

- MUST state what the skill covers in `description`, leading with the skill's identity (its lens, conventions, or workflow) before the coverage list.
- MUST state when the agent should apply the skill in `when_to_use`, using imperative routing phrasing such as "Apply when..." or "Use whenever...".
- MUST NOT phrase either field as third-person passive prose such as "This skill provides...".
- MUST NOT cut the what or the when dimension to fit a length budget; trim within each field instead.
- SHOULD state in a workflow entry-point skill's `when_to_use` when NOT to invoke it, so the model does not fire a heavyweight workflow on a casual prompt.

## Triggering Keywords

Agents match surface text as well as semantics. Include the terms users, reviewers, and maintainers are likely to type — primarily in `when_to_use`, where trigger text belongs.

**Guidelines:**

- SHOULD include literal domain tokens such as `SKILL.md`, `MECE`, `AGENTS.md`, or the names of neighboring skills in `description` when they mark the skill's territory.
- SHOULD include likely user phrasings in `when_to_use`, including short prompts like "split this skill" or "audit skills".
- MUST include symptom-based triggers when users may describe the problem instead of the domain.
- SHOULD NOT pad either field with broad keywords outside the skill's actual scope.

## Length Discipline

Discovery metadata competes for context across the entire skill set. The goal is enough signal for routing without crowding out neighboring skills.

**Guidelines:**

- MUST NOT exceed 1,024 characters in `description` — the spec's hard limit.
- MUST keep `description` + `when_to_use` combined at or under 1,536 characters — the Claude Code skill listing truncates there.
- SHOULD target roughly 300–800 characters for `description` and 150–400 for `when_to_use`.
- SHOULD trim duplicated synonyms before trimming meaningful trigger coverage.
- MUST assume over-limit text may be truncated, ignored, or rejected by a host runtime.

## Common Failure Modes

Most discovery-metadata failures are routing failures. They either prevent the skill from loading when it should or load it for prompts it does not own.

**Failure Examples:**

> Too narrow: Use when designing the homepage.

> Too broad: Use for code.

> Missing when: a coverage-only description with no `when_to_use`.

**Guidelines:**

- MUST fix `when_to_use` text that triggers only on the obvious happy-path phrasing.
- MUST narrow trigger text that fires on shared words unrelated to the skill's scope.
- MUST replace vague verbs such as `helps`, `handles`, or `manages` with concrete trigger verbs.
- MUST add a `when_to_use` when the frontmatter lists coverage but never says when to apply the skill.
