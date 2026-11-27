# Documentation Structure

## OKF v0.3 requirements

OKF consumers discover typed concepts, assets and reserved navigation files
within one bundle. Untyped Markdown can coexist with concepts. The format
leaves the vocabulary open, so a consumer can encounter a type it has never
seen. See the [OKF v0.3 specification](https://github.com/open-knowledge-format/open-knowledge-format/blob/527e81aff55992be21507e97004286789126f88c/SPEC.md).

**Guidelines:**

- MUST write a concept as UTF-8 Markdown with a YAML 1.2 core-schema mapping between lines containing exactly `---`. Its only universally required field is a nonempty string `type`. Keys must be unique.
- MUST reserve `index.md` and `log.md` at every depth. Nested indexes and logs have no frontmatter. An existing OKF log uses newest-first YYYY-MM-DD headings. Git-backed living docs use the commit history for changes. Leave the optional log out when bootstrapping.
- MAY declare `okf_version: "0.3"`, a title and a description on the root index. Preserve its existing frontmatter when refreshing the index.
- SHOULD edit only the metadata the change affects, preserving existing extension keys and values.

## Choose the subject

A parsing library can keep the accepted input and its error behavior under
parsing even when three modules implement it. Within a product, a capability
can own its history, sharing and platform-specific presentation. Move a common
interaction or terminology decision into shared design when independent
capabilities use it. A design system covers reusable foundations and components.

**Guidelines:**

- SHOULD start with the decision a reader brings and where they look for it. Choose the owning subject, then choose the page type by the claim it establishes.
- SHOULD distinguish caller guarantees, shared design, implementation, contributing, operations and authority where the readers and decisions differ. Use the project's names, package boundaries and depth.
- SHOULD record a [placement convention](./conventions-and-operations.md#contributor-routes) when contributors face a meaningful choice between subjects.

## Engineering defaults

These recommended types describe the decision the reader needs to make.

| Type              | Reader's decision                                                    | What belongs together                                                                                                                     |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Definition        | Does this case count, and what does the value mean?                  | A metric's population, eligibility, units, formula and weighting.                                                                         |
| Specification     | Which observable outcome may a consumer rely on?                     | Inputs, results, timing, failure behavior and guarantees for each mode.                                                                   |
| Convention        | Which practice does the team use where several satisfy the contract? | The selected practice, its reason and the alternative it rules out. Lint enforcement leaves this a convention.                            |
| Architecture      | Who owns this responsibility, and how does work cross the boundary?  | Components, control or data flow and dependencies. Identify implemented boundaries, adopted targets and illustrative examples explicitly. |
| Procedure         | Who runs this task and how do they know it succeeded?                | Entry conditions, prerequisites, ordered actions, checks and recovery.                                                                    |
| Policy (optional) | Who may authorize this action or grant an exception?                 | Shared restrictions, exception authority and reopening conditions, when governed independently of any one procedure.                      |

A table of configuration names, consumers and missing-value behavior can be a
single Specification when the reader needs those facts together.

**Guidelines:**

- SHOULD give each living page one primary type, a meaningful title and a short discovery description.
- SHOULD adopt the engineering vocabulary for a new bundle and preserve established project types and topic directories where readers or tools depend on them.

### Review the declared type

For each path in the validator's type list, write down the reader's question,
the claim this page owns and why the declared type helps the reader find that
claim. If answering requires several independent claims, identify the passages
and their owners. A project-specific name fits when readers use it for one
recognizable purpose and the page is maintained for that purpose.

Try the [type-review example](../assets/type-review-example/index.md). Both
pages have valid type strings. An editor reading their content should reach
these decisions:

| Page                                                          | Reader's question and the claim the page owns                                                                                                        | Editorial decision                                                                                                                                                                                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Notes](../assets/type-review-example/delivery-notes.md)      | How is the rate calculated? What does the API return for a zero denominator? What does the team do on Monday? Each answer can change independently.  | Flag the mixed `Description`. Put the formula in a Definition, the decimal or null return contract in a Specification, and the Monday reporting practice in a Convention. Link the pages where readers need to move between answers. |
| [Service registry](../assets/type-review-example/services.md) | Which team owns each production service today? The table owns the current service-to-team mapping and is updated as membership or ownership changes. | Accept `ServiceRegistry`. Readers can find the inventory by its established project type, and each entry answers the same question.                                                                                                  |

## The index

A scheduling index can list a Definition of retry limits beside the
Specification of what a client sees while waiting. A directory can contain
both. A root index can lead through nested indexes to either page.

**Guidelines:**

- SHOULD list concepts directly at the root while readers can select an answer there. Add a nested index when readers need to choose among a subject's subquestions. OKF permits a directory without an index.
- SHOULD link a subject index from its parent, state its scope and give each locally owned decision a descriptive route there. A caller with a specific question can link straight to the owning section.
- SHOULD keep rules at their typed owner and use indexes for navigation.
- SHOULD use Markdown links for index entries so OKF consumers can traverse them offline. An HTML link that works in a browser does not establish an OKF relationship.
- SHOULD add a page only when it owns an answer.

## The glossary

The legacy flat `specs/<domain>.md` convention pairs specs with glossary domain
headings. A typed Specification elsewhere creates no obligation to coin a term.
A glossary entry can link to a full Definition and still explain enough for a
reader to understand the word in context.

For example, **Job output** names what one Job produced, even after its record
is gone. Three near-misses narrow or shift that meaning:

| Candidate      | Likely interpretation       | Where it misleads                                          |
| -------------- | --------------------------- | ---------------------------------------------------------- |
| Output record  | A record that holds output  | Omits which job produced it.                               |
| Failure output | The output of a failed job  | Excludes successful jobs.                                  |
| Completed job  | An execution that has ended | Names the execution itself instead of what it left behind. |

**Guidelines:**

- SHOULD capture names from code, user-visible interfaces and team usage. Choose a new name whose ordinary meaning fits the concept. A plausible near-match hides the need to look it up.
- SHOULD use an optional cross-subject glossary for active aliases, UI labels and ambiguous terms. Give the minimum distinction, usually one to three sentences, and link to its owning section. Keep calculations, exceptions, procedures and guarantees at that owner.
- SHOULD explain a specialist term where its subject uses it. Group specialist terms in a subject-local Definition when readers consult them together.
- MUST account for every active alias and unique distinction when shortening a glossary, including meanings embedded in paragraphs. Move the distinction to an owner, retain a short finder or document the evidence for retirement in the change review.
- MUST preserve active spellings and disambiguation. Settle old grouping, presentation and heading compatibility [per route](./cross-references.md#preserve-the-reading-route).

## Diagrams

A state-transition diagram explains an observable contract. A diagram of the
producer and worker explains which component owns a transition.

**Guidelines:**

- SHOULD keep a diagram beside the claim it explains.
- MUST ship linked images with the bundle when readers need them offline.
