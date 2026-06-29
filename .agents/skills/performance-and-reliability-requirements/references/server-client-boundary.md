# Server / Client Boundary and Async Cost

Apply these rules to verify that server/client composition (where {{APP_FRAMEWORK}} distinguishes a server tier from a client tier) does not create avoidable latency or ship unnecessary client code.

## Async Waterfalls

This review focuses on major-severity cases where server-side code does `await getA()` followed by `await getB()` where `getB` does not depend on `getA`. Run independent async work concurrently (e.g., `Promise.all([getA(), getB()])`), or defer each unit so the consumer awaits it where the result is actually used.

**Guidelines:**

- MUST flag a Major when server-side code awaits independent async operations sequentially instead of running them concurrently.
- MUST flag a Critical when the diff converts a deferred / concurrent data pattern back into a serially-awaited one without a stated reason — that change re-introduces the waterfall.
- SHOULD point to the project's established pattern of deriving independent inputs and data as deferred handles passed to the units that consume them, rather than awaiting everything up front.

## Streaming / Lazy Load Granularity

*If this project's framework cannot stream or progressively render independent units, adapt this section to its lazy-loading mechanism during INIT.*

This review focuses on major-severity cases where a single loading boundary wraps two independently-slow async units. Split into one boundary per slow unit so each can render/stream as it resolves.

**Guidelines:**

- MUST flag a Major when a single loading/streaming boundary wraps two independently-slow async units. Split into one boundary per slow unit.
- MUST flag a Major when a loading/streaming boundary is missing for an async server unit that has a meaningful loading state — without it, the whole view blocks until the data arrives.
- MUST flag a Minor when a loading fallback is provided for a side-effect-only unit (e.g., a metadata injector with no visible output). Such units should defer without a visible fallback.

## Loading / Loaded Split

This review focuses on major-severity cases where a new unit performs data fetching but is not split into a structure that separates the loading state, the loaded state, and the orchestrator when the loading state is user-visible.

**Guidelines:**

- MUST flag a Major when a new data-fetching unit does not separate its loading view, loaded view, and orchestrator when the loading state is user-visible. Match the project's canonical layout for such units.
- MUST flag a Critical when a loading skeleton imports the loaded-data type and renders fields from it — the skeleton MUST render with no data so it can show before the fetch resolves.
- MUST flag a Major when the orchestrator does not propagate the project's test-identifier convention to the loading fallback — automated tests cannot assert the skeleton state otherwise. See [e2e-testing-guidelines](../../e2e-testing-guidelines/SKILL.md).

## Client Promotion

This review focuses on major-severity cases where the diff promotes a whole unit to the client tier when only a small interactive subtree needs to run on the client (e.g., one button). Extract the interactive part into its own client unit and keep the parent on the server tier.

**Guidelines:**

- MUST flag a Major when the diff promotes a unit to the client tier when its only client-needing reason is a small interactive subtree. Extract the interactive part and keep the parent on the server tier.
- MUST flag a Critical when promoting a unit to the client tier causes a previously server-only data fetch to ship to the browser. Lift the fetch into the server-tier parent and pass the result down as plain data.
- MUST flag a Critical when a client-tier file imports a function that itself pulls in heavyweight or server-only packages (data-layer SDK, parsing/rendering pipelines, the structured logger, an error-tracker server entry, or a server-only marker module). Cross-reference with [bundle-weight.md](./bundle-weight.md).

## Compiler / Memoization Implications

*If this project's toolchain has no auto-memoizing compiler, delete this entire subsection during INIT — heading, prose, and the **Guidelines:** block below (through the end of this section, before "Static / Dynamic Rendering Implications").*

When the framework's compiler auto-memoizes client components, the reviewer SHOULD be aware:

- Manual memoization in new client units is usually unnecessary. Flag a Minor when manual memoization is added without a reason the compiler cannot handle (e.g., a referential identity a third-party library requires).
- Such compilers typically do NOT optimize server-tier units — those re-execute on every request unless cached. Flag a Major when an expensive computation lives in an uncached server-tier unit.

**Guidelines:**

- MUST account for the framework compiler's auto-memoization behavior before flagging or approving manual memoization in new client units.

## Static / Dynamic Rendering Implications

*If this project's framework does not distinguish static from dynamic rendering, delete this subsection during INIT.*

When the framework can statically prerender server-tier units, reading per-request state (cookies, headers, request-specific parameters) typically forces the enclosing unit into dynamic rendering. The reviewer SHOULD be aware:

- Flag a Major when a previously-static view gains a new per-request read in an unexpected place (e.g., a deep child), silently opting the whole view out of static rendering.

**Guidelines:**

- MUST NOT recommend disabling the framework's compiler or static-rendering features to "fix" a perf issue — escalate to the human owner per [code-review-guideline › escalation](../../code-review-guideline/references/escalation.md).
