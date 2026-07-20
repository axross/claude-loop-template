# Functional Requirements Framing

Apply this reference when drafting or reviewing the "Functional requirements" section of a spec — the observable capabilities the change must deliver, described at the specification level, with the **UI design** and **System design** subsections nested under it. Functional requirements state *what the system does* for its users; the "how well" it does so (performance, scale, security) is the separate **Non-functional requirements** section, and *how it is built* stays owned by the implementation skills. Sourced from requirements-engineering and design-doc practice: the functional-vs-non-functional split in [ISO/IEC 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010), [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/), the [Volere requirements template](https://www.volere.org/templates/volere-requirements-specification-template/), and [atomic-requirement practice](https://www.perforce.com/blog/alm/how-write-product-requirements-document-prd).

## When the Section Applies

Functional requirements are a conditional section: a change that alters observable behavior earns one, and a change that does not — a pure refactor, a dependency bump, a docs edit, a config move with no behavior delta — omits it with a stated reason rather than inventing behavior to describe.

**Guidelines:**

- MUST include a Functional requirements section whenever the change adds, removes, or alters behavior a user or calling system can observe; MUST omit it — with a one-line reason — for a change with no observable behavior delta.
- MUST state each functional requirement as an observable capability (an input the system accepts, an output or state change it produces), not as an implementation step.
- MUST keep each requirement atomic — one capability with a single reasonable interpretation — per [problem-and-scope.md › Concrete, Checkable Language](./problem-and-scope.md#concrete-checkable-language).
- SHOULD order requirements by the user-facing flow they support, so the section reads as the feature behaves rather than as the code is structured.

## UI Design Nests Here

When the change is view-affected, its **UI design** subsection lives under Functional requirements: the surface a user sees is one of the capabilities the change delivers. This reference owns only the nesting; the craft of the UI design subsection — hierarchy, interaction states, accessibility intent, responsive behavior, and copy constraints — stays owned by [ui-design-framing.md](./ui-design-framing.md).

**Guidelines:**

- MUST nest the UI design subsection under Functional requirements when the change is view-affected, and write its content per [ui-design-framing.md](./ui-design-framing.md).
- MUST omit the UI design subsection — with a stated reason — for a non-view-affected change (data migration, internal refactor, config, backend-only logic), per [ui-design-framing.md › When to Include a UI Design Section](./ui-design-framing.md#when-to-include-a-ui-design-section).

## System Design Nests Here

The **System design** subsection — data flow, module boundaries, and the alternatives that were weighed — also nests under Functional requirements, describing how the observable behavior is realized at the specification level (not the code). This reference owns only the nesting and the requirement that a plausible competing approach be recorded; the craft of the subsection, including its **Alternatives considered** part and its measurable constraints, stays owned by [architecture-overview-framing.md](./architecture-overview-framing.md).

**Guidelines:**

- MUST nest the System design subsection under Functional requirements when the change warrants one per [architecture-overview-framing.md › When to Include an Architecture Overview](./architecture-overview-framing.md#when-to-include-an-architecture-overview), and write its content there.
- MUST include an **Alternatives considered** part inside System design whenever a plausible competing approach exists, per [architecture-overview-framing.md › Alternatives Considered](./architecture-overview-framing.md#alternatives-considered); omit it — without a placeholder heading — when no real alternative was weighed.
- MUST NOT restate UI or system-design mechanics that belong to the project's own UI/component and structure skills (created during INIT); the subsection describes decisions, not implementation.
