# Validators

Apply this reference when running the bundled checks, wiring them into a
project's own gate, or judging whether a proposed check belongs here.

## Three Commands, Three Questions

Each command answers one question, tied to one kind of change the author just
made. None is a general "check the docs" pass, because a general pass makes an
author who touched one spec read findings about everything else.

| Run it after                  | Command                | Reports                                  |
| ----------------------------- | ---------------------- | ---------------------------------------- |
| Adding or removing a document | `check-index.mjs`      | a document not listed in `index.md`      |
| Editing any document          | `check-references.mjs` | a relative link that does not resolve    |
| Adding or renaming a spec     | `check-glossary.mjs`   | a spec with no matching glossary heading |

```bash
node <skill>/scripts/check-references.mjs           # defaults to ./docs
node <skill>/scripts/check-references.mjs app/docs  # or name the docs directory
node <skill>/scripts/check-references.mjs --help    # names the other two
```

Each exits **0** when it passes or has nothing to check, **1** on findings, and
**2** on a bad invocation.

**There is no run-all script.** Adding one restores the bundled command the
split exists to remove, and it is the shell's job anyway:

```bash
for check in <skill>/scripts/check-*.mjs; do node "$check" || failed=1; done
```

**Guidelines:**

- MUST run every command whose subject a change touched, and fix what they
  report before calling the change done.
- SHOULD wire all three into the project's own merge gate. They are offline and
  deterministic, which is what a gate needs.

## The Two-Level Opt-In

`index.md` is the marker that a project has adopted `docs/` at all. Without it
every command exits 0 and reports nothing — installing this skill must never
turn red a `docs/` directory that holds something else entirely. Within an
adopted `docs/`, each command additionally does nothing when its own subject is
absent: no `specs/` leaves the glossary pairing with nothing to pair.

**Guidelines:**

- MUST create `index.md` as the deliberate act of adopting `docs/`; until it
  exists the checks are inert by design, not misconfigured.
- MUST NOT make a command fail on an absent subject. A project whose `docs/`
  holds no `specs/` yet has not failed a check; it has not written one.
- MUST treat a document under `conventions/` or `operations/` as in scope for
  `check-index.mjs` exactly as a spec — see
  [conventions-and-operations.md](./conventions-and-operations.md#what-the-validators-see)
  for the full picture across all three commands.

## Why No Defect Is Reported Twice

Two boundaries were drawn deliberately, and a change to these commands must
preserve them:

- **Resolution versus listing.** `check-references.mjs` owns whether a link
  resolves — including `index.md`'s own entries. `check-index.mjs` owns whether
  an existing file is listed. A missing target is a broken link; an unlisted
  file is an orphan; neither command reports the other's finding.
- **Pairing versus listing.** `check-glossary.mjs` owns whether a spec has a
  vocabulary heading. Whether either file is reachable from `index.md` is
  `check-index.mjs`'s question, and neither command answers the other's.

## What These Deliberately Do Not Check

A check earns its place when the defect it finds is **not visible in the text
its author just wrote** — because it spans files, because it counts, or because
it compares bytes. Four things fail that test and are left to a reader:

| Not checked                                   | Why                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| Whether a document matches the implementation | Undecidable. A checker that guessed would be trusted and wrong                       |
| Whether a glossary entry is self-sufficient   | A judgment about a reader, not a property of the text                                |
| Whether a term's words compose to its entry   | A reading of ordinary English, not a property of the text                            |
| A duplicated glossary heading                 | An ambiguity for a human; it corrupts no other check, since both headings still pair |
| Whether a constraint states why it holds      | No checker can tell prose that explains a rule from prose that merely sits beside it |

The last row is the one worth naming rather than leaving implied. Every rule
under `docs/` is supposed to carry its own reasoning — that is what this tree
has instead of a separate body of rationale — and the only thing that can see
whether a given rule does is a reader.

**Guidelines:**

- MUST NOT add a check for a defect visible in the file its author just wrote,
  unless it guards another check's input or a reference stability `docs/`
  depends on — and MUST state which, where the check is defined.
- MUST NOT add a check that compares documentation against implementation. The
  comparison is undecidable, and a confident wrong answer is worse than no
  answer.
- MUST NOT introduce a warning severity. A warning that fires routinely is one
  people stop reading, which costs more than the finding was worth.
