# Verification

Apply these guidelines to confirm that a change produces the correct output before considering the task done.

This reference owns the **method** — how to decide what a change put at risk, and in what order to confirm it. It does not enumerate the concrete targets: each one belongs to the skill closest to the surface it protects, so whichever skill governs a surface is also the skill that says how to verify it. For the commands that run the project's gate, consult the project's own documentation per [project-docs.md](./project-docs.md).

## Identifying Affected Output Surfaces

A change is verified against what it can break, not against whatever was convenient to check. Deciding that mapping first is what keeps verification from defaulting to the command that happens to be easiest to run.

**Guidelines:**

- MUST map changed files to the output surfaces they put at risk before choosing a verification path, rather than running a habitual command and calling the change confirmed.
- MUST include the surface a change produces even when the edit looks inert — prose with no structural impact still renders, and the rendered output is what a reader consumes.
- MUST run the project's aggregate quality gate whenever a change touches any surface that gate covers.
- SHOULD consult the skill that owns a changed surface for how that surface is verified, instead of re-deriving the check here.

## Plan Fragile Obligations Before Execution

A fragile obligation is an applicable requirement that a plausible implementation can violate without an obvious failure. A dropped consumer style can type-check; duplicate safe-area clearance can disappear on a zero-inset fixture. Planning the distinguishing check first prevents the implementation's own output from becoming its expected result.

**Guidelines:**

- MUST identify fragile obligations for affected responsibilities and output surfaces before execution, with independently derived expected results and discriminating checks, plus necessary human-approval conditions where applicable.
- MUST keep every other applicable duty binding; the explicitly planned checks are a focused evidence set, not an exhaustive compliance score.
- MUST record expected obligations and methods in the governing plan where one exists, or in existing permitted task state or internal handoffs otherwise, separately from progress and observations. This does not require a new plan artifact.

When an expectation or method changes an approved plan, consult the project's change-loop plan-revision and append-only recovery practices where present. Without that optional owner, preserve the project's approval and amendment gates, keep observations separate from expectations, and report unresolved approval before dependent work. This reference defines no approval identity or storage format.

## Manual Verification

Manual verification is the first line of confirmation; the automated gate is the second. Neither replaces the other — the gate cannot tell whether the content is correct, and reading cannot catch a broken link or a wrong exit code as reliably as a checker.

**Guidelines:**

- MUST exercise or read the output surface a change produces, in the form its consumer receives it, before calling the change done — including a runnable script's observed behavior, where the skill owning that surface says how to confirm it.
- MUST NOT call a change done on the strength of a passing format/lint gate alone; the gate does not judge whether the content is correct.
- MUST report skipped, failed or insufficient required checks as limitations, naming the reason and residual risk rather than presenting them as successful conformity.

### Device Checks

Exercising a change on an iOS Simulator or an Android emulator satisfies a device check in principle: an agent whose host has the runtime performs the check itself and records what it observed, with no human handoff owed. Three exceptions send the check elsewhere. A more specific rule of the skill that owns the surface, such as one requiring a real device for a named behaviour, takes precedence over this default.

| Exception                                                                                                                                                                                                                                                                                                                                                                       | Outcome                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **(a)** The host cannot run a simulator or emulator, such as a hosted cloud session.                                                                                                                                                                                                                                                                                            | A human performs the check on a physical device. |
| **(b)** The project's agent instructions or documented policy prescribe another route.                                                                                                                                                                                                                                                                                          | Follow that route.                               |
| **(c)** The property is one only a physical device proves. The list is not exhaustive: camera and barcode scanning, push notifications, performance, memory pressure and operating-system termination, real loss of radio signal, behaviour gated on the device model or a hardware capability, VoiceOver and TalkBack, haptics, and defects that reproduce only in production. | A human performs the check on a physical device. |

A check sent to a human is reported as a skipped check with its residual risk, under the guideline above.

**Guidelines:**

- MUST treat a simulator or emulator exercise as satisfying a device check unless exception (a), (b) or (c) applies, and route the check by that exception's outcome when one does.
- MUST check which runtimes the host actually has before declaring native-device access unavailable.
- MUST NOT read that check as provisioning a runtime, nor as authorization to dispatch billed or secret-bearing CI devices, hosted builds, or preview builds; each of those needs its own authorization.

#### Leaving the Target as Found

A simulator, emulator or attached device is shared by every session on the machine, and builds of one app commonly share an app id across checkouts. An exercise that leaves a device-wide setting changed, or a build installed, hands the next session a state it did not choose. When an exercise turned the network off and the check then failed, the network is still turned back on before the target is released.

Coordinating who may change a target at all — claiming it before a change and what to do when another session holds it — belongs to the project's change-loop writing-coordination practices where present, and is not restated here. Uninstalling discards the app's data, such as a sign-in or a local database; what that costs is the project's call.

**Guidelines:**

- MUST restore every device-wide setting an exercise changed, such as network or appearance, before releasing the target, including when the check failed partway, and MUST report any setting that could not be restored. This holds alongside whatever more specific route the owning skill prescribes for the check itself.
- SHOULD uninstall the builds the run installed once the change they verified is finished and no other open change of the same work needs them, and only when no other session holds the target; MUST keep and report them when that cannot be determined.
- MUST treat the target as shared where no claim practice establishes otherwise, and report an observation taken on it as one another session could have affected.

## Diagnose a Failed Check

A failing command establishes a failed route, not its cause. The same error in
the base and changed checkout can come from unchanged defective source or from
local generated state shared by both. Calling it pre-existing from that
comparison alone can conceal a repairable verification environment.

Choose evidence that separates the credible explanations. The following are
contrasts to guide diagnosis, not a requirement to run every comparison:

| Explanation                              | Discriminating evidence                                                                                                                               | Consequence                                                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Change regression                        | With comparable documented setup and inputs, the baseline passes and the changed material fails; tracing connects the failure to the changed surface. | Correct the in-scope regression and rerun affected checks.                                                                                     |
| Pre-existing source defect               | The failure persists in an isolated baseline using documented setup, and tracing identifies the defect in unchanged tracked source.                   | Record the baseline defect and the verification it prevents; its existence does not expand repair scope or satisfy the gate.                   |
| Generated or local environment state     | Trace the failing input's origin and relevant local setup; documented regeneration or isolated setup makes the same source pass.                      | Repair permitted local state or use the documented isolated route, then verify the required property without a speculative source workaround.  |
| Unavailable or inconclusive verification | The checker cannot execute, a required dependency is unavailable, or setup differences prevent a meaningful comparison.                               | Retain the missing evidence and cause as unresolved; pursue available independent checks without presenting them as the blocked check passing. |

**Contrasting Examples:**

> **Stale input:** An ignored generated declaration was copied into both base
> and changed checkouts, and both checks fail in that declaration. Input-origin
> inspection and documented regeneration replace the stale content; checking
> the same source with the required generated coverage then passes. That
> comparison supports a local-state diagnosis. The original pair of failures
> alone did not identify a defect in unchanged source.

> **Valid input adds coverage:** A generated declaration correctly restricts
> route names. With it, checking rejects a source call using an invalid route;
> clean CI omits it and accepts a broad string fallback. Inspecting the
> generator and checker inputs explains the different covered properties.
> Deleting the declaration reproduces the narrower pass, not a verified fix.
> Retain the required failure, distinguish regression from baseline defect
> using comparable inputs, and keep repair within the approved scope.

**Guidelines:**

- MUST establish the failed command, actual result, material revision and relevant setup, including whether the checker reached the property being tested or failed in its harness or environment.
- MUST distinguish a change regression, pre-existing source defect, generated/local state and unavailable or inconclusive verification using discriminating evidence; retain an unresolved diagnosis when the evidence cannot distinguish them. An identical baseline failure or a diagnostic outside changed files alone does not establish a pre-existing source defect.
- SHOULD choose the smallest safe comparison that can settle the cause, using documented setup and preserving unrelated local work; comparable base/current runs, input-origin inspection, regeneration and isolated execution answer different questions.
- MUST reconcile required checks after an environment correction or alternate route, rerunning the affected check against the current material when available and retaining every remaining failure or coverage gap. A passing alternate check establishes only its covered property, not a waiver of another required gate.

Route any proposed source repair through [change-management.md](./change-management.md)
for causal correction and scope. When consequential inference or reporting
accuracy is uncertain, consult the project's conduct practices where present;
without them, keep the diagnosis qualified by the evidence above. When the
diagnosis changes which action can proceed, consult change-loop progression
practices where present; without that owner, preserve the project's required
gates and report the specific blocked action and available work.

## Check the Current Integrated Output

Output conformity means that the inspected result follows its applicable governing rules and currently valid exceptions. Acquisition establishes which instructions reached an actor, not whether the actor followed them. A contribution can also be correct before integration and wrong afterward.

When a claimed departure depends on a bounded exception, consult the project's installed-rule-change practices where present to establish its human adoption and current applicability. Without that optional owner, require evidence that the human accepted the identified departure and that its bounds still apply. An agent assertion, expired or out-of-scope exception, or unadopted upstream proposal does not justify the departure. Actual host priority and tool restrictions still apply.

**Example:**

> A human adopts a fixed width for one constrained print view as a bounded departure from an identified override rule. That exception can justify the print-view result while its conditions hold; the same text in an agent draft, or applied to a mobile screen outside its scope, cannot.

**Guidelines:**

- MUST inspect the actual current integrated diff and output against the governing requirements, rather than accept a contribution receipt, author assertion or earlier result as proof of the integrated change.
- MUST derive expected behavior from the applicable domain rules and valid exceptions, not from what the implementation happens to produce.
- MUST NOT infer conformity from complete skill acquisition, or a concrete output violation from unknown acquisition alone; independently verified output establishes only the inspected property, not acquisition, finding disposition or readiness.

## Bound the Evidence Claim

Static inspection, web rendering, a simulator or emulator exercise and a physical-device exercise are four tiers of evidence, and each observes different properties. Evidence from before a relevant integration change cannot establish the affected current result. A reasoned skip accounts for a required check but leaves its claimed property unverified.

**Guidelines:**

- MUST identify the material revision, inspected obligation and scope, platform, check route, independent expected result, observed stage and actual result needed to interpret each claim, using existing permitted evidence destinations rather than a new schema.
- MUST recheck affected claims after relevant integration changes; evidence for an earlier contribution is not current merely because that contribution was accepted.
- MUST distinguish the four tiers — static inspection, web rendering, simulator or emulator exercise, physical-device exercise — and external-review completion; none establishes an unobserved property or platform by implication.

When evidence sufficiency is in question, consult the project's verification-evidence assessment practices where present. Without that optional owner, retain these claim limits rather than invent a QA gate. When preparing fresh review input or assessing posted completion, consult the project's review and change-loop practices where present; contributor observations do not replace original material and requirements with an author verdict map, or require external reviewers to enumerate successful skill loads or checks.

## Contrasting Checks

These examples apply the governing component-style and navigator-edge contracts and the device-check routing above; they illustrate check selection, not new domain rules or reports of app execution. Compare the following conditions:

| Conditions                                                                                                                                                                          | Independent expectation                                                                                                                                         | Evidence limit                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| An overrideable intrinsic width is 160; the consumer supplies 240.                                                                                                                  | Effective width is 240. A result of 160 violates the override contract even with complete acquisition.                                                          | A verified 240 establishes this override, not unknown acquisition or every styling duty.                                                                     |
| A non-scrolling screen has nonzero top and bottom insets; its visible header and tab bar already clear those edges.                                                                 | The screen adds no duplicate top or bottom clearance. Hiding its header transfers the top edge only if no ancestor navigator or presentation already clears it. | Zero-inset-only fixtures cannot distinguish duplication; inspect the full navigator arrangement. Web or static evidence establishes no native-device result. |
| A non-scrolling screen has nonzero top and bottom insets; its visible header and tab bar overlay content without clearing either edge, and no ancestor or presentation clears them. | The screen still owns both reached edges and supplies their required clearance.                                                                                 | Contrast this with the cleared-edge case; chrome visibility alone cannot distinguish the ownership.                                                          |
| Lint passes, or a check stays green with the violating implementation.                                                                                                              | The override and edge obligations still need distinguishing observations.                                                                                       | An unrelated or insensitive check does not cover those obligations.                                                                                          |
| The host has a runtime for the platform, and the property is not one exception (c) reserves.                                                                                        | The agent exercises the change there itself, unless exception (b) prescribes another route.                                                                     | The observation covers that runtime and platform, not a physical device or another platform.                                                                 |
| The host has no runtime for the platform, found by checking the runtimes it actually has (exception (a)).                                                                           | Record the skipped exercise and its concrete residual risk, and route the check to a human on a physical device.                                                | Static or web checks can establish their own properties, not turn the skip into device verification.                                                         |
| The property is one exception (c) reserves.                                                                                                                                         | The check goes to a human on a physical device, whatever runtimes the host has.                                                                                 | A simulator or emulator pass establishes what that runtime can show, not the reserved property.                                                              |

## Verify the Correction Against the Purpose

A symptom can disappear while the requested behavior regresses. [Product validation](https://www.nasa.gov/reference/5-4-product-validation) distinguishes meeting specified requirements from fulfilling the intended use; review remediation needs both. A list-freshness check alone cannot distinguish a correct cache update from a page reload that loses required editor state.

The project's unit- or end-to-end-testing practices, where present, own regression-case and assertion design. Without them, the bounded default is a check of the reported failure and required preserved behavior, with expected results derived from the task or contract rather than the correction's output.

**Example:**

> **Faulty expectation:** A test expects seconds, but the public contract specifies milliseconds. Correcting that test can be justified by the contract. Changing its expectation to whatever the new implementation happens to return cannot establish correctness.

**Guidelines:**

- MUST verify a correction against the intended outcome and relevant behavior that must survive, not only the reported symptom or the reviewer's suggested edit; reproduce the original failure when practicable and disclose when that reproduction is unavailable.
- MUST select checks that distinguish the justified correction from a credible wrong remedy, using the applicable testing practices where present; a generic passing gate or closed review conversation is not evidence of that distinction.
