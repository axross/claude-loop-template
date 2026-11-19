# Pre-Flight Review

Apply this reference when project policy selects an advisory review before delivery. Its absence or unavailability never substitutes for or waives mandatory independent review.

## Checkpoint Qualification

This checkpoint follows verified initial implementation, whether the driver or another actor implemented it. Implementation delegation and phase-deliverable review supply no qualification for its fresh reader. Missing review evidence remains a visible gap even when project policy permits limited draft delivery.

**Guidelines:**

- MUST apply [checkpoint qualification](./subagent-delegation.md#checkpoint-qualification) to the current pre-flight assignment, then use the review input below; an earlier reader's availability is not current eligibility.
- MUST retain the qualification, whether review ran, and the actual reviewed target, materials, policy, result, and limitations in existing run state. Preserve a non-complete or stale result rather than inferring clean review from verification or direct implementation.
- MUST use an authorized-draft exception for a pre-flight gap only where project policy permits it and publication is separately authorized; disclose the gap, keep delivery draft, and keep mandatory external review unmet. This exception does not apply to phase-deliverable review or external review.

## What the Stage Reproduces, and What It Does Not

The case for reviewing outside the authoring context is usually stated as one property. It is several, they separate, and none of them is recovered outright — which is why this stage can be worth running and still not replace the external review. Stating the accounting is what keeps "we already reviewed it" from being read as the external gate having been met.

The external-review column describes a separately hosted arrangement. A child reviewer selected under [review-workflow.md](./review-workflow.md) supplies context separation and a posted result without necessarily supplying environment, account or policy-source independence. This comparison changes none of this pre-flight stage's requirements or the separate mandatory independent-review gate.

| Property                                                                     | External review | This stage                                                                                                                                                                             |
| ---------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Context independence** — no memory of its own decisions or its own plan    | yes             | **partly** — recovered only as far as the fresh-context and durable-park rules hold                                                                                                    |
| **Input independence** — reviews the diff, not the author's account of it    | yes             | **partly** — recovered by fixing the input source and excluding the receipt                                                                                                            |
| **Verdict independence** — the reviewed party cannot suppress a finding      | yes             | **partly** — recovered for Critical and Major by the dismissal split                                                                                                                   |
| **Absence visibility** — a review that never ran is externally observable    | yes             | **no** — a stage never entered leaves no gap to notice                                                                                                                                 |
| **Policy-source independence** — the policy is not the one this change edits | yes             | **partly** — recovered by [the targeted-diff inspection a changed review-policy surface triggers](./writer-ownership-and-recovery.md#append-only-recovery), and by the external review |
| **Environment independence**                                                 | yes             | **no** — shares the workspace, uncommitted state included                                                                                                                              |

Absence visibility is the one no arrangement here recovers at all, because the reviewed party holds the report. It is an accepted limit, and it is the reason the external review stays exactly as it is rather than being relaxed once this stage runs.

**Guidelines:**

- MUST report this stage's result as advisory, and MUST NOT present any row above as recovered outright — a partial recovery is reported as partial, and absence visibility as not recovered.
- MUST NOT cite this stage, or the external review's existence, as the reason a finding may go unaddressed; what the external review still gates states what a decision did not weaken, never why it was allowed.
- MUST NOT describe a reader as read-only while a general-purpose shell remains available to it, since reading a change requires one. State which part of the constraint the host actually enforces and which part the reader is asked to honour.

## Review Input

Review the actual target revision and uncommitted diff, not an implementation receipt. Include the approved plan, applicable project review policy, required artifacts, and source/workspace identity. Run state is neither review evidence nor part of the verdict; disclose encountering it and exclude it from judgment.

**Guidelines:**

- MUST use an assignment satisfying the review contract in [implementation-package.md](./implementation-package.md), including every required material at its declared fidelity.
- MUST use a fresh review context each round and re-review after every fix batch.
- MUST NOT present loop-driver self-review or an unavailable advisory review as independent review.
- MUST review correctness against the approved criteria, maintainability, security, and test coverage; use Critical, Major, Minor, and Nit severities, honoring any stricter project policy.
- MUST build input from the review directive, current project policy, approved plan, and actual diff, in that order, excluding the implementer's receipt and summaries derived from it. Reading encountered run state is disclosed, not claimed mechanically impossible.
- MUST review only a stable target without a competing writer. A plan change abandons the current round and requires approval and fresh review, not transfer of its findings into a new plan's verdict.

## Finding Ledger

The ledger preserves findings through translation and recovery. Each finding has an ID, severity, citation, claim, suggested fix, disposition, and reason.

The driver's interpretation and remedy selection follow [finding-response.md](./finding-response.md). The suggested fix remains part of the finding's record even when a justified correction uses a different remedy; the authority below still determines its disposition.

**Guidelines:**

- MUST preserve each finding's ID, severity, and citation without omission or regrading.
- MUST give every finding one terminal state: **fixed**, **dismissed**, or **deferred**.
- MUST tie `fixed` to the fixing commit; the loop driver MAY dismiss Minor or Nit with a recorded reason, but MUST obtain human confirmation before dismissing Critical or Major and record that reason too.
- MUST use `deferred` only when the human makes an informed decision to decline another round.
- MUST NOT deliver the draft pull request while a finding in the current round lacks a terminal state. Superseded-plan rounds are abandoned, not silently treated as resolved.

## Durable Parks

Persisting full review reasoning can anchor a fresh reviewer. The session keeps the full ledger. Durable finding entries are restricted to the human waits for a Critical/Major dismissal or an additional round; a plan change abandons the round instead.

**Guidelines:**

- MUST persist only each open finding's ID, severity, and citation across a park, plus round and waiting state.
- MUST clear persisted findings before another review and re-run the ledger from scratch if that durable subset is lost.
- MUST NOT give prior findings, receipts, dispositions, or run state to the next reviewer as review input.
- MUST keep round and waiting state durable throughout the stage, not only at a park. Never persist resolved findings, claims, suggested fixes, dispositions, or reasons in that recovery subset.
- MUST re-run review where no recoverable ledger exists, including an interruption between parks; missing entries never establish completion.

## Deferred Handoff

An informed decline ends the advisory round without erasing its remaining risks. Its substantive handoff is a terminal human record, not the narrow recovery subset kept while a review may resume.

**Guidelines:**

- MUST retain each deferred finding's ID, severity, citation, claim, suggested fix, `deferred` disposition, decision reason, and supporting evidence, together with the advisory round, reviewed material identity, and human-decision evidence.
- MUST make that substantive record accessible to the human through a permitted project mechanism and identify it as handoff evidence, not canonical requirements or review input.
- MUST NOT provide the substantive handoff, its findings, or its dispositions as input to a later fresh advisory review or use it as replacement input for mandatory external review. A publicly readable record does not promise reviewer invisibility.
- MUST keep delivery incomplete when the substantive handoff cannot be persisted or published, report the missing effect, and preserve the full ledger in the current permitted internal handoff rather than reducing it to the durable-park subset.
- MUST report a missing substantive record after interruption as unavailable evidence and preserve only verified decision and process facts. Never reconstruct lost finding substance or treat the gap as permission for a new review round; any new finding set follows the ordinary round and informed-decision rules.

## Round Cap

The autonomous pre-flight envelope is the initial implementation plus **3** review/fix rounds. Each round's execution has its own initial-plus-two retry budget.

**Guidelines:**

- MUST ask the human once for each additional round, disclosing the count and severities of open findings and naming every open Critical or Major.
- MUST mark all still-open findings `deferred`, preserve them through the substantive handoff, and keep the delivered change in draft when the informed human declines another round.
- MUST NOT treat this cap as permission to schedule work or as a replacement for external independent review.
