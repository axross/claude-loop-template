# Choosing a Response to Findings

Apply this reference before choosing a response to advisory pre-flight or independent-review findings. It routes author-side judgment and correction selection; the stage's own reference still owns finding identity, disposition authority, evidence durability, fresh review, and round limits.

## Judgment and Implementation Owners

The driver needs to decide what the finding establishes before deciding how to change the work. A reviewer can identify a real concern while proposing an unsuitable fix. A disputed remedy does not erase that concern, and satisfying the suggested edit is not itself the task's outcome.

**Guidelines:**

- MUST consult the project's conduct practices for feedback judgment, where present, when evaluating a finding against the approved purpose, evidence, and settled constraints.
- MUST consult the project's development practices for causal correction selection and verification, where present, before implementing a remedy; detailed design and test mechanics stay with those owners.

## Standalone Response

When either owner is absent, use the following bounded summary for its missing responsibility, not as a second source of truth beside an installed owner:

1. Identify the approved outcome or invariant at stake; separate the observation, proposed explanation, and suggested fix.
2. Check the claim against the actual material and contract. Retain uncertain facts as unknown; return unresolved human tradeoffs rather than silently revising the task.
3. Choose a scope-bounded correction to the evidenced cause, or present the evidence for a different remedy or permitted dismissal. An obvious mechanical fix needs a direct check, not a speculative redesign.
4. Verify the intended outcome and required preserved behavior, not only the vanished symptom. Disclose reproduction or verification gaps and distinguish urgent mitigation from permanent resolution.

The summary supplies no new finding states or dismissal authority. An assessment that recommends no code change still passes through the applicable disposition contract. A shared-cause correction can serve several findings without collapsing their identities.

**Guidelines:**

- MUST apply the standalone summary only for a missing owner and keep the current stage's authority and evidence contract in force; optional-owner absence never waives a required gate.

The driver's response reasoning belongs in the current permitted work record, not in a replacement review input. Advisory durable parks and fresh-review inputs remain governed by [pre-flight-review.md](./pre-flight-review.md); external dispositions and fresh-review requirements remain governed by [independent-review.md](./independent-review.md).
