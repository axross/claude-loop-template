# Supply Chain

Apply these rules to verify new dependencies are justified, trustworthy, and do not bring along risky transitive code.

## Dependency Justification

Dependency Justification review focuses on major-severity cases where the diff adds a new entry to the dependency manifest without a justification per [development-guidelines › change-management](../../development-guidelines/references/change-management.md). The author should have considered ≥ 2 alternatives and chosen the most popular / well-maintained / platform-agnostic option.

**Guidelines:**

- MUST flag a Major when the diff adds a new entry to the dependency manifest (runtime or dev dependencies) without a justification per [development-guidelines › change-management](../../development-guidelines/references/change-management.md). The author should have considered ≥ 2 alternatives and chosen the most popular / well-maintained / platform-agnostic option.
- MUST flag a Major when a new dependency duplicates functionality already available in:
  - A package already in the manifest
  - A built-in standard-library API of the runtime
  - A built-in platform API already available to the project
- SHOULD flag a Minor when the new dependency is a thin wrapper around a single function and the diff only uses one export — inline the logic.

## Lockfile

Lockfile review focuses on critical-severity cases where the diff modifies the dependency manifest but the lockfile is unchanged, or vice versa — they must move together.

**Guidelines:**

- MUST flag a Critical when the diff modifies the dependency manifest but the lockfile is unchanged, or vice versa — they must move together.
- MUST flag a Major when a lockfile change introduces ≥ 50 new transitive packages for a single new direct dependency. That is a signal the dependency is heavyweight.

## Dependency Quality Signals

For each new direct dependency, the reviewer SHOULD verify (and request from the author if not stated in the PR description):

- Recent activity (commits within the last 12 months, ideally)
- Reasonable adoption (loosely: a download/usage count appropriate for the dependency's niche)
- Active issue tracker, no recent unaddressed CVEs
- Type definitions either built-in or available as a companion types package (for a typed {{PRIMARY_LANGUAGE}} project)
- Permissive license (MIT / ISC / Apache-2.0); flag a Critical on copyleft licenses (GPL, AGPL) when the project's license posture is incompatible with them

**Guidelines:**

- MUST verify direct-dependency quality signals before approving a new dependency, or request the author provide them.

## Postinstall and Lifecycle Scripts

Postinstall and Lifecycle Scripts review focuses on critical-severity cases where a new dependency declares a `postinstall`, `preinstall`, `prepare`, or `prepublish` script in its own manifest (visible in the lockfile) that runs a shell command, downloads a binary, or runs the runtime against an arbitrary file. Known-good binary-installer dependencies already vetted in the project are acceptable — new ones in that category need explicit justification.

**Guidelines:**

- MUST flag a Critical when a new dependency declares a `postinstall`, `preinstall`, `prepare`, or `prepublish` script in its own manifest (visible in the lockfile) that runs a shell command, downloads a binary, or runs the runtime against an arbitrary file. Already-vetted binary-installer dependencies are acceptable; new ones in that category need explicit justification.

## Platform Specificity

Platform Specificity review focuses on major-severity cases where a new dependency is platform-specific (e.g., a single-OS native module) when a platform-agnostic alternative exists. The project's deployment target and its development environment must both work.

**Guidelines:**

- MUST flag a Major when a new dependency is platform-specific (e.g., a single-OS native module) when a platform-agnostic alternative exists. The deployment platform and the development environment must both work.
- MUST flag a Major when a new dependency requires a runtime feature not present in the project's minimum supported runtime version (or in a constrained runtime such as an edge/serverless runtime, when the consuming module runs there).

## Bundling Implications

<!-- INIT:OPTIONAL key=CLIENT_BUNDLE — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*This section applies only when the project bundles code for a client/browser. Delete it during INIT for projects that ship no client bundle (e.g., a CLI or backend service).*

Bundling Implications review focuses on major-severity cases where the new dependency lacks tree-shaking support (no ESM, no `sideEffects: false`) and is imported into client-bundled code. Cross-reference with [performance-and-reliability-requirements › bundle-weight](../../performance-and-reliability-requirements/references/bundle-weight.md).

**Guidelines:**

- MUST flag a Major when the new dependency lacks tree-shaking support (no ESM, no `sideEffects: false`) and is imported into a client component or shared module that gets bundled into the client. Cross-reference with [performance-and-reliability-requirements › bundle-weight](../../performance-and-reliability-requirements/references/bundle-weight.md).
- MUST flag a Critical when a new dependency is added to the app framework's "externalize from the server bundle" list without justification — entries there are typically native or stream-based packages incompatible with the bundler.

## Transitive CVEs

Transitive CVEs describes the preferred project default: recommend the author run the package manager's audit command and report findings before merge when the diff changes the lockfile. `high` and `critical` audit severities MUST be resolved or explicitly deferred with rationale.

**Guidelines:**

- SHOULD recommend the author run the {{PACKAGE_MANAGER}} audit command and report findings before merge when the diff changes the lockfile. `high` and `critical` severities MUST be resolved or explicitly deferred with rationale.
