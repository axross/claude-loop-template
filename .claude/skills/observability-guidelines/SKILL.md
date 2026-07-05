---
name: observability-guidelines
description: Use this skill whenever writing, reviewing, or modifying code that throws, catches, reports, or logs — including `try`/`catch` placement, error-reporting capture calls, top-level error boundaries, structured-logger usage and module child loggers, log-level choice (`info` / `warn`; `error` reserved for projects without a dedicated error tracker), and "Started / Completed" structured-log messages. Use even when the user only mentions an error tracker, a logger, capturing an exception, error boundaries, log levels, or debugging an unhandled exception in this project.
---

# Observability Guidelines

Apply these rules when writing, reviewing, or modifying any code that handles errors or emits log output.

## Error Handling

See [error-handling.md](./references/error-handling.md) for:

- Where to place try-catch blocks and how errors propagate
- Rethrowing errors that are caught only for side effects
- When caught errors should be reported before alternate control flow
- Top-level error boundaries and root-level error handling

## Error Tracking

See [error-tracking.md](./references/error-tracking.md) for:

- {{ERROR_TRACKER}} initialization and runtime-specific configuration files
- The error-reporting capture call's import source, context, and privacy boundaries
- PII settings and safe event context
- Source map and instrumentation changes

## Logging

See [logging.md](./references/logging.md) for:

- When operations are worth logging and when they are not
- Which log level to use (`info` vs `warn`; `error` only when the project has no dedicated error tracker)
- Creating module-scoped child loggers from a shared root logger
- Structuring log calls with context objects and "Started / Completed" messages
