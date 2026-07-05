# Caching Correctness

Apply these rules to verify that caching is applied with a deliberate lifetime and scope, never to per-user/per-request data, and that invalidation is wired on writes. Map "the cache directive/API" and "the cache-lifetime API" to whatever Next.js (App Router) or the project's caching layer provides.

## Cache Placement

A cache entry outlives the request that created it, so placement decides whether the entry is shared computation or one user's private state replayed to strangers.

**Guidelines:**

- MUST flag a Critical when a server-tier cache directive is applied in a client-tier file. Caching is a server-tier concern.
- MUST flag a Critical when a cached function reads per-request or per-user state (cookies, headers, request-specific parameters, auth/session context). The cached result will be served to other users.
- MUST flag a Major when caching is missing from a new server function whose result is stable across requests for some non-trivial duration (e.g., a read of published content). Match the project's pattern of caching such reads.
- MUST flag a Major when a cached function's arguments include a value that effectively makes the cache key unique per request (e.g., a timestamp, a random ID, the full request URL). Cardinality explosion is a memory leak.

## Cache Lifetime (TTL) Choice

A TTL encodes a judgment about how long stale data is tolerable, and framework defaults shift between versions — an unstated judgment is one nobody validated.

**Guidelines:**

- MUST flag a Critical when caching is applied without an explicitly chosen lifetime/TTL. The default is unsafe to assume.
- MUST flag a Major when the chosen lifetime is mismatched to the data's actual mutability:
  - Too short for data that changes only on rare edits — wastes data-layer reads
  - Too long for data the author edits frequently — stale UI
  - Match the project's established pattern: when writes invalidate the cache explicitly, a moderate lifetime is appropriate.
- SHOULD flag a Minor when a new bespoke lifetime is introduced for a one-off purpose without considering whether one of the project's existing standard lifetimes suffices.

## Invalidation Wiring

TTL expiry is the fallback, not the mechanism: freshness after an edit depends on the write actively evicting what it just made stale.

**Guidelines:**

- MUST flag a Critical when a new data source that backs cached server reads is added without a corresponding cache-invalidation hook on writes. Without it, edits leave stale UI for up to one cache lifetime.
- MUST flag a Critical when a write-side invalidation diverges from the project's established invalidation path. When the data layer's write hooks may run in a different process than the cache, the hook should trigger the project's centralized invalidation entry point rather than calling the in-process cache-invalidation API directly. Diverging means draft/preview behavior differs from production.
- MUST flag a Major when a new invalidation endpoint is added without a corresponding write-side caller, or vice versa — they come in pairs.
- SHOULD point to the project's reference invalidation that targets the narrowest scope covering all stale views. New invalidations should target the narrowest scope that includes all stale routes.

## Invalidation Scope

Wrong scope fails in both directions — too broad discards warm cache for unaffected views, too narrow leaves shared UI stale past the edit.

**Guidelines:**

- MUST flag a Major when invalidation omits the correct scope distinction (individual view vs. shared layout/shell) when the change affects only one or the other.
- MUST flag a Critical when the invalidation target is built from user input — that is a cache-poisoning vector.

## External-Fetch Cache Specifics

An external-fetch cache exists to shield a third-party dependency from per-request traffic, and it only shields anything while many requests share one cache key.

**Guidelines:**

- MUST flag a Critical when a cached external-fetch helper is changed to vary by request-time inputs, because that explodes the cache key.
