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

Use applicable host guidance for the current operation, without requiring a private setting, plugin, named actor, or adapter. Without such guidance, the bounded default is eligible subagent implementation, with driver execution only when delegation is unavailable or disallowed. A review still requires an eligible fresh non-author context; driver execution is not that context.

**Guidelines:**

- MUST follow applicable host guidance within actual tool conditions; when that guidance is absent, use the bounded defaults above and current permitted tool contracts, reporting any required capability that cannot be established.
- MUST NOT require a universal actor ranking, role name, model, tool, separate checkout, live conversation, or resumable child, or use another invocation mechanism to evade a prohibited purpose.

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

Before accepting an investigation conclusion or using a returned plan or design in dependent work, apply [reviewing-phase-deliverables.md](./reviewing-phase-deliverables.md). Receiving the contribution alone does not establish current artifact review.

**Guidelines:**

- MUST compare the result, including its self-review material, policy, outcome, findings, and limitations, with actual changed files, uncommitted state, commits, checks, processes, and the approved revision before accepting it.
- MUST NOT accept missing, outdated, or mismatched required self-review evidence as clean; integration changes require current loop-driver self-review evidence against the integrated diff.
- MUST inspect the integrated result rather than treating a receipt as proof that the whole change is ready.
- MUST issue a fresh assignment after a plan revision; a clarification that does not change the plan may continue under the current assignment.
