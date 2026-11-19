# Plan and Approval

Apply this reference when preparing or approving the plan. A project with richer product-requirement practices owns section craft; this compact fallback keeps the loop independently installable.

Before presenting a plan for approval or each visual-option round for selection, follow [reviewing-phase-deliverables.md](./reviewing-phase-deliverables.md). That review precedes, rather than supplies, human approval.

## Canonical Structure

Use this order: Summary; Todo; Background with Assumptions; Goals and Non-goals; conditional Functional requirements with UI design, System design, and Alternatives considered; conditional Non-functional requirements; Acceptance criteria; Verification strategy; Open questions. Todo is a fixed plain list, not progress tracking. Acceptance criteria are plain, observable bullets covering applicable boundary states.

**Guidelines:**

- MUST resolve environment facts by investigation and put every unresolved product, UX, scope, edge-case, privacy, security, platform, compatibility, persistence, or migration choice to the human before approval.
- MUST stop after presenting a new or revised plan and obtain human approval before implementation; later gates never retroactively supply missing approval.
- MUST preserve question strictness from the project's conduct practices and never manufacture an answer from a resume signal. Without those practices, present decisions as two to four concrete options with the default marked recommended, ask dependent decisions in order, and re-present unanswered questions; never substitute defaults for answers.
- MUST describe beneficiary-observable outcomes, not incidental implementation details; include required sections and state a reason for each omitted conditional section. Follow the project's product-requirement capability when present.
- MUST separate decided assumptions from open questions and keep the approved Todo fixed rather than updating it as a progress log.
- SHOULD publish evidence gathered to settle a plan or design choice in the same durable target as the plan, outside the canonical plan content (for example in a comment on it), so publishing it does not change the plan's identity.

## Verification Outside the Tree

Some approved criteria need evidence the diff cannot carry, such as a real-device result or a machine-specific measurement. Agreeing that route during planning keeps the contributor accountable without asking a code reviewer to establish the result through inspection. An in-tree test remains preferable when it can verify the same outcome.

Designate each necessary external-verification criterion by appending `(verified out of tree: <where the evidence will be published>)` to its wording. Plan approval binds the verification method and evidence destination, not a reviewer exemption; review finding scope is a separate contract.

Verification strategy also names, for each designated criterion, who performs the check — the agent or a human — and by what route, such as a simulator, an emulator, a local web build, or a physical device. Where the project's verification practices, if present, set exceptions that may apply, write the route conditionally, for example "agent on a simulator when the host has one, otherwise a human on a physical device". Falling back along a stated condition is then not a plan change.

**Guidelines:**

- SHOULD use in-tree verification when it can establish the required outcome.
- MUST designate each criterion requiring out-of-tree verification in the plan and agree its verification method and evidence destination before implementation.
- MUST name the executor and route for each designated criterion in Verification strategy, and MAY state the route conditionally along the verification practices' exceptions; a fallback along a stated condition needs no revision, and any other change to executor or route does.
- MUST obtain an approved plan revision before adding or changing that designation later, then regenerate the delivery projection under the Plan Revision Identity rules below.

## Plan Revision Identity

The canonical plan content begins at the first plan section heading and runs through the end of Open questions. A status representation and archived original description are excluded. HTML character-reference decoding—named and numeric—is the only normalization before identity comparison.

**Guidelines:**

- MUST derive an immutable identity from canonical plan content, bind approval to it, and carry it in every assignment and result governed by that plan. Read-only work outside the change loop uses its material revision instead.
- MUST NOT use a whole-record update timestamp as plan identity or apply whitespace, line-ending, case, Unicode, or any normalization beyond HTML character-reference decoding.
- MUST invalidate approval and stale execution or review results when canonical content changes, and stop before editing on an identity mismatch.
- MUST name the revision that any projection of the plan's acceptance criteria onto a delivery target was taken from, regenerate that projection when canonical content changes, and treat a projection naming a superseded revision as stale rather than as evidence of what was approved.
- MUST establish a byte-faithful read before comparing or rewriting stored content; a degraded read is not evidence that a plan or approval disappeared. Distinguish changed content from degraded transport before proceeding.

## Plan Amendment

Approval of an amending plan carries approval of its write to another approved plan only under all three existing conditions: every replacement block is quoted verbatim; the resulting identity is named before approval; and the current identity was reproduced from stored bytes before drafting the replacement.

**Guidelines:**

- MUST obtain separate approval against the amended plan's own identity when any of the three conditions is absent.
- MUST fetch the amended plan after writing, re-derive its identity from stored bytes, compare it with the pre-approved resulting identity, and stop on mismatch.

## Visual Change Options

Visual direction is part of plan approval, not an implied implementation choice. A visual change is settled over one or more **rounds**, each approved on its own rather than bundled: a low-fidelity round settles regions, layout, and hierarchy, and a high-fidelity round confirms the concrete look against what that first round fixed. Climbing the ladder in that order is what keeps a layout objection from arriving after the colour, type, and spacing work has already been built on it.

**Guidelines:**

- MUST present two to four distinct visual options in each round, and obtain the human's approval of that round before opening the next.
- MUST NOT begin implementation until the final design round recorded against the plan is approved; a plan with no visual change proceeds on plan approval alone.
- MUST record the approved option as the design source of truth against the plan, and reference it from the delivery target so a reviewer can compare the build against it.
- MUST preserve visual artifacts at visual fidelity; prose describing an image is not the approved image.
- SHOULD publish each round as an artifact the human can actually view, and follow the project's own wireframe and high-fidelity design capabilities for each round's craft wherever it ships them.
