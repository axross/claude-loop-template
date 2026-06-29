# Asset and Image Optimization

Apply these rules to verify images and other large assets are sized, formatted, and rendered through the framework's optimized asset pipeline. Map "the optimized image component/pipeline" to whatever {{APP_FRAMEWORK}} provides.

## Optimized Image Pipeline Usage

This review focuses on critical-severity cases where a new unit renders a raw, unoptimized image element for any image that comes from the data layer, a bundled/public asset, or a known external host. Use the framework's optimized image pipeline so the right size is served for the device.

- Read intrinsic dimensions from the source (the data-layer record or static asset) where available, and fall back to the unoptimized path only when dimensions are unknown. Match the project's existing image-rendering pattern.

**Guidelines:**

- MUST flag a Critical when a new unit renders a raw, unoptimized image element for any image from the data layer, a bundled asset, or a known external host. Use the framework's optimized image pipeline.
- MUST flag a Major when an optimized image is rendered without intrinsic dimensions (or the framework's fill/intrinsic-sizing mode) — without dimensions the pipeline falls back to unoptimized output and ships a layout-shift-prone image.

## Unoptimized-Path Discipline

This review focuses on critical-severity cases where the unoptimized image path is used with a user-controlled URL whose host is not in the project's allowlist of permitted external image hosts. Cross-reference with [application-security-requirements › ssrf-and-embeds](../../application-security-requirements/references/ssrf-and-embeds.md).

**Guidelines:**

- MUST flag a Critical when the unoptimized image path is used with a user-controlled URL whose host is not in the project's allowlist of permitted external image hosts. Cross-reference with [application-security-requirements › ssrf-and-embeds](../../application-security-requirements/references/ssrf-and-embeds.md).
- MUST flag a Major when the unoptimized path is used for an image whose dimensions are known (a field on the record, or a static asset). Optimization saves bandwidth — unoptimized should be a fallback, not a default.

## Loading and Priority

This review focuses on major-severity cases where a new above-the-fold image is rendered without a priority hint or with lazy loading. Above-the-fold imagery should be prioritized.

**Guidelines:**

- MUST flag a Major when a new above-the-fold image is rendered without a priority/eager hint (or with lazy loading). Such imagery should load eagerly.
- MUST flag a Major when a new below-the-fold image is rendered without lazy loading. Match the project's existing body-content image pattern.

## Upload / Ingest Configuration

<!-- INIT:OPTIONAL key=IMAGES — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project does not ingest user-uploaded images, delete this section during INIT.*

This review focuses on major-severity cases where a new image-upload path is added without a configured output format (e.g., a modern compressed format) or without bounded resizing. Match the project's shared upload-processing helpers.

**Guidelines:**

- MUST flag a Major when a new image-upload path is added without a configured efficient output format (or a documented reason). Match the project's shared upload-processing configuration.
- MUST flag a Major when a new upload path lacks resize bounds with a sensible upper limit (cover-fit, no enlargement, explicit max width and height) — unbounded uploads consume storage and bandwidth.
- SHOULD flag a Minor when a new derived size/variant is generated without a stated consumer — variants generate on every upload and cost storage.

## External Image Host Allowlist

This review focuses on critical-severity cases where a new permitted external image host uses a wildcard hostname or omits a path scope. Existing entries should be tightly scoped to specific hosts and path prefixes.

**Guidelines:**

- MUST flag a Critical when a new permitted external image host uses a wildcard hostname or omits a path scope. Keep entries tightly scoped to a specific host and path prefix.
- MUST flag a Major when the pattern's protocol is insecure (plain HTTP) for a non-local host. Production images should be HTTPS only.

## Image-Processing Backend

<!-- INIT:OPTIONAL key=IMAGES — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project does not run a server-side image-processing backend, delete this section during INIT.*

This review focuses on critical-severity cases where the diff removes the image-processing backend the upload pipeline depends on — uploads would fall back to copying files unprocessed, breaking the format-conversion and resize pipeline.

**Guidelines:**

- MUST flag a Critical when the diff removes the image-processing backend the upload pipeline depends on, because uploads will fall back to storing files unprocessed and break the format-conversion and resize pipeline.
- MUST flag a Major when a new upload path sets output quality higher than necessary for general media (e.g., above ~90 for lossy formats) — diminishing returns past that point.
