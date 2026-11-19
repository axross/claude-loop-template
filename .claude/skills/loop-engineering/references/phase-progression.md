# Phase Progression

Apply this reference to a change, not a read-only question, investigation, or review. Project policy chooses gates; execution and delivery mechanisms realize them without changing their meaning. A missing adapter is not a missing contract: use the host's published, permitted tools directly, or identify the particular capability or authorization that prevents the next transition.

When research, plan, or design output is about to cross a phase boundary, use [reviewing-phase-deliverables.md](./reviewing-phase-deliverables.md) for its review and completion boundary before dependent work.

## Intake and Defaults

A named tracking target enters planning; an existing delivery target enters recovery and addressing. A free-form change first needs a durable tracking target. The tracking target is the project's own—an issue in the repository's forge by default, or whichever tracker project policy names instead—and the loop needs to know only that it is durable and holds the plan. These defaults preserve the loop's tracking target → plan → draft delivery path when a project supplies no more-specific change policy. They are not permission to make an external write.

Choose the entry from actual target, canonical-plan and approval evidence. The
following aid applies the existing [plan identity](./plan-document.md),
[recovery](./resuming-and-handoff.md) and
[operation-grant](./run-state-and-reporting.md#scoped-operation-grants) contracts:

| Available evidence                                                                                                | Next permitted action                                                                                                                                                    | Boundary to preserve                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Fresh documentation request; no tracked plan or approval                                                          | Identify policy and the durable target, then prepare and review its canonical plan for approval.                                                                         | Wait for actual approval before implementation edits.                                      |
| Existing task; approved canonical identity unchanged; pending phase and scoped grants established                 | Reconstruct actual state and advance the established pending phase.                                                                                                      | No replacement plan or repeated permission for an unchanged, covered effect.               |
| Continuation request; canonical plan has no approval evidence                                                     | Recover the current plan and approval state; present the plan for approval when needed.                                                                                  | A resume signal alone does not supply approval away from a recorded approval boundary.     |
| Current canonical content differs from the approved identity                                                      | Stop dependent edits and resolve the revision through Plan and Approval.                                                                                                 | Earlier approval and revision-bound results are stale.                                     |
| Earlier change merged; a new documentation change is requested                                                    | Release the merged change's recorded resources under [Release a Finished Change](#release-a-finished-change), then start intake for the new change under project policy. | The merged task's approval does not authorize the new scope.                               |
| A change with recorded resources is observed merged or closed, at resume, from a human's report or at next intake | Enter [Release a Finished Change](#release-a-finished-change) for that change.                                                                                           | No continuation of the ready run, and nothing armed to observe the next change.            |
| Implementation edits already exist; required approval is missing                                                  | Preserve and inspect the actual edits under [Writing and Recovery](./writer-ownership-and-recovery.md), then recover the unmet plan/approval boundary.                   | No destructive reset, further dependent implementation or invented retrospective approval. |
| Standalone read-only question; no project change requested or produced                                            | Investigate and answer under applicable read-only practices.                                                                                                             | No change-delivery gates merely to answer.                                                 |

A small reversible documentation edit can need less verification than a runtime
change. Its size supplies no adopted plan approval. Missing required material or
an unavailable tracking route leaves the corresponding prerequisite unmet;
identify that blocker under the intake rules below.

**Contrasting Examples:**

> **Fresh request:** “Combine the README's setup and development sections.”
> The project requires a tracked plan and approval, and neither exists. Read
> the headings and workflow to prepare that plan; a ready-to-apply content draft
> or a passing documentation check does not authorize editing the README.

> **Approved continuation:** “Continue the README reorganization.” The tracked
> plan's exact identity still matches actual human approval, the pending phase
> is execution and its grants still cover the effects. Resume implementation
> from the actual tree without asking for the same approval again.

> **Read-only question:** “Where does this README explain development setup?”
> Read the document and answer. Discovering a possible improvement does not
> turn that question into a request to implement it.

**Guidelines:**

- MUST identify the change target and applicable project policy before planning; by default anchor a new change in its durable tracking target before planning or edits, and reconstruct an existing delivery target rather than restarting it.
- MUST record the plan in that durable target before requesting approval; a private local plan-mode artifact alone does not satisfy this gate.
- MUST surface an authorization or capability blocker when a required delivery operation cannot be performed; never silently replace a mandatory target or gate with an easier one.
- MUST defer to a host project's own more-specific change-loop capability wherever it ships one: that capability owns the loop there and this one does not run beside it, which is a different thing from the project policy above that merely chooses this loop's gates.
- MUST select the pre-flight and independent-review routes under [review-workflow.md](./review-workflow.md), honoring explicit applicable instructions and using its defaults only where unspecified.

## Advance or Stop

A completed phase is evidence for the next transition, not a reason to return
control to the human. Loop owns whether work advances; the host owns the tool,
wait, or return mechanism that realizes that outcome.

A blocker attaches to an action through an unmet prerequisite. A failed check
can block readiness while leaving diagnosis available; a pending review can
block convergence while leaving required verification available. Name that
dependency before deciding that the whole run must wait.

The following trace follows one change as evidence arrives. Each row names
what can happen next and what that action still cannot establish; a label such
as "baseline failure" or "CI green" supplies neither on its own:

| Observed evidence                                                                                                    | Remaining action and prerequisite                                                                               | Next permitted operation                                                                            | Gate still unmet                                                                 |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Local checking fails in both base and changed checkouts; review and CI are pending.                                  | Required input diagnosis has a documented route, matching authority and no dependency on those pending results. | Inspect the failing inputs and obtain discriminating verification evidence.                         | Verification remains unresolved; pending review also blocks readiness.           |
| Clean CI passes, but comparison shows it omitted an input that enables required checking; that checking still fails. | Reconcile required coverage using the current material and documented setup.                                    | Diagnose the uncovered failure and pursue permitted remediation or other independent checks.        | A narrower pass has not resolved the required property, even if review finishes. |
| Current evidence now covers every required property and review is complete.                                          | Evaluate the remaining ready conditions, including approval and mergeability.                                   | When all hold, publish ready without another source edit or a repeated matching permission request. | None once every ready condition holds; this does not authorize merge.            |
| No independent required action remains; the next action needs a pending result, human decision or missing grant.     | That specific prerequisite must become available.                                                               | Use the permitted bounded machine wait or human handoff, retaining the action and its prerequisite. | The dependent gate remains unmet until current evidence resolves it.             |
| The applicable execution, review or waiting bound is exhausted.                                                      | Further execution exceeds the current bound.                                                                    | Stop with the observed result, remaining work and resumable next action.                            | Exhaustion supplies no missing verification or readiness evidence.               |

**Guidelines:**

- MUST enter the next required phase or perform its next action without asking for another instruction when current evidence establishes its prerequisites, a permitted route can perform it, and every effect that requires human authorization is covered by a matching operation grant. A matching standing grant counts as a matching operation grant under [Scoped Operation Grants](./run-state-and-reporting.md#scoped-operation-grants).
- MUST identify the concrete action and unmet prerequisite when blocked by a required human decision, an unmatched operation grant, an unavailable capability or required input, an unsafe failed or outcome-unknown effect, or an outstanding machine result; continue independent required, permitted work, including diagnostic work, and stop only work that depends on the blocker.
- MUST reevaluate the affected transition and remaining gates when a current machine result arrives, checking its material and coverage against the required evidence. An unchanged source revision needs no invented edit or renewed matching authorization; stale, partial, failed, or unknown evidence still leaves its gate unmet.
- MUST stop the run only when no required action remains available because of one of those blockers, or when an applicable execution or review bound, non-convergence, or completion applies; record the specific result state, actual dependency and resumable next action.
- MUST end the turn for a human wait; for an actual pending machine result, use only a permitted wait mechanism within the applicable bound. The turn-boundary rule separating a progress note from a deferred available action is stated in [SKILL.md](../SKILL.md) under its carve-out, and is not restated here.
- MUST preserve the phase, attempts, review round, grants, material revision, and pending or unknown effects across interruption so recovery resumes one established transition rather than restarting or skipping ahead.
- MUST NOT treat evidence that the ready gate is satisfied as authorization to merge, schedule, or perform any other unnamed effect. Publishing the ready transition itself is governed by [independent-review.md](./independent-review.md)'s ready gate, not by this operation-grant rule: once that gate is satisfied, publishing is the required next action rather than a blocked one.

## Execute and Verify

The approval binds the outcome; the assignment binds the execution. Parent and child implementations carry the same verification burden. The project's software-development and specialist capabilities own how to implement and test, and its code-review and QA capabilities own diff judgment and evidence adequacy.

When a check fails, consult software-development verification practices for
evidence-led failure diagnosis; without that owner, retain the failure and its
unresolved cause while obtaining available diagnostic evidence. This reference
uses that evidence to decide dependencies, not to waive a required check.
For a consequential inference or uncertain report, consult conduct practices;
when instruction delivery or retention is uncertain, consult skill-acquisition
practices where present. Without those owners, report the unresolved limit
rather than infer the cause or successful acquisition.

**Guidelines:**

- MUST implement only the current approved plan, preserve unrelated changes, and resolve the implementation assignment's execution arrangement through [checkpoint qualification](./subagent-delegation.md#checkpoint-qualification) before the first edit.
- MUST run the required formatting, lint, type, test, and surface-specific checks using documented project commands; disclose every failed or skipped check and its residual risk.
- MUST perform a reviewer-mode self-check against the request and actual diff before delivery, fixing obvious Critical or Major problems; a child's self-check is checked against its receipt and actual state, not treated as independent review.
- MUST enter the advisory pre-flight checkpoint by default after verified initial implementation, regardless of the implementation actor, and apply [its current qualification and gap rules](./pre-flight-review.md#checkpoint-qualification) before delivery.
- MUST preserve branch history, work outside the default branch, and refrain from pushing to the default branch or merging the change under the default policy. A child may not publish merely because it owns implementation.

## Deliver and Address

Delivery defaults to a draft target linked to its tracking target. Delivery owns its template, assignment, comment routing, trigger and persistence representation; the loop owns whether the evidence permits progress.

When the approved evidence destination depends on creating the draft target—a comment, CI artifact or preview tied to it—the initial body may name that destination with a pending evidence status instead of a yet-nonexistent locator. After creation, publish the evidence through a permitted, authorized route and immediately update and verify its link and stored content; keep delivery draft until this is complete. This exception covers only target-dependent publication, not evidence that can be published before the target exists. For evidence embedded in the approved delivery body, a fragment link qualifies once publication makes the linked evidence accessible.

**Guidelines:**

- MUST open delivery in draft by default and include the approved scope, the acceptance-criteria projection below, every skipped required check with its residual risk, and recovery information; request the project's required independent review through a permitted route.
- MUST carry, in the delivery target's own body, every approved acceptance criterion a reviewer can confirm or refute from the change itself and every criterion designated for out-of-tree verification under [plan-document.md](./plan-document.md)—quoted verbatim, including its designation, each with its status—together with the number of criteria not carried, a locator for the tracking target holding them, and the plan revision the projection was taken from. Each designated criterion also carries a link to its published evidence, except for the pending locator during the draft-dependent sequence above; an issue or pull-request number alone is not an evidence link. MUST NOT require a reviewer to read the tracking target in order to review. Quote rather than restate: a reviewer reading only the delivery target cannot tell a softened criterion from the original. The reviewer assesses code-inspectable criteria; the contributor remains responsible for external evidence. An absent projection is the author's defect, not that reviewer's limitation. The tracking target stays canonical; the projection never becomes what approval binds to.
- MUST address blocking findings and unmet acceptance criteria on the same delivery target, correlate every fixed finding with its fixing commit, rerun affected checks, and obtain fresh review after fixes.
- MUST preserve human decisions already settled in the plan rather than re-offering them as open choices to a reviewer.
- MUST keep mandatory review marked unmet when it cannot be obtained; no self-check, advisory review, or unavailable reviewer certifies readiness.
- MUST move to ready as soon as [independent-review.md](./independent-review.md)'s ready gate is satisfied, report the evidence, and leave merging to the human under the default policy.
- MUST return to addressing after later human feedback, restoring draft status when necessary and requiring fresh review of changed content.

## Release a Finished Change

A run leaves local resources behind: its branch, a working copy made for it, processes it started, port forwards it set up and builds it installed on a simulator or emulator. Ready ends the run and merging stays with the human, so nothing in the run itself frees them. Release is a later, separate entry that does, once the driver observes the change merged or closed — at resume, from a human's report, or at the next intake. It is never a continuation of the ready run, and nothing is armed to find out: with no observation, nothing happens.

Release touches only what the run state records as created by this run, under [Semantic Run State](./run-state-and-reporting.md#semantic-run-state), and only while that record still verifies against what is there. It needs no separate operation grant, under the carve-out in [Scoped Operation Grants](./run-state-and-reporting.md#scoped-operation-grants); host permission prompts and tool usage conditions remain boundaries. A **series** is the set of open changes the run state records as building on this change's resources, such as a stacked change on its branch or a follow-up using its install.

Deleting a local branch destroys no evidence when the hosting service retains every commit on it, which holds when the local tip is the change's final head as the hosting service recorded it, or an ancestor of that head. Ancestry against the default branch proves nothing here, because a squash or rebase merge leaves the branch's commits off it.

| Observed state                                                                        | Release                                                              |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Squash-merged; the local tip is the recorded final head                               | Delete the local branch after removing its clean working copy.       |
| The same, but the local branch has a commit the merged change lacks                   | Keep the branch and report the unmerged commit.                      |
| Closed without merging                                                                | Keep the branch and ask; stop the run's processes and port forwards. |
| First change of a recorded stack merged; the change built on its branch is still open | Keep what the open change needs until the series ends.               |
| No merge or close observed; the driver is idle                                        | Nothing happens, and no wait is armed to find out.                   |
| A branch or install the run never recorded as its own                                 | Leave it.                                                            |
| A recorded install, but the target now holds a different build                        | Keep it and report; it is no longer the run's build.                 |
| Any of the above                                                                      | The remote branch stays; repository settings or a human own it.      |

**Guidelines:**

- MUST enter release only on an observed merge or close of the change, and MUST NOT poll, subscribe, or schedule a wake to observe one; re-derive release from actual state each time, so a repeated entry is idempotent, and ask again about anything kept pending a human's answer that was not recorded.
- SHOULD release each recorded resource once its own conditions below hold, and MUST NOT release a resource whose conditions do not hold, that the run state does not record as created by this run, whose recorded identity no longer matches what is there, or that a recorded open change in the same series still needs before the last change in that series is observed merged or closed; keep and report a recorded resource the driver cannot reach.
- MUST NOT delete a local branch unless the hosting service shows the change merged and the local tip is the change's recorded final head or an ancestor of it; otherwise keep it and report why, and when the change closed without merging, keep it and ask. MUST NOT delete the remote branch.
- MUST NOT remove a working copy the run created unless it holds no uncommitted or untracked work and its branch qualifies for deletion, and MUST remove it before deleting that branch; keep it with a kept branch, leave one whose lifecycle the host owns to the host and report it, and never discard changes to make a removal succeed.
- SHOULD stop the processes the run started and remove the port forwards it set up, whether the change merged or closed unmerged, after verifying each by its recorded identity; keep one that does not verify.
- MUST route a recorded install to the project's device-check practices for its uninstall conditions where present, and keep and report it where they are absent or the target's other holders cannot be determined.
- MUST report in the session what was released and what was kept, each with its reason; a write to the merged or closed delivery target is not part of release unless separately authorized.
