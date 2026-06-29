# Secret and Environment-Variable Handling

Apply these rules to verify no secret is committed and `process.env` access stays inside the project's whitelisted boundary.

## Committed Secrets

Committed Secrets review focuses on critical-severity cases where the diff contains any literal value matching the shape of a service credential.

**Guidelines:**

- MUST flag a Critical when the diff contains any literal value matching the shape of:
  - A service credential — a long random string assigned to an application-secret variable outside the single sanctioned config file that legitimately holds it
  - A service token with an embedded auth secret (e.g., a connection URL or DSN that includes credentials past the host)
  - A storage / blob access token (recognizable by its provider-specific prefix)
  - A database auth token (often JWT-shaped)
  - A test-user password literal anywhere outside `.env.example`
  - A third-party analytics or service token outside the whitelisted env-access files
- MUST flag a Critical when `.env.local`, `.env.production`, `.env`, or any `*.pem` / `*.key` file appears in the diff. They are gitignored — appearance means the gitignore was bypassed.
- MUST flag a Major when a value previously read from `process.env.*` is hard-coded into the diff "for testing".

## `process.env` Whitelist

The project restricts `process.env.*` access to a small set of whitelisted files (often enforced by a linter rule). The reviewer MUST flag a Critical for any new `process.env.*` access outside those files. The whitelist typically covers only:

| File category | Why it is whitelisted |
|---|---|
| The env-derived runtime barrel | The single sanctioned module that reads env vars and re-exports typed runtime values (origin, environment name, service DSNs/tokens, etc.) |
| Data-layer config | The data/content layer needs DB/storage credentials at build/startup time |
| App-framework config | Build/config-time access to CI and deployment env vars |
| Test config | Test config-time access to CI flags, base URL, and automation-bypass secrets |

**Guidelines:**

- MUST flag a Critical when a component, repository, helper, request handler, or data-layer resource reads `process.env` directly. It MUST go through the project's single env-derived runtime barrel.

## Public / Client-Exposed Env-Var Boundary

Most app frameworks expose a subset of env vars to the browser/client via a prefix convention (e.g., a `*_PUBLIC_*`-style prefix). Anything carrying that prefix is shipped to every client. Review focuses on critical-severity cases where a secret value is read via a client-exposed env var.

- The project legitimately uses a handful of client-exposed env vars for public-by-design values (environment name, build/commit identifier, error-tracker DSN, analytics token).

**Guidelines:**

- MUST flag a Critical when a secret value is read via a client-exposed (public-prefixed) env var. The public prefix is the public-bundle boundary — anything prefixed is shipped to every client.
- MUST flag a Major when a new client-exposed env var is introduced without a one-line justification of why it must be public.

## Logging and Telemetry

Logging and Telemetry review focuses on critical-severity cases where a secret value (DSN, token, password, session ID, auth header) is interpolated into any log call, any error-report extras, or any analytics event payload. Structured logs go to stdout and are captured by the hosting platform; the error tracker and analytics service ship payloads off-server.

**Guidelines:**

- MUST flag a Critical when a secret value (DSN, token, password, session ID, auth header) is interpolated into any `logger.info()` / `logger.warn()` call, any error-report extras, or any analytics event payload. Logs are captured by the hosting platform; the error tracker and analytics ship payloads off-server.
- MUST account for a "send default PII" option being enabled in the error-tracker config (if the project enables it) because IP addresses, cookies, and request bodies may already be attached.
- MUST flag a Major when a change adds explicitly sensitive context (e.g., a bearer token) on top of that default.

## `.env.example`

`.env.example` review focuses on major-severity cases where the diff introduces a new env var consumed at runtime but does not add a placeholder line to `.env.example`. The example file is the only documentation of which env vars exist.

**Guidelines:**

- MUST flag a Major when the diff introduces a new env var consumed at runtime but does not add a placeholder line to `.env.example`. The example file is the only documentation of which env vars exist.
