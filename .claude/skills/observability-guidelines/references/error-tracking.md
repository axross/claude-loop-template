# Error Tracking

<!-- INIT:OPTIONAL key=ERROR_TRACKER — keep & fill the token (add the tool, INIT Step 5) OR, if the project has no error tracker yet, mark this section DORMANT (banner + neutral prose) rather than deleting it; observability-guidelines is a fixed skill (INIT.md Step 4). -->
*If this project has no {{ERROR_TRACKER}} (error-reporting service) yet, mark this section dormant during INIT (do not delete the skill).*

Apply these rules when writing, reviewing, or modifying {{ERROR_TRACKER}} setup, error event capture, instrumentation files, or error context.

## Error Tracker Integration Boundaries

This project uses {{ERROR_TRACKER}} as its error-reporting service, initialized through the error tracker's init/config files. {{ERROR_TRACKER}} changes affect production diagnostics and privacy, so treat them as observability and security work.

**Guidelines:**

- MUST import error-reporting helpers from {{ERROR_TRACKER}}'s SDK, not from an unrelated or lower-level package.
- MUST consult the project's development guidelines (current-docs rules) before changing the error tracker's init/config files, source maps, or runtime options.
- MUST consult the project's application-security requirements (privacy-and-exposure rules) before adding event context, tags, user identifiers, breadcrumbs, or request data.
- SHOULD keep {{ERROR_TRACKER}} setup in the existing init/config files instead of scattering initialization across feature modules.

## Capturing Exceptions

Captured exceptions should represent unexpected failures or unexpected states that need investigation. Expected validation failures and normal not-found paths usually belong in control flow or logs, not the error-reporting service.

**Guidelines:**

- MUST report an error (via {{ERROR_TRACKER}}'s capture call) whenever a caught error represents an unexpected failure that should be investigated.
- MUST report before an early return, redirect, not-found, or fallback path when the failure would otherwise disappear.
- MUST rethrow after reporting when the caller or error boundary still needs to handle the failure.
- SHOULD report non-thrown unexpected states with a descriptive `Error` object when they indicate a renderer, parser, or data-contract gap.
- MUST NOT report expected user input validation failures as exceptions unless they indicate abuse or a system defect.

## Event Context and PII

{{ERROR_TRACKER}} context should explain the failure without copying private content into a third-party event.

**Guidelines:**

- MUST NOT attach secrets, raw request bodies, raw user content, access tokens, non-public content, session data, or private data-layer fields to {{ERROR_TRACKER}} context.
- MUST treat any "send default PII" option as a privacy-sensitive setting and justify any new user, request, or identifier context.
- SHOULD prefer route names, public identifiers, operation names, feature flags, and booleans over raw content values.
- SHOULD include enough stable context to make issues actionable, such as an entity `id`, `url`, `filename`, or module name when those values are intentionally public.
