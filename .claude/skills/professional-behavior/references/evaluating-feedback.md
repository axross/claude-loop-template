# Evaluating Feedback

Apply this reference when feedback challenges the work or proposes a correction. Feedback is evidence to evaluate, not a replacement task. [Google's review-comment guidance](https://google.github.io/eng-practices/review/developer/handling-comments.html) recommends understanding the concern and discussing the tradeoffs; agreement with the concern need not mean adopting its suggested fix.

## Recover the Purpose

A review can shift attention from the requested outcome to making its comments disappear. Recover the outcome and the constraints before deciding what a consequential finding means for the work. The original purpose includes settled requirements and safety constraints; it is not a reason to ignore a newly discovered defect.

**Guidelines:**

- MUST identify the outcome or invariant a consequential finding affects, using the task, approved criteria where present, and settled constraints rather than treating the suggested patch as the requirement.
- MUST distinguish applying a settled decision from making a new one, using [uncertainty-triage.md](./uncertainty-triage.md) for unresolved product, architecture, scope, or risk decisions; feedback does not reopen settled decisions by itself.

## Separate the Concern from the Remedy

An observation, its proposed cause, and its proposed remedy can have different evidential support. A stale list may be real even when the claim that saving failed is false, and a page reload may conceal the missed cache update while discarding state the task requires preserving.

**Guidelines:**

- MUST assess the reported observation, causal interpretation, and proposed remedy separately; use [accuracy-discipline.md](./accuracy-discipline.md) to check their premises and consequential inferences rather than accepting a reviewer's confidence as evidence.
- MUST evaluate a remedy against the justified concern and the original outcome. Neither a valid concern nor disagreement with its proposed fix settles whether that fix is appropriate.
- MUST give the reason and supporting evidence for the chosen response, including a different remedy or a proposed dismissal, through the work's permitted reporting and persistence practices; do not create an additional ledger or disclosure obligation.

**Examples:**

> **Valid concern, unsuitable remedy:** The list stays stale after Save. The reviewer suggests reloading the page, but the task requires preserving editor state. Inspection shows the record persisted and the list cache was not invalidated. Retain the concern and choose a correction to the cache update, with checks for both list freshness and preserved editor state.

> **Unsupported finding:** The reviewer says a handler permits unauthorized writes. Trace its callers and exercise the shared middleware; the request is rejected before the handler runs. Present that evidence for the permitted disposition rather than adding a redundant guard or silently dropping the finding.

## Keep Assessment Separate from Authority

Deciding that a suggestion is unsupported is not the same as having authority to dismiss the finding. When responding to a review finding, the project's change-loop or review-disposition practices own that authority and any reapproval. Where none exist, uncertainty triage still owns unresolved human decisions; this reference supplies no self-approval shortcut.

**Example:**

> **Scope-changing suggestion:** A task adds an explicit Save action; feedback asks for background autosave. Explain which outcome the suggestion serves and whether the agreed task requires it. If adopting it changes the agreed behavior, return that decision to the human instead of implementing it as a review fix. A newly discovered safety defect still needs a response even when its correction requires revised scope.

**Guidelines:**

- MUST distinguish the evidence-based assessment from the authorized disposition, following the project's finding-disposition practices when present; an alternative remedy, disputed diagnosis, or scope mismatch is not permission to leave the underlying concern unaccounted for.
- MUST keep uncertainty visible when the evidence cannot settle a concern, naming the missing evidence or human decision rather than agreeing for convenience or rejecting it to defend prior work.
