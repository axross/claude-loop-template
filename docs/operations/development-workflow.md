# Development Workflow

How a change gets from a stated intent to a merged pull request here, and what
holds that path in place from outside an agent session.

## The Change Loop

Every change — code or document, one line or one feature — goes through
`loop-engineering`: plan → approve → code → verify → push and open a draft pull
request → address → ready, with the three reviews it defines at the points it
names. The skill owns the loop's stages, its gates, and its caps; this document
states only what is this project's own, and [the three
reviews](#the-three-reviews) section below holds this repository's choices for
them.

The loop is **model-invoked**. It carries `user-invocable: false`, so there is
no slash command to type and nothing to wait for: describing the work is what
enters it. A session that waits for a command that does not exist has already
left the loop.

Two of the seven gates [`CLAUDE.md`](../../CLAUDE.md) names carry the loop, and
neither has a self-approval path. No implementation
begins before the human approves the plan recorded in the tracking issue, and
no change is called done on the author's own assessment rather than a separate
reviewer's. How a runtime-injected instruction meets the gates belongs to
`loop-engineering`; [`CLAUDE.md`](../../CLAUDE.md) states how Claude Code obtains
an explicit request the host asks for.

## Branches and Merging

Work happens on a `claude/`-prefixed branch. Pushing to the default branch is
forbidden, and merging is the maintainer's decision rather than the session's —
a run that has flipped its pull request to ready is finished, whether or not
the merge has happened.

The prefix is not cosmetic: [the branch-governance
audit](../../.github/workflows/branch-governance-audit.yaml) keys on it.

## What Holds the Loop From Outside

The loop's own rules live in a skill and in [`AGENTS.md`](../../AGENTS.md), both
of which are read *inside* the session — which is exactly where a run that has
already skipped the loop is doing its reasoning. Two checks therefore sit
outside it.

[`branch-governance-audit.yaml`](../../.github/workflows/branch-governance-audit.yaml)
sweeps hourly for a `claude/*` branch pushed ahead of the default branch with no
open pull request: work delivered outside the loop, and so never given a
post-push review. It MUST stay a scheduled sweep rather than gaining a push trigger —
the loop legitimately pushes the working branch before it opens the draft pull
request, so a push-time check would fail that window every time. A grace period
skips a branch whose latest commit is still fresh. A branch the human pushed
without opening a pull request is expected to be flagged here until the human
opens a pull request for it or deletes it.

[`check.sh`](../../.claude/hooks/check.sh)'s in-flight reminder covers the
narrower case within a single session; see
[agent-sessions.md](./agent-sessions.md#the-opt-in-quality-hooks).

## The Three Reviews

`loop-engineering` defines plan review, pre-push review, and post-push review:
their terms, scope, round caps, route selection, and the properties of the
post-push review. It sets them out in its [Review
Terms](../../.claude/skills/loop-engineering/references/review-workflow.md#review-terms)
and in the references for
[plan review](../../.claude/skills/loop-engineering/references/plan-review.md),
[pre-push review](../../.claude/skills/loop-engineering/references/pre-push-review.md),
and [post-push review](../../.claude/skills/loop-engineering/references/post-push-review.md).
This section states only this repository's choices.

### Pre-Push Review

Pre-push review always runs in this repository. Where it cannot run, because
no reviewer subagent exists or the human answered "pull request without
subagents" to the delivery question at the plan gate, the gate is reported unmet
and the authorized-draft exception in
[`pre-push-review.md`](../../.claude/skills/loop-engineering/references/pre-push-review.md#checkpoint-qualification)
applies:

- the draft pull request opens, with the gap named under the body's risks
  section;
- the run requests the post-push review on the selected route when that route
  needs no subagent, as the CI reviewer does, and addresses findings
  single-agent; where the fallback reviewer is the selected route, the
  post-push review gate is reported unmet as well;
- the pull request stays draft and the run never marks it ready. It ends with
  the pre-push review gate reported unmet, and readying the pull request is then
  the human's own act.

The exception does not cover the answer "neither": no pull request opens, the
branch stays local, and pushing it is the human's own act. For that run this
answer narrows the standing delivery grant's push effect. Publication is
authorized separately, by that delivery question; [`CLAUDE.md`](../../CLAUDE.md)
lists its answers.

At the round cap, each open Critical or Major finding goes to the human, as the
skill requires. When the human declines to fix one, it is deferred, and the run
records it in a comment on the tracking issue, the permitted project mechanism
for the skill's [deferred
handoff](../../.claude/skills/loop-engineering/references/pre-push-review.md#deferred-handoff).
The cap question tells the human that declining to fix a finding records it in
a comment on the tracking issue, and the human's answer authorizes that write.
The comment:

- begins with the agent-comment marker and is titled "Deferred pre-push
  findings";
- carries each deferred finding's identifier, severity, citation, claim,
  supporting evidence, and suggested fix, its deferred disposition and the
  decision reason, the round, the reviewed material's identity (the commit plus
  the identity of the uncommitted diff), and the human-decision evidence;
- is labeled "handoff evidence, not canonical requirements or review input".

The pull request body states only that such a record exists on the tracking
issue; it neither links nor restates it. If the write fails, the full ledger
stays in run state and delivery stays incomplete.

### Post-Push Review

Post-push review follows the route this repository's
[`AGENTS.md`](../../AGENTS.md) names as an override, where one is present; this
template ships one, the CI reviewer requested with the review trigger phrase.
Where none is present, the skill's fallback applies and
[`REVIEW.md`](../../REVIEW.md) is the policy the reviewer applies.

The review trigger phrase is written only in the comment that requests the
review; `github-operation` states the rule (Attribute Comments Without Inventing
a Bot), and the header of
[`claude-review.yaml`](../../.github/workflows/claude-review.yaml) lists where
the literal phrase appears.

The CI reviewer is inert until a one-time operator setup is done, and its
silence is indistinguishable from a clean review: it needs the
[Claude GitHub App](https://github.com/apps/claude) installed and a
`CLAUDE_CODE_OAUTH_TOKEN` repository secret (or an `ANTHROPIC_API_KEY` for
pay-as-you-go billing). It also answers repository owners, members, and
collaborators only. A run that gets no review MUST confirm the setup rather
than reading the absence as approval. The reviewer answers through
[`claude-review.yaml`](../../.github/workflows/claude-review.yaml) and applies
[`REVIEW.md`](../../REVIEW.md).

## Waiting, Ready, and Teardown

`loop-engineering` owns the rules: the [waiting
bound](../../.claude/skills/loop-engineering/references/post-push-review.md#waiting-bound)
and the [ready
gate](../../.claude/skills/loop-engineering/references/post-push-review.md#ready-gate).
[`CLAUDE.md`](../../CLAUDE.md#waiting-on-a-pull-request) names the host's tools.
GitHub Actions scheduled workflows, such as the branch-governance audit above,
are unaffected: they run outside any session.

## Standing Delivery Grant

<!-- INIT: fill in the placeholders below and keep this section if the maintainer wants runs in this project to perform the delivery effects it lists without asking, or delete the section if not. The grant takes effect only on the maintainer's merge of the change that fills it in. -->

This section is a skeleton. It is **inert** until an adopter fills in the
placeholders and the maintainer merges the change that does so, and a run reads
the grant as it stands on the default branch: in the template, it grants
nothing.

Once adopted, the maintainer, `@<maintainer>`, issues this standing delivery
grant once, here, to every agent run in this repository. It is actual human
authorization that names its targets, its effects, its lifetime, and its
exclusions, rather than an inference from project policy. Its evidence is
`@<maintainer>`'s merge of `<adopting pull request>`.

The grant's targets are:

- this repository
- the run's `claude/` working branch
- the run's tracking issue
- the run's draft pull request
- the post-push review route this repository selects

Its covered effects, each performed without asking, are:

- creating the tracking issue, publishing and revising the plan in it, and
  assigning the authenticated operator
- append-only pushes of the working branch
- opening the draft pull request, where the host's explicit-request condition is
  also met
- maintaining the pull request description
- requesting the post-push review once per round, up to the round cap
- replying to and resolving that pull request's review threads
- converting the pull request back to draft, and to ready after the ready gate
- subscribing to and unsubscribing from the pull request's activity

Never covered:

- merging
- pushing to the default branch
- force-pushing or amending published commits
- scheduling any wake
- approving or requesting changes in a review
- writing to other people's issues or pull requests
- changing repository settings, secrets, or workflows
- dispatching workflows or publishing releases

The grant is standing: it holds across runs and sessions until the maintainer
amends or removes this section. It is separate from plan approval, which
releases implementation and authorizes no delivery effect, and it does not
satisfy a host's explicit-request condition: the run still meets that at the plan
gate, as [`CLAUDE.md`](../../CLAUDE.md) describes. Rounds beyond the cap are not
covered.
