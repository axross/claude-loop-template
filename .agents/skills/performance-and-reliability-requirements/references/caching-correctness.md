# Caching Correctness

Apply these rules to verify that caching is applied with a deliberate lifetime and scope, never to per-user/per-request data, and that invalidation is wired on writes. Map "the cache directive/API" and "the cache-lifetime API" to whatever {{APP_FRAMEWORK}} or the project's caching layer provides.

## Cache Placement

This review focuses on critical-severity cases where caching is applied on the client tier (caching is a server-tier concern) or applied to request-specific data.

**Guidelines:**

- MUST flag a Critical when a server-tier cache directive is applied in a client-tier file. Caching is a server-tier concern.
- MUST flag a Critical when a cached function reads per-request or per-user state (cookies, headers, request-specific parameters, auth/session context). The cached result will be served to other users.
- MUST flag a Major when caching is missing from a new server function whose result is stable across requests for some non-trivial duration (e.g., a read of published content). Match the project's pattern of caching such reads.
- MUST flag a Major when a cached function's arguments include a value that effectively makes the cache key unique per request (e.g., a timestamp, a random ID, the full request URL). Cardinality explosion is a memory leak.

## Cache Lifetime (TTL) Choice

This review focuses on critical-severity cases where caching is applied without a deliberately chosen lifetime/TTL. The default cache lifetime is unsafe to assume.

**Guidelines:**

- MUST flag a Critical when caching is applied without an explicitly chosen lifetime/TTL. The default is unsafe to assume.
- MUST flag a Major when the chosen lifetime is mismatched to the data's actual mutability:
  - Too short for data that changes only on rare edits — wastes data-layer reads
  - Too long for data the author edits frequently — stale UI
  - Match the project's established pattern: when writes invalidate the cache explicitly, a moderate lifetime is appropriate.
- SHOULD flag a Minor when a new bespoke lifetime is introduced for a one-off purpose without considering whether one of the project's existing standard lifetimes suffices.

## Invalidation Wiring

This review focuses on critical-severity cases where a new data source that backs cached server reads is added, but no corresponding cache-invalidation hook is wired on writes. Without it, edits leave stale UI for up to one cache lifetime.

**Guidelines:**

- MUST flag a Critical when a new data source that backs cached server reads is added without a corresponding cache-invalidation hook on writes. Without it, edits leave stale UI for up to one cache lifetime.
- MUST flag a Critical when a write-side invalidation diverges from the project's established invalidation path. When the data layer's write hooks may run in a different process than the cache, the hook should trigger the project's centralized invalidation entry point rather than calling the in-process cache-invalidation API directly. Diverging means draft/preview behavior differs from production.
- MUST flag a Major when a new invalidation endpoint is added without a corresponding write-side caller, or vice versa — they come in pairs.
- SHOULD point to the project's reference invalidation that targets the narrowest scope covering all stale views. New invalidations should target the narrowest scope that includes all stale routes.

## Invalidation Scope

This review focuses on major-severity cases where invalidation is requested without specifying the correct scope (the unit invalidated vs. its shared layout/shell). Wrong scope either over-invalidates (perf) or under-invalidates (stale shared UI).

**Guidelines:**

- MUST flag a Major when invalidation omits the correct scope distinction (individual view vs. shared layout/shell) when the change affects only one or the other.
- MUST flag a Critical when the invalidation target is built from user input — that is a cache-poisoning vector.

## External-Fetch Cache Specifics

This review focuses on critical-severity cases where a cached function that fetches external data is changed to vary by request-time inputs (e.g., adds a per-visitor `User-Agent` parameter) — that explodes the cache key.

**Guidelines:**

- MUST flag a Critical when a cached external-fetch helper is changed to vary by request-time inputs, because that explodes the cache key.
- SHOULD flag a Minor recommendation that newly-added external-fetch helpers also bracket their work with start/complete log pairs carrying a `duration`, so cache misses are observable. See [observability-guidelines › logging](../../observability-guidelines/references/logging.md).
