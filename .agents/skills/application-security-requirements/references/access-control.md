# Access Control

Apply these rules to verify the data layer's access rules and the project's request handlers gate sensitive data correctly.

*Some sections below assume a data/content layer with built-in access rules and a draft/published lifecycle (a CMS-style `{{CMS_OR_DATA_LAYER}}`). If the project has no such layer, adapt or delete the layer-specific sections during INIT.*

## Data-Layer Access Rules

Data-Layer Access Rules review focuses on critical-severity cases where a new data-layer resource (collection, model, table-backed entity) is added without explicit access rules. A default-deny data layer is safe, but a missing-by-omission rule on a resource that should be publicly readable (e.g., published content for anonymous visitors) means the rendered route returns empty.

**Guidelines:**

- MUST flag a Critical when a new data-layer resource is added without an explicit access configuration. A default-deny default is safe, but a missing-by-omission rule on a resource that should be publicly readable (e.g., content for anonymous visitors) means the rendered route returns empty.
- MUST flag a Critical when a resource's read rule is changed to allow-all (`read = () => true`) on a resource that contains non-public data (as opposed to intentionally public static assets such as media/cover/avatar images).
- MUST flag a Major when a new resource's update, delete, or create rule defaults to allowing all authenticated users — these should typically be admin-only.
- MUST flag a Major when a resource's read rule ignores the requesting user and returns `true` unconditionally — even public resources SHOULD return a query filter that excludes non-default (e.g., draft) content for non-authenticated requests.

## Unpublished / Non-Default Content Gating

This review focuses on critical-severity cases where a data-access function accepts a flag requesting non-default content (e.g., `draft: true`) and forwards it without first verifying the request is authenticated to view that content. The established callers gate on an explicit request flag AND rely on the data layer's own auth — confirm both are present.

**Guidelines:**

- MUST flag a Critical when a data-access function accepts a flag requesting non-default/unpublished content and passes it to the data layer without first verifying the request is authenticated to view it. Established callers gate on an explicit request flag AND rely on the data layer's auth — confirm both.
- MUST flag a Critical when a data-access function omits the published/default-state filter when the unpublished flag is not set. The established pattern adds the filter conditionally — diverging exposes unpublished identifiers publicly.
- MUST flag a Critical when a server-side render injects non-public-only fields (internal status or shadow fields) into a public response or public metadata.

## Authentication Lockout Settings

This review focuses on critical-severity cases where the diff weakens the authentication system's lockout settings.

**Guidelines:**

- MUST flag a Critical when the diff weakens the authentication lockout settings:
  - lockout duration reduced below 5 minutes
  - max login attempts raised above 5
  - the auth/lockout configuration block removed entirely (defaults may be weaker or absent)

## Request Handler Authentication

Request Handler Authentication review focuses on critical-severity cases where a new mutation handler (`POST`, `PUT`, `PATCH`, `DELETE`) does not verify the caller's identity. Even seemingly harmless endpoints (e.g., a cache-revalidation endpoint) can be abused for DoS — the reviewer SHOULD recommend either rate-limiting or a shared-secret header for new ones.

**Guidelines:**

- MUST flag a Critical when a new mutation handler (`POST`, `PUT`, `PATCH`, `DELETE`) does not verify the caller's identity. Even cache-busting or idempotent endpoints can be abused for DoS — recommend rate-limiting or a shared-secret header for new ones.
- MUST flag a Major when a new server-side callable or handler reads from a resource with sensitive access rules but does not pass a user-scoped data-layer context.

## Preview / Privileged Mode

Preview / Privileged Mode review focuses on critical-severity cases where a new route uses a query flag (e.g., `?preview=true`) to bypass production gating without also requiring the authenticated content path. A preview flag should only switch the rendering mode — it MUST NOT itself unlock non-public content.

**Guidelines:**

- MUST flag a Critical when a new route uses a query flag (e.g., `?preview=true`) to bypass production gating without also requiring the authenticated content path. A preview flag should only switch rendering mode — it must not itself unlock non-public content.
- MUST flag a Major when a new route reads cookies or headers to derive auth state without going through the project's authentication system — that system owns sessions in this project.

## Admin / Tool-Owned UI Surface

If the data/content layer ships its own admin UI under a dedicated route segment, that segment is owned by the tool. Review focuses on respecting that boundary and on not mistaking UI affordances for access control.

**Guidelines:**

- MUST NOT review files inside a tool-owned admin route segment per [code-review-guideline › scoping](../../code-review-guideline/references/scoping.md). The data/content layer owns that route segment.
- MUST flag a Critical when a data-layer field is added with a "hidden from admin UI" flag to "hide" sensitive data — hiding is a UI affordance, not access control. Use the read access rule to actually gate the field.
