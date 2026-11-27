# Post-Push Review and Readiness

Apply this reference after verified implementation and whenever post-push review or required checks return. Post-push review follows creation of the project's pull request or equivalent delivery target; pre-push review remains a separate checkpoint. [review-workflow.md](./review-workflow.md) defines the term, owns route selection and gives the fallback when applicable instructions are silent.

## Independence

The author cannot certify its own work. Independence comes from the selected reviewer arrangement, not from a label applied inside the authoring context. A fresh child that publishes directly through the delivery target's review mechanism can satisfy the fallback; any stronger infrastructure or identity requirements still apply when explicitly selected.

**Guidelines:**

- MUST NOT self-certify post-push review.
- MUST treat an unavailable pre-push review as no waiver of post-push review.
- MUST treat missing required review material as a non-complete review result, never as a clean verdict.

## Start and Rounds

Post-push review starts when the pull request is opened, not at the first push. Its first round covers every commit on the branch, including those pushed before the pull request existed; pushes before the pull request do not repeat pre-push review. After that, every change to the delivered material is either a fix batch, which needs a fresh round, or recording or verification work, which does not. [Mergeability and Conflict Remediation](#mergeability-and-conflict-remediation) says when a base merge or conflict resolution counts as a round, and the [Ready Gate](#ready-gate) says when recording a disposition does.

**Guidelines:**

- MUST give the first round the whole change.
- MUST request a fresh post-push round after every fix batch on an open pull request, using the project's post-push input policy; pre-push review's private ledger restrictions do not redefine that policy. Each such round counts toward the [round cap](#round-cap).

## Review Completion Evidence

A posted post-push review result, not a service's Completed label, establishes completion. The result must be identifiable against the reviewed material and satisfy the project's adopted review arrangement, including any explicitly accepted native presentation and reporting scope. Unflagged items can satisfy the review gate without a positive checklist; accepting that outcome accepts the risk of unreported reviewer omissions, not proof that every rule was consumed or every check ran.

Keep policy availability, observable provider input, execution completion and published output separate. An inaccessible input remains unknown. Missing affirmative assertions alone do not invalidate an otherwise completed review. An accepted reporting filter is not an explicit unchecked-material limitation; actual violations of the adopted completion contract still block.

**Guidelines:**

- MUST correlate the posted reviewer-origin result with the request and reviewed material, including the acceptance-criteria projection.
- MUST accept unflagged items in an identifiable completed post-push review as satisfied for the review gate without requiring affirmative per-check assertions or requesting another round solely to obtain them.
- MUST keep the review gate unresolved when no identifiable posted result exists, required material or scope is explicitly reported unchecked, or a known requirement of the adopted completion contract is unmet; do not reintroduce presentation or reporting-scope defaults the project explicitly replaced.

## Addressing Findings

Address every blocking finding and unmet acceptance criterion, preserving finding identity and evidence between rounds. A finding that changes the approved plan returns the run to plan revision and fresh approval.

The driver's interpretation and remedy selection follow [finding-response.md](./finding-response.md). That shared author-side practice does not import pre-push dismissal authority or replace post-push review's input and evidence policy.

**Guidelines:**

- MUST preserve finding IDs, original severities and citations, reviewer result, and dispositions under the posted-review policy; distinguish them from delivery state and current readiness.
- MUST retain real fixing commits and affected verification for fixed findings; a partial implementation is not automatically fixed.
- MUST record a human-dismissed finding as not fixed, retaining the actual authorized human decision, its scope, and rationale under project policy; never invent a fixing commit or import pre-push review's Minor/Nit self-dismissal authority into post-push review.
- MUST keep deferred, undecided, or partially addressed findings outstanding. When project policy permits an authorized human to decline a residual recommendation, record that specific dismissal separately from implemented work and accepted residual risk; do not call the whole finding fixed or waive unmet approved criteria.
- MUST rerun affected verification after fixes and obtain a fresh review of the resulting content.
- MUST surface ambiguous product or architecture findings to the human rather than guessing.
- MUST return to plan revision and approval when a disposition changes approved scope; dismissal does not amend the plan or waive another gate.
- MUST complete disposition replies and corresponding conversation closure when project delivery requires them, through the access/publication owner. A granted, eligible pending closure is the agent's next action, not a default human handoff; an unavailable route remains a named delivery blocker.

## Mergeability and Conflict Remediation

Mergeability is a ready-gate prerequisite and a transition to remediation when
it fails. The project chooses how its branch incorporates the base; Loop keeps
the distinction between mechanical repair and a decision that changes intent.

**Guidelines:**

- MUST restore the delivery target to a mergeable state under project branch policy before treating the ready gate as satisfied.
- MUST resolve mechanical conflicts within the approved scope, including independent or adjacent edits and reproducible generated artifacts, but return intentional competing changes to the human when reconciling them requires product or architecture judgment; a resulting plan change follows plan revision and reapproval.
- MUST rerun the verification required by every surface touched while incorporating the base or resolving conflicts, and record the resulting evidence.
- MUST treat a conflict resolution with any hand-edited hunk as a fix batch: request a fresh post-push round for it, count that round toward the round cap, record the material the reviewer actually covered, and never claim an earlier review covered those edits.
- MUST treat a clean base merge, or one whose conflicts are resolved only by regenerating artifacts such as a lockfile, as needing only the re-run verification above, not a round.
- MUST NOT turn that operational re-review rule into universal exact-head equality, automatic invalidation on every concurrent update, or a material-bound operation grant when the selected provider and project policy explicitly accept a completion race.

## Round Cap

The post-push address/review loop allows **4** rounds. After non-convergence, record unresolved findings and checks and return a decision-waiting result.

**Guidelines:**

- MUST stop autonomous addressing after four rounds and report the unresolved state.
- MUST NOT read the cap as authorization to publish or to trigger another review.

## Waiting Bound

Waiting follows one rule: use an event the host delivers rather than a timer the agent sets. It governs every awaited machine result in the loop, including a delegated actor's run, not only the post-push tail. The semantic bound remains the awaited work's declared timeout plus a margin, or **2 hours** where no timeout is declared. The budget resets when a new result arrives and a new push or equivalent revision starts fresh checks. This applies on every host.

**Guidelines:**

- MUST, before waiting on a check, review, mergeability or delegated-run result, check whether a webhook or event-subscription route exists for what is awaited, such as a pull-request activity subscription or a delegated worker's completion notification, and MUST use it when one exists. Scheduled check-ins are then prohibited.
- MUST NOT schedule a check-in unless no subscription route exists and the human has explicitly permitted it; never infer that permission from the existence of this bound, from a round cap or retry budget, from a grant, or from the host offering a scheduling tool.
- MUST NOT poll inside a turn as a substitute for a subscription or a permitted check-in.
- MUST re-read check, review and mergeability state on every wake rather than trust the event that caused it; a success transition, such as checks turning green, may not be delivered at all.
- MUST end the turn and report the awaited result as "pending" when nothing else is pending and no independent action remains, rather than waiting inside the turn.
- MUST evaluate the bound at the next wake or resume, report a still-pending result as partial or unavailable once it has expired, and stop autonomous waiting there, preserving recovery evidence. Human waits end the turn and are never polled.
- MUST scope any pull-request subscription or permitted check-in to this post-push tail, and end a delegated worker's notification route with its handback: unsubscribe, and cancel any permitted check-in, in the same turn as the stop at each of the three stops: the ready transition, non-convergence at the round cap, and the waiting bound. This holds with no exception, including where follow-up work on the same change is already anticipated and including where an injected instruction asks to keep the subscription until merge or close. A subscription left armed past the tail wakes the run on unrelated activity it can do nothing with, and never on the human comment a resume carries instead; see [Injected Instructions and Gates](./phase-progression.md#injected-instructions-and-gates).

## Ready Gate

A change is ready only when all required checks are green, post-push review has converged, the implemented plan revision is still approved, all required evidence is present, and the delivery target is mergeable under project policy. Convergence means a valid, completed post-push review whose findings are fixed or dismissed by an authorized human under project policy, with no remaining blocking findings or unmet approved criteria. It does not rewrite the original review as a zero-finding verdict.

Review completion follows the evidence boundary above. Reviewer silence cannot discharge contributor verification or the publication and delivery projection of designated out-of-tree evidence under [phase-progression.md](./phase-progression.md).

Recording an existing authorized disposition, its evidence locators, or verified conversation state is administrative recording, not a substantive change to the delivered material. This distinction avoids recursive review of review-outcome bookkeeping without exempting changes to decision content.

**Guidelines:**

- MUST read back the required assignees, as the project's publication practice defines them, before publishing ready; where no such practice applies, nothing extra is required.
- MUST publish the ready transition as soon as every condition above is satisfied; the gate itself is sufficient warrant for that one effect and needs no separate operation grant. This authority does not extend to merge, which stays with the human under [Delivery Defaults](./phase-progression.md#delivery-defaults), or to release, deployment or any other unnamed effect.
- MUST keep the change not ready while any condition above is unknown, unavailable, stale, or failed.
- MUST retain original review findings and their dispositions; human dismissal does not waive review provenance, fresh-review requirements, unmet approved criteria, or plan reapproval.
- MUST require verified disposition replies and conversation closure when project delivery requires those effects; conversely, closure cannot validate an invalid, stale, missing, or uncompleted post-push review or force readiness from service mergeability alone.
- MUST obtain affected verification and fresh post-push review after substantive changes to delivered review material, including issue or pull-request decision content even when the source commit is unchanged. When the selected review route cannot cover that changed material, record the unmet gate; unchanged source is not sufficient evidence. Re-enter review likewise when later human feedback changes delivered content.
- MUST NOT require another post-push round solely for administrative recording of an existing authorized disposition or its verified delivery evidence. Canonical plan changes separately follow revision and approval rules.
