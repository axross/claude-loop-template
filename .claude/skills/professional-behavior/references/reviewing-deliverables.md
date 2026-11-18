# Reviewing Deliverables

Apply this reference to investigation, planning, design, and comparable non-code deliverables, including read-only work outside a change loop.

## Scope and Reviewer

A deliverable is an investigation conclusion, plan, design option set, or comparable synthesized output that a human or downstream actor will rely on. Its identity follows its requested purpose and substantive handoff, not its filename or number of constituent files. A visual-option set is one deliverable; low- and high-fidelity rounds are distinct deliverables. A working note is not yet a deliverable; a conclusion passed into further work is.

This practice sets what must be checked before a non-code output is relied on, within the active instruction hierarchy and permitted tool purposes. It does not enroll read-only work in project delivery gates. Applicable host execution guidance owns actual reviewer selection.

**Guidelines:**

- MUST obtain advisory review of a deliverable before delivering it as the requested result or passing it into dependent work, whether the author is the main agent or a subagent and whether or not a change loop applies. A requested draft or option set is a result, not an exemption.
- MUST use a reviewer other than any agent that authored or revised the deliverable, with a fresh review context for every round. Different model names alone do not establish independence.
- SHOULD use a separate subagent as the default where eligible. Applicable host guidance selects the actor and mechanism; an equivalent separate non-author review context is valid only when it meets the same freshness and material-access requirements.
- MUST apply the practice to requested investigation, planning, and design, and to their intermediate deliverables used by a subsequent phase.
- MUST exclude routine status updates, clarification questions, verbatim source retrieval, private scratch work, and purely administrative review coordination or records. A substantive investigation, plan, or design output does not become exempt by being embedded in one of these forms.
- MUST exclude ordinary review reports, their findings and suggested corrections, and responses assessing those findings; do not review the review. A separate investigation, plan, or design deliverable created beyond assessing the existing artifact remains subject to review. Applying corrections to the original artifact retains that artifact's existing budget and current-review requirement.
- MUST use only an available, permitted review route with access to the required material. If none qualifies, report the cause and the unreviewed status; self-review does not satisfy this practice or authorize dependent work.

## Review Input and Findings

Fresh context reduces author anchoring; faithful source material keeps that separation from becoming an uninformed review. The review judges the artifact, not the author's account of producing it.

**Guidelines:**

- MUST give the reviewer the original task, settled constraints and applicable review criteria, the exact current artifact revision, and access to necessary evidence. Review visual designs at visual fidelity, including relevant states; a prose account is not a substitute.
- MUST NOT supply the author's completion receipt, claimed quality verdict, prior review findings, dispositions, or revision narrative as review input. Keep necessary assumptions, alternatives, and reasoning that are part of the artifact itself.
- MUST ask for evidence-grounded defects and missing requirements, not agreement or a minimum finding count. Each finding identifies its location, consequence, severity, evidence, and suggested correction; zero findings and unchecked material are separate outcomes.
- SHOULD keep the assignment short and neutral, referencing accessible material once and requesting compact actionable output. Do not achieve token savings by omitting requirements or evidence; do not claim savings without measurement.
- MUST review a stable target without a competing writer and verify the returned target identity and required-material coverage before using the verdict.

**Example assignment:**

> Review artifact revision [identity] against the original task [locator] and constraints [locator]. Use evidence [locators]; identify unsupported claims, omissions, contradictions, and defects relevant to its intended use. Return findings with location, consequence, severity, evidence, and correction, or state no findings. Name required material you could not inspect. Do not edit or delegate further.

## Improvement and the Hard Limit

A round begins with a request for a fresh assessment of the current revision, followed by the author's response and any corrections when a result is available. The initial draft is not a round. A later review checks the full current artifact independently, not only whether old comments disappeared.

**Guidelines:**

- MUST consult the applicable feedback-judgment practice when responding to findings. Review feedback does not authorize scope changes or settle human decisions.
- MUST repeat fresh review after corrections only while rounds remain; stop early when the current revision has a complete review and no unresolved findings under the applicable disposition rules.
- MUST run no more than three review/improvement rounds per deliverable. MUST NOT extend this limit, ask for an extra round, or reset it by renaming, delegating, resuming, or revising the same deliverable.
- MUST record a consumed round immediately before each invocation requesting a new assessment, including an invocation that fails or returns partial or unknown results. Retrieving the same pending result is not a new assessment; a retry requesting another assessment consumes another round, regardless of a host's separate execution-retry budget.
- MUST retain the artifact identity, rounds consumed, findings and response evidence, latest reviewed revision, and limitations in the work's existing permitted record. If the remaining budget cannot be reconstructed from verified evidence, stop with a non-complete handoff rather than assume unused rounds. Do not create a mandatory new registry or storage service.
- MUST distinguish a correction from fresh reviewer confirmation. Corrections made after the third review are not independently re-reviewed.
- MUST return a bounded non-complete human-facing handoff when required review is unavailable, or no rounds remain and the current revision lacks a complete review or has unresolved findings: include the latest artifact, review coverage, remaining concerns, and corrections not re-reviewed. Do not label it clean or pass it into dependent execution; the human decides disposition, not a fourth round. A complete third review of the current revision with no unresolved findings may finish normally.

## Relationship to Other Practices

Another agent's assessment adds scrutiny, not decision authority. Keep subject judgment, factual verification, and approval with their existing owners.

**Guidelines:**

- MUST keep review advisory. The agent responsible for the requested outcome retains synthesis and integration responsibility; receiving an artifact alone transfers neither. Review does not replace factual verification, human approval, operation authorization, or external review.
- MUST use applicable subject practices to judge evidence and design quality, and applicable finding-disposition rules to settle findings. When none exists, unsupported or non-blocking suggestions may be rejected with evidence; unresolved substantive concerns and human choices stay visible.
