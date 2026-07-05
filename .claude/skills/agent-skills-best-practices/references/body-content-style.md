# Body Content Style

Apply this reference when writing the Markdown body of a `SKILL.md` or any reference file under the host project's skill root. For parent `SKILL.md` sections that only route to reference files, use the routing format in [progressive-disclosure.md](./progressive-disclosure.md) instead of the description-then-guidelines pattern.

## Section Anatomy

A useful section teaches the topic before it commands behavior. Start with compact Markdown that demonstrates the point, then follow with requirement bullets. The demonstration may be prose, an ordered list, a blockquote, a table, a code snippet, a Mermaid diagram, or any other Markdown syntax that clarifies the topic.

**Example:**

```markdown
### Source URL Safety

External links from untrusted input can become clickable UI, so validation is a protocol allowlist:

1. Parse the value as an absolute URL.
2. Accept only web protocols.
3. Reject everything else before rendering metadata or links.

> Custom protocols are reserved for the project's own internal launch URLs, when it defines any.

**Guidelines:**

- MUST allow only `http:` and `https:` protocols.
- MUST reject `javascript:`, `data:`, custom protocols, and relative URLs.
- SHOULD render external links with `rel="noreferrer"` when they open a new tab.
```

**Guidelines:**

- MUST make every substantive rule section demonstrate its topic before listing requirements, regardless of heading depth.
- SHOULD write each section intro as rationale — why the rule exists — rather than a restatement of its first guideline bullet.
- MUST put RFC-2119 guideline bullets after the description, usually under a `**Guidelines:**` label.
- MUST NOT apply the `**Guidelines:**` requirement to parent `SKILL.md` reference-routing sections; those sections use `See [file.md](./references/file.md) for:` with descriptive bullets.
- MAY use H3, H4, or deeper headings when hierarchy improves readability.
- SHOULD use standard Markdown syntax such as prose, ordered lists, unordered lists, blockquotes, tables, code snippets, or Mermaid diagrams when that format explains the topic better than plain prose.
- SHOULD keep the demonstration short enough that the guideline bullets remain easy to scan.
- MUST NOT use examples as a substitute for explicit requirements.

## RFC-2119 Keywords

RFC-2119 keywords mark how strongly a rule applies. They let future agents distinguish absolute requirements from preferred defaults and true options.

| Keyword      | Synonym           | Meaning                                                                        |
| ------------ | ----------------- | ------------------------------------------------------------------------------ |
| "MUST"       | "REQUIRED"        | Non-negotiable requirement; no exceptions.                                     |
| "MUST NOT"   |                   | Non-negotiable prohibition; no exceptions.                                     |
| "SHOULD"     | "RECOMMENDED"     | Strongly preferred; deviation is allowed only after weighing the implications. |
| "SHOULD NOT" | "NOT RECOMMENDED" | Strongly discouraged; allowed only after weighing the implications.            |
| "MAY"        | "OPTIONAL"        | Genuinely optional; no preference implied.                                     |

**Guidelines:**

- MUST capitalize the keyword when it carries requirement-level meaning.
- MUST use RFC-2119 keywords for every normative guideline bullet.
- SHOULD reserve MUST and MUST NOT for non-negotiable rules.
- SHOULD use SHOULD and SHOULD NOT when valid exceptions exist.
- MAY use ordinary prose without RFC-2119 keywords for definitions, examples, and explanatory paragraphs.

## Decision-Language vs Implementation-Language

Different skills need different levels of procedural detail. A design-governance skill should explain choices and trade-offs; a mechanics skill should give concrete steps and command shapes.

**Decision-language Example:**

> SHOULD choose the smaller scope when two skill boundaries overlap.

**Implementation-language Example:**

> MUST run the project's unit-test command after changing validation helpers.

**Guidelines:**

- SHOULD write design skills in decision-language: what to choose, why, and when to choose otherwise.
- SHOULD write mechanics skills in implementation-language: what to do, in what order, and with which files or commands.
- MUST choose the dominant axis when a rule straddles both decision and implementation concerns.
- MUST cross-reference the neighboring skill instead of duplicating rules that belong elsewhere.

## Add What the Agent Lacks

Skills are most valuable when they encode facts the model would not infer reliably from general knowledge: project conventions, uncommon edge cases, local command sequences, and fragile failure modes.

**Guidelines:**

- MUST focus on project-specific conventions, non-obvious edge cases, and required local tools or APIs.
- MUST NOT explain general concepts the model already knows unless the project uses them in a surprising way.
- SHOULD keep a rule only when the agent is likely to get that behavior wrong without the skill.
- SHOULD recommend deleting a skill when it no longer adds knowledge beyond ordinary model behavior.

## Gotchas, Defaults, and Calibration

Good skills name a default path instead of presenting a menu, then explain exceptions only when those exceptions matter. Fragile tasks need tighter instructions than judgment-heavy tasks.

**Guidelines:**

- SHOULD include a gotcha near the top of the relevant file when a local fact defies reasonable assumptions.
- MUST name a default when multiple tools or approaches are valid.
- SHOULD mention alternatives only when they help the agent decide whether the default does not apply.
- SHOULD make fragile sequences prescriptive and judgment-heavy choices explanatory.
- SHOULD favor reusable procedures over one-off declarations.

## Precise Verbs

Precise verbs make requirements testable. "Route skill additions through AGENTS.md" is enforceable; "handle skill discovery" leaves too much to interpretation.

**Guidelines:**

- MUST use domain-anchored verbs such as `validate`, `route`, `cite`, `split`, `merge`, `link`, or `verify`.
- MUST NOT use vague verbs such as `handle`, `manage`, or `support` without a concrete object and action.
- SHOULD keep each guideline bullet focused on one action.
- MUST NOT use hedging language inside normative bullets.

## Section and Bullet Hygiene

Long sections hide requirements. When a section grows past a small, coherent list, split the section or move detail into a reference file.

**Single Prose Example:**

> Too broad: Use for code.

**Good Examples:**

> code-review-guidelines owns review reporting and severity.

> quality-assurance-guidelines owns test and verification evidence.

**Bad Example:**

> review-and-test-and-security-guidelines owns three separate decision contexts.

**Snippet example:** fenced code blocks are appropriate for Markdown, TypeScript, shell commands, Mermaid diagrams, and directory trees.

**Guidelines:**

- SHOULD keep each substantive section near seven guideline bullets.
- MUST NOT exceed ten guideline bullets in one section unless the section states why the exception is necessary.
- SHOULD keep bullets to one to three lines.
- SHOULD move long examples into concise fenced snippets instead of embedding them inside a sprawling bullet.
- MUST emphasize example and guideline labels as bold subheading-like paragraphs, such as `**Example:**` and `**Guidelines:**`.
- SHOULD format short prose examples as blockquotes under bold example labels instead of fenced `text` blocks.
- MUST group multiple Good/Bad examples under bold plural headings and blockquote each example.
- MAY split an overgrown section with deeper heading levels when the parent topic remains coherent.
- MUST preserve the description-then-guidelines pattern after splitting a substantive rule section.
- MUST preserve the parent routing-section pattern after splitting `SKILL.md` content into `references/`.
