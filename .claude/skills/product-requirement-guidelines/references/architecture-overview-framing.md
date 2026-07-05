# Architecture Overview Framing

Apply this reference when drafting or reviewing the "System design / architecture" section of a spec — data flow, module boundaries, alternatives considered, and constraints, described at the specification level, not the implementation itself. Sourced from design-doc and architecture-decision-record practice: [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/), the [C4 model](https://c4model.com/), [arc42](https://arc42.org/overview), [Michael Nygard's ADR format](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md), the [Rust RFC template](https://github.com/rust-lang/rfcs/blob/master/0000-template.md), [AWS's ADR guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), and [GitLab's documentation ladder](https://docs.gitlab.com/charts/architecture/decision-making/). Implementation mechanics for these same concerns — actual module placement, file layout, routing — stay owned by the project's own structure skill (created during INIT); this reference owns only how to *describe* system-design decisions in a spec.

## When to Include an Architecture Overview

Not every change earns an architecture section. arc42 treats every one of its architecture sections as optional by design, included only when the project's scale warrants it, and GitLab's documentation ladder makes the same point operationally: a single-team, low-blast-radius change is fully documented by a good commit message, and only work that crosses team or module boundaries escalates to a design doc. Shape Up generalizes this into "appetite" — the amount of process, and by extension documentation, a piece of work deserves is set by its size and reversibility up front, not discovered by filling out a fixed template.

**Guidelines:**

- MUST include an architecture overview only when the change crosses a module, service, or team boundary, or is expensive to reverse; MUST NOT include one for a change scoped to a single module with no shared-state impact.
- SHOULD size the section to the change's appetite rather than a fixed template — a narrow change earns a short paragraph or none; a new shared-state model or service boundary earns more.
- SHOULD apply a concrete trigger test before writing the section: is this decision hard or costly to reverse, does it affect more than one module or team, would a future engineer need to know *why* this shape was chosen? Omit the section if none apply.

## Data Flow and Module Boundaries at Spec Level

An architecture section answers "what talks to what, and who owns which piece of state" — it does not pre-write the code. Google's design-doc guidance is explicit that these documents should rarely contain code or pseudocode except for a genuinely novel algorithm, and the C4 model formalizes the same instinct by stopping most spec audiences at the context/container/component levels, reserving the "code" level for the codebase itself. arc42's building-block view offers the right unit of description: name each module or service, state its responsibility, and describe its interface at the level of what it accepts and returns, not literal signatures.

**Guidelines:**

- MUST describe data flow as named entities moving between processes and stores, and MUST NOT contain code, pseudocode, or literal function/type signatures except for a genuinely novel algorithm.
- MUST state which module or service owns each piece of shared state and how other modules may read or mutate it.
- MUST NOT prescribe file layout, routing, or module-placement mechanics that belong to the project's own structure skill (created during INIT).

## Alternatives Considered

Mature spec-writing traditions treat the alternatives you rejected as being as valuable as the one you chose. The Rust RFC template devotes a dedicated "Rationale and alternatives" section to justifying the chosen design against the road not taken, including the impact of doing nothing. Michael Nygard's ADR format builds the same expectation into "Consequences" — a decision record is incomplete if it doesn't make clear what became harder, not just what became easier. The practical reason is institutional memory: a record of a rejected alternative stops a future engineer from re-litigating a path already closed off.

**Guidelines:**

- MUST list the realistic alternatives that were seriously evaluated and state why each was rejected, when the section is included at all.
- SHOULD record a rejected alternative even when the current answer seems obvious, since the record's value is in preventing the same alternative from being re-proposed later.
- SHOULD reduce a comparison to the 2-4 criteria that actually drove the decision (cost, latency, blast radius, ownership) rather than an exhaustive feature matrix.

## Constraints and Non-Functional Requirements

Non-functional requirements belong in a spec as short, measurable targets, not as a rehearsal of the implementation that will satisfy them. AWS's ADR guidance treats performance, availability, and security requirements as consequences of a decision, not decisions in themselves, and standard NFR-writing practice replaces vague adjectives like "fast" or "scalable" with a stated number and scope, e.g., "95th percentile under 200ms".

**Guidelines:**

- MUST state non-functional requirements (performance, scale, security) as short, measurable targets, per [problem-and-scope.md › Concrete, Checkable Language](./problem-and-scope.md#concrete-checkable-language).
- SHOULD scope each non-functional requirement to the specific component it constrains rather than declaring it for the whole system.
- MUST NOT restate the implementation mechanism used to satisfy a constraint (e.g., "use Redis with a 5-minute TTL"); the constraint is the target, and the technique — if architecturally significant — belongs in the alternatives-considered discussion above.
