# Actor-local skill acquisition

Use this reference to establish which applicable skill material a controlled
internal actor has in its current context. It covers the loop driver,
implementers, investigators and internal reviewers, not affirmative consumption
attestations from posted independent reviewers. Selection follows the active
task's development or review practices and applicable project policy;
installation and native host selection remain separate observations under
[active-loading.md](./active-loading.md).

## Required material in the actual actor

A parent's complete load does not supply a fresh worker's context. An assignment
can name useful starting material without knowing every responsibility the
executor will encounter. Complete acquisition means the full applicable skill
body and applicable references, not every citation recursively.

**Guidelines:**

- MUST establish the required skill material for the actual actor before dependent work, consulting the active task's selection practices and applicable project policy where present, including review-specific requirements for internal reviewers. Without a selection owner, follow applicable instructions and discovery evidence, and report unresolved applicability rather than inventing a selection policy.
- MUST treat an assignment's material list as a starting set, not an upper bound; reassess applicability when the actor's responsibility or required material changes before dependent judgment or editing.
- MUST acquire each full applicable body and applicable reference in that actor's current context through a permitted route, or reuse fully retained current text under [Retention and recovery](#retention-and-recovery).
- MUST NOT infer the actor's acquisition from a parent, previous worker or another session having loaded the same material. Reusing an assignment identifier does not establish that a fresh actor received it.

## Acquisition route and correspondence

These routes answer different questions, even when their text matches:

| Route              | What its evidence can establish                                                               | What it does not establish                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Native loading     | Host-selected source and supplied content, to the extent the current host result exposes them | Full delivery, applicable references or another actor's context merely from a successful load |
| Direct acquisition | The complete text received from an identified source and content revision                     | Which same-name source the host selected for native loading                                   |
| Retained text      | Complete applicable text still available in this actor's current context                      | Current retention merely from a historical load, transcript or summary                        |

For example, a callback contains a whole body before the host prepares its final
model input. That observation can cover the callback stage while final delivery
remains unknown. A direct read can supply the required text while native source
selection remains unknown. Neither observation should absorb the other.

**Guidelines:**

- MUST correlate the actual actor and current context with its assignment and material revision; unresolved correspondence remains unknown. Use available evidence, not a prescribed identifier format or mandatory ledger.
- MUST distinguish required material from observed material, identifying intended and observed source/content, acquisition route, result locator and justified coverage. Existing handoff prose or host metadata can carry these facts.
- MUST identify the observation stage and its visibility limits; a raw callback or intermediate payload does not establish complete final delivery.
- MUST NOT use a disk hash, successful tool exit, actor acknowledgment or matching skill name alone as proof of complete acquisition in the current context.
- MUST keep direct acquisition and retention distinct from verified native loading; neither repairs missing host-selection evidence by implication.
- MUST keep correlation evidence limited to what the assignment needs, without requiring raw commands, full transcripts, credentials or signed URLs to be published.

## Coverage, not an execution result

Report coverage for the required material at the observed stage using the
following distinctions:

| Coverage    | Meaning                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Full        | Complete required text at the intended source/content revision is available to the identified actor in the identified current context |
| Partial     | Known truncation, gaps or missing required bodies/references leave the set incomplete                                                 |
| Unknown     | Evidence cannot establish delivery, completeness, source/content agreement or actor/context correspondence                            |
| Mismatch    | Observed source or content differs from the intended material revision                                                                |
| Unavailable | A required acquisition capability or material is inaccessible or prohibited                                                           |

Coverage concerns material, not whether execution succeeded, output conforms,
a finding is resolved or delivery is ready. A known mismatch can coexist with
an unknown observation at a later stage; report those scopes separately rather
than forcing them into one verdict.

**Guidelines:**

- MUST justify each coverage claim from the observed text and correspondence, naming missing ranges, references, mismatches or visibility limits as applicable.
- MUST NOT call required-material acquisition full when text is truncated, stale, mixed across revisions or unavailable, or when final delivery or current retention is unobservable.
- MUST keep coverage separate from the execution-result vocabulary of any applicable handoff or change-loop practices. Apply their existing missing-required-material rule; a coverage record does not make a non-complete result successful.

## Retention and recovery

Fully retained current text needs no redundant read. A historical transcript or
compaction summary can locate a prior acquisition, but does not show that its
complete text remains available now. Recovery fills the actual gap, not a
checklist of calls already made.

**Example:**

> A body at revision A arrived through line 80. Recover the missing continuous
> ranges from A and check that the assembled body has no gaps. If the applicable
> source is now revision B, reacquire B instead; A's opening plus B's ending is
> not a complete body at either revision.

**Guidelines:**

- MUST reuse complete retained text when that exact applicable revision remains available in the actor's current context; do not reread it solely to produce another receipt.
- MUST reassess retention after compaction, context replacement, resumption or a source revision change. Reacquire required text that is no longer fully available; a summary does not replace a full body or required reference.
- MUST recover missing continuous ranges from one verified content revision through a permitted channel, checking revision consistency and gaps across the recovered set before dependent work.
- MUST NOT silently assemble different revisions into one complete body. When the applicable revision changes, reacquire the new revision rather than complete the old text with new ranges.
- MUST report inaccessible required material or unresolved recovery under the existing execution or handoff contract rather than claiming acquisition or execution success.

## Acquisition and output assessment

Full acquisition does not prove that an output follows the supplied rules.
Unknown acquisition does not by itself prove a concrete output violation.
Those questions need their own observations and the active task's assessment
owner. Contributor verification generates evidence; internal review judges the
change; quality assurance judges whether that evidence is adequate.

**Guidelines:**

- MUST consult development output-verification practices, where present, when performing contributor verification of an integrated output against applicable rules and currently valid exceptions. If that owner is absent, name the unperformed assessment rather than infer conformity from acquisition.
- MUST consult code-review practices, where present, when a controlled internal reviewer assesses whether a change follows applicable rules and currently valid exceptions. Contributor verification does not replace that assessment. If that owner is absent, name the unperformed assessment rather than infer conformity from acquisition.
- MUST consult verification-evidence assessment practices, where present, when judging evidence sufficiency, including whether a check can distinguish correct from incorrect output. If that owner is absent, name the assessment limit rather than inventing a QA gate.
- MUST NOT turn internal acquisition correspondence or coverage into a demand for affirmative load or per-check attestations in posted independent-review completion; the applicable review-completion contract remains its owner.
