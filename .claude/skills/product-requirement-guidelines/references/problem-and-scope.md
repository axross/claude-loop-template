# Problem Framing and Scope

Apply this reference when drafting or reviewing the parts of a spec that state what is needed and why — before any UI, system-design, or implementation detail. It owns the craft of the canonical plan's **Summary** and **Background** sections (with Background's **Goals**, **Non-goals**, and **Assumptions** subsections) and its **Open questions** section. Sourced from PRD- and requirements-writing practice: [Perforce's PRD guide](https://www.perforce.com/blog/alm/how-write-product-requirements-document-prd), [ProductPlan's problem-statement guide](https://www.productplan.com/learn/guide-to-writing-an-effective-problem-statement), [Intercom's "start with a problem statement"](https://www.intercom.com/blog/how-to-write-problem-statements/), [Product Talk on product outcomes](https://www.producttalk.org/product-outcomes/), and [Google's design-docs practice](https://www.industrialempathy.com/posts/design-docs-at-google/).

## Summary

The Summary is one standalone paragraph at the top of the plan that a reader can absorb without scrolling further: what the change is, who it is for, and the outcome it produces. It is the whole plan in miniature, not a teaser — a reader who stops after the Summary should still know what will land and why.

**Guidelines:**

- MUST open the plan with a single self-contained paragraph stating the change, its audience, and the outcome it produces, understandable without reading any later section.
- MUST keep the Summary to the outcome, not the mechanics; the *how* belongs to Functional requirements and the implementation skills.
- SHOULD write the Summary last, once the rest of the plan has settled, so it reflects the plan as it stands rather than as first imagined.

## Outcome Before Solution

A requirement earns its solution once the problem is on the page. PRD guidance converges on the same opening move: name who is affected, what is broken or missing for them, and why it matters, before naming a feature, screen, or fix. Outcome-based framing — the change in user or business behavior sought — is preferred over output-based framing (the artifact being shipped), since output-only specs risk becoming a "feature factory" that ships work without moving anything real.

**Guidelines:**

- MUST state the user-facing outcome and the problem it solves before any solution, UI, or system-design detail.
- MUST keep "how" out of this section; system design, UI mechanics, and implementation belong to their owning skills, not here.
- SHOULD frame the outcome as a change in behavior or capability, not as the artifact being built.
- SHOULD ground the problem in the underlying need it serves rather than a literal feature request, so the requirement stays stable if the chosen solution changes.

## Background and Goals

Background gives a reader the context the change assumes — the current state, the constraint or trigger that makes it worth doing now — and then states the **Goals** as the concrete, checkable ends the change must achieve. Goals are the positive counterpart to Non-goals: each goal is an outcome the finished change is measured against, phrased so its achievement is observable rather than aspirational. Google's design-doc practice pairs context with explicit goals for exactly this reason — the goals are what the rest of the document is held to.

**Guidelines:**

- MUST state the background a reader needs to understand *why now* — the current state and the trigger or constraint prompting the change — without restating the whole problem history.
- MUST list Goals as concrete, checkable outcomes the change must achieve, each one an end a reviewer can confirm was met, per [Concrete, Checkable Language](#concrete-checkable-language).
- MUST keep Goals distinct from the solution: a goal is an outcome, not a task list or a chosen mechanism.
- SHOULD pair every Goals list with the Non-goals list below, since the boundary between them is what pre-empts scope creep.

## Non-Goals and Out-of-Scope

Non-goals are a decision, not a disclaimer. Design-doc practice at Google treats "Non-Goals" as things that could reasonably have been in scope but were deliberately excluded — not a restatement of the goal in the negative. Pairing every goal list with an equally visible non-goal list pre-empts "can we just add X" requests once work is underway.

**Guidelines:**

- MUST write explicit non-goals or out-of-scope bullets whenever the boundary is easy to misread.
- MUST phrase each non-goal as a deliberate exclusion of something that could plausibly have been included, not as a negated goal.
- SHOULD route a later request that falls outside the stated non-goals through explicit scope evaluation rather than silently absorbing it into the current change.

## Assumptions

Assumptions are the Background subsection that records the beliefs the plan relies on — things taken as true so the plan can proceed, each one a candidate to revisit if it turns out false. They are distinct from open questions: an assumption is a belief the plan *acts on* now; an open question is an unresolved item that must be *answered* before the plan is confident (see [Open Questions](#open-questions) below).

**Guidelines:**

- MUST state the assumptions and constraints the plan relies on as an explicit Background subsection, distinct from open questions.
- MUST NOT embed an unresolved product, scope, or platform decision silently as an assumption; move it to Open questions and ask it, per AGENTS.md's rule to ask a concrete question when progress depends on a product, platform, privacy, compatibility, or scope decision.
- SHOULD flag an assumption the reader is likely to disagree with rather than build around it unstated.

## Open Questions

Open questions are the plan's final section: the unresolved items that need an answer — from a human, a stakeholder, or further investigation — before the affected part of the plan is settled. Keeping them in one visible place, rather than scattered through the prose or silently resolved as assumptions, is what lets a reviewer see exactly what is still undecided and who must decide it.

**Guidelines:**

- MUST collect every unresolved decision the plan depends on into the Open questions section, rather than burying it in another section or resolving it silently as an assumption.
- MUST phrase each open question so its answer is actionable — name the decision, the options if known, and who or what resolves it — not a vague "TBD".
- MUST leave the section empty (or omit it with a stated reason) only when nothing is genuinely unresolved; a plan with real open questions and no Open questions section is incomplete.
- SHOULD promote an open question to a blocking clarification when the plan cannot be responsibly built until it is answered, rather than proceeding on a guess.

## Right-Sizing Scope

Formality tracks risk and reversibility, not a fixed template. Cross-team, irreversible, or high-blast-radius changes warrant a fuller spec with alternatives and non-goals; a small, easily reversible change warrants a short paragraph. Shape Up's appetite-first approach — fixing the time or resource budget and shaping scope to fit it — is a disciplined way to right-size scope instead of letting an open-ended feature list dictate it.

**Guidelines:**

- MUST right-size the section to the change: a one-line copy fix needs a short paragraph, not a multi-heading spec; a cross-cutting feature needs more.
- SHOULD add detail only as decisions stabilize rather than speculatively covering capabilities not yet needed.
- SHOULD scale formality to the change's risk and reversibility, not to a fixed section template.

## Concrete, Checkable Language

Vague quality adjectives are a measured defect, not a style nitpick: empirical requirements-smell research ties subjective terms like "user-friendly," "fast," "intuitive," or "seamless" directly to lower testability and higher downstream defect risk. Classic requirements guidance names the same failure mode as words to avoid without a measurable follow-up.

**Guidelines:**

- MUST replace vague quality adjectives ("user-friendly", "fast", "intuitive", "clean", "seamless") with concrete, checkable statements.
- MUST keep each requirement to one thing with only one reasonable interpretation (atomic: one requirement, one interpretation).
- MUST name the exact copy, threshold, attribute, or state transition expected instead of describing a quality in the abstract.
