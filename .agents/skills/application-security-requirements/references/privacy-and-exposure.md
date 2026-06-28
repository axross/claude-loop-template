# Privacy and Exposure Control

Apply these rules when reviewing whether a change exposes content, identifiers, environment values, analytics properties, or error context beyond the intended audience.

## Public Content Boundaries

The public surface may render published content, public profile data, public media assets, metadata, and search/discovery files. Unpublished, preview-only, admin-only fields, secrets, and operational identifiers are not public just because the author controls the content layer.

**Guidelines:**

- MUST flag a Critical when unpublished or preview content can be reached from a public route without the authenticated draft/preview path.
- MUST flag a Critical when sitemap, robots, structured data (e.g., JSON-LD), social-preview (Open Graph) image routes, or generated page metadata can expose unpublished content or private fields.
- MUST flag a Major when a public response exposes internal storage keys, database IDs, raw data-layer records, stack traces, or environment-derived values that are not required for the user-facing feature.
- SHOULD verify that public media exposure is intentional for the publicly served asset resources (media, cover images, avatar images, and any blob-backed assets).

## Client and Environment Exposure

Values sent to the browser/client are public. The framework's public/client-exposed env-var prefix is a release decision, not only a typing convenience.

**Guidelines:**

- MUST flag any newly exposed client-prefixed env value unless it is safe for every visitor to read.
- MUST flag a Critical when secrets, tokens, DSNs with auth tokens, admin emails, session values, or database URLs can reach client bundles, HTML, metadata, logs, or analytics payloads.
- MUST verify `process.env.*` access remains limited to the env-access files allowed by [secret-handling](./secret-handling.md).
- SHOULD ask for a narrower public value when a client component only needs a derived boolean or public identifier.

## Analytics and Error Reporting Exposure

*If this project has no analytics service or no {{ERROR_TRACKER}}, delete the corresponding guidelines below during INIT.*

Analytics and error-reporting services are third-party data processors. Event context should be useful for debugging or analytics without carrying raw private content.

**Guidelines:**

- MUST flag a Major when analytics events include unpublished content, body/rich-text content, private data-layer fields, auth/session data, or high-cardinality user-entered values.
- MUST flag a Major when {{ERROR_TRACKER}} context includes secrets, raw request bodies, raw content, access tokens, or unpublished data-layer content.
- MUST treat a "send default PII" option in the {{ERROR_TRACKER}} config as a privacy-sensitive default and require explicit justification when adding identifiers to its context.
- SHOULD prefer stable non-sensitive identifiers such as route names, identifiers for published content, feature names, and boolean state over raw content values.
