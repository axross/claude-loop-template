# Abstraction Boundaries

Apply these rules to verify that new code respects the project's separation of concerns.

## Data-Access / UI Split

When a UI component reads or writes persisted state directly, serialization, validation, and migration logic scatter across every call site instead of living in one place.

**Guidelines:**

- MUST flag a component that calls `localStorage` directly. Todo persistence MUST go through the dedicated storage module (`lib/todo-store.ts`) so serialization, schema validation of stored JSON, and key naming are centralized.
- MUST flag a storage function that returns unvalidated parsed JSON instead of the validated `Todo` type. The storage module owns the parse-and-validate transform.
- MUST flag a storage function that imports UI modules (components, routing, view libraries) — storage modules MUST be UI-free.

## Server / Client Boundary

Fetching from the client ships data-access code into the browser bundle and adds a network round-trip the server could have avoided.

**Guidelines:**

- MUST flag a client-side component that performs data fetching (network request, opening a data-layer connection, calling a data-access function) — see the project's own component skill, if defined. Lift the fetch into the parent server-side component or its data-access module.
- MUST flag a client-side component that imports data-access modules, the data-layer SDK, or any module marked server-only. This will leak server code into the client bundle.
- MUST flag a server-side component that uses client-only state, lifecycle, event handlers, or browser APIs — it should be split into a server-side container and an interactive client child.
- MUST flag a server-only value type (e.g., an unresolved async/promise prop, where the framework allows it) being passed into a client component when the framework forbids it.

## Domain Pipeline Boundary

A shared pipeline copied into a second place drifts out of sync, so a fix applied to one copy silently skips the rest.

**Guidelines:**

- MUST flag any new component that re-creates a shared domain pipeline (e.g., assembling a content-transformation chain) outside its single owning module. The pipeline is a single chain, per the project's own domain skill, if defined.
- MUST flag domain processing attempted on the wrong side of the server/client boundary when the pipeline is server-side only.
- MUST flag a new node/element type added to a renderer's component-mapping table without a corresponding component import.

## Cross-Tier Imports

An import that runs against the tier hierarchy couples layers meant to stay independent, eroding the boundaries the tiers exist to enforce.

**Guidelines:**

- MUST flag any import path that crosses tiers in the wrong direction:
  - Group-shared / global modules MUST NOT import from a specific route's route-local code. Shared code should not depend on route-local code.
- SHOULD flag deep relative imports (`../../../`) that cross more than two directory levels — prefer the project's configured path aliases.
