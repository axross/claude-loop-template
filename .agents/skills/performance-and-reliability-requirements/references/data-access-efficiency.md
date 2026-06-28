# Data-Access Efficiency

Apply these rules to verify that reads against the data/content layer ({{CMS_OR_DATA_LAYER}}) are bounded and N+1-free.

## Mandatory Query Bounds

Every read against the data layer should make its projection, relationship depth, result bound, and filter explicit:

| Concern | Why it matters |
|---|---|
| Field selection (projection) | Without an explicit projection, the data layer returns every field on every record, including large blobs (e.g., a full body/content field). Select only what the consumer renders. |
| Relationship depth | If the data layer auto-populates related records, an unbounded or deep population fans out joins. Removing an explicit shallow depth is Critical when the consumer relies on populated relationships; an excessively deep population is Major because each level multiplies the work. |
| Result limit | Many data layers apply a small default limit silently. Flag a Critical when the consumer expects all records but no limit is set (the user will silently see a truncated subset). Match the project's established bounding pattern. |
| Filter / predicate | Required when fetching anything other than "all of this collection". Visibility-restricted reads must filter out records the caller is not allowed to see, per [application-security-requirements › access-control](../../application-security-requirements/references/access-control.md). |

**Guidelines:**

- MUST flag a Major when a data-layer read omits an explicit projection, depth bound, result limit, or filter where the API supports them.
- MUST flag a Critical when a query removes an explicit shallow relationship depth while the consumer relies on populated relationships.
- MUST flag a Major when a query sets relationship depth deeper than the consumer actually needs.
- MUST require the appropriate visibility predicate (e.g., "only published / publicly-visible records") for reads that serve untrusted callers.

## N+1 Patterns to Reject

N+1 review focuses on critical-severity cases where the diff iterates a list of records and issues a separate per-record read inside the loop. Use a single batched read (e.g., an `id IN (...)` filter) instead, or rely on the data layer's relationship population to fetch related records in the original query.

**Guidelines:**

- MUST flag a Critical when the diff iterates a list of records and issues a per-record data-layer read inside the loop. Use a single batched read (e.g., an `id IN (...)` predicate) instead, or populate relationships in the original query.
- MUST flag a Critical when a server-rendered list renders each item by awaiting its own data fetch — pre-fetch in the parent and pass the data (or a deferred handle) down, per [server-client-boundary.md](./server-client-boundary.md).
- MUST flag a Major when a write/lifecycle hook iterates a result set and performs a per-record network call serially (i.e., without batching the independent calls to run concurrently). Match the project's pattern of running independent per-record calls concurrently.

## Single Data Client Per Request

This review focuses on major-severity cases where the diff constructs or acquires the data-layer client more than once inside the same request scope. Cache the client to a local variable and reuse it.

**Guidelines:**

- MUST flag a Major when the diff acquires the data-layer client more than once inside the same request scope. Cache it to a local variable and reuse it.
- MUST flag a Critical when the diff acquires the data-layer client from a non-canonical entry point. If the runtime intends a single shared (process-global) client, alternative construction paths break that singleton.

## Pagination

This review focuses on critical-severity cases where a new data-access function returns a result set directly without a comment about whether the total count exceeds the limit and will silently truncate. Either lift the limit, paginate, or document the intentional cap.

**Guidelines:**

- MUST flag a Critical when a new data-access function returns a result set directly without a comment about whether the total count exceeds the limit and will silently truncate. Either lift the limit, paginate, or document the intentional cap.
- SHOULD flag a Major when a new collection/table is queried without a defined sort — unsorted queries return records in storage-insertion order, which is not stable across data-layer schema migrations.

## Migration Cost

This review focuses on critical-severity cases where a new data-layer schema migration drops a column or renames a field on a collection/table that holds production data, without a data-backfill step. Defer to the human owner per [code-review-guideline › escalation](../../code-review-guideline/references/escalation.md).

**Guidelines:**

- MUST flag a Critical when a new data-layer schema migration drops a column or renames a field on a collection/table that holds production data, without a data-backfill step. Defer to the human owner per [code-review-guideline › escalation](../../code-review-guideline/references/escalation.md).
- MUST flag a Major when a new field used in a filter predicate is added without an index — the storage engine will full-scan. Either add an index to the field or document the expected row count.

## Locale / Variant Handling

*If this project has no per-locale or per-variant content, delete this section during INIT.*

This review focuses on major-severity cases where a new data-access call omits the locale/variant parameter that content reads require. When the project has a default locale with fallback behavior, diverging from the pattern returns the wrong variant silently.

**Guidelines:**

- MUST flag a Major when a new data-access call omits the locale/variant parameter that the project's content reads require, when the data layer supports localized or variant content.
