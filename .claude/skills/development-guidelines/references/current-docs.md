# Current External Documentation

Apply this reference when a change depends on framework, platform, service, or tool behavior that may have changed since the local skill was written. Official docs are part of the implementation context for these surfaces.

## When to Refresh Docs

Use current official docs before changing behavior governed by fast-moving frameworks, services, or tools that the project depends on. The table below lists representative surfaces by tool token; delete rows for tools the project does not use during INIT, and add rows for any other fast-moving dependency.

| Surface | Refresh docs before changing |
| ------- | ---------------------------- |
| {{APP_FRAMEWORK}} | Routing/rendering conventions, request/response handling, metadata, caching, configuration, instrumentation, asset/image behavior |
| {{CMS_OR_DATA_LAYER}} | Schema/model definitions, fields, access control, hooks, admin/customization, migrations, query APIs, storage adapters <!-- INIT:OPTIONAL key=DATA_LAYER — fill the token OR delete this row. --> |
| {{ERROR_TRACKER}} | SDK setup, instrumentation, source maps, event capture, PII behavior, runtime-specific config <!-- INIT:OPTIONAL key=ERROR_TRACKER — fill the token OR delete this row. --> |
| {{HOSTING_PLATFORM}} | Deployment/runtime behavior, asset optimization, storage, environment variables |
| {{E2E_TEST_FRAMEWORK}} | Test runner configuration, snapshot behavior, locator/assertion APIs |
| {{LINTER}} | Formatter/linter configuration, suppression syntax, rule names |

**Guidelines:**

- MUST consult current official docs before changing any surface listed in the table.
- MUST use official docs as the primary source; use blog posts, examples, or issues only as secondary context.
- MUST mention the docs consulted in the final summary when the implementation depends on a current-docs decision.
- MUST NOT rely only on memory for APIs, defaults, or behavior that the relevant vendor may have changed.
- SHOULD limit the docs lookup to the smallest surface needed for the task.

## Project-Specific Current-Docs Triggers

Some project areas are especially sensitive because a small API mismatch can produce production-only failures. List the project's own high-sensitivity config files and entry points here during INIT.

**Guidelines:**

- MUST refresh {{APP_FRAMEWORK}} docs before changing framework entry points, routing/rendering APIs, metadata generation, caching APIs, or framework configuration files.
- MUST refresh {{CMS_OR_DATA_LAYER}} docs before changing schemas, auth/access rules, editor/field configuration, migrations, or storage integration. <!-- INIT:OPTIONAL key=DATA_LAYER — fill the token OR delete this bullet. -->
- MUST refresh {{ERROR_TRACKER}} docs before changing its initialization/instrumentation files, event-capture behavior, source maps, or PII settings. <!-- INIT:OPTIONAL key=ERROR_TRACKER — fill the token OR delete this bullet. -->
- MUST refresh {{HOSTING_PLATFORM}} docs before changing deployment/runtime assumptions, storage usage, or environment-variable exposure.
- SHOULD refresh {{E2E_TEST_FRAMEWORK}} or {{LINTER}} docs before changing their configuration files, snapshot behavior, or suppression syntax.
