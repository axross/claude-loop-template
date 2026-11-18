# Bootstrapping docs/

Apply this reference when a project has no `docs/` tree of its own and one is
being started.

## Detect Before Proposing

A project that already documents something has already made choices, and those
choices are usually load-bearing for people who are not in the room. The default
shape is what to propose in the absence of a convention, never what to impose
over one.

That default is not the same as an accident. A `docs/` directory naming
`conventions/` or `operations/` as siblings of `specs/`, with an index that
says as much, is
[the shape documentation-structure.md names](./documentation-structure.md)
when adopted on purpose, and detecting it means detecting all of `docs/`
rather than stopping at `specs/` alone.

**Guidelines:**

- MUST look for an existing convention first — a `docs/` directory, a wiki
  export, a long `README` section, an `adr/` or `decisions/` directory — and
  adopt its layout and naming where one exists.
- MUST leave documentation that is out of scope exactly where it is,
  distinguishing a `docs/` directory that merely shares its name — no
  `conventions/` or `operations/` siblings, no index naming them — from a
  `docs/` tree adopted on purpose. Where it merely shares the name: adding an
  index beside it does not bring it into scope, and rewriting it is not this
  capability's business.
- MUST ask before relocating or restructuring anything that already exists.
  Where `docs/` lives is a project decision with consequences for links,
  bookmarks, and tooling nobody in the session can see.
- MUST leave an existing decision log — `adr/`, `decisions/`, however it is
  named or numbered — exactly where it is. This capability writes no such body
  and converting one invalidates every reference already pointing into it,
  which is a cost with no matching benefit; a constraint settled after
  adoption goes to the document that governs it, per
  [Settled Decisions](../SKILL.md#settled-decisions), rather than to the log.

## The Smallest `docs/` Worth Having

Adoption fails when it starts as a template to fill. A handful of files, each
with real content, beat a complete tree of headings with nothing under them.

Write in this order:

1. **`index.md`** — the adoption marker. Until it exists there is no `docs/`
   the bundled validators recognize, and they stay silent.
2. **`specs/<domain>.md` for one domain** — the one whose behaviour is most
   often asked about, or most often got wrong. State the domain's boundary and
   what it deliberately does not do alongside what it does; the boundary is
   the part people disagree about, so it is worth settling in the first spec
   rather than deferred to a document written later.
3. **`glossary.md`** — seeded from that spec's own vocabulary.
4. **`conventions/` or `operations/`** — from the first rule or procedure a
   contributor actually needs, not backfilled from what the project imagines
   it does.

**Guidelines:**

- MUST create `index.md` first, and add a line to it for each document as it is
  written rather than afterwards.
- MUST NOT scaffold empty files or heading-only documents. An empty document is
  indistinguishable from a subject nobody has considered, and it makes the index
  claim coverage `docs/` does not have.
- MUST NOT backfill rationale for choices already made. Reconstructed
  reasoning is a guess presented as history; a constraint whose reason nobody
  in the room can state is written as the constraint alone, and the gap is
  left visible rather than filled in.
- SHOULD grow `docs/` one domain at a time, as changes touch each area, rather
  than in a single documentation push that nobody has a reason to keep
  current.

## Seeding the Glossary

The vocabulary already exists — in type names, table names, route segments, and
the words the team uses in review. Writing it down is a matter of collecting and
reconciling it, not inventing it.

**Guidelines:**

- MUST take terms from the code and the team's own usage, and record the term
  the product actually uses even where it is imperfect.
- MUST record a conflict rather than silently resolving it. Where the code says
  `Account` and people say "workspace", that divergence is the single most
  useful thing the glossary can surface, and picking one quietly hides it.
- SHOULD stop at the terms a newcomer would have to infer. A glossary that
  defines every noun is one nobody finishes reading.

## What Not to Import

| Tempting to move in                          | Why it stays out                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| README, setup, commands, deployment runbooks | Contributor documentation; belongs under `conventions/` or `operations/` if the project adopts that shape, never `specs/` |
| Roadmap, upcoming work, deprecation plans    | A spec is the present tense; a plan owns the future                                                                       |
| API reference generated from source          | Generated output goes stale differently and is better regenerated than restated                                           |
| Meeting notes, incident timelines            | History, not steady state; the governing document carries the part that still constrains                                  |

**Guidelines:**

- MUST keep a spec to the present tense of the product. Anything describing
  what will change belongs to a plan.
- SHOULD extract the constraint an incident or a long discussion settled into
  the document that governs its subject, with the reason it holds, and leave
  the narrative where it is.
