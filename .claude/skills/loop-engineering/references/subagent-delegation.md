# Direct and Delegated Execution

Apply this reference when qualifying an implementation assignment or selected review checkpoint, and when integrating a contribution. The loop specifies evidence and phase meaning; applicable host guidance owns general actor selection, read routing, and invocation mechanisms.

## Checkpoint Qualification

A qualification belongs to one proposed assignment at one checkpoint, not to the host for the whole run. A configured role or visible tool alone establishes neither permitted purpose nor access to current material. [SKILL.md](../SKILL.md) states the independent-checkpoint rule; this reference defines the evidence for applying it.

**Guidelines:**

- MUST identify the checkpoint, assignment purpose, proposed invocation route, applicable eligibility conditions, role and material access, and required authorization before relying on that route.
- MUST record the determination and its grounds for that assignment, including which condition failed when no route qualifies. Distinguish missing capability, prohibited purpose, missing material, missing authorization, failed execution, and unknown outcome through [the handoff result contract](./implementation-package.md).
- MUST record whether each selected review ran and which actual current artifact, required materials, and policy it covered; qualify completion under [the review-result contract](./implementation-package.md#review-result), not from a role name or zero findings alone.
- MUST requalify after a relevant purpose, material, policy, or capability change, preserving earlier results and the applicable retry and review budgets. Requalification does not renew authorization or make stale coverage current.
- MUST NOT repeat permission requests for an unchanged prohibited purpose or manufacture assignments to make an otherwise ineligible invocation appear eligible.

## Conditional Host Defaults

Use applicable host guidance for the current operation, without requiring a private setting, plugin, named actor, or adapter. Without such guidance, the bounded default is eligible subagent implementation, with driver execution only when delegation is unavailable or disallowed, or when the brief would be longer than the diff, as the [delegation matrix](#delegation-matrix) states. A review still requires an eligible fresh non-author context; driver execution is not that context.

**Guidelines:**

- MUST follow applicable host guidance within actual tool conditions; when that guidance is absent, use the bounded defaults above and current permitted tool contracts, reporting any required capability that cannot be established.
- MUST NOT require a universal actor ranking, role name, model, tool, separate checkout, live conversation, or resumable child, or use another invocation mechanism to evade a prohibited purpose.

## Delegation Matrix

This matrix applies only where [Checkpoint Qualification](#checkpoint-qualification) already qualifies delegation for the assignment, and grants no authorization: it neither permits a tool, a publication or an operation grant nor qualifies a route. It says which work goes to which actor once delegation is open.

| Actor    | Work it holds                                                                                                                                                                                               | Work it does not hold                                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Driver   | Intake, plan authorship, questions to the human, approvals, finding triage, push and pull request operations (a post-push reviewer posts its own review), the integration check of the diff, and reporting. | A large-input reduction, which a reader takes, and implementation after approval, which a writer takes, except where the brief would be longer than the diff. |
| Reader   | A task whose input is large and whose conclusion is small: a wide search, a long log (including diagnosing a CI failure), a long pull request thread reduced to a finding list, or history.                 | An exact single lookup, which the driver does directly.                                                                                                       |
| Writer   | Implementation after approval; running the checks; self-review; committing locally.                                                                                                                         | An edit whose brief would be longer than the diff, which the driver makes; pushing; and the final check, which the driver re-runs on the integrated diff.     |
| Reviewer | A fresh instance for each round of plan review, pre-push review and post-push review.                                                                                                                       | Resumption, the author's conversation, and an earlier round's findings.                                                                                       |

**Guidelines:**

- MUST assign work to the actor the table names, subject to the exceptions it states and to a post-push reviewer posting its own review.
- MUST bound a brief or handback by its shape, never by a numeric token cap: a reader hands back its conclusion and locators, and a writer hands back the result record the [execution result contract](./implementation-package.md#execution-result) defines.

## Compatibility Preflight

An executor should fail before effects, not after them. Preflight checks the assignment's required reads, writes, commands, return path, and material fidelity against actual permitted capabilities.

When preflight concerns applicable skill material in a controlled internal actor,
consult the project's actor-local skill-acquisition practices, where present,
for required versus observed material in that actor's current context. Without
that owner, report the acquisition-assessment limit; the required access and
judging-actor context rules here still apply.

**Guidelines:**

- MUST confirm access to every required material at its declared fidelity before execution; visual access means the image is actually rendered to the actor.
- MUST return a non-complete result before editing when source, revision, uncommitted diff, required material, permission, or return path does not match the assignment.

## Integration Boundary

This boundary applies when an actor assigns a contribution and retains responsibility for the whole change. The contribution's `complete` result closes only that assignment; the responsible actor still verifies integrated evidence and advances the loop.

Before accepting an investigation conclusion or using a returned plan or design in dependent work, apply [plan-review.md](./plan-review.md). Receiving the contribution alone does not establish current plan review.

**Guidelines:**

- MUST compare the result, including its self-review material, policy, outcome, findings, and limitations, with actual changed files, uncommitted state, commits, checks, processes, and the approved revision before accepting it.
- MUST NOT accept missing, outdated, or mismatched required self-review evidence as clean; integration changes require current loop-driver self-review evidence against the integrated diff.
- MUST inspect the integrated result rather than treating a receipt as proof that the whole change is ready.
- MUST issue a fresh assignment after a plan revision; a clarification that does not change the plan may continue under the current assignment.
