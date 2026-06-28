# Logging

*If this project has no {{LOGGER}} (structured logger), delete or adapt this section during INIT.*

Apply these rules when writing, reviewing, or modifying any code that emits log output.

## When to Log

When to Log describes the preferred project default: log the start and end of any operation that is slow, depends on an external system, or could fail (e.g., database queries, HTTP fetches, file or media processing).

**Guidelines:**

- SHOULD log the start and end of any operation that is slow, depends on an external system, or can fail (e.g., database queries, HTTP fetches, file or media processing).
- SHOULD log unexpected-but-recoverable conditions (e.g., a record was skipped due to a parse error).
- SHOULD NOT log trivial or extremely frequent operations (e.g., individual UI renders, synchronous computations).

## Log Levels

Log Levels describes the preferred project default: use `logger.info()` for informational messages that describe normal progress.

**Guidelines:**

- SHOULD use `logger.info()` for informational messages that describe normal progress.
- SHOULD use `logger.warn()` for recoverable unexpected conditions — cases where execution continues but something is worth investigating.
- MUST NOT use `logger.error()` for errors **when the project has a dedicated {{ERROR_TRACKER}}**. Report the error to {{ERROR_TRACKER}} (via its capture call) and let it propagate. See [Error Handling](./error-handling.md).
  - If the project has **no** {{ERROR_TRACKER}}, `logger.error()` is the sanctioned channel for unexpected failures; this rule depends on whether {{ERROR_TRACKER}} survives INIT.

## Logger Setup

The project uses {{LOGGER}} for structured (e.g., JSON) logging.

**Guidelines:**

- MUST derive loggers from the project's shared **root logger** instead of instantiating a new {{LOGGER}} instance directly in each module.
- MUST create a **child logger** scoped to each module, setting a `module` field that identifies the module:

```typescript
import { rootLogger } from "the project's shared logger module";

const logger = rootLogger.child({ module: "data-fetch" });
```

- SHOULD choose a `module` identifier that represents the module's concern at a glance and is unique per module, so log lines can be filtered by module without reading the full path.
- MAY adopt a short, scannable convention for the `module` identifier (for example, an emoji per module such as `📥` for data fetching, `🌏` for external requests, `🖼️` for media handling) if the project finds it useful.

## Structured Log Format

{{LOGGER}} accepts an optional **context object** as the first argument and the **message string** as the second. Use this two-argument form whenever there is relevant context to attach. (Adapt to your logger's signature if it differs.)

```typescript
// No context needed
logger.info("Started fetching records.");

// With context
logger.info({ id }, "Started fetching record.");
logger.info({ id, duration: performance.now() - startedAt }, "Completed fetching record.");
```

**Guidelines:**

- SHOULD include identifiers (e.g., an entity `id`, `url`, `filename`) in the context object so log lines are searchable and filterable.
- SHOULD include timing information (`duration`) in "completed" log lines for operations where latency matters.
- MUST NOT log values that can contain sensitive user data (passwords, tokens, PII). Log only identifiers and metadata.

## Message Conventions

Log messages SHOULD follow a consistent past-tense / gerund-phrase pattern that makes log streams easy to scan:

| Moment | Prefix | Example |
|---|---|---|
| Beginning of an operation | `"Started ..."` | `"Started fetching records."` |
| Successful completion | `"Completed ..."` or `"Finished ..."` | `"Completed fetching external metadata."` |
| Recoverable skip / partial failure | Descriptive past tense | `"Skipped a record due to parse error."` |

```typescript
// CORRECT
logger.info({ url }, "Started fetching external metadata.");
// ... operation ...
logger.info({ url, duration }, "Completed fetching external metadata.");

// CORRECT — warn on recoverable skip
logger.warn(
  { id: record.id, error: parseError },
  "Skipped a record due to parse error.",
);

// WRONG — vague, not scannable
logger.info("done");
logger.info("error fetching record");
```

**Guidelines:**

- MUST end every log message with a period (`.`) for grammatical consistency.
