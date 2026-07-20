---
name: product-requirement-guidelines
description: How to write a product requirement, feature spec, or issue description against the canonical plan-document structure. Owns that seven-section structure and its per-section craft — summary; background with goals, non-goals, and assumptions; functional requirements with nested UI design and system design (and alternatives considered); non-functional requirements; testable acceptance criteria; verification strategy; open questions — plus scope framing and each section's omit-rules.
when_to_use: Apply when writing, refining, or reviewing a requirement, spec, or plan document, including any plan-writing or issue-drafting step of a delivery workflow — "write a PRD", "refine this issue", "what sections does the plan need", "write acceptance criteria", "what's the scope of this change", "is this requirement testable", or "does this need a UI design / system design section".
user-invocable: false
---

# Product Requirement Guidelines

Apply this skill whenever drafting or reviewing a product requirement, feature spec, issue description, or delivery-workflow plan. It owns the **canonical plan-document structure** — the fixed section order every plan follows — and the craft of each section that describes **what** is needed and **how completion is verified**, but not how it is built. It is general-purpose: any product requirement, feature specification, or plan benefits from it, not only a delivery workflow's plan-writing step.

## Canonical Plan-Document Structure

Every plan follows this seven-section order. **Required** sections are always present; **conditional** sections are included when they apply and omitted with a one-line stated reason when they do not. This skill declares the structure and routes each section to the reference that owns its craft; [template.md](./references/template.md) is the fill-in-the-blanks skeleton.

1. **Summary** *(required)* — one standalone paragraph.
2. **Background** *(required)* — with **Goals**, **Non-goals**, and **Assumptions** subsections.
3. **Functional requirements** *(conditional)* — with **UI design** and **System design** (the latter carrying an **Alternatives considered** subsection when a plausible competing approach exists) nested under it.
4. **Non-functional requirements** *(conditional)*.
5. **Acceptance criteria** *(required)*.
6. **Verification strategy** *(required)*.
7. **Open questions** *(required, may be empty)*.

This skill deliberately does not own everything a plan contains. It owns the structure, problem framing, scope boundaries, acceptance-criteria craft, verification-strategy framing, and the spec-level framing of the UI design and system-design sections. It does not own the implementation mechanics behind them:

- UI component structure, CSS, and markup mechanics — the project's own UI/component skill (created during INIT). This skill owns only how to *describe* hierarchy, states, accessibility, and responsive intent in the plan (see below).
- Actual data flow implementation, routes, and module placement — the project's own structure skill (created during INIT). This skill owns only how to *describe* system-design decisions in the plan (see below).
- Test coverage design — the project's end-to-end testing and unit-test guidelines. This skill owns only how to *frame* the verification strategy that names them (see below).

## Problem Framing and Scope

See [problem-and-scope.md](./references/problem-and-scope.md) for the **Summary**, **Background** (with **Goals**, **Non-goals**, **Assumptions**), and **Open questions** sections:

- writing the one-paragraph standalone Summary
- stating background context and framing Goals as concrete, checkable outcomes
- writing explicit non-goals and out-of-scope bullets
- separating stated assumptions from open questions, and collecting the latter into the Open questions section
- right-sizing the sections to the size of the change
- replacing vague quality adjectives with concrete, checkable statements

## Functional Requirements Framing

See [functional-requirements.md](./references/functional-requirements.md) for the **Functional requirements** section:

- when the section applies (observable behavior delta) and when to omit it
- stating each requirement as an observable capability, atomic and ordered by the user-facing flow
- how the **UI design** and **System design** subsections nest under it, and when each is included

## UI Design Section Framing

See [ui-design-framing.md](./references/ui-design-framing.md) for the **UI design** subsection (nested under Functional requirements):

- when a plan needs a UI design subsection at all (view-affected changes only) and at what fidelity
- describing hierarchy and layout intent in spec terms, not implementation
- enumerating interaction states (default, disabled, loading, error, empty)
- stating accessibility intent as testable, WCAG-referencing criteria
- stating responsive behavior intent and copy/microcopy constraints

## Architecture Overview Framing

See [architecture-overview-framing.md](./references/architecture-overview-framing.md) for the **System design** subsection (nested under Functional requirements) and the **Non-functional requirements** section:

- when a plan needs a system-design subsection (the disjunctive breadth-or-mechanics trigger — either suffices alone)
- describing data flow and module boundaries at spec level, not implementation
- recording alternatives considered and why they were rejected
- stating non-functional requirements as measurable targets

## Acceptance Criteria Craft

See [acceptance-criteria.md](./references/acceptance-criteria.md) for the **Acceptance criteria** section:

- writing criteria a reviewer can verify independently, without reading implementation code
- preferring concrete, checkable phrasing over adjectives
- covering the happy path, edge/error/empty states, and explicit non-effects
- right-sizing the checklist and keeping verification gates in the Verification strategy section instead
- tracing every criterion back to the rest of the plan

## Verification Strategy Framing

See [verification-strategy.md](./references/verification-strategy.md) for the **Verification strategy** section:

- distinguishing the verification method from the acceptance-criteria outcomes it establishes
- naming the automated gates the changed surface requires (format/lint, unit, e2e, build)
- deferring test-coverage design to the project's end-to-end testing and unit-test guidelines
- naming focused manual checks and committing to recorded verification evidence

## Plan Document Template

See [template.md](./references/template.md) for:

- a self-contained, annotated Markdown skeleton for the full seven-section plan
- what belongs in each section, which are required, and how conditional sections are omitted
