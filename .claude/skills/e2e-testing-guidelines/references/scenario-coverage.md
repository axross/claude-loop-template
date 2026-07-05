# E2E Scenario Coverage

<!-- INIT:OPTIONAL key=SCENARIO_COVERAGE — keep if the project adopts journey-catalog e2e coverage OR delete this file, its "E2E Scenario Coverage" routing section in ../SKILL.md, and the marked "Scenario Coverage" sites in quality-assurance-guidelines; see the INIT.md Step-4 bullet. -->
*If this project does not adopt scenario coverage, delete this file (and the other marked sites) during INIT.*

Apply these rules when tagging tests, extending the journey catalog, or reading the coverage report. This project measures e2e coverage as **scenario coverage** — which real user journeys the {{E2E_TEST_FRAMEWORK}} suite *asserts* — not lines of application code executed.

## Why Scenario Coverage, Not E2E Line Coverage

Scenario coverage is a deliberate choice over instrumenting the app and collecting e2e *line* coverage. Line coverage was rejected because:

- **Noisy and gameable.** Executed ≠ asserted: a line runs when a test merely walks past it, so line coverage overstates how well journeys are *verified*.
- **Slow and heavy.** It needs an instrumented coverage build, which is fragile under modern bundlers and slows the default e2e run. Scenario coverage is pure bookkeeping over test tags, so it adds near-zero cost.
- **Cannot express gaps.** Line coverage has no notion of an *intended* journey nobody has tested yet, so it can never say "the cancel journey is untested." A traceability catalog can — that visible-gap capability is the whole point.

The trade-off: the denominator is a **human judgment call** — an incomplete catalog inflates the percentage — so the catalog is reviewed alongside the code, and only critical journeys are hard-gated.

## Mechanism

Three pieces, joined by a stable scenario id:

- **Catalog** — a human-authored journey list (e.g. `scenarios.md` at the root of `{{TEST_DIR}}`) with one row per journey: a stable dotted id (e.g. `checkout.payment.success`), a title, an area, and a priority of `must` | `should` | `may`.
- **Tags** — each test declares which journeys it asserts through the tag mechanism {{E2E_TEST_FRAMEWORK}} provides. For example: a `@scenario:<id>` join tag (a test can carry several), optional `@area:<area>` / `@priority:<priority>` facet tags for filtered runs and grouped reporting, and an `@smoke` selection tag marking the fast pre-gate subset — adapt the exact syntax to the framework's tagging feature.
- **Reporter** — a coverage reporter tallies, for every catalog row, whether at least one **passing** test carries its scenario tag, then prints `covered/total` overall and per priority plus the list of uncovered scenarios.

> The reporter, the gate script, and the coverage run command are built during INIT (Step 5) — the template ships the convention, not an implementation.

**Guidelines:**

- MUST author the catalog as a human-reviewable file, not a list in code, so journey completeness is judged in review.
- MUST add a catalog row when a change introduces a new user-facing journey, in the same change as the test that asserts it.
- MUST tag the test that **asserts** the journey's outcome — never a test that merely passes through the journey on its way elsewhere; executed ≠ asserted, and a tag on a pass-through test overstates coverage.
- MUST NOT rename a scenario id without updating every tag that references it in the same change — the id is the contract between catalog and tests.
- MUST keep facet tags (area, priority) consistent with the tagged scenario's catalog row, so filtered runs and grouped reports stay trustworthy.
- SHOULD keep genuinely-untested journeys in the catalog with an honest priority so the report shows real gaps; writing tests for surfaced gaps is follow-up work, not a prerequisite for reading the metric.
- MUST count a scenario as covered only when a **passing** test carries its tag; a failing or skipped test leaves it uncovered.

## Phased Gate

Gating in phases lets the metric land before coverage is complete: pin the critical journeys first, grow breadth without blocking every merge.

**Guidelines:**

- MUST hard-gate `must`-priority scenarios at 100% first: a `must` row with no passing asserting test blocks.
- MUST fail the run on structural tag errors — an unknown scenario id or a facet tag that disagrees with the catalog — in every phase; a silently mis-joined tag corrupts the metric.
- SHOULD keep `should` / `may` coverage report-only until the `must` gate is stable, then tighten deliberately.
- SHOULD keep the default e2e run threshold-free (report + structural errors only) so it stays fast, and enforce the `must` gate in a dedicated coverage command or CI job.
