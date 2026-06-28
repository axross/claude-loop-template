# Change Management

Apply these rules on every task to keep changes focused, safe, and easy to review.

## Stay Within Scope

Stay Within Scope sets the required project default: only make changes that are necessary to fulfil the stated task. A task boundary is the single user-facing goal described in the request.

**Guidelines:**

- MUST only make changes that are necessary to fulfil the stated task. A task boundary is the single user-facing goal described in the request.
- SHOULD flag opportunities for improvement — technical debt, naming issues, missing tests — as a written note to the user rather than making unsolicited changes.

## Make Incremental Changes

Make Incremental Changes describes the preferred project default: decompose large tasks into a sequence of small, independently verifiable steps.

**Guidelines:**

- SHOULD decompose large tasks into a sequence of small, independently verifiable steps.
- MUST verify each step (see [code-quality.md](./code-quality.md)) before moving on to the next. Do not accumulate unverified changes across many files before checking.

## Follow Existing Patterns

Follow Existing Patterns sets the required project default: read the code in the area you are modifying. Mimic its architecture/structure, naming conventions, and coding idioms.

**Guidelines:**

- MUST read the code in the area you are modifying. Mimic its architecture/structure, naming conventions, and coding idioms.
- MUST search the codebase for how similar problems are already solved.
- MUST NOT silently change conventions that are already established project-wide. If there is a compelling reason to change a convention, surface it to the user first.

## Adding Dependencies

Adding Dependencies marks a discouraged project pattern: add a new dependency when the task can be reasonably accomplished with the packages already in the project's manifest, or with built-in language/platform APIs.

- When you are adding a new dependency,
  - MUST explore a couple of packages as options, and
  - MUST prefer platform-agnostic packages over platform-specific ones.
  - MUST prefer more popular, well-tested and maintained packages.

**Guidelines:**

- SHOULD NOT add a new dependency when the task can be reasonably accomplished with the packages already in the project's manifest, or with built-in language/platform APIs.
- MUST add dependencies through {{PACKAGE_MANAGER}} rather than editing the manifest by hand, so the lockfile stays consistent.

## Modifying the Data Layer / Generated Code

*If this project has no {{CMS_OR_DATA_LAYER}} or other schema-bound generated code, delete this section during INIT.*

Modifying the Data Layer sets the required project default: when a change alters the data/content layer's schema, regenerate or create the corresponding migration immediately, then apply it locally before testing.

- Schema-bound code paths (data-layer schema definitions, generated types, and migration files) require a migration step only when the change alters the underlying schema — adding, removing, or renaming fields/entities, or changing field types. Behavioral changes that do not touch the schema do not.
- Some files under the data layer are generated or vendor-managed and are overwritten on upgrades. Do NOT hand-edit generated/vendor-managed files; change the source-of-truth definitions instead. Identify which directories are generated during INIT.

**Guidelines:**

- MUST create or regenerate a data-layer schema migration immediately after changing the schema, then apply it locally before testing (see [dev-commands.md](./dev-commands.md) for the relevant commands).
- MUST NOT modify an already-applied migration file. Create a new migration instead.
- MUST NOT hand-edit generated or vendor-managed files; they will be overwritten on upgrades.
