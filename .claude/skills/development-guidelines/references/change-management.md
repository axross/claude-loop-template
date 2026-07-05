# Change Management

Apply these rules on every task to keep changes focused, safe, and easy to review.

## Stay Within Scope

Unrequested changes enlarge the review surface and the blast radius of a task, making regressions harder to attribute and to revert.

**Guidelines:**

- MUST only make changes that are necessary to fulfil the stated task. A task boundary is the single user-facing goal described in the request.
- SHOULD flag opportunities for improvement — technical debt, naming issues, missing tests — as a written note to the user rather than making unsolicited changes.

## Make Incremental Changes

Small, independently checkable steps localize a failure to the step that introduced it, instead of hiding it in a large unverified batch.

**Guidelines:**

- SHOULD decompose large tasks into a sequence of small, independently verifiable steps.
- MUST verify each step (see [code-quality.md](./code-quality.md)) before moving on to the next. Do not accumulate unverified changes across many files before checking.

## Follow Existing Patterns

Matching the surrounding code keeps the codebase legible as one authored voice and spares reviewers from re-learning a new style with every change.

**Guidelines:**

- MUST read the code in the area you are modifying. Mimic its architecture/structure, naming conventions, and coding idioms.
- MUST search the codebase for how similar problems are already solved.
- MUST NOT silently change conventions that are already established project-wide. If there is a compelling reason to change a convention, surface it to the user first.

## Adding Dependencies

Each dependency is a standing cost — maintenance, supply-chain surface, and bundle weight — carried for the life of the project, so the bar to add one is high.

- When you are adding a new dependency,
  - MUST explore a couple of packages as options, and
  - MUST prefer platform-agnostic packages over platform-specific ones.
  - MUST prefer more popular, well-tested and maintained packages.

**Guidelines:**

- SHOULD NOT add a new dependency when the task can be reasonably accomplished with the packages already in the project's manifest, or with built-in language/platform APIs.
- MUST add dependencies through {{PACKAGE_MANAGER}} rather than editing the manifest by hand, so the lockfile stays consistent.

## Modifying the Data Layer / Generated Code

<!-- INIT:OPTIONAL key=DATA_LAYER — keep & fill the token (add the tool, INIT Step 5) OR delete this section. -->
*If this project has no {{CMS_OR_DATA_LAYER}} or other schema-bound generated code, delete this section during INIT.*

A schema change without its migration leaves every other environment on the old schema, so what works locally breaks on the next deploy or fresh checkout.

- Schema-bound code paths (data-layer schema definitions, generated types, and migration files) require a migration step only when the change alters the underlying schema — adding, removing, or renaming fields/entities, or changing field types. Behavioral changes that do not touch the schema do not.
- Some files under the data layer are generated or vendor-managed and are overwritten on upgrades. Do NOT hand-edit generated/vendor-managed files; change the source-of-truth definitions instead. Identify which directories are generated during INIT.

**Guidelines:**

- MUST create or regenerate a data-layer schema migration immediately after changing the schema, then apply it locally before testing (see [dev-commands.md](./dev-commands.md) for the relevant commands).
- MUST NOT modify an already-applied migration file. Create a new migration instead.
- MUST NOT hand-edit generated or vendor-managed files; they will be overwritten on upgrades.
