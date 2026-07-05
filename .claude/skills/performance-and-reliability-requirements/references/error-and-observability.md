# Error Handling and Observability

Apply these rules to verify the change keeps the project's error-propagation model and structured-logging discipline intact. Defer the developer-facing rules to [observability-guidelines](../../observability-guidelines/SKILL.md) — this file is the **reviewer's** flagging checklist. Throughout, `reportError(...)` denotes the project's error-reporting call (it maps to {{ERROR_TRACKER}}'s capture function if the project has one), and `logger` denotes the project's structured logger ({{LOGGER}}).

<!-- INIT:OPTIONAL key=ERROR_TRACKER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no {{ERROR_TRACKER}}, treat `reportError(...)` as the project's equivalent failure-reporting mechanism (or delete the error-reporting clauses during INIT).*

## `try`/`catch` Placement

This review focuses on major-severity cases where a new `try`/`catch` is placed inside a nested helper rather than at the root call site (the request entry point / top-level handler / server action). The project rule per [observability-guidelines › error-handling](../../observability-guidelines/references/error-handling.md) is "let errors propagate to the root call site".

**Guidelines:**

- MUST flag a Major when a new `try`/`catch` is placed inside a nested helper rather than at the root call site (the request entry point / top-level handler / server action). The project rule per [observability-guidelines › error-handling](../../observability-guidelines/references/error-handling.md) is "let errors propagate to the root call site".
- MUST flag a Critical when a `catch` block does any of:
  - Logs without rethrowing or calling `reportError(...)` (silent error swallow)
  - Returns a default value (e.g., `return null`, `return []`) without `reportError(...)` — the failure becomes invisible
  - Writes to a bare console/stderr instead of `reportError(...)` — ad-hoc console output does not reach the error tracker in production
- MUST flag a Major when a `catch` rethrows but loses the original error (e.g., `throw new Error("something went wrong")`). Preserve the cause (e.g., `throw new Error("…", { cause: error })`) or just rethrow.

## Error-Reporting Discipline

This review focuses on critical-severity cases where a new caught error is not reported via `reportError(...)`. The only exception is a known control-flow signal (e.g., the sentinel thrown by a "not found" / redirect helper).

**Guidelines:**

- MUST flag a Critical when a new caught error is not reported via `reportError(...)`. The only exception is a known control-flow signal (e.g., a "not found" or redirect sentinel).
- MUST flag a Major when `reportError(...)` is called **after** an early return / "not found" / redirect rather than before. The report must be sent before the function exits along the alternate path.
- MUST flag a Major when the error-reporting call is imported from the wrong SDK entry point for the runtime (server vs. browser vs. edge). Use the integration that wires all runtimes correctly.
- MUST flag a Major when an unexpected non-thrown state is silently ignored. Construct and report an explicit error for "should-not-happen" branches instead of swallowing them.

## Logger Discipline

This review focuses on critical-severity cases where the diff logs an error through the logger instead of reporting it. The project routes errors to the error tracker via `reportError(...)`, not to the logger, per [observability-guidelines › logging](../../observability-guidelines/references/logging.md).

**Guidelines:**

- MUST flag a Critical when the diff calls the logger's error level for a real error — the project routes errors through `reportError(...)` per [observability-guidelines › logging](../../observability-guidelines/references/logging.md).
- MUST flag a Critical when a new module constructs its own logger instance directly instead of deriving a child from the project's shared root logger.
- MUST flag a Major when a new module's logger label/namespace collides with an existing one — labels must stay unique so logs are attributable.
- MUST flag a Major when a new slow / external operation lacks the start/complete log pair carrying a `duration`. Match the project's convention of bracketing each fetch / parse / IO operation with start and complete logs.

## Log Hygiene

This review focuses on critical-severity cases where a log line interpolates a secret (token, password, session ID, full request body). Cross-reference with [application-security-requirements › secret-handling](../../application-security-requirements/references/secret-handling.md).

**Guidelines:**

- MUST flag a Critical when a log line interpolates a secret (token, password, session ID, full request body). Cross-reference with [application-security-requirements › secret-handling](../../application-security-requirements/references/secret-handling.md).
- MUST flag a Major when a log message violates the project's established message style (the linter/formatter and convention enforce it).
- MUST flag a Major when an info-level log is emitted for a high-frequency operation (e.g., per-render of a server unit, per-iteration inside a tight loop). Log at the boundary of the operation, not inside it.

## Error Boundaries

This review focuses on critical-severity cases where the diff modifies the project's last-resort/root error boundary to remove its error-reporting hook — that boundary is the final sink for otherwise-unhandled errors.

**Guidelines:**

- MUST flag a Critical when the diff removes the error-reporting call from the project's root/last-resort error boundary — it is the final error sink.
- MUST flag a Major when a new localized error boundary is added without the same error-reporting pattern.
- MUST flag a Major when a "not found" boundary reports an error — a "not found" outcome is a normal control-flow path, not an error. Reporting it would mask real errors with noise.

## Replay and Trace Sampling

<!-- INIT:OPTIONAL key=ERROR_TRACKER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project's {{ERROR_TRACKER}} has no session replay or trace sampling, delete this section during INIT.*

This review focuses on critical-severity cases where the diff lowers error-time session-replay capture below full sampling. Error-time replay is the most diagnostic signal.

**Guidelines:**

- MUST flag a Critical when the diff lowers error-time replay capture below full sampling. Error-time replay is the most diagnostic signal.
- SHOULD flag a Minor recommendation to lower the trace sampling rate when a new high-traffic route is added — full sampling will hit the error tracker's quotas.

## Idempotency

This review focuses on critical-severity cases where a new mutation handler is not idempotent (a retry produces a different result) and the caller (e.g., a data-layer write hook) does not handle the partial-failure case. Match the project's idempotent mutation handlers.

**Guidelines:**

- MUST flag a Critical when a new mutation handler is not idempotent (a retry produces a different result) and the caller does not handle the partial-failure case. Design retries to be safe.
- SHOULD flag a Major when a new external `fetch`/network call inside a server function lacks a timeout (e.g., an abort signal with a deadline). A hung dependency stalls the entire request.
