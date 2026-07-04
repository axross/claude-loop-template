# Product Requirement Section Template

Apply this reference as a starting skeleton for the "Product requirement" and "Acceptance criteria" sections of a spec. It is self-contained: copy the skeleton, fill each slot per [problem-and-scope.md](./problem-and-scope.md) and [acceptance-criteria.md](./acceptance-criteria.md), and delete the annotations (the italic notes) before publishing. Omit a slot only when it genuinely does not apply, and say why inline instead of leaving it blank.

**Guidelines:**

- MUST fill every slot below or state why it does not apply; do not leave a slot silently empty.
- MUST delete the italic annotations before the spec is considered final.
- SHOULD keep the whole template short for a small change; right-size per [problem-and-scope.md](./problem-and-scope.md#right-sizing-scope).

## Skeleton

```markdown
## Product requirement

<One to three sentences: who is affected, what is broken or missing for them, and why it
matters. State the outcome sought, not the feature being built.>
_(See problem-and-scope.md → Outcome Before Solution.)_

**Non-goals** (omit only if nothing plausible is being excluded):
- <A thing that could reasonably have been in scope, deliberately excluded, and why.>
_(See problem-and-scope.md → Non-Goals and Out-of-Scope.)_

**Assumptions** (distinct from open questions — an open question blocks planning and gets
asked instead):
- <A belief the plan relies on that the reader might disagree with.>
_(See problem-and-scope.md → Assumptions vs. Open Questions.)_

## Acceptance criteria

- <One observable happy-path behavior, phrased so a reviewer can verify it from the
  diff or the running UI without reading implementation code.>
- <One relevant edge/disabled/empty/error-state behavior.>
- <An explicit "X is unaffected" criterion, when this change sits next to something
  that must stay untouched.>
- <Additional criteria only for behavior the sections above actually specify —
  right-size the checklist per the pointer below.>
_(See acceptance-criteria.md → Coverage and Right-Sized Checklists.)_
- <The verification gates this change requires — e.g. format/lint, unit tests, e2e
  tests, build — as trailing items.>
_(See acceptance-criteria.md → Right-Sized Checklists.)_
```
