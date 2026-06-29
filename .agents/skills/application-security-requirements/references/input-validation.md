# Input Validation

Apply these rules to verify every untrusted input is validated and coerced before reaching the data layer, an outbound `fetch`, or any rendering pipeline. Treat the static types at a request boundary as unverified: the runtime value may not match its declared type (e.g., a single query param may arrive as a string, an array, or `undefined`).

## Route Inputs (params, query params)

Route Inputs review focuses on critical-severity cases where a route param or query param value reaches a data-layer query, a `fetch` URL, or a redirect target without an explicit type assertion or schema parse. The static type at the boundary lies — at runtime a query value could be `string | string[] | undefined`.

**Guidelines:**

- MUST flag a Critical when a route param or query param value reaches a data-layer query, a `fetch` URL, or a redirect target without an explicit type assertion or validation-library parse. The static type at the boundary lies — at runtime a query value can be `string | string[] | undefined`.
- MUST flag a Major when a boolean query param is coerced via a truthy check (`if (query.flag)`) instead of value comparison (`query.flag === "true"`). The project's established pattern uses explicit value comparison — diverging risks treating a `?flag=false` value as truthy.
- MUST flag a Critical when a dynamic segment (e.g., an identifier path param) is passed into an equality filter without ensuring it is a string. An array value can bypass an equals filter.

## Server Actions and Request Handlers

Server Actions and Request Handlers review focuses on critical-severity cases where a new request handler reads a JSON body, form data, or the request URL without a schema (or equivalent) validating the parsed shape before use.

**Guidelines:**

- MUST flag a Critical when a new request handler reads a JSON body, form data, or the request URL without a schema (or equivalent runtime check) validating the parsed shape before use.
- MUST flag a Critical when a new server-side callable invoked from the client accepts arguments without runtime validation, regardless of static types.
- MUST flag a Major when a request handler or server-side callable returns data-layer records directly without first parsing them through the appropriate schema. Direct return leaks fields the consumer did not request and may include non-public fields.

## Data Layer

Data Layer review focuses on critical-severity cases where a new data-access function does not parse (or safe-parse) its result through the project's schema/validation library before returning. The project's pattern is to define a schema transform per record shape and parse before return.

**Guidelines:**

- MUST flag a Critical when a new data-access function does not run a schema `parse(…)` or `safeParse(…)` on the result before returning. The project's pattern is to define a schema transform per record shape and parse before return.
- MUST flag a Major when a safe-parse failure is **silently** dropped in production code (no warning log). The established pattern logs the failure with enough context (identifier and flattened error) to debug — match it.
- MUST flag a Critical when a data-layer query filter is built by string concatenation, template literal, or anything other than the data layer's typed/parameterized query interface. The typed filter interface IS the safe boundary; building it dynamically with untrusted keys is the injection-equivalent path.

## Rendering Pipeline Inputs

Rendering Pipeline Inputs review focuses on critical-severity cases where a new code path passes user-supplied content into a rendering pipeline (markdown/rich-text/HTML) without going through the sanctioned loader that the pipeline assumes its input came from. A pipeline that trusts its input source is unsafe if a new path feeds it arbitrary external content.

**Guidelines:**

- MUST flag a Critical when a new code path passes user-supplied content into the rendering pipeline without going through the sanctioned content loader (which loads from the trusted data layer, never the filesystem or arbitrary HTTP). The pipeline assumes its input came from the trusted source.
- MUST flag a Major when a new custom render node or transform reads attribute values without validating them — the established pattern validates parseable inputs (e.g., `URL.canParse(href)`) before constructing the node.

## File Uploads

File Uploads review focuses on critical-severity cases where a new upload-accepting resource lacks a content-type (MIME) filter when it accepts user-uploaded files. The established upload resources restrict accepted types (e.g., `image/*`) — match the pattern.

**Guidelines:**

- MUST flag a Critical when a new upload-accepting resource lacks a content-type (MIME) filter when the resource accepts user-uploaded files. The established pattern restricts accepted types — match it.
- MUST flag a Major when a new upload resource does not enforce filename sanitization. The established upload hooks rewrite the uploaded filename to a generated, safe name (e.g., `${uuid}.${ext}`) — match the pattern.
