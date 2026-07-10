# Bundle and Dependency Weight

Apply these rules to verify client-tier additions do not balloon the code shipped to the browser (or, for non-web {{PROJECT_KIND}} projects, the code pulled into the client/edge bundle).

## Server-Only Imports in Client Files

The bundler follows every import edge regardless of how little of a module is used, so one wrong import in a client-tier file drags a server-sized payload into what every visitor downloads.

**Guidelines:**

- MUST flag a Critical when a client-tier file imports any of these classes of package (each pulls in tens to hundreds of KB or breaks the build):
  - The data-layer SDK / ORM / CMS client
  - Heavyweight content-processing or rendering pipelines (parsers, transformers, syntax highlighters)
  - Server-side metadata/scraping libraries
  - The structured logger and its pretty-printer
  - An error-tracker's server-only entry points
  - Native runtime / platform builtins (e.g., `node:*` modules)
  - A "server-only" marker package (importing it in a client file is a build error by design)
- MUST flag a Critical when a client-tier file imports from a server-only module tier (e.g., the data-access or data-layer-config directories). These tiers contain server-only code per the project's maintainable-code guidelines (abstraction-boundaries rules).

## Heavy Client Dependencies

Server-tier code costs the server once per request; client-tier code costs every visitor's download, parse, and execution time — so where a library runs matters as much as what it does.

**Guidelines:**

- MUST flag a Major when a client-tier file imports a heavyweight library whose work could happen on the server tier, or that has a smaller equivalent. Use judgment:
  - A utility library is fine, but flag it if the diff pulls in many of its submodules and the work could happen on the server tier.
  - A library that is necessarily client-side (e.g., browser analytics) — do not flag.
  - Tiny utilities — do not flag.
- MUST flag a Major when a new dependency with a large installed size (roughly > 200 KB) is imported into a client-tier file. Cross-reference with the project's application-security requirements (supply-chain rules).

## Re-Exports and Barrel Files

A barrel import hands the bundler the whole index, and everything the re-exports touch rides along unless tree-shaking can prove it unused — which it often cannot.

**Guidelines:**

- MUST flag a Critical when a new barrel file is created that re-exports many items and is imported from a client-tier file. Import directly from the source module per the project's development guidelines (code-quality rules).
- MUST flag a Major when a new client unit imports from a file that itself re-exports server-only modules. The transitive pull will fail the build at best and bloat the client bundle at worst.

## Server-External Package Configuration

<!-- INIT:OPTIONAL key=BUNDLER — keep this section OR delete it. -->
*If this project's bundler has no "external server packages" escape hatch, delete this section during INIT.*

Some bundlers let you mark packages that the server runtime should NOT bundle (they stay loaded from the dependency tree at runtime). This list should stay minimal.

**Guidelines:**

- MUST flag a Critical when a new package is added to the server-external list without a stated reason. Legitimate reasons are:
  - A native binary
  - A stream-based or otherwise bundler-incompatible logger
  - A module that uses runtime builtins incompatible with the bundler
- MUST flag a Critical when a package that legitimately requires the server-external escape hatch is also imported from a client-tier file. The setting does not protect the client bundle.

## Dynamic Import Patterns

Lazy loading moves a unit's cost from every visitor's initial load to the moment the unit is actually needed.

**Guidelines:**

- SHOULD flag a Minor recommendation to lazy-load (deferring server-side rendering when appropriate) a new client unit that is large, only used on a single route, and not above the fold.
- MUST flag a Critical when server-side rendering is disabled for a unit the reviewer would expect to be server-rendered (e.g., an SEO-critical above-the-fold element). Disabling SSR removes it from the initial HTML.

## Tree-Shaking

Tree-shaking works by proving exports unused, and default or namespace imports of CommonJS-shaped modules make that proof impossible.

**Guidelines:**

- MUST flag a Major when a client-tier file uses a default import (e.g., `import _ from "lib"`) instead of named imports for a tree-shakeable library. Default imports often defeat tree-shaking for CommonJS-shaped libraries.
- SHOULD flag a Minor when a new icon or UI library is imported wholesale (e.g., `import * as Icons from "…"`). Import only the items used.
