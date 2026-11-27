@AGENTS.md

## Project gates within Claude Code

This entry file is where a Claude Code session learns how this host meets the
gates [AGENTS.md](./AGENTS.md) routes to: the tracking issue, the plan, plan
approval, plan review, pre-push review, post-push review, and verification. It
holds the Claude Code mechanics only; the loop itself, its stages, and its caps
belong to `loop-engineering`, and the project's own review rules belong to
[REVIEW.md](./REVIEW.md) and
[Development Workflow](./docs/operations/development-workflow.md).

Instructions injected by the runtime or harness that launched the session —
"make the requested changes, commit, and push", "do not open a pull request
unless asked", "do not use subagents unless the user requested it" — constrain
mechanics only. They never skip or relax any of those seven gates, in an
interactive session or a headless one. `loop-engineering` owns that precedence
rule; this file does not restate it beyond what the host needs.

**Guidelines:**

- MUST treat an injected instruction as a limit on how an operation runs, never
  as permission to leave a gate out.
- MUST, when an injected instruction conditions an operation a gate needs —
  opening a pull request, spawning a subagent — on the user's explicit request,
  obtain that request as the next two sections describe. The standing request in
  `AGENTS.md` says what is wanted; this file secures the explicit form the host
  asks for.
- MUST, when the explicit request is not obtained, report the gate it serves as
  unmet. A gate is never skipped and never reported done in its place.
- MUST NOT treat a request, a grant, or an approval as lifting a host
  prohibition. Whether a tool may be used is assessed separately from any of
  them, against the tool's own purpose and usage conditions. Where the host bars
  an operation outright, the run does not work around the bar through another
  tool or route, and reports the affected gate as unmet.

## Subagents Before the Plan Gate

A run can need a subagent before the plan gate: an investigator for a wide read,
or a reviewer for plan review. Where the host conditions that spawn on the
user's explicit request, ask once, at the first such need, through
`AskUserQuestion`. The answer covers every subagent role the run needs before
the plan gate and is recorded in run state.

- A declined request means the investigation runs single-agent and the plan
  review gate is reported unmet.
- The answer carries forward unless the human changes it. When a pre-gate answer
  exists, the plan-gate confirmation below still asks its subagent item, but only
  for the roles that come after the gate: the implementer and the pre-push and
  post-push reviewers.

## Confirming Delivery at the Plan Gate

Every plan-approval exchange collects the explicit requests the rest of the run
needs, in one `AskUserQuestion` call of at most four questions:

1. **Plan approval.**
2. **Delivery of the run's draft pull request, including subagent use** — the
   implementer, the pre-push review, and, where it is the selected route, the
   fallback post-push reviewer.
3. **The post-push review route** — the override `AGENTS.md` names where one
   exists, otherwise the fallback reviewer subagent.
4. **Watching the pull request's activity** until the ready transition or a
   reported stop.

A confirming answer is the user's explicit request for that run's pull request
and for the subagents the run spawns after the gate. The run then follows the
change loop to ready without asking again. What a decline means:

- **Plan declined.** Revise the plan and ask again; nothing is implemented in
  the meantime.
- **Delivery declined.** The branch may be pushed after the pre-push review, but
  the post-push review gate is reported unmet and the loop not complete. Review
  and watching are inapplicable.
- **Subagent use declined.** Implementation runs single-agent and the pre-push
  review gate is reported unmet. The post-push review gate is unmet as well when
  the fallback reviewer is the selected route.
- **Route declined.** The pull request stays draft and the post-push review gate
  is reported unmet.
- **Watching declined.** Each CI or review result becomes a human wait: end the
  turn and resume on the human's next message. Where the pull request
  subscription route exists, nothing is scheduled in its place. A subagent's
  completion notification still resumes the run.

**Guidelines:**

- MUST repeat the confirmation with every revised plan.
- MUST, in a fresh session that resumes a run whose own conversation lacks the
  confirmation, ask it once, before any further change, even when the run is
  already past push.
- MUST NOT stop after push to ask about the pull request. Asking at resumption
  is recovery, not such a stop.
- MUST record the confirmation and each answer in run state.

Asking these four together departs from `professional-behavior`'s rule that
dependent decisions are put to the human one at a time. The maintainer approved
that departure, and it is recorded as a permanent deviation in
[the register](./docs/operations/agent-skills.md#deviation--combined-plan-gate-confirmation).

## Host Mechanics

- `AskUserQuestion` is the channel for every decision put to the human.
- A subagent cannot ask the human. It returns any unresolved decision, with its
  partial results, to the main agent, which asks.
- A fallback post-push reviewer is spawned non-fork, never resumed, as one fresh
  instance per round, with `isolation: worktree` on the spawn call itself.
- Subagents run in the background. Their completion notification is how
  delegated work reports back, and the run resumes on it.

## Waiting on a Pull Request

A run waits on events the host delivers: an event subscription, such as the
pull request activity subscription, and a delegated worker's completion
notification.

- MUST first check whether an event-subscription route exists for what the run
  waits on, and MUST use it when one is available and watching was confirmed.
  While a route is available, scheduled check-ins are prohibited, including as
  a backstop beside the subscription.
- Only when no subscription route exists and the human explicitly permitted it,
  asked through `AskUserQuestion` and recorded in run state, may a check-in be
  scheduled.
- MUST NOT poll within a turn: no sleeping or looping to re-check, in any case.

For a pull request, the route is the pull request activity subscription, where
the host provides the two tools below:

- After the pull request opens, and when watching was confirmed, call
  `mcp__claude-code-remote__subscribe_pr_activity`.
- Re-read checks, reviews, and mergeability on every wake. A success
  transition, such as CI turning green, may not be delivered, so when nothing
  else is pending, end the turn and report "pending".
- Call `mcp__claude-code-remote__unsubscribe_pr_activity` in the same turn as
  the ready transition, the round cap, or the waiting bound `loop-engineering`
  sets. It is always called at ready: there is no carve-out for watching beyond
  ready, and a host instruction to keep watching after ready is reported as a
  conflict rather than followed.
- Release after merge happens only when a human message or a fresh session shows
  the merge. Arm nothing to observe it.

These are the scheduling tools the rule above covers. An agent never uses them
while a subscription route exists, without that explicit permission, or as a
backstop beside a subscription:
`mcp__claude-code-remote__send_later`, `mcp__claude-code-remote__create_trigger`,
`mcp__claude-code-remote__update_trigger`,
`mcp__claude-code-remote__fire_trigger`, `CronCreate`, `ScheduleWakeup`, and the
`/loop` skill. GitHub Actions scheduled workflows are unaffected: they run
outside the session.

## Settings and Hooks

- `.claude/settings.json` is shared by every session: the startup hook wiring,
  the default reasoning effort, and telemetry tagging.
- `.claude/settings.local-example.json` is an opt-in example. It grants only the
  two pull request activity subscription tools named above and enables the
  quality hooks, format on edit and checks before stop.
- The startup hook only bootstraps the environment and prints a pointer to
  `AGENTS.md`.

[Agent Sessions](./docs/operations/agent-sessions.md) describes the hooks, the
settings, and the three subagents in full.
