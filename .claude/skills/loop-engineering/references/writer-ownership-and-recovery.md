# Writing and Recovery

Apply this reference when an assignment writes, a run changes a runtime target other sessions share, an execution stops unexpectedly, or an effect's outcome is unknown.

## Writing Coordination

The assignment, not this skill, states the workspace arrangement. Concurrent writers are safe only when the host or project provides explicit isolation and integration rules.

**Guidelines:**

- MUST name permitted writes, protected changes, conflict coordination, and commit delivery in every writing assignment.
- MUST prevent competing writes to the same surface unless explicit isolation and integration make them safe.
- MUST account for write-capable background processes before transferring responsibility or accepting completion.
- MUST NOT require a shared checkout, worktree, branch prefix, or commit creation unless project policy or the assignment requires it.
- MUST triage a permission request a delegated executor raises by what it asks for: apply the current host permission policy to an approved-scope operation the assignment already covers; deny an out-of-scope or destructive one and ask that executor for a safe alternative; and return a product, security, privacy, or platform decision to the human instead of answering it on their behalf.
- MUST surface a required human authorization rather than manufacturing one, and leave writing responsibility with the executor while its request is pending.
- MUST verify actual workspace identity before writing: shared workspaces require coordination; separated workspaces require explicit material transfer, retrieval, integration, and verification. A message is not a file transfer, and a behavioral ownership contract is not an enforced lock.

### Shared Runtime Targets

Simulators, emulators, attached devices, ports and the app installed on them are surfaces too, and every session on the machine shares them. Two sessions using one at once rarely fail loudly: one session's install replaces another's build, app data and device-wide settings carry across, and a force-stop ends another session's app. The cost shows up as a wrong observation recorded as evidence. A claim is how sessions keep out of each other's way. It is cooperative rather than enforced, and the project supplies its mechanism.

| Situation                                  | Response                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Another session holds the emulator's claim | Do not install. Report the held target and end the turn, or ask the human.                    |
| A claim whose owner looks finished         | Ask the human; do not break it.                                                               |
| The project provides no claim mechanism    | Say the target is shared, run only what the check needs, and qualify the observation as such. |

**Guidelines:**

- MUST, where the project provides a claim mechanism, claim a target before installing, uninstalling, launching, changing or restoring a setting on, or stopping an app on it, and release the claim when the exercise ends.
- MUST NOT change a target another session holds; report the held target and end the turn, or ask the human, and arm no poll, subscription or wake to watch the claim.
- MUST NOT break another session's claim without the human, including one whose owner looks finished.
- MUST, where the project provides no claim mechanism, state that the target is shared, limit the exercise to what the check needs, and report its observation as taken on a target another session could have changed rather than assume exclusive use.
- MUST treat a claim as a cooperative convention, never as proof that no other session touched the target.

## Changed Plan and Decisions

A clarification explains the approved plan without changing scope, acceptance criteria, non-goals, design artifacts, or sensitive behavior. Anything else is a plan revision.

**Guidelines:**

- MUST pause affected work, collect its actual partial state, revise the plan, obtain fresh approval, and issue a fresh assignment after a plan revision.
- MUST NOT consume results produced for the superseded plan as current results; explicitly audit any reusable work against the new revision.
- MUST use a fresh delegated execution context after plan revision, never resume a child carrying superseded requirements. Include still-valid and potentially obsolete changes, prior results, and the reason for the revision in its assignment; a loop driver implementing directly rereads and audits against the new approved revision.
- MUST checkpoint only work valid independently of an unresolved decision; leave decision-dependent changes uncommitted and identify them rather than manufacturing a clean workspace.

## Retry Budget

Each approved plan revision and task phase allows one initial execution plus **2** retries. Exhaustion leaves recovery with the current loop driver; it does not authorize another delegated attempt.

When the effect requests a new assessment of a phase deliverable, [reviewing-phase-deliverables.md](./reviewing-phase-deliverables.md) routes to the separate artifact-review budget; an execution retry does not replenish it.

**Guidelines:**

- MUST count runtime failure, lost response, unexplained stall, and unexpected executor disappearance as attempts.
- MUST inspect actual files, commits, processes, and external effects before retrying, especially when the prior result is `outcome-unknown`.
- MUST NOT infer permission to schedule, poll, or spawn from the retry budget.
- MUST also count transient API or recoverable tool failures. A newly approved plan, human-requested scope change, new review round, or separate addressing task starts its own budget rather than consuming an earlier phase's retries.
- MUST reuse a still-valid executor only where permitted and supported; otherwise provide a new executor the complete assignment plus previous attempt, partial changes, failure, processes, and confirmed stopped state. On exhaustion the current loop driver continues from established state, not from a destructive reset.

## Append-Only Recovery

Recovery preserves evidence. Rewriting or resetting away partial work destroys the record needed to distinguish failure from an unknown outcome.

**Guidelines:**

- MUST preserve history append-only: no destructive reset, amend, squash of distinct stages, or force-push as a recovery shortcut.
- MUST compare every execution result with actual repository and process state before accepting it.
- MUST continue from established state, correcting through new changes, and surface conflicts requiring human judgment.
- MUST inspect unexpected paths and targeted diffs when build, dependency, lock, CI, security, or review-policy surfaces changed; checks failed or were skipped; the receipt disagrees with files; acceptance evidence is thin; or uncertainty or size exceeds the assignment. Acceptance of a receipt never certifies independent review.
