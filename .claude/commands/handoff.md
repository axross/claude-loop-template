---
description: Suspend the current session's work into a downloadable handoff package — or take over from one — so another AI agent session can continue seamlessly
argument-hint: [continue]
---

<!-- INIT:OPTIONAL key=SESSION_HANDOFF — Claude Code harness binding for cross-session work handoff. Self-contained: no token to fill and no Step-1 decision — keep it as-is (swapping the named Claude Code tools, e.g. `AskUserQuestion` and `SendUserFile`, for your harness's equivalents if they differ) OR delete this file if the project doesn't want the /handoff capability. -->

You are the `/handoff` driver. This command moves one unit of in-progress work across session boundaries: the outgoing session freezes its state into a self-contained package the human can download, and an incoming session — with zero shared context — rebuilds that state from the package and continues the work from exactly where it stopped.

Target: `$ARGUMENTS`

## Argument Resolution

| Argument | Meaning | Entry |
| -------- | ------- | ----- |
| *(empty)* | Suspend the current work immediately and produce the handoff package | [Wrap Up](#mode-1--wrap-up-handoff) |
| `continue` | Rebuild state from a provided handoff package and take over the work | [Take Over](#mode-2--take-over-handoff-continue) |
| anything else | Ambiguous | Ask which mode was meant (see [Asking the Human](#asking-the-human)) |

## Mode 1 — Wrap Up (`/handoff`)

### Suspend first

- MUST stop the in-flight work at the nearest safe boundary the moment this command is invoked: let the current tool action finish or abort cleanly, then make no further progress on the task and start nothing new. Producing the handoff package is the session's only remaining job.
- MUST NOT "quickly finish" a to-do, refactor, commit, push, or otherwise change repository state as part of wrapping up — the successor inherits the work exactly as it stands. Capture, don't complete.

### Collect the session state

Reconstruct, from this session's own history:

- the original request and how it evolved — scope changes, human decisions and their answers;
- what has been done, what remains, and what is blocked;
- the repository state: current branch, `HEAD` short hash, upstream/push status (`git log --oneline @{u}..` when an upstream exists), and the full `git status` picture — staged, unstaged, and untracked files;
- every artifact the session created outside the repository's committed tree: scratch scripts, generated reports, downloaded fixtures, screenshots, notes.

Resolve the timestamp once — `date +%s` — and reuse that single epoch value in both file names below so the pair is unambiguous.

### Write `handoff-<unix epoch>.md`

Create a single comprehensive markdown document in a working location outside the repository checkout (the harness's scratchpad or temp directory).

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
- Tell the human how to resume: start a new agent session, attach or upload the file(s), and send `/handoff continue`.
- Then end the turn. The work is suspended; do not resume it in this session unless the human asks.

## Mode 2 — Take Over (`/handoff continue`)

### Locate and ingest the package

- Find the handoff document: the `handoff-<unix epoch>.md` the human attached or uploaded to this session, or one present in the working directory. When several candidates exist, propose the newest epoch and confirm the choice with the human; when none is found, ask the human to provide it — MUST NOT guess or reconstruct a handoff from thin air.
- MUST read the entire document before taking any action, and extract the companion zip (matching epoch) beside it when one exists.
- MUST check the zip's contents against the document's **Precondition** inventory and treat any mismatch — a missing entry, an unexpected extra — as a question for the human, never something to silently ignore.

### Verify preconditions

- Check every item in **Precondition** against reality: right repository and branch, expected `HEAD`, patches apply cleanly, tools and environment available.
- When state has diverged — the branch moved, a patch conflicts, a required credential is missing — surface the divergence and ask how to proceed (see [Asking the Human](#asking-the-human)) rather than forcing a resolution.

### Resume the work

- Adopt the document's **Goal** as the success criteria and its **Concerns and/or blockers** as live risks.
- Trust `- [x]` items as done — spot-check cheaply where practical, but do not redo them — and resume at the first `- [ ]` item, using **History/transition** to avoid re-treading recorded dead ends.
- From here this is ordinary project work: follow [Development Guidelines](../skills/development-guidelines/SKILL.md), the [Response Approach](../../AGENTS.md) workflow, and every skill whose routing condition matches the surface being changed.
- Before editing anything, report a short takeover summary — what the handoff says, what was verified, and the plan — so the human can catch a misreading early.

## Asking the Human

Both modes run into ambiguity: an unclear argument, an unreadable or conflicting package, a diverged precondition, a to-do whose intent is uncertain.

- MUST route every such decision through the harness's dedicated question tool (in Claude Code, `AskUserQuestion`): frame it as 2–4 concrete options, mark the default you would otherwise take as recommended, and use the answer inline.
- MUST NOT proceed on an unstated assumption when the handoff content plus local investigation cannot settle the question.
