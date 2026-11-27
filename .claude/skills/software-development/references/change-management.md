# Change Management

Apply these rules on every task to keep changes focused, safe, and easy to review.

## Stay Within Scope

Unrequested changes enlarge the review surface and the blast radius of a task, making regressions harder to attribute and to revert.

**Guidelines:**

- MUST only make changes that are necessary to fulfil the stated task. A task boundary is the single user-facing goal described in the request.
- MUST preserve existing behavior and routing during refactors unless the requested change intentionally modifies them.
- SHOULD flag opportunities for improvement — technical debt, naming issues, missing tests — as a written note to the user rather than making unsolicited changes.

## Choose a Causal Correction

A review fix is another implementation decision, not an instruction to patch the cited line. [SRE troubleshooting](https://sre.google/sre-book/effective-troubleshooting/) starts with expected and observed behavior and tests explanations; [refactoring workflows](https://martinfowler.com/articles/workflowsOfRefactoring/fallback.html) keep preparatory, behavior-preserving changes separate from behavior changes. The aim is the smallest coherent correction that satisfies the task, not the fewest edited lines or a speculative redesign.

When interpreting feedback or resolving uncertain intent, consult the project's conduct practices for feedback judgment where present. Without conduct practices for feedback judgment, use the following steps:

1. Separate the observation, explanation, and suggestion.
2. Check the factual premises of each.
3. Return unresolved human tradeoffs rather than treating a proposed fix as a new requirement.

Detailed design choices remain with the applicable maintainability and domain practices where present; their absence is not a reason to introduce speculative abstractions.

**Examples:**

> **Shared cause:** A chart and an export both misread timestamps. Tracing confirms their shared decoder mixes seconds with milliseconds. Correct that conversion at its owner rather than multiplying values separately in each consumer; verify both consumers and the already-correct input variant. A shared symptom alone would not establish a shared cause.

> **Mechanical fix:** A documentation link still names a renamed target. Correct the link and check its destination. No architectural investigation or invented competing explanation is needed.

> **Urgent mitigation:** An authorized temporary feature disable stops harmful writes while diagnosis continues. Record what it prevents, what remains unresolved, and how resolution will be verified; the stopped symptom alone does not establish a permanent fix.

**Guidelines:**

- MUST trace a consequential correction from the expected and observed behavior to an evidenced failure mechanism and its owning responsibility before choosing a permanent remedy; urgent mitigation can precede complete diagnosis, and a cited line or failing check alone does not establish the owner.
- SHOULD prefer a correction to that mechanism over compensations in its consumers, comparing credible remedies against required behavior, scope, complexity, and regression risk. A guard, retry, or adapter is appropriate when the actual contract and failure mechanism justify it.
- MUST NOT add an exception, suppression, or relaxed test expectation solely to hide the symptom or satisfy the review; a changed expectation needs independent support from the intended contract, not the output of the proposed implementation.
- SHOULD address a verified shared cause with one coherent correction rather than independent symptom patches. The project's review-disposition practices, where present, still own each finding's identity and resolution evidence; without them, account for each concern in the response.
- MUST distinguish temporary mitigation from verified resolution, retaining its limits and unresolved risk under the work's existing reporting and authority rules.

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
- MUST add dependencies through npm rather than editing the manifest by hand, so the lockfile stays consistent.
