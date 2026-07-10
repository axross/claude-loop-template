# Escalation

Apply these rules to decide what stays inside the review report versus what must be deferred. The review phase's only output is the review report — it does not act on the codebase, and it does not delegate the review elsewhere.

## The Reviewer Reports, It Does Not Act

The review phase produces a report, not a patch — mixing edits into it destroys the separation between finding problems and fixing them.

**Guidelines:**

- MUST NOT mutate the codebase during the review phase. Apply fixes only after the review report is complete and the workflow has switched back into implementation mode.
- MUST NOT delegate the review elsewhere. Frame every finding so the user or the later implementation phase can act on it without needing another reader.
- SHOULD make each Critical and Major finding so specific (file path, line number, diff-style fix snippet per [evidence.md](./evidence.md)) that the eventual fixer can apply it without re-deriving context.

## Make Fixes Trivially Applicable by the Caller

A Critical or Major fix that lands without its verification step can silently trade the original defect for a new one.

**Guidelines:**

- MUST list, under **Recommended Actions**, the verification step ({{LINT_CMD}}, {{E2E_TEST_CMD}}, a manual check of the affected surface per the project's development guidelines (verification rules)) needed after each Critical or Major fix.
- SHOULD phrase recommendations as imperative checklist items written to the future fixer, such as "Apply fix #1, then run {{LINT_CMD}}."

## Surface Recurring Guideline Gaps to the Caller

A defect class that recurs with no rule to cite will keep reappearing in future changes until the guidance catches up.

**Guidelines:**

- SHOULD note in the report when the same defect class has appeared multiple times in the diff and no current guideline rule cleanly covers it. Use a **Guideline gap:** bullet under Recommended Actions and propose a concrete location, such as "Consider adding a rule under `application-security-requirements/secret-handling.md` covering …".
- MUST NOT add or modify guideline files during the review phase.

## Escalate High-Risk Changes

A single-agent self-review cannot substitute for independent review on changes where a missed defect could expose private data, break production behavior, or destroy content. These changes can still be implemented locally, but the review report must not call them merge-ready without an external gate.

**Guidelines:**

- MUST mark high-risk self-reviewed changes as needing user review, CI/PR review, or explicit user acceptance before merge-readiness.
- MUST treat auth, access control, secrets, environment-variable exposure, untrusted-input rendering (XSS), SSRF/outbound fetching, data-layer schema migrations, public interface contracts, production config, analytics/privacy capture, and broad refactors as high-risk.
- MUST list the external gate under **Recommended Actions** when the change is high-risk.
- SHOULD include the strongest local verification evidence available before escalating, so the external reviewer is checking a narrowed risk.

## Defer Decisions to the Caller

The reviewer MUST defer the decision back to the user — it does not pick a side — when a finding involves any of:

- A breaking change to a public interface contract (e.g., a public URL, API response shape, or other consumer-facing contract) that affects consumers already depending on it.
- A change to a data-layer schema migration that will be irreversible once applied to production (e.g., dropping a non-empty column).
- A cost / performance trade-off that requires production-environment data to evaluate (e.g., choosing a short vs long cache lifetime — the rule is "cache it", but which value is a judgment call).
- Adoption of a new third-party service or API key with a budget implication.

Frame deferred items under the **Recommended Actions** section as **Decision needed:** entries with at least two enumerated options and the reviewer's tentative recommendation.

**Guidelines:**

- MUST defer trade-offs between two SHOULD rules when no MUST rule breaks the tie.

## Do Not Surface as Guideline Gaps

Guideline-gap reporting is reserved for missing reusable guidance. Ordinary execution failures and already documented rules should stay in the review findings instead.

- Lint or format errors — the developer's code-quality loop (per the project's development guidelines, code-quality rules) covers them; flag them as Critical findings and let the fixer run {{FORMAT_CMD}} / {{LINT_CMD}}. <!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — keep the next parenthetical if the project adopts the posted-review channel (REVIEW.md) OR delete it; see the INIT.md Step-4 bullet. --> (When the project has a posted-review policy, a **posted** PR review omits these CI-enforced findings per the [Repository Review Policy Overlay](../SKILL.md#repository-review-policy-overlay).)
- Snapshot regenerations — flag whether the change is intentional per the project's quality-assurance guidelines and let the fixer re-run with the test runner's snapshot-update flag.
- Anything resolvable by re-reading an existing guideline file.

**Guidelines:**

- MUST NOT report lint failures, format failures, snapshot updates, or already documented rules as guideline gaps.
- SHOULD report these items as ordinary review findings with the relevant existing guideline citation.
