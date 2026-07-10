# Scope Discipline

Apply these rules to verify the diff is exactly what the stated task required — nothing more, nothing less.

## In-Scope vs Out-of-Scope

Every changed file a reviewer cannot trace back to the stated goal widens the review surface and the blast radius of a regression.

**Guidelines:**

- MUST identify the stated user goal (from the PR description, commit message, or the task the user gave the reviewer) and confirm every changed file traces back to that goal.
- MUST flag any drive-by change — a renamed unrelated variable, a refactor of an untouched file, a formatter change to a file that did not need to be edited — as Minor scope creep, per the project's development guidelines (change-management rules).
- MUST NOT itself extend the review into pre-existing concerns; surface them under "Pre-existing Observations" per the project's code-review guideline (evidence rules).

## YAGNI

An abstraction introduced before a second caller exists guesses at a shape the future may never need, paying indirection now for a payoff that may never come.

**Guidelines:**

- MUST flag a new abstraction (a new helper, a new data-access function, a new component prop, a new generic type parameter) that has only **one** caller in the diff and no documented future caller. Inline it.
- MUST flag a new configuration option (a new prop, a new function argument, a new environment variable) added "just in case" with no live consumer.
- MUST flag speculative type widening — e.g., a function signature changed from `(id: string)` to `(id: string | string[])` when no caller passes an array.

## DRY (Done Right)

Genuine duplicates of a single concern drift apart the moment one copy is updated and the others are forgotten.

**Guidelines:**

- SHOULD flag two or more code blocks in the diff that are byte-for-byte (or near-identical) duplicates **of the same concern**. Extract a helper.
- MUST NOT recommend extracting a helper when two blocks are coincidentally similar but represent different concerns (e.g., a logger child and an analytics tracker that both happen to take a `module` parameter). Coupling unrelated callers is worse than the duplication.
- SHOULD prefer "rule of three" — duplication is a smell after the third occurrence, not the second.

## KISS

Code is read far more often than it is written, so a line that takes ten seconds to decode taxes every future reader.

**Guidelines:**

- SHOULD flag a clever one-liner that requires more than ten seconds to parse when a multi-line, named-step version would read cleaner.
- SHOULD flag a regex used for a string operation that a clearer standard-library call (e.g., string split or a URL parser) can express more readably. (Note: do not flag a regex used for a tightly-bounded match where it is genuinely the clearest tool.)
- SHOULD flag a new generic type parameter on a function with one concrete usage — replace with the concrete type.

## SOLID Applied to Component Trees

A component that owns several unrelated entities couples their fetches, so one slow or failing entity holds up everything the component renders.

**Guidelines:**

- SHOULD flag a server-side component whose responsibility extends across multiple unrelated entities (e.g., one component that fetches a record **and** the site settings **and** the tag list). Split per concern; each child gets its own loading/streaming boundary, per the project's own component skill, if defined.
- MUST flag a server-side component that **mutates** data — data-access modules are read-only. Mutations belong in request handlers or the data layer's own lifecycle hooks.
- SHOULD flag a loading/placeholder component that depends on the loaded data shape (defeats the loaded/loading split) — the loading skeleton must render with no data.

## Diff Size

The more unrelated ground one diff covers, the more likely a real defect slips past the reviewer unnoticed.

**Guidelines:**

- SHOULD flag a single PR/diff that touches more than ~15 unrelated files or more than ~600 lines net change as Minor "consider splitting". Large diffs increase the chance the reviewer misses something. Defer the split decision to the human owner per the project's code-review guideline (escalation rules).
