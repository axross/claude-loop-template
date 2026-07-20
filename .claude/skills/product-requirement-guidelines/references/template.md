# Plan Document Template

Apply this reference as the starting skeleton for a full plan document — the canonical section structure every plan follows. It is self-contained: copy the skeleton, fill each section per the reference that owns it, and delete the annotations (the italic notes) before publishing. The structure has seven sections in a fixed order; **required** sections are always present, **conditional** sections are included when they apply and omitted with a one-line stated reason when they do not.

The canonical order:

1. **Summary** *(required)* — one standalone paragraph. See [problem-and-scope.md › Summary](./problem-and-scope.md#summary).
2. **Background** *(required)* — with **Goals**, **Non-goals**, and **Assumptions** subsections. See [problem-and-scope.md](./problem-and-scope.md).
3. **Functional requirements** *(conditional)* — with **UI design** and **System design** (the latter carrying an **Alternatives considered** subsection when a plausible competing approach exists) nested under it. See [functional-requirements.md](./functional-requirements.md), [ui-design-framing.md](./ui-design-framing.md), and [architecture-overview-framing.md](./architecture-overview-framing.md).
4. **Non-functional requirements** *(conditional)* — measurable performance/scale/security/reliability targets. See [architecture-overview-framing.md › Constraints and Non-Functional Requirements](./architecture-overview-framing.md#constraints-and-non-functional-requirements).
5. **Acceptance criteria** *(required)*. See [acceptance-criteria.md](./acceptance-criteria.md).
6. **Verification strategy** *(required)*. See [verification-strategy.md](./verification-strategy.md).
7. **Open questions** *(required, may be empty)*. See [problem-and-scope.md › Open Questions](./problem-and-scope.md#open-questions).

**Guidelines:**

- MUST keep the seven sections in the order above; MUST include every required section and omit a conditional one only with a one-line stated reason, never by silently dropping the heading.
- MUST fill every slot below or state why it does not apply; do not leave a slot silently empty.
- MUST delete the italic annotations before the plan is considered final.
- SHOULD keep the whole plan short for a small change; right-size per [problem-and-scope.md › Right-Sizing Scope](./problem-and-scope.md#right-sizing-scope) rather than padding every section.

## Skeleton

Everything in `<…>` is a slot to fill; everything in italics is an annotation to delete.

```markdown
## Summary

<One standalone paragraph: what the change is, who it is for, and the outcome it
produces — the whole plan in miniature, readable without any later section.>
_(problem-and-scope.md → Summary.)_

## Background

<The context a reader needs to understand why this change, why now — current state
and the trigger or constraint prompting it.>
_(problem-and-scope.md → Background and Goals.)_

**Goals**:
- <A concrete, checkable outcome the change must achieve.>

**Non-goals** (omit only if nothing plausible is being excluded):
- <Something that could reasonably have been in scope, deliberately excluded, and why.>
_(problem-and-scope.md → Non-Goals and Out-of-Scope.)_

**Assumptions** (beliefs the plan relies on — distinct from open questions):
- <A belief the plan acts on that the reader might disagree with.>
_(problem-and-scope.md → Assumptions.)_

## Functional requirements

_(Conditional — omit with a reason for a change with no observable behavior delta.
functional-requirements.md → When the Section Applies.)_

- <An observable capability the change delivers: an input accepted, an output or
  state change produced.>

### UI design

_(Conditional — include when the change is view-affected; otherwise state why it is
omitted. ui-design-framing.md.)_

<Hierarchy and content priority, interaction states, accessibility intent, responsive
behavior, and copy constraints — in spec terms, not implementation.>

### System design

_(Conditional — include when either the breadth or the mechanics trigger applies;
otherwise state why it is omitted. architecture-overview-framing.md.)_

<Data flow as named entities between processes and stores; which module owns which
state — not code or file layout.>

#### Alternatives considered

_(Include when a plausible competing approach exists.
architecture-overview-framing.md → Alternatives Considered.)_

- <A realistic alternative that was evaluated, and why it was rejected.>

## Non-functional requirements

_(Conditional — include when the change has measurable performance, scale, security,
or reliability targets; otherwise omit with a reason.
architecture-overview-framing.md → Constraints and Non-Functional Requirements.)_

- <A short, measurable target scoped to the component it constrains
  (e.g. "95th-percentile response under 200ms").>

## Acceptance criteria

- <One observable happy-path behavior, verifiable from the diff or the running UI
  without reading implementation code.>
- <One relevant edge/disabled/empty/error-state behavior.>
- <An explicit "X is unaffected" criterion, when this change sits next to something
  that must stay untouched.>
_(acceptance-criteria.md → Coverage and Right-Sized Checklists.)_

## Verification strategy

<How the acceptance criteria will be established: the automated gates the changed
surface triggers (format/lint, unit, e2e, build), the focused manual checks, and
where new test coverage is added.>
_(verification-strategy.md.)_

## Open questions

- <An unresolved decision the plan depends on: the question, its options if known,
  and who or what resolves it. Leave empty only if nothing is genuinely unresolved.>
_(problem-and-scope.md → Open Questions.)_
```
