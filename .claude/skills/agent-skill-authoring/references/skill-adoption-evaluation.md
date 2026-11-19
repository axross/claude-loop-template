# Skill-Adoption Evaluation Design

For skill authors comparing a candidate rule revision, freeze the comparison before observing results. This reference defines evaluation-design contracts, not another evaluation framework. It assumes a requested task outcome and candidate treatments. Domain verdicts, installation, active loading, project gates, and runtime operations remain with their owners.

A treatment is a declared guidance, skill, or adapter variant. A source hash identifies content; a different hash neither defines a treatment nor proves adoption. Selection, material acquisition, output conformity, and guard behavior are separate axes, not stages whose success implies the next.

## Comparison declaration

A declaration describes the intended comparison independently of its observations. A comparison cell is one planned task, treatment, and repetition. The following contracts make an intentional revision distinguishable from an unrelated change:

| Contract         | Frozen before execution                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Task             | Application fixture, requested outcome, and ordinary task material                                                     |
| Treatment        | Named variants, expected source/content identities, and allowed guidance, skill, or adapter differences                |
| Fixed conditions | Model/profile, non-treatment harness conditions, and identities of material outside the declared treatment             |
| Scorer           | Definition identity, comparable axes or common obligations, and variable evidence slots                                |
| Opportunities    | Planned cells and the axis-specific populations each cell can exercise                                                 |
| Claim scope      | Natural tasks or separate controls, synthetic or live provenance, supported host/profile scope, and unqualified claims |

The declaration can be prose or an instrument's own format. No universal record schema or identifier syntax follows from these contracts.

**Guidelines:**

- MUST freeze the contracts above and identify every planned cell before execution; later identify the exact observations compared rather than selecting an implicit old/new baseline.
- MUST distinguish treatment labels from source identities and from ordinary skill-present/absent conditions; a declaration is not evidence of adoption or execution.
- MUST check actual identities against declared expectations for every supplied cell, including peer material and fixed conditions; reject duplicate, unexpected, or internally contradictory cells and retain missing cells.
- MUST qualify each comparable axis before calculating its effect: undeclared divergence blocks the effect, while missing identity evidence leaves qualification unknown rather than establishing equality.
- MUST preserve ordinary skill-present/absent and predecessor checks; declared revision comparisons do not justify blanket digest or prompt exemptions or invented metadata for historical observations.

## Scorer definition and variable evidence

A scoring definition identifies the rubric, its template or script, and the judge model and route. Evidence slots identify the parts of the submitted input that vary with task output. A new output in a declared slot changes the actual full prompt, not the scoring definition. A changed rubric or template changes the scorer. So does a changed script, judge model, or route.

**Guidelines:**

- MUST identify the fixed scoring definition separately from variable evidence slots and retain actual full reasoning-judge prompts, judge model, and route for each result.
- MUST treat changed evidence as comparable only within the declared slots; a scorer change or an unknown definition/evidence separation leaves that effect unqualified.
- MUST compare common output obligations separately from obligations added or removed by a treatment; do not pool unlike obligation sets into a revision effect.
- MUST keep measured observations immutable and distinguish declarations from derived reports; missing historical scoring evidence remains unavailable rather than being reconstructed as measurement.

## Natural tasks and actor-visible material

Natural tasks ask for ordinary application outcomes without supplying case-specific expected skill-owner or check answers. Preserve normal skill-catalog visibility, project policy, and required task material. Hiding that ordinary guidance would change the task rather than prevent answer leakage.

For a component/framework responsibility study, the following illustrative categories exercise different boundaries without defining consumer fixtures or executable scenarios. Other skill domains need tasks that exercise their own responsibilities:

| Category                   | Requested surface                                                    |
| -------------------------- | -------------------------------------------------------------------- |
| Small component style edit | A narrow visual change within an existing component                  |
| Props plus style           | A component contract change together with its visual result          |
| Framework wiring           | Startup, routes, or configuration outside a component's own contract |
| Isolated pure calculation  | A calculation change with no component or framework contract change  |

**Guidelines:**

- MUST choose natural tasks that exercise the responsibilities in adopted domain contracts and hold each task's application outcome fixed across treatments.
- MUST keep case-specific scorer expectations outside actor-visible prompts, plans, and handoffs while preserving ordinary catalog, policy, and required task material.
- MUST inspect actor-visible material separately from scorer-only expectations; boundary and fault controls remain a separate suite rather than natural-task results.

## Opportunities and incomplete populations

An opportunity is a predeclared occasion on which one axis can be observed. Its population is not the set of records that happened to survive. Define applicability through the project's adopted domain contracts; the table below identifies evaluation populations, not a competing set of domain verdict rules:

| Axis        | Predeclared population                                                                 | Distinction the report retains                                                                                 |
| ----------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Selection   | Responsibility-selection opportunities, including applicable and inapplicable controls | An invocation at any time does not prove selection before dependent judgment                                   |
| Acquisition | Actor × phase × required-material opportunities                                        | Availability, delivery route, and coverage differ; unobserved delivery is not automatically failed acquisition |
| Conformity  | Applicable output obligations, with common and added/removed obligations separated     | Acquisition coverage alone supplies no output verdict                                                          |
| Guards      | Call/stage opportunities                                                               | Observed refusal differs from actual prevention                                                                |

For three planned cells with one completed pass, one started partial result, and one unstarted cell, the population stays planned 3, started 2, completed 1. The surviving pass cannot become the primary success rate or a numeric treatment effect.

**Guidelines:**

- MUST declare each axis's opportunities before execution and report planned, observed-started, and observed-completed cells separately against that declaration.
- MUST retain failure, unknown, partial, approval-wait, unsupported, and not-reached observations, as well as unstarted cells; none disappears because it lacks a successful verdict.
- MUST name every rate's denominator and label any complete-case descriptive rate separately; an incomplete primary comparison, including an omitted factor in a recorded probe, has no numeric effect.
- MUST report no rate for a zero-applicable population, rather than zero or perfect adherence; correct approval waiting is neither a selection omission nor actual-edit success.
- MUST keep uncovered writes, unsupported profiles, and edit-not-reached observations outside prevention-success claims and report those limits against the planned guard population.

## Separate boundary and fault controls

Controls distinguish plausible wrong interpretations that a successful natural task alone cannot exclude. The following contrasts test how evidence is reported; synthetic observations establish report behavior, not the host behavior they describe:

| Control                                               | Distinction to preserve                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Scope expansion before dependent judgment             | Newly applicable selection opportunities differ from late invocation               |
| Parent-only material evidence                         | Evidence from a parent does not establish a worker's acquisition                   |
| Stale, truncated, or mixed delivery                   | Material availability differs from required coverage and expected content identity |
| Loaded but violating output                           | Full acquisition can coexist with failed conformity                                |
| Unknown acquisition with independently checked output | A checked output verdict does not settle acquisition                               |
| Ignored refusal                                       | A refusal that does not stop the write is not prevention                           |
| Constant denial contrasted with a valid edit          | Denying everything cannot qualify a guard that must permit valid edits             |

**Guidelines:**

- MUST declare boundary and fault controls separately from natural tasks; when evaluating guard discrimination, include a valid-edit control and an ignored-refusal contrast so constant denial and nonpreventing guards cannot qualify prevention.
- MUST keep axis observations independent in the report, including loaded-but-violating and acquisition-unknown/output-checked contrasts.
- MUST label synthetic controls and report regressions as instrument checks, never as live worker, resume, permission-flow, audit, or prevention qualification.

## Evidence sufficiency and claim limits

Design contracts define what to compare; they do not decide whether evidence proves a domain verdict. When judging that sufficiency, consult the project's quality-assurance (QA) practices only if their scope covers the experimental evidence judgment. Installed pre-merge change-verification practices do not cover that judgment merely by being present. Axis criteria come from their adopted domain contracts, not this reference. Installation and active source/content confirmation belong to skill-management practices. Required gates belong to project policy and change-loop practices; execution mechanisms belong to applicable host operations.

If no available QA owner covers the judgment, report that evidence-sufficiency review is absent and identify the evidence limitation. This limit applies both when the owner is missing or unavailable and when installed QA practices do not cover the judgment. Unknown evidence stays unknown; independently checked conformity does not settle unknown acquisition. A declaration or synthetic report cannot supply the absent review or qualify an unsupported host. A no-delegation profile cannot establish genuine worker acquisition; an unattended bypass profile cannot establish ordinary permission flow. Neither stored reconstruction nor simulated invocations supply genuine resume or correctly rooted live audit evidence.

**Guidelines:**

- MUST route evidence-sufficiency judgment to the project's QA practices only when an available owner's scope covers that judgment; otherwise state the evidence-sufficiency-review limitation rather than substitute unknown evidence for a pass.
- MUST ground axis criteria in adopted domain contracts and identify any missing contract that limits a verdict; sibling proposals or messages are not adopted scoring revisions.
- MUST retain synthetic/live provenance, supported scope, and unqualified claims in every report; source agreement, installation, or loading checks alone are not experimental adoption evidence.
