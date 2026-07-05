---
description: Drive a GitHub issue, PR, or prompt end-to-end — plan, code, then request an independent review and respond to it — in one continuing session
argument-hint: <issue-or-pr number/URL | prompt | continue> [--review-plan]
---

You are the `/address` driver. Take one unit of work — a GitHub issue, a pull request, or a free-form prompt — from intake to a review-ready pull request inside this single continuing session.

Target: `$ARGUMENTS`

Make all GitHub reads and writes per [GitHub Operations](../skills/github-operations/SKILL.md): the harness's sanctioned tool channel, acting as the connected operator (written `@axross` below), with the project's agent-comment marker (the single marker string recorded in that skill) on every comment you post so `/address continue` never mistakes your own output for human input. Follow [Development Guidelines](../skills/development-guidelines/SKILL.md) and the [Response Approach](../../AGENTS.md) workflow inside every phase.

## Execution Model

You are the only long-lived actor. Advance the work as far as you can autonomously, and stop the turn whenever the next step needs a human. Two — and only two — kinds of thing resume a stopped run:

- **A machine event that completes on its own** — CI, or the independent review this flow requests (see [Independent Review](#phase-3--request-independent-review)). Schedule your own wake-up where the harness provides one (in Claude Code, `send_later`) and poll until it resolves (see [CI and Review Tail](#ci-and-review-tail)).
- **A human decision — a Phase 1 Must-ask, plan approval, an ambiguous finding, or a conflict judgment call:** ask it through the dedicated question UI and use the answer inline (see [Asking the Human](#asking-the-human)). When that UI is unavailable (the surface doesn't render it, or a headless run has no human to answer), or when a machine event is stuck, post your state, **end the turn**, and wait at zero cost; the human resumes by sending **`/address continue`** in this same session.

- MUST poll autonomously ONLY for machine events (CI, the review workflow); never keep a session alive polling for a human.
- MUST resolve human decisions through the question UI inline when it is available (see [Asking the Human](#asking-the-human)); end the turn for `/address continue` when the UI is unavailable or a machine event is stuck, and never schedule a wake-up to re-check for human input.
- MUST clear the [Phase 1](#phase-1--plan) clarify-before-building gate before implementing: surface every spec ambiguity that needs a human decision and get it answered, rather than coding against an unstated assumption.
- The running session is the primary state store; a run resumes with its context intact. Write durable status to GitHub as a safety net (see [GitHub as Lightweight State](#github-as-lightweight-state)), not as the mechanism of record.
- Keep each externally observable step idempotent, so a re-run of `/address continue` re-reads state and continues rather than duplicating work.

## Asking the Human

Every human-gated **decision** in this flow — a Phase 1 Must-ask, plan approval under `--review-plan`, an ambiguous review finding, or a conflict-resolution judgment call — is asked through the harness's dedicated question tool where the session supports it (in Claude Code, **`AskUserQuestion`**): it renders your options as selectable choices in the chat and returns the answer inline, so the run continues in the same turn instead of ending and waiting for `/address continue`.

- MUST prefer the question tool when it is available: frame the decision as concrete options (2–4), state the **default you would otherwise take** and mark it recommended, and rely on the tool's built-in "Other" choice for anything unanticipated. Never bury a decision in prose or silently assume an answer.
- The question tool's availability is a property of the **client surface**: an interactive terminal or IDE renders the UI, while many web, cloud, and CI surfaces do not (in Claude Code the call fails with a closed permission stream, and no settings permission changes that). Detect availability by whether the call succeeds, not by configuration.
- MUST fall back to a marked GitHub comment that @mentions `@axross`, then **end the turn**, **whenever the question tool is unavailable or errors** — the surface doesn't render it, or the run is a headless routine/API job with no human to answer. The comment is a durable breadcrumb `/address continue` resumes from, so the run never stalls on a tool the session can't use.
- MUST keep the pinned status comment current with any open question, so a reclaimed session recovers it regardless of which channel asked.
- This section governs **decisions with options**. Pure notifications (ready-to-merge, a stuck-check dormancy notice, non-convergence) stay a marked `@axross` comment plus end-the-turn — there is nothing to choose.

## Argument Resolution

Resolve `$ARGUMENTS` first, then enter the matching phase.

| Argument                  | Meaning                                 | Entry                                        |
| ------------------------- | --------------------------------------- | -------------------------------------------- |
| Issue number / URL        | Plan and deliver the issue              | Plan                                         |
| Pull request number / URL | Resume delivery of an open pull request | Address / tail                               |
| Free-form prompt          | Ad-hoc task with no issue yet           | Open a tracking issue, then Plan             |
| `continue`                | Resume the paused run in this session   | Reconstruct state, re-enter the pending step |
| `--review-plan` (flag)    | Add a human approval gate after Plan    | Modifier on any of the above                 |

- For a free-form prompt, open a tracking issue capturing the request before planning, so the run is issue-anchored and `/address continue` can reconstruct it.
- For `continue`, re-read the target's current state — the open pull request, its CI status, the independent review's comments, unresolved threads, and your pinned status comment — before acting, and resume the single pending step rather than restarting.
- Run full-auto by default, but treat any unresolved product, UX, scope, or edge-case decision as blocking — clarify it before Code (see the required gate in [Phase 1](#phase-1--plan)) rather than proceeding on an unstated assumption. Add a further plan-approval gate only when invoked with `--review-plan`.

## Phase 1 — Plan

Turn the target into a buildable specification recorded in the issue.

- Read the issue (or the tracking issue opened for a prompt) and its full thread, classify the work — UI-bearing, implementation-only, exploratory, or mixed — per the [Response Approach](../../AGENTS.md), and investigate the smallest useful code and documentation context before proposing a plan. Consult every project skill whose routing condition matches the surface per the `AGENTS.md` skill index, and research current external docs per [current-docs.md](../skills/development-guidelines/references/current-docs.md) when behavior depends on a fast-moving framework or platform the project uses.
- **Clarify before building — required gate.** Investigation resolves _how_ to build; it does not resolve _what the product should do_. Before finalizing the plan and entering Code, list every open question the spec leaves and sort each one:
  - **Settle-and-note** — anything code, project conventions, or docs can answer: decide it and record the choice as a stated assumption in the plan.
  - **Must-ask** — anything needing human judgment: a product outcome, a UX or interaction choice, a scope boundary or non-goal, empty/error/edge-case behavior, a data-model or persistence/migration decision, or anything privacy-, platform-, or compatibility-sensitive that the issue and its thread do not pin down.

  If any Must-ask question remains, you **MUST NOT** start implementing — ask them through the dedicated question UI (see [Asking the Human](#asking-the-human)), each framed as options with the **default you would otherwise assume** marked recommended, then use the answers to finalize the plan. Ask only genuine spec gaps, never what local investigation already answers; but when a detail is genuinely ambiguous, asking is required, not optional. Prefer batching related questions into one prompt over dribbling them out across rounds.

- Rewrite the issue body into a comprehensive plan with these sections, omitting any that genuinely do not apply and saying why, per [Product Requirement Guidelines](../skills/product-requirement-guidelines/SKILL.md): (1) **Product requirement** — the user-facing outcome and constraints; (2) **UI design** — hierarchy, states, responsive and accessibility intent, and copy constraints, when UI-bearing (per the project's UI/component skills); (3) **System design / architecture** — data flow, state, routes, module placement, when applicable (per the project's structure skill); (4) **Testing strategy** — the coverage to add or update (per the project's testing skills in the `AGENTS.md` index); (5) **Acceptance criteria** — a plain bullet list (not GitHub `- [ ]` checkboxes, which nothing checks and so read as perpetually incomplete) the reviewer can verify against the finished pull request.
- Refine the issue title to the concrete deliverable and move the original description into a collapsed `<details>` section, in a single issue write, per [GitHub Operations](../skills/github-operations/SKILL.md).
- The clarify-before-building gate above always applies. `--review-plan` adds a _further_ gate: after writing the plan, ask `@axross` to approve it through the dedicated question UI (see [Asking the Human](#asking-the-human)) before entering Code. Without the flag, proceed to Code once no Must-ask question remains.

## Phase 2 — Code + Verify

- Implement strictly from the plan, keeping edits within the smallest surface that satisfies the acceptance criteria, on a branch under the harness's push-allowed prefix (per [GitHub Operations](../skills/github-operations/SKILL.md), e.g. an agent-namespaced `issue-<n>` branch); never push to the default branch.
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
- Keep the branch mergeable into its base. When the base branch has moved and the pull request conflicts (GitHub marks it not mergeable, or an update/rebase fails), bring the base branch into the branch and resolve the conflicts, then re-run the verification the touched surface requires and note it in the pull request. Resolve mechanical conflicts yourself — imports, independent or adjacent edits, regenerated lockfiles — but when the correct resolution is genuinely unclear (both sides changed the same logic on purpose, or keeping both sides matters and how to reconcile them is a judgment call), ask `@axross` how to reconcile it through the dedicated question UI (see [Asking the Human](#asking-the-human)) rather than guessing.
- Escalate through the dedicated question UI (see [Asking the Human](#asking-the-human)) when a finding or human comment is ambiguous or needs a product or architecture decision, rather than guessing.
- Gate the draft→ready flip on a **clean independent review** (no blocking findings) plus green CI — never on your own assessment of your code. On convergence, flip the pull request to ready for review and @mention `@axross`. Merging remains the human's decision.
- When a human leaves comments on a ready pull request, treat `/address continue` as the resume: re-read the new threads, address or escalate each, convert back to draft if needed, request a fresh independent review, and re-enter this loop as a new round.

## CI and Review Tail

After you push and request review, two machine events run on their own: the merge-checks CI ([`merge-checks.yaml`](../../.github/workflows/merge-checks.yaml): lint + unit tests) and the independent review ([`claude-review.yaml`](../../.github/workflows/claude-review.yaml)). Poll for both — nothing wakes this session when they finish, so schedule a wake-up with the harness's scheduled self-wake where it provides one (in Claude Code, `send_later` from the claude-code-remote MCP server, which delivers a message back into this same session and survives container reclaim); without one, end the turn and wait for `/address continue`.

- Poll at a **4-minute** cadence for the first ~15 minutes, then back off to a **10-minute** cadence while still pending. (The 4-minute figure is Claude-Code-specific guidance: its prompt cache has a ~5-minute TTL, so a wake-up under five minutes resumes cache-warm and cheap, and minute-granular scheduling makes four minutes the closest warm value.)
- MUST stop autonomous polling after **2 hours** with no result — a check still pending at two hours is stuck or badly queued and needs a human. On the cap, update the pinned status comment to note what is stuck, @mention `@axross`, and end the turn; the run goes dormant until `/address continue`.
- Reset the 2-hour budget when a check produces a result and a new push or review request starts a fresh run; the cap governs a single uninterrupted wait, not the run's whole lifetime.
- On green CI plus a clean review, flip the pull request to ready, @mention `@axross`, and end the turn. On review findings or red CI, enter Address (Phase 4). On only some checks resolved, keep polling for the rest.

## GitHub as Lightweight State

State lives in this running session; GitHub carries a thin, human-visible breadcrumb so a resumed or reclaimed session can recover.

- Maintain a single pinned status comment on the issue (and, once open, the pull request) recording the current phase, the review-round count, and what the run is waiting on. Update it in place; do not post a new comment per step.
- Never write the literal review trigger phrase in a status, breadcrumb, or any comment other than the dedicated review request — the review workflow fires on that phrase appearing **anywhere** in a comment body, so embedding it even in prose spuriously starts a review (and muddies the run). Refer to it as "the independent review" everywhere except the request itself, per [GitHub Operations](../skills/github-operations/SKILL.md).
- On `/address continue`, reconstruct state from GitHub before acting — the open pull request, its CI status, the independent review's comments, unresolved threads, and the pinned status comment — and resume the one pending step the comment names, not restart from Plan.
- Labels are optional and purely informational; the run does not depend on a label state machine.

## Termination Guard

- Cap the address↔review loop at **4** rounds; on non-convergence, post a summary of what still fails, @mention `@axross`, end the turn, and wait for `/address continue`.
- Cap autonomous polling at 2 hours per wait and go dormant rather than poll indefinitely.
- End the turn (never loop-block) whenever waiting on a human, so an idle run consumes nothing.

## Project Skills to Follow

`/address` orchestrates existing project skills; it does not restate their rules. Beyond the phase links above, follow [GitHub Operations](../skills/github-operations/SKILL.md) for every GitHub read/write, and the verification the changed surface requires per [Development Guidelines › verification](../skills/development-guidelines/references/verification.md). The independent reviewer applies [`REVIEW.md`](../../REVIEW.md) and [Code Review Guideline](../skills/code-review-guideline/SKILL.md) in its own session; you consult the latter only for the Phase 2 self-check. Keep edits to the smallest surface that satisfies the acceptance criteria; never push to the default branch; never merge the pull request.
