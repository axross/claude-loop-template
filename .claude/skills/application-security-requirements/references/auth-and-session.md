# Auth and Session Management

Apply these rules to verify the project's authentication is not weakened and the error tracker's PII exposure is bounded.

<!-- INIT:OPTIONAL key=ERROR_TRACKER_OR_ANALYTICS — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*This lens assumes the project has an authentication system (often provided by the data/content layer) and, optionally, an {{ERROR_TRACKER}} and analytics service. Delete the subsections for tools the project does not use during INIT.*

## Authentication Lockout Settings

Lockout and rate-limit settings are the only cost imposed on password guessing, so a relaxed threshold quietly turns the login form into a brute-force oracle.

**Guidelines:**

- MUST flag a Critical when the diff weakens any of these in the auth configuration:
  - lockout duration set below 5 minutes
  - max login attempts raised above 5
  - the auth/lockout configuration block removed entirely (defaults are weaker or absent)
- MUST flag a Critical when the diff adds a new field to the user/account resource that exposes a credential (e.g., a plain-text API key field) — credentials belong in env vars or a secrets store, not in the database.
- MUST flag a Major when the user/account resource's read rule is changed to allow non-admin reads. User records contain email addresses and locked-out state.

## Session Cookies

Cookie names, flags, and rotation are internal details of the authentication system, so a second reader or writer breaks silently whenever that system changes them.

**Guidelines:**

- MUST flag a Critical when a new component or request handler reads or writes session cookies directly instead of going through the project's authentication system. That system owns cookie management — bypassing it desyncs the auth state.
- MUST flag a Major when a new feature implements its own auth cookie or token rather than relying on the authenticated-user context the auth system already provides.

## Privileged / Preview Auth Path

URLs leak by design — into history, logs, referrers, and shared links — so a query flag that unlocks non-public data is a password published in plain sight.

**Guidelines:**

- MUST flag a Critical when the diff makes a privileged/preview flag reachable without a valid authenticated session. A preview flag should only switch rendering mode — the data fetch for non-public content must still rely on the auth system's authentication.
- MUST flag a Critical when a new query-param flag is introduced that affects data visibility (e.g., a hypothetical `?internal=true`) without auth gating.

## Error-Tracker PII Exposure

<!-- INIT:OPTIONAL key=ERROR_TRACKER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no {{ERROR_TRACKER}}, delete this section during INIT.*

If the {{ERROR_TRACKER}} is configured with a "send default PII" option, and/or session replay, it already captures IP addresses, request bodies, user-agent, and DOM mutations including form input.

**Guidelines:**

- MUST account for this review context when it applies: the {{ERROR_TRACKER}} may already capture IP addresses, request bodies, user-agent, and (with session replay) form input.
- MUST flag a Critical when the diff adds a new authentication form, payment form, or any input that captures secrets, without applying the {{ERROR_TRACKER}}'s input-masking/blocking for replay. Even an otherwise-public project can leak a privileged admin form via replay.
- MUST flag a Major when a new error report attaches extra context (`reportError(error, { extra: { … } })`, mapping to the {{ERROR_TRACKER}}'s capture function) that contains a token, password, session ID, or full request body.
- SHOULD flag a Minor recommendation to scope the trace sample rate below `1` when a new high-traffic route is introduced, to control {{ERROR_TRACKER}} quota.

## Analytics PII Exposure

<!-- INIT:OPTIONAL key=ANALYTICS — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no analytics service, delete this section during INIT.*

If the analytics client is configured with autocapture (capturing visible text and/or session recordings), it captures content rendered into the DOM.

**Guidelines:**

- MUST flag a Critical when a new component renders a credential, full email address, or other PII into the DOM tree visited by analytics autocapture. Use the analytics SDK's opt-out attribute or wrap the element to disable capture.
- MUST flag a Major when a new analytics `track(…)` call attaches identifiers (raw email, IP, payment info) directly. Use a hashed or opaque user ID instead.

## Localhost / Production Divergence

Code gated to the local environment escapes every production test and review scenario, so its divergence from the production path surfaces only after deployment.

**Guidelines:**

- MUST flag a Major when the diff causes a code path to execute only when running locally (per the project's environment flag) but no equivalent exists for production — a localhost-only auth bypass that ships to production via a deployed branch is a recurring class of bug.
