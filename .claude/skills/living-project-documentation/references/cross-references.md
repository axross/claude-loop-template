# Cross-References

Apply this reference when deciding whether one document should link to another,
or when reviewing a `docs/` tree whose links have multiplied.

## The Rule

A link is a cross-reference that rots independently of the prose around it: the
sentence stays true while the target moves, is renamed, or stops being current.
That cost buys navigation, so it is worth paying only where navigation is not
already free.

> **A link exists only where it carries information the structure does not
> already encode.**

One test, applied to every reference `docs/` can contain:

| Reference                  | Does structure already encode it?                         | Verdict                                                  |
| -------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| `index.md` → each document | No — reachability lives nowhere else                      | **Link.** This is how the index invariant is implemented |
| `glossary.md` → `specs/`   | Yes — the heading a term sits under names its spec        | No link                                                  |
| Within `glossary.md`       | The file is small enough to read whole                    | No link; bold marks a defined term                       |
| `specs/` → `specs/`        | No — a dependency between domains is written nowhere else | **Link**, for a genuine dependency                       |
| A constraint → its reason  | Yes — the reason is the prose beside the constraint       | No link                                                  |

One case earns a link that the index does not already carry, and it is the one
the structure genuinely cannot express: a dependency between domains appears in
no directory listing and in no index line. A constraint's reasoning is not a
second case, because it is not somewhere else — it is written into the document
that states the constraint, where a reader meets it without deciding whether to
follow anything.

**Guidelines:**

- MUST apply the rule above before adding any cross-reference, and leave the
  link out when the answer is that structure already says it.
- MUST use a relative path from the linking document, so `docs/` stays
  correct when read from a checkout rather than a rendered site.
- MUST NOT link to a heading with a fragment. An agent reads whole files rather
  than navigating to anchors, so the fragment is never consumed, while it
  couples the link to heading text that a rewording silently breaks.

## Between Specs

A dependency is the condition, and it is narrower than a mention. Two domains
that merely use the same noun are related through the glossary, which is what
the glossary is for.

**Guidelines:**

- MUST link one spec to another only where the other domain's behaviour is a
  **precondition** for this one — the rule here cannot be stated or verified
  without it.
- MUST NOT link because a term appears in the prose; define the term in the
  glossary instead.
- SHOULD state the dependency in the sentence rather than leaving a bare link,
  so a reader learns what the other domain contributes without opening it.

## Why a Constraint Does Not Link Out

A reader asking "why is it done this way?" is reading the rule when the question
occurs to them, and a link answers it by sending them somewhere else to find out.
The reasoning goes in the sentences around the rule instead — which is also what
keeps the two in step, since a change that overturns the rule is editing the
paragraph the reasoning sits in.

The cost this avoids is the one a separate rationale document always charges: a
link that still resolves while what it points at no longer holds. Nothing
resolves, so nothing can resolve staler than the prose around it.

**Guidelines:**

- MUST write a constraint's reasoning into the document that states the
  constraint, next to it, rather than linking out to a document that holds
  reasoning.
- MUST NOT restate a constraint in a second document and link the two; the
  document that governs the subject states it once, and the other refers to that
  document in prose if it must.

## Co-located Bodies

Once `docs/` also holds `conventions/` or `operations/` —
[the shape documentation-structure.md names](./documentation-structure.md) —
a link can point into either without changing the rule that decides whether
one belongs.

| Reference                                  | Does structure already encode it? | Verdict                                                                                                          |
| ------------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `specs/` → `conventions/` or `operations/` | —                                 | Governed by [The Rule](#the-rule) alone; this capability adds no dependency condition for a body it does not own |
| `conventions/` ↔ `operations/`             | —                                 | Governed by [The Rule](#the-rule) alone, the same way                                                            |

**Guidelines:**

- MUST NOT state a dependency condition for a link from `specs/` into
  `conventions/` or `operations/`, or between those two; [The Rule](#the-rule)
  alone decides it, and this capability owns no further condition for a body
  it does not own.
- MUST apply [Why a Constraint Does Not Link Out](#why-a-constraint-does-not-link-out)
  to a document under `conventions/` or `operations/` exactly as to a spec: its
  rules carry their own reasoning, and neither body links out to find any.
