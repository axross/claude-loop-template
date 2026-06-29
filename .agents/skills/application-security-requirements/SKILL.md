---
name: application-security-requirements
description: Use this skill when reviewing security or privacy implications of a change. Covers secrets/env vars, the framework's public/client-exposed env-var prefix, input validation, data-layer access control, public exposure, output-encoding/injection in rendered untrusted content, SSRF/outbound fetch of user-controlled URLs, auth/session settings, analytics/error-reporting data capture, and dependency supply-chain risk. Use for "is this safe", "security", "auth", "admin", "secret", "privacy", "PII", "XSS", "SSRF", or dependency reviews.
---

# Application Security Requirements

Apply these rules when reviewing the security implications of any code change in this project. The framing is OWASP Top 10 mapped onto this project's stack. Where a section names a concrete tool (`{{CMS_OR_DATA_LAYER}}`, `{{HOSTING_PLATFORM}}`, `{{ERROR_TRACKER}}`, an analytics service), treat it as a placeholder for whatever the project actually uses, and delete the section if the project has no such tool.

## Secret and Environment-Variable Handling

See [secret-handling.md](./references/secret-handling.md) for:

- No literal secret committed (any service credential, token, or test password)
- `process.env.*` accessed only inside the project's whitelisted env-access files
- The framework's public/client-exposed env-var prefix convention used only for values intentionally exposed to the browser/client
- `.env.local` is gitignored; example only in `.env.example`

## Input Validation

See [input-validation.md](./references/input-validation.md) for:

- All request handlers validate and coerce request inputs before passing them to the data layer or an outbound `fetch`
- All route params / query params are treated as untrusted (their static types do not guarantee their runtime shape)
- Data-layer queries receive sanitized values (no type-coercion bypass on identifiers)
- Data-layer return values are parsed through the project's schema/validation library before reaching consumers

## Access Control

See [access-control.md](./references/access-control.md) for:

- Each data-layer resource has explicit access rules appropriate for its data sensitivity
- Unpublished / non-default content is gated so it is not served to unauthorized requests
- The authentication system's lockout / rate-limit settings are not weakened
- New mutation endpoints are protected against unauthenticated abuse

## Privacy and Exposure Control

See [privacy-and-exposure.md](./references/privacy-and-exposure.md) for:

- Unpublished, preview, admin-only, and private content cannot leak through public routes, metadata, structured data, sitemap, robots, or media routes
- Public media/asset URLs expose only intentionally public assets and do not reveal private storage tokens or internal identifiers
- Analytics and error-reporting changes do not capture unnecessary PII, secrets, private content, or internal fields
- Client-exposed environment variables, analytics event properties, and error context are intentionally public

## Injection in Rendered Untrusted Content

See [xss-in-markdown.md](./references/xss-in-markdown.md) for:

- Rich-text / markdown / HTML rendering of untrusted (user- or CMS-authored) content does not pass user-controlled values into raw-HTML sinks or unsanitized attributes
- Dangerous URL protocols (e.g., `javascript:`) are stripped or neutralized before reaching a rendered attribute
- Custom render nodes only emit attributes that the rendering layer encodes safely
- The framework's safe-encoding path is not bypassed (no manual string interpolation of untrusted content into markup)

## SSRF and Outbound Fetch

See [ssrf-and-embeds.md](./references/ssrf-and-embeds.md) for:

- Any code that `fetch`-es a user- or CMS-controlled URL cannot be steered at internal-network hosts in production
- Image/asset rendering does not bypass the host allowlist for user-controlled URLs
- New user-controlled URLs that flow into a `fetch` call go through an allowlist or a hostname check
- New entries in the config allowlist of external hosts are tightly scoped

## Auth and Session Management

See [auth-and-session.md](./references/auth-and-session.md) for:

- Authentication lockout / rate-limit settings are not relaxed
- Privileged / preview state is reachable only via the authentication path, not via a query-string bypass
- Error-tracker PII exposure is acknowledged when adding new identifiers/contexts

## Supply Chain

See [supply-chain.md](./references/supply-chain.md) for:

- New dependencies justify their addition per [development-guidelines › change-management](../development-guidelines/references/change-management.md)
- New dependencies are reasonably popular, maintained, and platform-agnostic
- Lockfile is updated; transitive additions are inspected for known-vulnerable versions
- No `postinstall` / `prepare` script in a new dependency runs unexpected code
