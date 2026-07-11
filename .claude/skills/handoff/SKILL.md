---
name: handoff
description: Suspend this session's in-progress work into a self-contained, downloadable handoff package — a handoff-<unix epoch>.md document plus an optional same-epoch .zip of patches and artifacts — that a fresh-context agent session takes over with /address continue.
when_to_use: Invoke when the human wants to stop working here and let another session pick the work up — "hand this off", "wrap this up for another session", "package this up so we can continue later". It suspends at the nearest safe boundary and captures state; it never finishes, commits, or pushes the work. Takes no arguments.
argument-hint: (takes no arguments)
user-invocable: true
---

<!-- INIT:OPTIONAL key=SESSION_HANDOFF — Fixed Claude Code workflow entry-point skill for cross-session work handoff. INIT KEEPS this file (never deletes it): the /address and /handoff skills are fixed infrastructure, see INIT.md Step 4. No token to fill and no keep-or-delete decision — just delete this marker, and swap the named Claude Code tools (e.g. `AskUserQuestion`, `SendUserFile`) for the harness's equivalents if they differ. The take-over side lives in `/address continue` ([the address skill](../address/SKILL.md)), which is also fixed. -->

You are the `/handoff` driver. This skill suspends one unit of in-progress work at a session boundary: the outgoing session freezes its state into a self-contained package the human can download. Taking the work over is **not** this skill's job — a fresh-context session, with zero shared context, rebuilds that state and continues the work when the human attaches the package there and sends `/address continue` (see [the address skill](../address/SKILL.md)).

Target: `$ARGUMENTS`

## Argument Resolution

| Argument | Meaning | Entry |
| -------- | ------- | ----- |
| *(empty)* | Suspend the current work immediately and produce the handoff package | [Wrap Up](#wrap-up) |
| `continue` | Retired take-over invocation | Neither wrap up nor take over. Tell the human that taking over a handoff now runs through `/address continue` — start a fresh session, attach the handoff file(s), and send `/address continue` — then stop. |
| anything else | Ambiguous | Ask what was meant (see [Asking the Human](#asking-the-human)) |

## Wrap Up

### Suspend first

- MUST stop the in-flight work at the nearest safe boundary the moment this skill is invoked: let the current tool action finish or abort cleanly, then make no further progress on the task and start nothing new. Producing the handoff package is the session's only remaining job.
- MUST NOT "quickly finish" a to-do, refactor, commit, push, or otherwise change repository state as part of wrapping up — the successor inherits the work exactly as it stands. Capture, don't complete.

### Collect the session state

Reconstruct, from this session's own history:

- the original request and how it evolved — scope changes, human decisions and their answers;
- what has been done, what remains, and what is blocked;
- the repository state: current branch, `HEAD` short hash, upstream/push status (`git log --oneline @{u}..` when an upstream exists), and the full `git status` picture — staged, unstaged, and untracked files;
- every artifact the session created outside the repository's committed tree: scratch scripts, generated reports, downloaded fixtures, screenshots, notes.

Resolve the timestamp once — `date +%s` — and reuse that single epoch value in both file names below so the pair is unambiguous.

### Write `handoff-<unix epoch>.md`

Create a single comprehensive markdown document in a working location outside the repository checkout (the harness's scratchpad or temp directory). This document is the package contract the successor's `/address continue` take-over ingests — its structure is load-bearing, not advisory.

- MUST contain these sections, in this order. The two marked *(if applicable)* MAY be omitted when genuinely empty; every other section is required:
  1. **Quick summary** — 2–4 sentences: what the work is, where it stands, and the single next action.
  2. **Background** — the context a zero-context agent needs: the repository and its purpose, the original request (verbatim where the wording matters), and the constraints and decisions that shaped the approach.
  3. **Goal** — the definition of done: the outcome the work must achieve and the acceptance criteria to verify against.
  4. **Precondition** *(if applicable)* — everything the successor must have or do before resuming: repository, branch, and expected `HEAD`; each file in the zip and how to apply or use it; tools, environment variables, or credentials to obtain (named, never valued — see the zip rules); commands to run first.
  5. **Concerns and/or blockers** *(if applicable)* — open questions awaiting a human decision, known risks, failing checks, flaky behavior, and anything the successor should distrust.
  6. **To-dos** — every work item as a checkbox in execution order, each self-contained enough to act on without further context. MUST mark every item explicitly complete (`- [x]`) or incomplete (`- [ ]`); an unmarked or ambiguous item is a defect.
  7. **History/transition in the session** — a chronological account of the session: what was tried, what worked, what failed and *why* (so the successor does not repeat dead ends), key findings, ending at the exact point of suspension.
- MUST be fully self-contained: readable by an agent with no access to this conversation. Never write "as discussed above" or point into the session transcript — restate what matters.
- MUST use repository-relative paths for files in the checkout, and name branches, commands, files, and people explicitly.
- SHOULD name the GitHub issue or pull request the work is anchored to, when one exists, in **Background** — the take-over side uses it to re-enter the delivery flow at the right phase.

### Package supportive files into `handoff-<unix epoch>.zip`

- Gather what the successor cannot recover from the repository's remote alone:
  - all uncommitted changes as one patch — `git diff --binary HEAD > uncommitted.patch` (apply with `git apply`);
  - unpushed local commits as mailbox patches — `git format-patch @{u}..` when an upstream exists, or from the merge-base with the default branch otherwise (apply with `git am`) — since a successor working from a fresh clone would otherwise lose them;
  - untracked files that belong to the work, and the session artifacts collected above.
- If any such files exist, MUST bundle them into a single `handoff-<unix epoch>.zip` (same epoch as the document) — with the `zip` CLI, or `python3 -m zipfile` when `zip` is unavailable — and enumerate every entry and its purpose in the document's **Precondition** section.
- If none exist, skip the zip and state in the document that the markdown file is the complete package.
- MUST NOT include secrets in the zip — no `.env*` files, tokens, or credentials. Name what the successor must obtain in **Precondition** instead.
- MUST NOT commit the handoff document, the zip, or anything inside it to the repository.

### Deliver and stop

- MUST provide the markdown document — and the zip, when one was created — to the human as downloadable files via the harness's file-delivery tool (in Claude Code, `SendUserFile`). If the harness has no such tool, print the absolute paths and how to retrieve them.
- Tell the human how to resume: start a new agent session, attach or upload the file(s), and send `/address continue` — the take-over flow in [the address skill](../address/SKILL.md) rebuilds the state from the package and continues the work.
- Then end the turn. The work is suspended; do not resume it in this session unless the human asks.

## Asking the Human

Wrap-up runs into ambiguity of its own: an unclear argument, uncertainty about which artifacts belong to the work, or doubt about whether a to-do was actually completed.

- MUST route every such decision through the harness's dedicated question tool (in Claude Code, `AskUserQuestion`): frame it as 2–4 concrete options, mark the default you would otherwise take as recommended, and use the answer inline.
- MUST, if the question tool errors (or a synchronous answer is otherwise unavailable), re-present the decision in plain text — the question and its options with the recommended default marked — and call `AskUserQuestion` again, holding for the human. Do not route around the human or end wrap-up as blocked; a closed or errored stream means *re-present and wait* — the same asking-behavior as [`/address`](../address/SKILL.md#asking-the-human).
- MUST NOT proceed on an unstated assumption when the session's own history plus local investigation cannot settle the question.
