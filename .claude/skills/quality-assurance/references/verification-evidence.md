# Verification Evidence

Apply these rules when reviewing whether the author proved the change works. Verification evidence is the observable record of checks performed, not a general claim that the change was tested.

## Review Finding Scope

Evidence adequacy and review finding scope are separate decisions. Code-review practices own which gaps a review reports; QA does not widen that scope. An excluded finding can still leave contributor verification incomplete.

**Guidelines:**

- MUST, when code-review practices are available, apply their finding-scope boundaries before turning missing verification into a QA finding; consult their acceptance-criteria code-inspection boundary when the proposed finding depends only on absent external-verification confirmation or evidence.
- MUST use this reference's evidence rules under the project's review policy when no code-review owner is available; absence of that optional owner creates no additional exclusion.

## Evidence-Adequacy Decision Flow

Walk every changed surface through this flow. A reasoned skip is accounted for but remains unverified; it does not exit at "covered." Each flag is subject to [Review Finding Scope](#review-finding-scope); excluding a finding does not make its evidence adequate. The specific rule and the project's review severity tiers assign severity to reportable flags.

Apply the following decisions in order:

1. Identify the claimed obligation and the current integrated material it concerns.
2. Record the property left unverified by a skipped required check, with its reason and residual risk. Continue assessing remaining checks and claims on the same surface; assess any reportable gap under Review Finding Scope.
3. For each remaining check, require a named command, manual route or reasoned inspection with an observed result. Missing or failing required checks do not establish conformity.
4. Assess relevance, currency and discriminatory power under the sections below. An unrelated, stale or insensitive result leaves the claim unverified, however green.
5. Compare the observation with the independently derived expectation. Record an evidenced mismatch as an output violation subject to Review Finding Scope; otherwise call only the established property covered. Repeat for remaining claims and checks before taking the next surface.

## Acquisition Is Not Conformity Evidence

Contributor output-verification practices own generating evidence against applicable rules and valid exceptions. This reference assesses that evidence, not whether an actor acquired its instructions. When those practices are available, consult them for a claim about integrated-output conformity; without them, keep the following limits rather than infer success from acquisition.

Compare these independent observations:

| Acquisition observation           | Output observation                                                          | Supported conclusion                                            |
| --------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Complete applicable text acquired | An overrideable width of 160 remains 160 despite a consumer override of 240 | The override violation remains; acquisition does not excuse it. |
| Acquisition unknown               | Effective consumer width independently verified as 240                      | This output property is verified; acquisition remains unknown.  |
| Complete applicable text acquired | Only unrelated lint passes                                                  | No override or safe-area conformity is established.             |

**Guidelines:**

- MUST consult contributor-verification practices, when available, for the generation and bounds of integrated-output evidence; without them, assess only independently observed properties, as illustrated above.

This assessment does not require posted independent reviewers to enumerate passed skill loads or checks. Fresh-review input and external completion remain under the applicable review and change-loop practices, not a positive-attestation checklist here.

## Relevance and Currency

A result answers a particular question at an observed material revision and stage. Static source inspection can establish an inspected branch, while rendering observes a surface, a simulator or emulator exercise observes that runtime, and a physical-device exercise observes the hardware. A contribution's earlier result can stop describing the integrated change.

For the bounds of an integrated-output claim, consult contributor-verification practices when available. Without them, judge only observed properties of the inspected material and platform; unobserved dimensions stay unverified. QA assesses whether the supplied checks support that bounded claim.

**Guidelines:**

- MUST reject unrelated or stale results for the claimed property under Review Finding Scope.

## Evidence Required Before Completion

A review should connect each changed surface to the command, manual check, or reasoning that covers it.

Evidence is whatever actually establishes the check ran, and the change's own description is only one place it can live. The project's automated checks report against the change independently of its author, which makes them the stronger evidence of the two; an author's report in the session is the weaker but still admissible one. What the description does **not** carry is not thereby unverified — reaching for the description first, and reading its silence as absence, turns a formatting preference into a finding.

**Guidelines:**

- MUST require evidence that the project's format and lint commands ran after code or documentation edits, accepting the project's own reported check results or the author's report of the run, and MUST NOT treat the change description's silence as evidence that they did not.
- MUST require manual evidence for changed output surfaces listed in [manual-verification.md](./manual-verification.md), without turning a gap excluded by Review Finding Scope into a finding.
- MUST map skipped required checks to a concrete reason and residual risk, keeping them unverified rather than counted as successful conformity.
- MUST require a second-pass verification statement after fixing any finding the project's review severity tiers rank as Critical or Major.

## A Result That Could Not Have Come Out Otherwise

The rules above ask whether a surface is covered. This one asks something the coverage question cannot reach: whether the result offered as evidence was ever **capable of coming out differently**. A fixture that fails identically whether the code counts bytes or characters, a case that still passes after the fix it covers is reverted, and a harness that reports failure because it could not execute at all are all results that carry no information about the thing they name. Each reads exactly like evidence, which is why this has to be asked rather than assumed.

The insensitivity is usually in the setup rather than the assertion. Where the assertion itself is what fails to discriminate, the project's unit-testing practices own that rule — assert the distinguishing observable output, not that something merely happened — and this section does not restate it.

**Guidelines:**

- MUST ask of any result offered as evidence whether it would have differed had the behavior it covers been absent or broken, and treat a result that would not have differed as no evidence, however green.
- MUST require that a fixture chosen to discriminate between two candidate behaviors actually differ under them; a fixture that is equal under both — an all-ASCII input for a check that claims to measure bytes rather than characters — proves neither.
- MUST treat a failing result as evidence only for the cause claimed, confirming the check ran and failed for that reason, since a harness that cannot execute fails indistinguishably from the defect it would have caught.
- SHOULD ask how a green check was shown to be capable of failing — the fix reverted, the branch removed, the input broken — whenever that check is the only evidence for a behavior nothing else covers.

## Evidence Format

Evidence should be short but specific enough that another reviewer can see what was covered.

**Guidelines:**

- SHOULD state each command with its observed result, such as "the lint command passed" or "the format command reported no changes" — naming the actual invocation that was run.
- SHOULD name manual routes or surfaces checked, such as "the record-detail page in its non-default content state rendered the expected banner".
- SHOULD include relevant log, screenshot, or diff context when the result is not obvious from command success alone.
- MUST NOT accept "tested manually" or "looks fine" without the route, state, or behavior that was checked.
- MUST NOT accept a passing command as coverage for a surface the command does not exercise.
