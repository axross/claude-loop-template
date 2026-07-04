# Problem Framing and Scope

Apply this reference when drafting or reviewing the part of a spec that states what is needed and why — before any UI, system-design, or implementation detail. Sourced from PRD- and requirements-writing practice: [Perforce's PRD guide](https://www.perforce.com/blog/alm/how-write-product-requirements-document-prd), [ProductPlan's problem-statement guide](https://www.productplan.com/learn/guide-to-writing-an-effective-problem-statement), [Intercom's "start with a problem statement"](https://www.intercom.com/blog/how-to-write-problem-statements/), [Product Talk on product outcomes](https://www.producttalk.org/product-outcomes/), and [Google's design-docs practice](https://www.industrialempathy.com/posts/design-docs-at-google/).

## Outcome Before Solution

A requirement earns its solution once the problem is on the page. PRD guidance converges on the same opening move: name who is affected, what is broken or missing for them, and why it matters, before naming a feature, screen, or fix ([Perforce](https://www.perforce.com/blog/alm/how-write-product-requirements-document-prd), [ProductPlan](https://www.productplan.com/learn/guide-to-writing-an-effective-problem-statement), [Miro](https://miro.com/product-development/how-to-write-problem-statement/)). Outcome-based framing — the change in user or business behavior sought — is preferred over output-based framing (the artifact being shipped), since output-only specs risk becoming a "feature factory" that ships work without moving anything real ([Inside Product](https://insideproduct.co/benefits-pitfalls-outcomes-over-outputs/), [LeadDev](https://leaddev.com/velocity/focus-outcomes-over-outputs), [Marty Cagan / SVPG](https://www.svpg.com/when-performance-is-measured-by-results/)).

**Guidelines:**

- MUST state the user-facing outcome and the problem it solves before any solution, UI, or system-design detail.
- MUST keep "how" out of this section; system design, UI mechanics, and implementation belong to their owning skills, not here.
- SHOULD frame the outcome as a change in behavior or capability, not as the artifact being built.
- SHOULD ground the problem in the underlying need it serves rather than a literal feature request, so the requirement stays stable if the chosen solution changes.

## Non-Goals and Out-of-Scope

Non-goals are a decision, not a disclaimer. Design-doc practice at Google treats "Non-Goals" as things that could reasonably have been in scope but were deliberately excluded — not a restatement of the goal in the negative ([Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/), [example design doc](https://www.industrialempathy.com/posts/design-doc-a-design-doc/)). Pairing every goal list with an equally visible non-goal list pre-empts "can we just add X" requests once work is underway ([Google eng-practices](https://google.github.io/eng-practices/)).

**Guidelines:**

- MUST write explicit non-goals or out-of-scope bullets whenever the boundary is easy to misread.
- MUST phrase each non-goal as a deliberate exclusion of something that could plausibly have been included, not as a negated goal.
- SHOULD route a later request that falls outside the stated non-goals through explicit scope evaluation rather than silently absorbing it into the current change.

## Assumptions vs. Open Questions

Assumptions and open questions are easy to conflate but serve different readers. An assumption is a stated belief the plan relies on and would need to revisit if wrong; an open question is an unresolved item that blocks confident planning until answered ([SRS practice via Jama](https://www.jamasoftware.com/requirements-management-guide/writing-requirements/how-to-write-an-effective-product-requirements-document/), [Karl Wiegers' requirements traps](http://users.csc.calpoly.edu/~csturner/courses/300f06/readings/reqtraps.pdf)).

**Guidelines:**

- MUST state assumptions and constraints the plan relies on, distinct from open questions.
- MUST NOT embed an unresolved product, scope, or platform decision silently as an assumption; ask it instead, per AGENTS.md's rule to ask a concrete question when progress depends on a product, platform, privacy, compatibility, or scope decision.
- SHOULD flag an assumption the reader is likely to disagree with rather than build around it unstated.

## Right-Sizing Scope

Formality tracks risk and reversibility, not a fixed template. Cross-team, irreversible, or high-blast-radius changes warrant a fuller spec with alternatives and non-goals; a small, easily reversible change warrants a short paragraph ([Pragmatic Engineer on RFCs and design docs](https://newsletter.pragmaticengineer.com/p/software-engineering-rfc-and-design), [project-sizing guidance](https://www.projectmanagement.com/articles/281615/Determining-the-Appropriate-Level-of-Formal-Documentation-with-Project-Sizing-)). Shape Up's appetite-first approach — fixing the time or resource budget and shaping scope to fit it — is a disciplined way to right-size scope instead of letting an open-ended feature list dictate it ([Shape Up, "Set Boundaries"](https://basecamp.com/shapeup/1.2-chapter-03), ["Decide When to Stop"](https://basecamp.com/shapeup/3.5-chapter-14)).

**Guidelines:**

- MUST right-size the section to the change: a one-line copy fix needs a short paragraph, not a multi-heading spec; a cross-cutting feature needs more.
- SHOULD add detail only as decisions stabilize rather than speculatively covering capabilities not yet needed.
- SHOULD scale formality to the change's risk and reversibility, not to a fixed section template.

## Concrete, Checkable Language

Vague quality adjectives are a measured defect, not a style nitpick: empirical requirements-smell research ties subjective terms like "user-friendly," "fast," "intuitive," or "seamless" directly to lower testability and higher downstream defect risk ([Characterizing Requirements Smells, arXiv](https://arxiv.org/pdf/2404.11106), [Requirements Smells, arXiv](https://arxiv.org/pdf/1611.08847)). Classic requirements guidance names the same failure mode as words to avoid without a measurable follow-up ([Seven Words You Can Never Use in a Requirements Specification](https://modernanalyst.com/Community/CommunityBlog/tabid/182/ID/389/Seven-Words-You-Can-Never-Use-in-a-Requirements-Specification.aspx), [Jama's do's and don'ts](https://www.jamasoftware.com/requirements-management-guide/writing-requirements/8-dos-and-donts-for-writing-requirements/)).

**Guidelines:**

- MUST replace vague quality adjectives ("user-friendly", "fast", "intuitive", "clean", "seamless") with concrete, checkable statements.
- MUST keep each requirement to one thing with only one reasonable interpretation (atomic, per [Writing Atomic Requirements](https://tynerblain.com/2006/06/14/writing-atomic-requirements/)).
- SHOULD name the exact copy, threshold, attribute, or state transition expected instead of describing a quality in the abstract.
