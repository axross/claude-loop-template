---
description: Drive a GitHub issue, PR, or prompt end-to-end — plan, code, then request an independent review and respond to it — in one continuing session; `continue` also takes over a /handoff package in a fresh session
argument-hint: <issue-or-pr number/URL | prompt | continue> [--review-plan]
---

<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — Claude Code + GitHub MCP harness binding EXAMPLE for the independent-review capability. Keep (and adapt: replace `@<maintainer>` with the connected operator's real handle, confirm the agent-comment marker and push-allowed branch prefix recorded in github-operation-guidelines, and swap the harness-specific tool names for your harness's equivalents) OR delete this file with the capability; see the INIT.md Step-4 bullet. -->

You are the `/address` driver. Take one unit of work — a GitHub issue, a pull request, or a free-form prompt — from intake to a review-ready pull request inside this single continuing session.

Target: `$ARGUMENTS`

Make all GitHub reads and writes per [GitHub Operation Guidelines](../skills/github-operation-guidelines/SKILL.md): the harness's sanctioned tool channel, acting as the connected operator (written `@<maintainer>` below — replace with the real handle during INIT), with the project's agent-comment marker (the single marker string recorded in that skill) on every comment you post so `/address continue` never mistakes your own output for human input. Follow [Development Guidelines](../skills/development-guidelines/SKILL.md) and the [Response Approach](../../AGENTS.md) workflow inside every phase.

## Execution Model

You are the only long-lived actor. Advance the work as far as you can autonomously, and stop the turn whenever the next step needs a human. (A fresh-session take-over is not a resume — it *creates* a run from a handoff package, then follows this same model; see [Take Over a Handoff](#take-over-a-handoff).) Two — and only two — kinds of thing resume a stopped run:

- **A machine event that completes on its own** — CI, or the independent review this flow requests (see [Independent Review](#phase-3--request-independent-review)). Schedule your own wake-up where the harness provides one (in Claude Code, `send_later`) and poll until it resolves (see [CI and Review Tail](#ci-and-review-tail)).
- **A human decision — a Phase 1 Must-ask, plan approval, an ambiguous finding, or a conflict judgment call:** ask it through the dedicated question UI and wait for the answer inline (see [Asking the Human](#asking-the-human)). A question-tool error is **not** a reason to end the turn: re-present the decision in text and ask again, holding for the human. Ending the turn is reserved for a stuck machine event — post your state, **end the turn**, and wait at zero cost; the human resumes by sending **`/address continue`** in this same session.

- MUST poll autonomously ONLY for machine events (CI, the review workflow); never keep a session alive polling for a human.
- MUST resolve human decisions through the question UI inline, re-presenting and asking again if it errors (see [Asking the Human](#asking-the-human)); end the turn for `/address continue` only when a machine event is stuck, and never schedule a wake-up to re-check for human input.
- MUST clear the [Phase 1](#phase-1--plan) clarify-before-building gate before implementing: surface every spec ambiguity that needs a human decision and get it answered, rather than coding against an unstated assumption.
- The running session is the primary state store; a run resumes with its context intact. Write durable status to GitHub as a safety net (see [GitHub as Lightweight State](#github-as-lightweight-state)), not as the mechanism of record.
- Keep each externally observable step idempotent, so a re-run of `/address continue` re-reads state and continues rather than duplicating work.

## Asking the Human

Every human-gated **decision** in this flow — a Phase 1 Must-ask, plan approval under `--review-plan`, an ambiguous review finding, a conflict-resolution judgment call, or a take-over decision (which package, a zip↔inventory mismatch, a diverged precondition) — is asked through the harness's dedicated question tool where the session supports it (in Claude Code, **`AskUserQuestion`**): it renders your options as selectable choices in the chat and returns the answer inline, so the run continues in the same turn instead of ending and waiting for `/address continue`.

- MUST prefer the question tool when it is available: frame the decision as concrete options (2–4), state the **default you would otherwise take** and mark it recommended, and rely on the tool's built-in "Other" choice for anything unanticipated. Never bury a decision in prose or silently assume an answer.
- A closed or errored question tool is **not proof the surface lacks the UI**. On a remote or cloud session the permission stream can close **transiently** — no client was synchronously attached at that instant — even though the human is reachable and will answer once you ask again. The harness returns the *same* error for that transient case and for a genuinely headless run with no human, so you **cannot tell them apart from the error alone**: MUST NOT diagnose the surface, or assert the UI is unavailable, from a single stream-close. Treat the error as a signal to **re-present and ask again** (next bullet), never to route around the human.
- MUST, when the question tool errors (or a synchronous answer is otherwise unavailable), **re-present the decision and wait** — never route around the human. Show the decision in plain text first — background, the question, and the numbered options with the recommended default marked — then call `AskUserQuestion` again with those same options and hold for the answer. Do NOT post a marked GitHub "decision recorded here" comment, and do NOT end the turn as if blocked-with-a-breadcrumb. This holds whether or not the run is anchored yet: before any GitHub thread exists (e.g. a pre-anchor take-over question), state the question in the turn output and wait just the same. A closed or errored stream means *re-present and wait*, not *fall back and end the turn*.
- MUST make that plain-text presentation offer the **same options, in the same order, with the same recommended default** as the `AskUserQuestion` call. Numbering that drifts between the text and the tool ask would map a bare answer token (e.g. `2`) to a different branch with no error — so mirror the ask exactly.
- MUST, on the next turn, treat a bare answer token — an option number, an option label, or free-form "Other" text — as answering the **still-open** question: reconcile it against the options shown in that plain-text presentation and continue from that choice, rather than restarting or re-asking.
- MUST keep the pinned status comment current with any open question — the decision and its options — so a session reclaimed mid-wait can recover and re-present it. This breadcrumb records state for a reclaim; it is not a fallback channel for answering, and it does not replace re-presenting the question in-session.
- This section governs **decisions with options**. Pure notifications (ready-to-merge, a stuck-check dormancy notice, non-convergence) stay a marked `@<maintainer>` comment plus end-the-turn — there is nothing to choose.

## Argument Resolution

Resolve `$ARGUMENTS` first, then enter the matching phase.

| Argument | Meaning | Entry |
| -------- | ------- | ----- |
| Issue number / URL | Plan and deliver the issue | Plan |
| Pull request number / URL | Resume delivery of an open pull request | Address / tail |
| Free-form prompt | Ad-hoc task with no issue yet | Open a tracking issue, then Plan |
| `continue` (bare token) | Resume the in-session run — or, when there is none, take over a human-provided `/handoff` package | Three-way precedence below: resume, [Take Over a Handoff](#take-over-a-handoff), or ask |
| `--review-plan` (flag) | Add a human approval gate after Plan | Modifier on any of the above |

- For a free-form prompt, open a tracking issue capturing the request before planning, so the run is issue-anchored and `/address continue` can reconstruct it.
- `continue` matches the bare token only; an argument that merely starts with the word (e.g. `continue the migration work`) is a free-form prompt. For bare `continue`, MUST resolve the invocation to exactly one of three outcomes — in this precedence order, before any other action:
  1. **This session holds an `/address` run** (paused, or reclaimed with its context thinned) → resume it: re-read the target's current state — the open pull request, its CI status, the independent review's comments, unresolved threads, and your pinned status comment — before acting, and resume the single pending step rather than restarting. A handoff package already ingested by this session is part of that run — MUST NOT re-ingest it.
  2. **No in-session run, and the human provided a handoff package this session** (`handoff-<unix epoch>.md`, optionally with a matching zip) → enter [Take Over a Handoff](#take-over-a-handoff).
  3. **Neither** → state that there is nothing to resume and ask what was meant (see [Asking the Human](#asking-the-human)). MUST NOT start new work from a bare `continue`.
- Run full-auto by default, but treat any unresolved product, UX, scope, or edge-case decision as blocking — clarify it before Code (see the required gate in [Phase 1](#phase-1--plan)) rather than proceeding on an unstated assumption. Add a further plan-approval gate only when invoked with `--review-plan`; the flag has meaning only when the run (re-)enters Plan — on a resume or take-over already past Plan it is ignored.

## Take Over a Handoff

[`/handoff`](handoff.md) suspends another session's in-progress work into a self-contained `handoff-<unix epoch>.md` document plus an optional same-epoch `handoff-<unix epoch>.zip` of supporting files (the package contract is defined there). When `/address continue` runs in a fresh-context session with such a package, this section rebuilds the suspended state and hands the work to the normal phase flow — the handoff document replaces the session context that an in-session resume would have had.

### Locate and ingest the package

- Find the handoff document the human attached or uploaded to this session. A package merely found on disk — especially one tracked by git, which the wrap-up rules in [handoff.md](handoff.md) forbid committing — is NOT the human's package: MUST confirm it with the human (see [Asking the Human](#asking-the-human)) before ingesting it. When several candidates exist, propose the newest epoch and confirm the choice; when none is found, ask the human to provide it — MUST NOT guess or reconstruct a handoff from thin air.
- MUST read the entire document before taking any action. Extract the companion zip (matching epoch) into a scratch location outside the repository checkout, verify its inventory there, and apply entries deliberately per the document's **Precondition** section (patches via `git apply` / `git am`, other files copied individually) only after the [Verify preconditions](#verify-preconditions) gate below clears — never unzip directly into the working tree.
- MUST check the zip's contents against the document's **Precondition** inventory and treat any mismatch — a missing entry, an unexpected extra — as a question for the human (see [Asking the Human](#asking-the-human)), never something to silently ignore.

### Verify preconditions

- MUST verify every item in the document's **Precondition** section against reality — right repository and branch, expected `HEAD`, patches apply cleanly, tools and environment available — and resolve, or have the human waive, every divergence BEFORE the first repository mutation.
- When state has diverged — the branch moved, a patch conflicts, a required credential is missing — surface the divergence and ask how to proceed (see [Asking the Human](#asking-the-human)) rather than forcing a resolution.

### Resume the work

- Adopt the document's **Goal** as the success criteria and its **Concerns and/or blockers** as live risks.
- Trust `- [x]` items as done — spot-check cheaply where practical, but do not redo them — and resume at the first `- [ ]` item, using **History/transition** to avoid re-treading recorded dead ends.
- MUST report a short takeover summary — what the handoff says, what was verified, and the plan — before editing anything, so the human can catch a misreading early.
- Then re-enter the normal flow: when the handoff names a GitHub issue or pull request, resume the phase matching the work's current state (Plan, Code, Address, or the CI/review tail); when it names none, search for an existing tracking issue first (the predecessor may have opened one without recording it in the package), and only then open one capturing the handoff's **Goal** and remaining to-dos — the same issue-anchoring as a free-form prompt — and continue from there. From this point the run is ordinary `/address` work: follow [Development Guidelines](../skills/development-guidelines/SKILL.md), the [Response Approach](../../AGENTS.md) workflow, and every skill whose routing condition matches the surface being changed.
- Once anchored to an issue or pull request, MUST create or update the pinned status comment recording the takeover — the package epoch, the verified `HEAD`, and the to-do resumed — so a later resume, or a second would-be successor, can see the package was already consumed. MUST treat an existing takeover record for the same epoch as a stop-and-ask (see [Asking the Human](#asking-the-human)), never a second takeover.

## Phase 1 — Plan

Turn the target into a buildable specification recorded in the issue.

- Read the issue (or the tracking issue opened for a prompt) and its full thread, classify the work — UI-bearing, implementation-only, exploratory, or mixed — per the [Response Approach](../../AGENTS.md), and investigate the smallest useful code and documentation context before proposing a plan. Consult every project skill whose routing condition matches the surface per the `AGENTS.md` skill index, and research current external docs per [current-docs.md](../skills/development-guidelines/references/current-docs.md) when behavior depends on a fast-moving framework or platform the project uses.
- **Clarify before building — required gate.** Investigation resolves *how* to build; it does not resolve *what the product should do*. Before finalizing the plan and entering Code, list every open question the spec leaves and sort each one:
  - **Settle-and-note** — anything code, project conventions, or docs can answer: decide it and record the choice as a stated assumption in the plan.
  - **Must-ask** — anything needing human judgment: a product outcome, a UX or interaction choice, a scope boundary or non-goal, empty/error/edge-case behavior, a data-model or persistence/migration decision, or anything privacy-, platform-, or compatibility-sensitive that the issue and its thread do not pin down.

  If any Must-ask question remains, you **MUST NOT** start implementing — ask them through the dedicated question UI (see [Asking the Human](#asking-the-human)), each framed as options with the **default you would otherwise assume** marked recommended, then use the answers to finalize the plan. Ask only genuine spec gaps, never what local investigation already answers; but when a detail is genuinely ambiguous, asking is required, not optional. Prefer batching related questions into one prompt over dribbling them out across rounds.
- Rewrite the issue body into a comprehensive plan with these sections, omitting any that genuinely do not apply and saying why, per [Product Requirement Guidelines](../skills/product-requirement-guidelines/SKILL.md): (1) **Product requirement** — the user-facing outcome and constraints; (2) **UI design** — hierarchy, states, responsive and accessibility intent, and copy constraints, when UI-bearing (per the project's UI/component skills); (3) **System design / architecture** — data flow, state, routes, module placement, when applicable (per the project's structure skill); (4) **Testing strategy** — the coverage to add or update (per the project's testing skills in the `AGENTS.md` index); (5) **Acceptance criteria** — a plain bullet list (not GitHub `- [ ]` checkboxes, which nothing checks and so read as perpetually incomplete) the reviewer can verify against the finished pull request.
- Refine the issue title to the concrete deliverable and move the original description into a collapsed `<details>` section, in a single issue write, per [GitHub Operation Guidelines](../skills/github-operation-guidelines/SKILL.md).
- The clarify-before-building gate above always applies. `--review-plan` adds a *further* gate: after writing the plan, ask `@<maintainer>` to approve it through the dedicated question UI (see [Asking the Human](#asking-the-human)) before entering Code. Without the flag, proceed to Code once no Must-ask question remains.

## Phase 2 — Code + Verify

- Implement strictly from the plan, keeping edits within the smallest surface that satisfies the acceptance criteria, on a branch under the harness's push-allowed prefix (per [GitHub Operation Guidelines](../skills/github-operation-guidelines/SKILL.md), e.g. an agent-namespaced `issue-<n>` branch); never push to the default branch.
- Follow every project skill whose routing condition matches the changed files, and add or update the test coverage the plan named.
- Run the verification the changed surface requires — the commands in the `AGENTS.md` **Verification** section, per [Development Guidelines › verification](../skills/development-guidelines/references/verification.md) — and record the evidence in the pull request body.
- Do a reviewer-mode reset and fix obvious Critical/Major issues before opening the pull request (a self-check to avoid trivial hand-backs per [Code Review Guideline](../skills/code-review-guideline/SKILL.md)); this is NOT the authoritative review — that is the independent reviewer in Phase 3.

## Phase 3 — Request Independent Review

Review is **not** done by you. It runs as a separate agent session on separate infrastructure — a different session, under a bot identity distinct from the operator — via the [`claude-review.yaml`](../../.github/workflows/claude-review.yaml) workflow, which applies the same policy as the repo's [`/review`](review.md) command ([`REVIEW.md`](../../REVIEW.md)). That separation is the whole point: the code's author never certifies its own work.

- Open the pull request in **draft** with `Closes #<n>`, structured from any repository PR template, summarizing the change, the verification evidence, and the acceptance criteria with their status.
- Request the review by posting a top-level comment whose body is exactly the review trigger phrase — `@claude review` in the example workflow — plus the project's marker line, and nothing else. This fires the review workflow, which submits its findings as inline comments anchored to the diff, tagged by severity, with a summary — not as loose conversation comments. Do not repeat the phrase in status or summary comments (see [GitHub as Lightweight State](#github-as-lightweight-state)), or you will fire duplicate reviews.
- The review is a machine event that completes on its own in minutes — poll for it in the tail alongside CI. Do NOT review the diff yourself in place of it.

## Phase 4 — Address

- When the independent review's comments land, read them (their author is the review bot, not you and not a human) together with the CI status of the merge-checks workflow.
- Address and resolve each blocking finding (Important, or whatever the posted-review policy marks merge-blocking) and every unmet acceptance criterion, pushing fixes to the same branch and re-running the relevant verification after each batch.
- For every review comment a commit resolves, reply on that comment's thread with a marked comment (the project's marker line, then a line beginning **`Resolved in <short-hash>`** — the 7-character hash of the commit that fixed it — followed by a one-sentence summary of what changed), then resolve the thread. When one commit resolves several comments, reference that same hash on each. This ties each resolution to the exact commit for the reviewer and for `/address continue`.
- Re-request review by posting the review trigger phrase again after a batch of fixes, and repeat up to the 4-round cap (see [Termination Guard](#termination-guard)).
- Keep the branch mergeable into its base. When the base branch has moved and the pull request conflicts (GitHub marks it not mergeable, or an update/rebase fails), bring the base branch into the branch and resolve the conflicts, then re-run the verification the touched surface requires and note it in the pull request. Resolve mechanical conflicts yourself — imports, independent or adjacent edits, regenerated lockfiles — but when the correct resolution is genuinely unclear (both sides changed the same logic on purpose, or keeping both sides matters and how to reconcile them is a judgment call), ask `@<maintainer>` how to reconcile it through the dedicated question UI (see [Asking the Human](#asking-the-human)) rather than guessing.
- Escalate through the dedicated question UI (see [Asking the Human](#asking-the-human)) when a finding or human comment is ambiguous or needs a product or architecture decision, rather than guessing.
- Gate the draft→ready flip on a **clean independent review** (no blocking findings) plus green CI — never on your own assessment of your code. On convergence, flip the pull request to ready for review and @mention `@<maintainer>`. Merging remains the human's decision.
- When a human leaves comments on a ready pull request, treat `/address continue` as the resume: re-read the new threads, address or escalate each, convert back to draft if needed, request a fresh independent review, and re-enter this loop as a new round.

## CI and Review Tail

After you push and request review, two machine events run on their own: the merge-checks CI ([`merge-checks.yaml`](../../.github/workflows/merge-checks.yaml): lint + unit tests) and the independent review ([`claude-review.yaml`](../../.github/workflows/claude-review.yaml)). Poll for both — nothing wakes this session when they finish, so schedule a wake-up with the harness's scheduled self-wake where it provides one (in Claude Code, `send_later` from the claude-code-remote MCP server, which delivers a message back into this same session and survives container reclaim); without one, end the turn and wait for `/address continue`.

- Poll at a **4-minute** cadence for the first ~15 minutes, then back off to a **10-minute** cadence while still pending. (The 4-minute figure is Claude-Code-specific guidance: its prompt cache has a ~5-minute TTL, so a wake-up under five minutes resumes cache-warm and cheap, and minute-granular scheduling makes four minutes the closest warm value.)
- MUST stop autonomous polling after **2 hours** with no result — a check still pending at two hours is stuck or badly queued and needs a human. On the cap, update the pinned status comment to note what is stuck, @mention `@<maintainer>`, and end the turn; the run goes dormant until `/address continue`.
- Reset the 2-hour budget when a check produces a result and a new push or review request starts a fresh run; the cap governs a single uninterrupted wait, not the run's whole lifetime.
- On green CI plus a clean review, flip the pull request to ready, @mention `@<maintainer>`, and end the turn. On review findings or red CI, enter Address (Phase 4). On only some checks resolved, keep polling for the rest.

## GitHub as Lightweight State

State lives in this running session; GitHub carries a thin, human-visible breadcrumb so a resumed or reclaimed session can recover.

- Maintain a single pinned status comment on the issue (and, once open, the pull request) recording the current phase, the review-round count, and what the run is waiting on. Update it in place; do not post a new comment per step.
- Never write the literal review trigger phrase in a status, breadcrumb, or any comment other than the dedicated review request — the review workflow fires on that phrase appearing **anywhere** in a comment body, so embedding it even in prose spuriously starts a review (and muddies the run). Refer to it as "the independent review" everywhere except the request itself, per [GitHub Operation Guidelines](../skills/github-operation-guidelines/SKILL.md).
- On an in-session `/address continue` resume, reconstruct state from GitHub before acting — the open pull request, its CI status, the independent review's comments, unresolved threads, and the pinned status comment — and resume the one pending step the comment names, not restart from Plan. (A fresh-session take-over reconstructs from the handoff package instead — see [Take Over a Handoff](#take-over-a-handoff).)
- Labels are optional and purely informational; the run does not depend on a label state machine.

## Termination Guard

- Cap the address↔review loop at **4** rounds; on non-convergence, post a summary of what still fails, @mention `@<maintainer>`, end the turn, and wait for `/address continue`.
- Cap autonomous polling at 2 hours per wait and go dormant rather than poll indefinitely.
- End the turn (never loop-block) whenever waiting on a human, so an idle run consumes nothing.

## Project Skills to Follow

`/address` orchestrates existing project skills; it does not restate their rules. Beyond the phase links above, follow [GitHub Operation Guidelines](../skills/github-operation-guidelines/SKILL.md) for every GitHub read/write, and the verification the changed surface requires per [Development Guidelines › verification](../skills/development-guidelines/references/verification.md). The independent reviewer applies [`REVIEW.md`](../../REVIEW.md) and [Code Review Guideline](../skills/code-review-guideline/SKILL.md) in its own session; you consult the latter only for the Phase 2 self-check. Keep edits to the smallest surface that satisfies the acceptance criteria; never push to the default branch; never merge the pull request.
