---
name: observability-guidelines
description: Use this skill whenever writing, reviewing, or modifying code that throws, catches, or reports errors — including `try`/`catch` placement, error-reporting calls, and top-level error boundaries. Use even when the user only mentions capturing an exception, error boundaries, or debugging an unhandled exception in this project.
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

> **Dormant until an error tracker exists** — remove this banner when one (e.g.
> Sentry) lands, making the lens unconditional.

See [error-tracking.md](./references/error-tracking.md) for:

- Error-tracker initialization and runtime-specific configuration files
- The error-reporting capture call's import source, context, and privacy boundaries
- PII settings and safe event context
- Source map and instrumentation changes
