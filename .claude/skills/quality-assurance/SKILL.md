---
name: quality-assurance
description: Reviewing whether a change carries adequate verification evidence — "is this verified", "did this break anything", "were the required checks run". The reviewer's QA pass on top of the development verification rules, judging the evidence a change offers rather than re-deriving the rule behind it. Covers requiring command evidence for the format and lint gate, treating a change to the gate's own configuration as a risk to the gate itself, matching manual checks to the changed output surfaces, mapping a skipped check to residual risk, and asking whether a check that passed was ever capable of failing.
user-invocable: false
---

# Quality Assurance

Use this capability to judge whether a change has been adequately verified before merge. This is the reviewer's lens — flag missing evidence within the applicable review finding scope and link to the developer-facing rule rather than re-deriving it.

The severity labels used throughout (Critical, Major, Minor) are owned by the project's review severity model; consult it for each tier's definition, fixed floors, and verdict mapping.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Verification Evidence

See [verification-evidence.md](./references/verification-evidence.md) for:

- Assessing missing verification under the review finding scope, without waiving contributor verification
- Assessing `tests pass` or `tested manually` claims against commands or routes, exit status, and relevant output
- The evidence-adequacy decision flow, keeping reasoned skips accounted for but unverified
- Separating skill acquisition from integrated-output conformity without positive external-review attestations
- Assessing relevance and currency against the claimed obligation, material, platform and observed stage
- Assessing a green check's unique behavioral coverage, whether its result could have differed, and fixture or harness failures that make a check carry no information
- Manual checks matched to changed output surfaces
- Assessing skip reasons for required checks and their residual risk
- Assessing second-pass verification after fixing Critical or Major findings

## Lint and Format Gate

See [lint-and-format-gate.md](./references/lint-and-format-gate.md) for:

- The author ran the format and lint commands per the project's code-quality rules
- A diff touching the gate's own configuration, hooks, or CI workflows, and the evidence that the gate still catches violations
- No new inline linter suppressions without an inline justification
- Judging introduced lint errors, new warnings in modified files, or new inline suppressions or escape-hatch casts

## Manual Verification Evidence

See [manual-verification.md](./references/manual-verification.md) for:

- Judging a data-driven surface, route, or running app output that passing commands do not exercise as a human would see it
- The author exercised non-default content states when the change touches a data-driven surface
- Simulator or emulator evidence per shipped platform, and a reasoned skip for a platform the author's host cannot run or a property reserved to a physical device
- The not-found UI was verified for routing changes
- The dev-server output was checked for new warnings or errors
