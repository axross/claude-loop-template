# Error Tracking

> **Dormant until an error tracker exists** — remove this banner when one (e.g.
> Sentry) lands, making the lens unconditional.

Apply these rules when writing, reviewing, or modifying error-tracker setup, error event capture, instrumentation files, or error context.

## Error Tracker Integration Boundaries

The project's error tracker is initialized through its init/config files. Error-tracker changes affect production diagnostics and privacy, so treat them as observability and security work.

**Guidelines:**

- MUST import error-reporting helpers from the error tracker's SDK, not from an unrelated or lower-level package.
- MUST consult [Development Guidelines › current-docs](../../development-guidelines/references/current-docs.md) before changing the error tracker's init/config files, source maps, or runtime options.
- MUST consult [Application Security Requirements › privacy and exposure](../../application-security-requirements/references/privacy-and-exposure.md) before adding event context, tags, user identifiers, breadcrumbs, or request data.
- SHOULD keep error-tracker setup in the existing init/config files instead of scattering initialization across feature modules.

## Capturing Exceptions

Captured exceptions should represent unexpected failures or unexpected states that need investigation. Expected validation failures and normal not-found paths usually belong in control flow or logs, not the error-reporting service.

**Guidelines:**

- MUST report an error (via the error tracker's capture call) whenever a caught error represents an unexpected failure that should be investigated.
- MUST report before an early return, redirect, not-found, or fallback path when the failure would otherwise disappear.
- MUST rethrow after reporting when the caller or error boundary still needs to handle the failure.
- SHOULD report non-thrown unexpected states with a descriptive `Error` object when they indicate a renderer, parser, or data-contract gap.
- MUST NOT report expected user input validation failures as exceptions unless they indicate abuse or a system defect.

## Event Context and PII

Error-tracker context should explain the failure without copying private content into a third-party event.

**Guidelines:**

- MUST NOT attach secrets, raw request bodies, raw user content, access tokens, non-public content, session data, or private data-layer fields to error-tracker context.
- MUST treat any "send default PII" option as a privacy-sensitive setting and justify any new user, request, or identifier context.
- SHOULD prefer route names, public identifiers, operation names, feature flags, and booleans over raw content values.
- SHOULD include enough stable context to make issues actionable, such as an entity `id`, `url`, `filename`, or module name when those values are intentionally public.
