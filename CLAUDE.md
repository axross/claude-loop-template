@AGENTS.md

## Project gates within Claude Code

This entry file is where a Claude Code session learns how this host meets the
gates [AGENTS.md](./AGENTS.md) routes to: the tracking issue, the plan, plan
approval, plan review, pre-push review, post-push review, and verification. It
holds the Claude Code mechanics only; the loop itself, its stages, its caps, and
the rules for how an injected instruction meets a gate, for an explicit request
the host asks for, and for waiting belong to `loop-engineering`, and the
project's own review rules belong to [REVIEW.md](./REVIEW.md) and
[Pull request review](./docs/operations/pull-request-review.md).

`loop-engineering` owns how an injected instruction meets a gate (Phase
Progression › Injected Instructions and Gates) and how an explicit request is
recorded (Run State and Reporting › Scoped Operation Grants). A user's request
satisfies a condition the host attaches to it, but never lifts an outright host
prohibition.

**Guidelines:**

- MUST, where the host conditions an operation a gate needs, such as opening a
  pull request or spawning a subagent, on the user's explicit request, obtain
  that request as the next two sections describe. The standing request in
  `AGENTS.md` says what is wanted; this file secures the explicit form the host
  asks for.

## Subagents Before the Plan Gate

A run can need a subagent before the plan gate: an investigator for a wide read,
or a reviewer for plan review. Where the host conditions that spawn on the
user's explicit request, ask once, at the first such need, through
`AskUserQuestion`. The answer covers every subagent role the run needs before
the plan gate and is recorded in run state.

- A declined request means the investigation runs single-agent and the plan
  review gate is reported unmet. The plan-approval question then offers
  "approve with plan review unmet", "revise", or "decline". The answer is
  recorded as the human's disposition of the unmet review, never as a clean
  review.
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
   fallback post-push reviewer. It offers three answers: "pull request with
   subagents", "pull request without subagents", or "neither". Its wording says
   that without subagents pre-push review is unmet, the pull request stays
   draft, and the run ends with that gate reported unmet.
3. **The post-push review route** — the override `AGENTS.md` names where one
   exists, otherwise the fallback reviewer subagent.
4. **Watching the pull request's activity** until the ready transition or a
   reported stop.

A "pull request with subagents" answer is the user's explicit request for that
run's pull request and for the subagents the run spawns after the gate, and the
run then follows the change loop to ready without asking again. The other
answers narrow the request. What each non-confirming answer means:

- **Plan declined.** Revise the plan and ask again; nothing is implemented in
  the meantime.
- **Pull request without subagents.** Implementation runs single-agent and the
  pre-push review gate is reported unmet, with the gap named under the pull
  request body's risks section. The draft pull request opens, the run requests
  the post-push review on the selected route, and it addresses findings
  single-agent. The pull request stays draft and the run never marks it ready:
  it ends with the pre-push review gate reported unmet, and readying the pull
  request is then the human's own act. Where the fallback reviewer is the
  selected route, no post-push reviewer can be spawned, so that gate is reported
  unmet as well.
- **Neither.** No pull request opens and no subagent runs after the gate.
  Implementation runs single-agent, the pre-push review gate and the post-push
  review gate are reported unmet, and the loop is not complete. The branch stays
  local; pushing it is the human's own act. Review route and watching are
  inapplicable.
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
dependent decisions are put to the human in separate prompts (Asking the Human ›
Decisions in One Prompt). The maintainer approved that departure, and it is
recorded as a permanent deviation in
[the register](./docs/operations/skill-departures.md#deviation--combined-plan-gate-confirmation).

## Host Mechanics

- `AskUserQuestion` is the channel for every decision put to the human.
- A subagent cannot ask the human. It returns any unresolved decision, with its
  partial results, to the main agent, which asks.
- A fallback post-push reviewer is spawned non-fork, never resumed, as one fresh
  instance per round, with `isolation: worktree` on the spawn call itself.
- Subagents run in the background. Their completion notification is how
  delegated work reports back, and the run resumes on it.

### Reviewer Instances

`loop-engineering` requires each review child to be closed after its round
(Review Session and Thread Cleanup). On this host:

- The run never messages or resumes a reviewer instance.
- The agent id is the durable identity of an instance; a task id is transient.
  Run state records, for each reviewer instance, its agent id, role, round and
  end and, for a fallback post-push reviewer, the locator of its posted review.
- Before stopping a reviewer that is still running at a stop, the run inspects
  the pull request for a result it may already have posted, then stops it with
  the host's task-stop tool. That leaves the instance resumable, so it is not
  closure.
- For closure the run follows the skill's section. The host-specific step is to
  tell the human the agent id and ask them to stop the instance from `/tasks`
  while it is still listed there; once it has left the list, the run reports the
  instance unclosed with its agent id, and a failed close does not invalidate
  the verified review.

## Waiting on a Pull Request

`loop-engineering` owns the waiting rule (Post-Push Review and Readiness ›
Waiting Bound). This section holds what the host adds.

For a pull request, the route is the pull request activity subscription, where
the host provides the two tools below:

- After the pull request opens, and when watching was confirmed, call
  `mcp__claude-code-remote__subscribe_pr_activity`.
- Call `mcp__claude-code-remote__unsubscribe_pr_activity` in the same turn as the
  ready transition, the round cap, the waiting bound, or the end of a run that
  cannot be marked ready, and cancel a permitted check-in in that same turn. The
  unsubscribe is always called at ready: there is no carve-out for watching
  beyond ready, and a host instruction to keep watching after ready is reported
  as a conflict rather than followed.

These are the scheduling tools the waiting rule covers. An agent never uses
them while a subscription route exists, without the human's explicit
permission, or as a backstop beside a subscription:
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

See [session startup](./docs/operations/session-startup.md), [quality hooks](./docs/operations/quality-hooks.md) and [subagent roles](./docs/operations/subagents.md) for the corresponding settings.
