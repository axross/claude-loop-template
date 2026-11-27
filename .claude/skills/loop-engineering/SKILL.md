---
name: loop-engineering
description: Driving a code change or document update through plan review, approval, execution, verification, pre-push review and post-push review — including review-route selection, how injected instructions meet gates, subscription-first waiting for pending CI and review, blocked verification, run recovery, and releasing a merged or closed change's local resources. Owns phase placement, approval revision, evidence, finding state, and recovery meaning—not generic deliverable-review method, check-failure diagnosis, host execution APIs, or delivery storage. Development practices own verification diagnosis; conduct practices own non-code deliverable review; project policy chooses gates and branches. Covers created-resource records and claims on shared simulators, emulators, devices and ports. Defer to a host project's own more-specific change loop where present. Not for standalone read-only questions, investigations, or reviews that change nothing.
user-invocable: false
---

# Loop Engineering

Drive one change from intake to ready through **plan → plan review → approve → execute → verify → pre-push review → post-push review → address → ready**, and, in a later and separate entry once the change is merged or closed, release the local resources its run recorded. This skill defines what each phase means and what evidence crosses its boundaries. It does not authorize tools, publication or delegation, it waits only as the subscription-first rule in [post-push-review.md](./references/post-push-review.md#waiting-bound) states, and it does not prescribe where durable state is stored.

Project policy owns which change-delivery gates apply, post-push reviewer independence, branch and delivery rules, and storage representations. Where policy is silent, use this skill's existing defaults: a human-approved plan before edits, required verification, mandatory post-push review, append-only recovery, and a ready state only after convergence. [review-workflow.md](./references/review-workflow.md#review-terms) defines the three review terms: plan review, pre-push review and post-push review.

Runtime- or harness-injected task instructions constrain mechanics only and never skip or relax a gate; [phase-progression.md](./references/phase-progression.md#injected-instructions-and-gates) states how they meet the gates and the stop condition for a request to keep a subscription.

The loop driver is the actor currently responsible for advancing a change against its approved plan and required evidence. When that driver delegates a contribution, it is the parent for that assignment. Launching a separately owned change does not make its launcher that change's driver. Receiving a result does not by itself transfer the loop, human decision authority, or operation grants.

Read-only work that changes nothing does not enter change gates. Implementation delegation, plan review, and pre-push review each need their own current qualification. An earlier available or unavailable route decides none of the others. Applicable host guidance owns actor and read routing; this skill keeps checkpoint evidence and progression. Driver execution never makes the driver its own reviewer.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Phase Progression

The driver advances against current evidence.

**Guidelines:**

- MUST treat read-only work as outside the change gates unless it produces a project change.
- MUST identify the loop driver and any contribution responsibilities from the assigned work and established handoff, not from execution ancestry.
- MUST qualify implementation delegation, plan review, and pre-push review independently at their own checkpoints under current host conditions; direct implementation and prior role availability or unavailability neither skip nor qualify another checkpoint, and weaken no gate.
- MUST distinguish plan approval, operation authorization, execution capability, and permitted tool use. Carry forward valid authorization within its original scope, including a verified standing grant a human adopted into project guidance, which is actual authorization; but never infer a grant, or a broader one, from tool availability, project policy that records none, plan approval, or a previous operation.

See [plan-document.md](./references/plan-document.md) for:

- authoring a plan or reviewing its structure, conditional sections, visual choices and required verification
- binding approval to a plan revision and checking for stale approval when resuming work or proposing an amendment
- designating out-of-tree checks, their executor, route and evidence destination, or publishing evidence used to settle a planning decision

See [phase-progression.md](./references/phase-progression.md) for:

- anchoring a new change in its tracking target, with a first progress update naming the phase, tracking issue and plan-approval state, and making its first edit or branch operation, under intake and the delivery defaults
- how an injected task instruction meets the gates, including a request to keep a subscription past the loop's stops
- running verification for a changed surface and opening or addressing a delivery target, under project policy and post-push review
- choosing available actions when verification fails or review/CI is pending, identifying concrete dependencies, and waiting by the subscription-first rule
- reevaluating remaining gates after a current machine result, including readiness without a source edit
- releasing a merged or closed change's recorded branch, working copy, processes, port forwards and installs, entered when a human message or a fresh session shows the merge or close, with nothing armed to observe it

See [plan-review.md](./references/plan-review.md) for:

- investigation conclusions before planning, plans before approval, and each low- then high-fidelity visual-option round before human selection or dependent work
- current deliverable and required-material identity, reusable unchanged reviews, and recovery of consumed rounds through existing handoff state
- the conduct-owned completion boundary, the fallback when that review practice is absent even from an installed older conduct skill, and separation from pre-push review and post-push review

## Execution Handoffs

See [implementation-package.md](./references/implementation-package.md) for:

- defining the approved target, material identity and operation grants for a contribution
- returning or accepting an execution or review result, including unchecked material, unresolved decisions and recovery state

See [subagent-delegation.md](./references/subagent-delegation.md) for:

- qualifying an implementation assignment or a selected review checkpoint, including direct execution and a previously unavailable route
- which work the driver keeps and which a reader, writer or reviewer takes, once delegation qualifies (the delegation matrix)
- assignment-specific grounds, relevant requalification changes, and conditional host-guidance defaults
- material-access preflight and integration of returned evidence without transferring whole-change responsibility

See [writer-ownership-and-recovery.md](./references/writer-ownership-and-recovery.md) for:

- coordinating concurrent writing, retrying an effect, or recovering an interrupted run, including plan-change interruption and outcome-unknown recovery
- claiming a simulator, emulator, attached device, port or installed app other sessions share before changing it
- append-only history and completion-evidence comparison

## Review and Readiness

See [review-workflow.md](./references/review-workflow.md) for:

- the definitions of plan review, pre-push review and post-push review, and the note retiring the earlier terms
- selecting each checkpoint's route from applicable instructions or skills, including ordinary trigger directives
- the post-push route, override first and then the fallback, with per-host override examples, while preserving pre-push review and the project's delivery mechanism
- closing created review sessions/threads after posting, recovery, and permission requests or concrete human cleanup handoffs when closure fails

See [finding-response.md](./references/finding-response.md) for:

- choosing an author-side response to a pre-push or post-push review finding through feedback judgment and causal correction selection
- the bounded response practice when conduct or development capabilities are absent
- response reasoning distinct from finding disposition and fresh-review input

See [pre-push-review.md](./references/pre-push-review.md) for:

- the driver entering pre-push review after initial implementation and before the first push, or recovering a pending assessment
- pre-push findings, terminal states, deferred human handoffs, dismissal authority, and durable parks
- the initial implementation plus three review/fix rounds, and the disposition of findings still open after round three

See [post-push-review.md](./references/post-push-review.md) for:

- the driver requesting post-push review, addressing its findings, evaluating the posted result or publishing readiness
- where post-push review starts, fresh rounds after each fix batch, and the four-round address cap
- identifiable posted completion under the project's adopted presentation and reporting scope, without affirmative per-check assertions, distinct from explicit limitations and contributor evidence
- post-push fixed, human-dismissed, and outstanding dispositions without rewriting reviewer history
- convergence distinct from conversation closure, including substantive metadata changes
- conflict remediation, affected verification, the waiting bound with its subscription route, and ready conditions

## Resume and Reporting

See [resuming-and-handoff.md](./references/resuming-and-handoff.md) for:

- resuming or taking over a run by reconstructing actual state and resuming one pending phase
- handling stale, partial, and unknown outcomes

See [run-state-and-reporting.md](./references/run-state-and-reporting.md) for:

- persisting recoverable semantic run state independent of storage format, including separate checkpoint qualifications, actual review coverage, and their grounds
- evaluating a recovered or standing operation grant against a proposed effect across phases and sessions
- writing the evidence-backed ready-to-merge brief, which lists agent-performed checks with their evidence links and leaves only the remainder as human steps, and reporting a spawned role's model and effort as `verified`, `declared`, or `unknown`
- recording the branches, working copies, processes, port forwards and installs a run creates, by identity a later release can check, and why releasing them needs no separate grant

A text-only handoff ends the turn. The same-turn action rule applies throughout the run, including after a contribution or machine result arrives.

**Guidelines:**

- MUST act, in the same turn, on any observation that has a next step while the run continues — do not end a turn that reports and calls no tool when there is more to do.
- MUST treat exactly three cases as exceptions to that rule rather than violations of it: ending the turn at a required human gate, including a machine event escalated to one; recording state before stopping at a waiting bound; and the completion report that closes the run.
- MUST NOT apply this rule to a progress note, or to ending the turn as "pending", while an asynchronous machine event is still outstanding — a required check, post-push review, or a delegated actor's run — when no independent next action is available; an outstanding event alone does not establish that condition. [Waiting Bound](./references/post-push-review.md#waiting-bound) states how to wait.
- MUST apply the project's conduct practices' reporting rule against claiming continued work in a reply that ends the turn. Where that rule is absent, such a reply does not claim the work continues now or will without new input. A turn that ends under an exception or the asynchronous-event carve-out states that ground in plain terms and, except for the completion report, what or whom it awaits and the resumable next action. Sending a report to another actor is not by itself such a ground. [phase-progression.md](./references/phase-progression.md#advance-or-stop) states the full record for a run stop.
- MUST NOT read this rule as barring reasoning alongside a tool call: it forbids splitting one turn into a text-only turn followed by the turn that acts, not writing prose in the same turn that also calls a tool.
