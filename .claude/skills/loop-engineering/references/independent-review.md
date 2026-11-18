# Independent Review and Readiness

Apply this reference after verified implementation and whenever independent review or required checks return. Mandatory independent review follows creation of the project's delivery target; pre-flight remains a separate advisory checkpoint. [review-workflow.md](./review-workflow.md) owns route selection and the context-independent default when applicable instructions are silent.

## Independence

The author cannot certify its own work. Independence comes from the selected reviewer arrangement, not from a label applied inside the authoring context. A fresh child that publishes directly through the delivery target's review mechanism can satisfy the default; any stronger infrastructure or identity requirements still apply when explicitly selected.

**Guidelines:**

- MUST NOT self-certify independent review.
- MUST treat an unavailable advisory review as no waiver of mandatory external review.
- MUST request a fresh independent review after every fix batch using the project's independent-review input policy; the advisory stage's private ledger restrictions do not redefine the external review's policy.
- MUST treat missing required review material as a non-complete review result, never as a clean verdict.

## Review Completion Evidence

A posted independent-review result, not a service's Completed label, establishes completion. The result must be identifiable against the reviewed material and satisfy the project's adopted review arrangement, including any explicitly accepted native presentation and reporting scope. Unflagged items can satisfy the review gate without a positive checklist; accepting that outcome accepts the risk of unreported reviewer omissions, not proof that every rule was consumed or every check ran.

Keep policy availability, observable provider input, execution completion and published output separate. An inaccessible input remains unknown. Missing affirmative assertions alone do not invalidate an otherwise completed review. An accepted reporting filter is not an explicit unchecked-material limitation; actual violations of the adopted completion contract still block.

**Guidelines:**

- MUST correlate the posted reviewer-origin result with the request and reviewed material, including the acceptance-criteria projection.
- MUST accept unflagged items in an identifiable completed independent review as satisfied for the review gate without requiring affirmative per-check assertions or requesting another round solely to obtain them.
- MUST keep the review gate unresolved when no identifiable posted result exists, required material or scope is explicitly reported unchecked, or a known requirement of the adopted completion contract is unmet; do not reintroduce presentation or reporting-scope defaults the project explicitly replaced.

## Addressing Findings

Address every blocking finding and unmet acceptance criterion, preserving finding identity and evidence between rounds. A finding that changes the approved plan returns the run to plan revision and fresh approval.

The driver's interpretation and remedy selection follow [finding-response.md](./finding-response.md). That shared author-side practice does not import advisory dismissal authority or replace the external review's input and evidence policy.

**Guidelines:**

- MUST preserve finding IDs, original severities and citations, reviewer result, and dispositions under the posted-review policy; distinguish them from delivery state and current readiness.
- MUST retain real fixing commits and affected verification for fixed findings; a partial implementation is not automatically fixed.
- MUST record a human-dismissed finding as not fixed, retaining the actual authorized human decision, its scope, and rationale under project policy; never invent a fixing commit or import the advisory stage's Minor/Nit self-dismissal authority into external review.
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
- MUST request fresh independent review after known conflict-resolution or other material-fix changes, record the material the reviewer actually covered, and never claim an earlier review covered those edits.
- MUST NOT turn that operational re-review rule into universal exact-head equality, automatic invalidation on every concurrent update, or a material-bound operation grant when the selected provider and project policy explicitly accept a completion race.

## External Round Cap

The post-delivery address/review loop allows **4** rounds. After non-convergence, record unresolved findings and checks and return a decision-waiting result.

**Guidelines:**

- MUST stop autonomous addressing after four rounds and report the unresolved state.
- MUST NOT read the cap as authorization to publish, schedule, or trigger another review.

## Waiting Bound

Waiting is host execution, not loop semantics. The semantic bound remains the awaited work's declared timeout plus a margin, or **2 hours** where no timeout is declared. The budget resets when a new result arrives and a new push or equivalent revision starts fresh checks.

**Guidelines:**

- MUST report a still-pending result as partial or unavailable when the bound expires.
- MUST NOT require polling, subscriptions, schedulers, cache-TTL measurements, or a particular resume mechanism.
- MUST NOT infer scheduling permission from the existence of this bound.
- MUST stop autonomous waiting at that bound, preserving recovery evidence; human waits end the turn and are never polled.
- MUST resolve which wait mechanism the session actually has before the first wake, rather than tuning an interval against a mechanism it turns out not to expose, and record when only one of delivery and a scheduled wake is available — a success transition missed by delivery alone strands the run rather than merely delaying it.
- MUST scope any permitted wait mechanism to this tail, and MUST tear down every mechanism it armed in the same turn as the stop, at each of the three stops: the ready transition, non-convergence at the round cap, and the waiting bound. This holds with no exception, including where follow-up work on the same change is already anticipated — a mechanism left armed past the tail wakes the run on unrelated activity it can do nothing with, and never on the later human comment a resume carries instead.

## Ready Gate

A change is ready only when all required checks are green, mandatory independent review has converged, the implemented plan revision is still approved, all required evidence is present, and the delivery target is mergeable under project policy. Convergence means a valid, completed independent review whose findings are fixed or dismissed by an authorized human under project policy, with no remaining blocking findings or unmet approved criteria. It does not rewrite the original review as a zero-finding verdict.

Review completion follows the evidence boundary above. Reviewer silence cannot discharge contributor verification or the publication and delivery projection of designated out-of-tree evidence under [phase-progression.md](./phase-progression.md).

Recording an existing authorized disposition, its evidence locators, or verified conversation state is administrative recording, not a substantive change to the delivered material. This distinction avoids recursive review of review-outcome bookkeeping without exempting changes to decision content.

**Guidelines:**

- MUST publish the ready transition as soon as every condition above is satisfied; the gate itself is sufficient warrant for that one effect and needs no separate operation grant. This authority does not extend to merge, release, deployment, scheduling, or any other unnamed effect, which stay with the human under project policy.
- MUST keep the change not ready while any condition above is unknown, unavailable, stale, or failed.
- MUST retain original review findings and their dispositions; human dismissal does not waive review provenance, fresh-review requirements, unmet approved criteria, or plan reapproval.
- MUST require verified disposition replies and conversation closure when project delivery requires those effects; conversely, closure cannot validate an invalid, stale, missing, or uncompleted independent review or force readiness from service mergeability alone.
- MUST obtain affected verification and fresh independent review after substantive changes to delivered review material, including issue or pull-request decision content even when the source commit is unchanged. When the selected review route cannot cover that changed material, record the unmet gate; unchanged source is not sufficient evidence.
- MUST NOT require another independent-review round solely for administrative recording of an existing authorized disposition or its verified delivery evidence. Canonical plan changes separately follow revision and approval rules.
- MUST re-enter review when later human feedback changes delivered content.
