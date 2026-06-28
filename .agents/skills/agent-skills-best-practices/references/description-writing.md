# Description Writing

Apply this reference when authoring or revising the `description` field of a skill. The description is the only skill body-adjacent text available during discovery.

## Imperative Phrasing

The description should tell the agent when to load the skill. Imperative phrasing turns the field into a routing instruction instead of passive documentation.

**Example:**

```yaml
description: Apply this skill when reviewing a diff for validation, tests, or route behavior.
```

**Guidelines:**

- MUST use agent-facing phrasing such as "Apply this skill when..." or "Use this skill whenever...".
- MUST NOT phrase the description as third-person prose such as "This skill provides...".
- SHOULD lead with the trigger condition before listing detailed coverage.
- SHOULD keep the sentence direct enough to work as routing metadata.

## What and When in One Field

A useful description contains both coverage and trigger. "Covers validation and routing" says what but not when; "Use for security work" says when but not what.

**Complete Description Example:**

> Apply this skill when reviewing untrusted-input security: covers request decoding, source URL validation, internal URI construction, metadata exposure, and dependency risk.

**Guidelines:**

- MUST state what the skill covers.
- MUST state when the agent should apply it.
- SHOULD list the most important rule categories the skill owns.
- SHOULD list user-visible task triggers, including prompts that do not name the domain directly.
- MUST NOT cut either the what or the when dimension to fit the length budget.

## Triggering Keywords

Agents match surface text as well as semantics. Include the terms users, reviewers, and maintainers are likely to type.

**Guidelines:**

- SHOULD include literal domain tokens such as `SKILL.md`, `MECE`, `AGENTS.md`, or the names of neighboring skills when relevant.
- SHOULD include likely user phrasings, including short prompts like "split this skill" or "audit skills".
- MUST include symptom-based triggers when users may describe the problem instead of the domain.
- SHOULD NOT pad descriptions with broad keywords outside the skill's actual scope.

## Length Discipline

Descriptions compete for discovery context across the entire skill set. The goal is enough signal for routing without crowding out neighboring skills.

**Guidelines:**

- SHOULD target about 768 characters.
- MUST NOT exceed the 1024-character hard limit.
- SHOULD trim duplicated synonyms before trimming meaningful trigger coverage.
- SHOULD trim marginal phrases before removing core coverage.
- MUST assume over-limit descriptions may be truncated, ignored, or rejected by a host runtime.

## Common Failure Modes

Most description failures are routing failures. They either prevent the skill from loading when it should or load it for prompts it does not own.

**Failure Examples:**

> Too narrow: Use when designing the homepage.

> Too broad: Use for code.

> Missing when: Covers validation and metadata.

**Guidelines:**

- MUST fix descriptions that trigger only on the obvious happy-path phrasing.
- MUST narrow descriptions that fire on shared words unrelated to the skill's scope.
- MUST replace vague verbs such as `helps`, `handles`, or `manages` with concrete trigger verbs.
- MUST add an explicit trigger when the description lists coverage but not when to apply the skill.
