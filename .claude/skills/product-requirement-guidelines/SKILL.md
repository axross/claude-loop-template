---
name: product-requirement-guidelines
description: Apply this skill when writing, refining, or reviewing a product requirement, feature spec, or issue description — including any plan-writing or issue-drafting step of a delivery workflow. Covers framing the problem/outcome before the solution, separating "what" from "how", explicit non-goals and assumptions, right-sizing scope to the change, testable acceptance criteria, and — for view-affected or architecturally broad changes — framing a spec's UI design and system-design/architecture sections. Use for "write a PRD", "refine this issue", "write acceptance criteria", "what's the scope of this change", "is this requirement testable", or "does this need a UI design / architecture section".
---

# Product Requirement Guidelines

Apply this skill whenever drafting or reviewing the parts of a product requirement, feature spec, or issue description that describe **what** is needed and **how completion is verified** — not how it is built. It is general-purpose: any product requirement, feature specification, or issue description benefits from it, not only a delivery workflow's plan-writing step.

This skill deliberately does not own everything a spec contains. It owns problem framing, scope boundaries, acceptance-criteria craft, and — when those sections are warranted — the spec-level framing of the UI design and system-design/architecture sections. It does not own the implementation mechanics behind them:

- UI component structure, CSS, and markup mechanics — the project's own UI/component skill (created during INIT). This skill owns only how to _describe_ hierarchy, states, accessibility, and responsive intent in the spec (see below).
- Actual data flow implementation, routes, and module placement — the project's own structure skill (created during INIT). This skill owns only how to _describe_ system-design decisions in the spec (see below).
- Test coverage strategy — [E2E Testing Guidelines](../e2e-testing-guidelines/SKILL.md) and [Unit Test Guidelines](../unit-test-guidelines/SKILL.md).

## Problem Framing and Scope

See [problem-and-scope.md](./references/problem-and-scope.md) for:

- stating the user-facing outcome and problem before any solution detail
- writing explicit non-goals and out-of-scope bullets
- separating stated assumptions from open questions
- right-sizing the section to the size of the change
- replacing vague quality adjectives with concrete, checkable statements

## Acceptance Criteria Craft

See [acceptance-criteria.md](./references/acceptance-criteria.md) for:

- writing criteria a reviewer can verify independently, without reading implementation code
- preferring concrete, checkable phrasing over adjectives
- covering the happy path, edge/error/empty states, and explicit non-effects
- right-sizing the checklist and including verification-gate criteria
- tracing every criterion back to the rest of the spec

## UI Design Section Framing

See [ui-design-framing.md](./references/ui-design-framing.md) for:

- when a spec needs a UI design section at all (view-affected changes only) and at what fidelity
- describing hierarchy and layout intent in spec terms, not implementation
- enumerating interaction states (default, disabled, loading, error, empty)
- stating accessibility intent as testable, WCAG-referencing criteria
- stating responsive behavior intent and copy/microcopy constraints

## Architecture Overview Framing

See [architecture-overview-framing.md](./references/architecture-overview-framing.md) for:

- when a spec needs a system-design/architecture section at all (broad or hard-to-reverse changes only)
- describing data flow and module boundaries at spec level, not implementation
- recording alternatives considered and why they were rejected
- stating constraints and non-functional requirements as measurable targets

## Product Requirement Section Template

See [template.md](./references/template.md) for:

- a self-contained, annotated Markdown skeleton for the Product requirement and Acceptance criteria sections
- what belongs in each slot (problem/outcome, scope, non-goals, assumptions/constraints, checklist)
