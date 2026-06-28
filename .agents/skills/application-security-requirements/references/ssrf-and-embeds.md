# SSRF and Outbound Fetch

Apply these rules to verify server-side outbound `fetch` calls cannot be steered at internal-network or unintended targets by user- or CMS-controlled content.

## The Outbound-Fetch Risk Surface

Any function that performs a server-side `fetch(url)` where `url` originates from authored/user-controlled content (e.g., a link-preview / embed fetcher that resolves URLs from content) is the principal SSRF surface. Identify the project's equivalents and apply the rules below.

**Guidelines:**

- MUST flag a Critical when the diff removes the URL-validity check (e.g., `URL.canParse(href)`) on an authored URL before it flows into a fetch, without replacing it with a stricter check. That parse is often the only filter keeping malformed URLs out.
- MUST flag a Major when the diff adds a new caller that `fetch`-es a user- or CMS-controlled URL without a hostname allowlist or a block-list for internal ranges (e.g., `127.0.0.0/8`, `169.254.169.254` — the cloud metadata endpoint, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `localhost`, `*.internal`).
- MUST flag a Major when a new server-side `fetch` follows redirects (the default `redirect: "follow"`) without checking the final `response.url` host against an allowlist. A redirect can land on an internal host even when the initial URL passes the allowlist.
- SHOULD flag a Minor recommendation that any new outbound fetch passes a tight timeout (e.g., `signal: AbortSignal.timeout(<ms>)`) so a hung internal endpoint does not stall the request.

## Image Optimization and Remote Hosts

This review focuses on major-severity cases where a new entry in the config allowlist of external image/asset hosts uses a wildcard hostname or covers more than one origin. Allowlist entries should be tightly scoped to a single known origin.

- A pre-existing optimized-image component may use an "unoptimized" escape hatch for an externally fetched image URL — flag a Critical only if the diff worsens this (e.g., promotes the image to an eagerly-preloaded position, or replaces the framework's `<Image>`-style component with a raw `<img>`).

**Guidelines:**

- MUST flag a Major when a new entry in the config allowlist of external hosts uses a wildcard hostname or covers more than one origin. Existing entries should be tightly scoped to a single origin.
- MUST flag a Critical when a new component renders a media element with an "unoptimized" / host-check-bypassing source for a user- or CMS-controlled URL whose host is not validated. The "unoptimized" path skips the remote-host allowlist check.

## Social-Preview / Sitemap / Robots

This review focuses on critical-severity cases where a social-preview (OG) image route accepts a `src` query parameter that flows into `fetch(src)` without an allowlist. This is the canonical OG-image SSRF pattern.

**Guidelines:**

- MUST flag a Critical when a social-preview image route accepts a `src` query parameter that flows into `fetch(src)` without an allowlist. This is the canonical OG-image SSRF pattern.
- MUST flag a Major when sitemap or robots generation performs an unbounded `fetch` to a user- or CMS-controlled URL — those should fetch only data through the project's data-access layer.

## CSRF on Mutation Endpoints

This review focuses on major-severity cases where a new mutation handler (`POST`, `PUT`, `PATCH`, `DELETE`) does not check the `Origin` or `Sec-Fetch-Site` header for cross-site requests. Even idempotent endpoints (e.g., a cache-flush endpoint) can be abused cross-site.

**Guidelines:**

- MUST flag a Major when a new mutation handler (`POST`, `PUT`, `PATCH`, `DELETE`) does not check the `Origin` or `Sec-Fetch-Site` header for cross-site requests. Even idempotent endpoints can be abused (e.g., to flush caches).
- SHOULD recommend a shared-secret header for new mutation endpoints invoked only by internal hooks (e.g., a data-layer lifecycle hook that triggers revalidation).

## Out-of-Scope

If the data/content layer ships its own admin UI under a dedicated route segment, that segment owns its own CSRF and request validation and is out of scope for this lens. The reviewer MUST NOT flag findings inside that directory per [code-review-guideline › scoping](../../code-review-guideline/references/scoping.md).

**Guidelines:**

- MUST NOT flag findings inside a tool-owned admin route segment per [code-review-guideline › scoping](../../code-review-guideline/references/scoping.md); the data/content layer owns its CSRF and request validation there.
