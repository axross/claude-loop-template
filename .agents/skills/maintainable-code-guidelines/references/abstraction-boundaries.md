# Abstraction Boundaries

Apply these rules to verify that new code respects the project's separation of concerns.

## Data-Access / UI Split

Data-Access / UI Split sets the required project default: flag a UI module or request handler that talks to the data/content layer directly (e.g., opening a client/connection and querying it inline). Data access MUST go through a dedicated data-access module so caching, schema validation, and logging are centralized.

**Guidelines:**

- MUST flag a UI module or request handler that opens a connection to `{{CMS_OR_DATA_LAYER}}` or queries it directly. Data access MUST go through a dedicated data-access module so caching, schema validation (parsing the raw record into a validated view type), and logging are centralized.
- MUST flag a data-access function that returns the raw record type from `{{CMS_OR_DATA_LAYER}}` instead of a validated/parsed view type (e.g., a `RecordDetail` or `RecordSummary` shape). The data-access layer owns the schema-to-domain transform.
- MUST flag a data-access function that imports UI modules (components, routing, view libraries) — data-access modules MUST be UI-free.

## Server / Client Boundary

Server / Client Boundary sets the required project default: flag a client-side component that performs data fetching (calling the data/content layer or a network request directly) — see the project's own component skill, if defined. Lift the fetch into the parent server-side component or its data-access module.

**Guidelines:**

- MUST flag a client-side component that performs data fetching (network request, opening a data-layer connection, calling a data-access function) — see the project's own component skill, if defined. Lift the fetch into the parent server-side component or its data-access module.
- MUST flag a client-side component that imports data-access modules, the data-layer SDK, or any module marked server-only. This will leak server code into the client bundle.
- MUST flag a server-side component that uses client-only state, lifecycle, event handlers, or browser APIs — it should be split into a server-side container and an interactive client child.
- MUST flag a server-only value type (e.g., an unresolved async/promise prop, where the framework allows it) being passed into a client component when the framework forbids it.

## Domain Pipeline Boundary

Domain Pipeline Boundary sets the required project default: flag any new module that re-implements a shared domain pipeline (for example, a content-transformation or rendering chain) outside its single owning module. The pipeline is a single chain owned in one place, per the project's own domain skill, if defined.

**Guidelines:**

- MUST flag any new component that re-creates a shared domain pipeline (e.g., assembling a content-transformation chain) outside its single owning module. The pipeline is a single chain, per the project's own domain skill, if defined.
- MUST flag domain processing attempted on the wrong side of the server/client boundary when the pipeline is server-side only.
- MUST flag a new node/element type added to a renderer's component-mapping table without a corresponding component import.

## Data-Layer Hooks / UI Boundary

<!-- INIT:OPTIONAL key=DATA_LAYER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no `{{CMS_OR_DATA_LAYER}}` with lifecycle hooks, delete this section during INIT.*

Data-Layer Hooks / UI Boundary sets the required project default: flag a data-layer lifecycle hook (before/after an operation) that imports UI modules — such hooks run server-side, outside the UI runtime.

**Guidelines:**

- MUST flag a `{{CMS_OR_DATA_LAYER}}` lifecycle hook (before/after an operation) that imports UI components or any view module — these hooks run server-side, outside the UI runtime.
- MUST flag a `{{CMS_OR_DATA_LAYER}}` access/authorization rule that unconditionally grants access to an admin-only or non-default-state field (e.g., an unpublished/draft status flag) without an explicit comment justifying why it is public.

## Cross-Tier Imports

Cross-Tier Imports sets the required project default: flag any import path that crosses tiers in the wrong direction:

**Guidelines:**

- MUST flag any import path that crosses tiers in the wrong direction:
  - The `{{CMS_OR_DATA_LAYER}}` realm MUST NOT import from the application UI realm. The data layer is a separate process boundary.
  - Group-shared / global modules MUST NOT import from a specific route's route-local code. Shared code should not depend on route-local code.
- SHOULD flag deep relative imports (`../../../`) that cross more than two directory levels — prefer the project's configured path aliases.
