---
name: application-security-requirements
description: Use this skill when reviewing security or privacy implications of a change. Covers secrets/env vars, the framework's public/client-exposed env-var prefix, input validation (including localStorage-persisted state), public exposure, output-encoding/injection in rendered untrusted content, SSRF/outbound fetch of user-controlled URLs, error-reporting data capture, and dependency supply-chain risk. Use for "is this safe", "security", "secret", "privacy", "PII", "XSS", "SSRF", or dependency reviews.
---

# Application Security Requirements

Apply these rules when reviewing the security implications of any code change in this project. The framing is OWASP Top 10 mapped onto this project's stack (Next.js on Vercel, client-side localStorage persistence, no auth, no backend data layer).

## Secret and Environment-Variable Handling

See [secret-handling.md](./references/secret-handling.md) for:

- No literal secret committed (any service credential, token, or test password)
- `process.env.*` accessed only inside the project's whitelisted env-access files
- The framework's public/client-exposed env-var prefix convention used only for values intentionally exposed to the browser/client
- `.env.local` is gitignored; example only in `.env.example`

## Input Validation

See [input-validation.md](./references/input-validation.md) for:

- All route params / query params are treated as untrusted (their static types do not guarantee their runtime shape)
- Values read back from `localStorage` are validated in the storage module before use
- User-entered todo text only reaches the page through React's safe-encoding path

## Privacy and Exposure Control

See [privacy-and-exposure.md](./references/privacy-and-exposure.md) for:

- Private content cannot leak through public routes, metadata, structured data, sitemap, robots, or media routes
- Error-reporting changes do not capture unnecessary PII, secrets, or private content (dormant until an error tracker lands)
- Client-exposed environment variables and error context are intentionally public
- Localhost-only code paths have a production equivalent

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

## Supply Chain

See [supply-chain.md](./references/supply-chain.md) for:

- New dependencies justify their addition per [development-guidelines › change-management](../development-guidelines/references/change-management.md)
- New dependencies are reasonably popular, maintained, and platform-agnostic
- Lockfile is updated; transitive additions are inspected for known-vulnerable versions
- No `postinstall` / `prepare` script in a new dependency runs unexpected code
