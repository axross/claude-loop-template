# Consulting and Upkeep

## Consult before planning

A change to retry timing can invalidate both the scheduler's contract and an
operator's procedure for recognizing a stuck job. The index identifies the
initial owners. Their preconditions and authority links reveal other readers.

**Guidelines:**

- MUST consult the index to locate unfamiliar subjects before planning a change. Follow precise caller links directly and trace the dependencies whose claims the change would invalidate.
- SHOULD stop reading when the routes establish that the change affects no documented claim. Revisit that conclusion if implementation reveals a dependency.

## Find the affected claim

| Change                                            | Consult                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| A metric changes eligibility, units or weighting  | Its Definition and the Specifications that consume it                        |
| A mode returns a different result or error        | Its result Specification and readers that present the value                  |
| Responsibility moves between components           | The Architecture, diagrams and operational diagnostics that use the boundary |
| A team changes an implementation practice         | Its Convention, counterexamples and enforcement                              |
| A release permission changes                      | The Policy and each entry point that relies on it                            |
| A command, prerequisite or success signal changes | Its Procedure and the caller's route to recovery                             |
| A term, file or heading moves                     | Glossary conventions, indexes, inbound links and external anchors            |

**Guidelines:**

- MUST correct an invalidated claim in the same change and update the routes that depend on it.
- SHOULD leave a page alone when the change preserves its claims and reading routes.

## Record what became true

An adopted target architecture and a deployed component can answer different
questions about the same service. A later contributor also needs to know why
an apparently workable alternative violates a settled constraint. When a retry
limit changes, replace the value and the reason for it on the governing page.
The commit shows the previous limit. The pull request holds the benchmark and
review discussion that led to the change.

**Guidelines:**

- MUST describe observable behavior in the present tense, identifying targets and illustrative examples explicitly.
- MUST put a settled constraint and its current rationale on the page that governs it. Include a rejected alternative when readers are likely to try it. Keep deliberation and run results with the commit or pull request that settled the change. Link that source when a current claim depends on it.
- MUST update the governing page in place. Do not append dated updates or create a page, registry or concept type for each verification run, rollout or decision.
- MUST retire obsolete guidance when a feature disappears and [settle support for affected routes](./cross-references.md#preserve-the-reading-route).
- SHOULD read each changed page on its own and exercise a boundary case from a consumer's or operator's entry point. Run the [documentation checks](./validators.md).

## Verify a reader's route

An on-call runbook links “Can I roll back?” to a release overview. The
overview links to “Rolling back,” where the operator learns to redeploy the
previous revision only while the data survives. After a destructive contract
migration, the operator must stop and use the restore procedure. Point the
runbook straight at “Rolling back.” Start again at the runbook: the operator
can skip the overview and stop at the same decision, with its exception.
Linking to a valid “Releasing” heading instead would lose that answer.

**Guidelines:**

- SHOULD sample real tasks before and after a substantial move. Record the question, starting path and fragment, pages and sections opened, owning answer, limiting condition and stopping point for each route.
- MUST exercise the root, the relevant subject index and representative callers such as a README, runbook or dependent concept. Follow the routes the export actually ships. A shortcut at the root can hide a missing choice at a subject index.
- MUST compare the link's promise to the actual passage, including exceptions. Repair a misleading label or heading, a missing local route or a detour through unrelated material. Keep a longer route when the reader genuinely needs both owners.
- MAY compare hops, distinct files or bytes opened to diagnose a detour. Count a file once per question and starting point when measuring whole-file exposure. Use the decision and its limits to judge the change.
