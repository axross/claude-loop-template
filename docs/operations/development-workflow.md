# Development Workflow

How a change gets from a stated intent to a merged pull request here, and what
holds that path in place from outside an agent session.

## The Change Loop

Every change — code or document, one line or one feature — goes through
`loop-engineering`: plan → approve → code → verify → push and open a draft pull
request → address → ready, with the three reviews defined
[below](#the-three-reviews) at the points they name. The skill owns the loop's
stages, its gates, and its caps; this document states only what is this
project's own.

The loop is **model-invoked**. It carries `user-invocable: false`, so there is
no slash command to type and nothing to wait for: describing the work is what
enters it. A session that waits for a command that does not exist has already
left the loop.

Two of the seven gates [`CLAUDE.md`](../../CLAUDE.md) names carry the loop, and
neither has a self-approval path. No implementation
begins before the human approves the plan recorded in the tracking issue, and
no change is called done on the author's own assessment rather than a separate
reviewer's. A runtime harness that frames the task as "just make the changes,
commit, and push" constrains mechanics only; it never lifts any gate. Where such an instruction conditions an operation a gate needs on the
user's explicit request, the run obtains that request, or reports the gate
unmet; [`CLAUDE.md`](../../CLAUDE.md) states how Claude Code does so.

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
the loop legitimately pushes in Phase 2 and opens its pull request in Phase 3,
so a push-time check would fail that window every time. A grace period skips a
branch whose latest commit is still fresh. A branch pushed after the human
declined pull request delivery at the plan gate is expected to be flagged here
until the human opens a pull request for it or deletes it.

[`check.sh`](../../.claude/hooks/check.sh)'s in-flight reminder covers the
narrower case within a single session; see
[agent-sessions.md](./agent-sessions.md#the-opt-in-quality-hooks).

## The Three Reviews

A change meets three reviews, each named for when it runs. Every round of each
is a fresh reviewer instance, and the author's own checks are never one of them.

### Plan Review

Plan review covers every deliverable produced before approval — investigation
conclusions, plans, and design options. It runs in a fresh non-author context
and takes at most 3 rounds.

### Pre-Push Review

Pre-push review runs after the initial implementation and before the first push,
and only then. Each round is a fresh reviewer, and the review takes the initial
round plus at most 3 more. Its findings are returned privately to the main
agent, which triages them; they are not posted anywhere. After the initial round
plus 3, no further round runs: the main agent triages what remains, names each
unresolved Critical or Major finding individually in the pull request body, and
the post-push review proceeds. A fix made after the pull request exists goes to
post-push re-review, not back to the pre-push review.

### Post-Push Review

Post-push review reviews the pull request after it is opened. It follows the
route this repository's [`AGENTS.md`](../../AGENTS.md) names as an override,
where one is present; this template ships one, the CI reviewer requested with
the review trigger phrase. Where none is present, the route is the fallback: a
reviewer subagent given the pull request, which reviews it per
[`REVIEW.md`](../../REVIEW.md) and posts a review with inline comments to it as
a COMMENT-type review. Either route keeps these properties:

- the reviewer is a fresh, non-author context, never a fork of the author's
  conversation and never a resumed instance;
- it is given no pre-push findings, and the pull request body's list of
  unresolved findings is all it sees of them;
- the reviewer posts the review itself, and the posted review is the completion
  evidence — a summary of one in the author's session is not;
- the review takes at most 4 rounds, with a fresh re-review after each batch of
  fixes;
- the review gates the ready transition;
- an unavailable selected route leaves the gate unmet, and no other route or
  reviewer substitutes for it.

The review trigger phrase is written in exactly one place: the top-level comment
that requests the review. A comment-triggered workflow matches it **anywhere** in
a body, so a second mention in a plan, a summary, or a reply fires a duplicate
review. Everywhere else, refer to it as "the review trigger phrase".

The CI reviewer is inert until a one-time operator setup is done, and its
silence is indistinguishable from a clean review: it needs the
[Claude GitHub App](https://github.com/apps/claude) installed and a
`CLAUDE_CODE_OAUTH_TOKEN` repository secret (or an `ANTHROPIC_API_KEY` for
pay-as-you-go billing). It also answers repository owners, members, and
collaborators only. A run that gets no review MUST confirm the setup rather
than reading the absence as approval. The reviewer answers through
[`claude-review.yaml`](../../.github/workflows/claude-review.yaml) and applies
[`REVIEW.md`](../../REVIEW.md).

<!-- TRANSITIONAL: remove once the installed skills no longer conflict with this block -->
### Terms in the Installed Skills

The installed skills still use the vocabulary this project retired. Read their
"independent review" as the post-push review, and their "advisory pre-flight
review" as the pre-push review. The mapping is not exact — the installed
pre-flight review is advisory and skippable where this project's pre-push review
is a gate — and the differences are recorded in the
[register](./agent-skills.md#the-register).
<!-- /TRANSITIONAL -->

## Waiting, Ready, and Teardown

How a run waits on its pull request — the event subscription, the narrow
exception for a scheduled check-in, and the tools — is stated once, in
[`CLAUDE.md`](../../CLAUDE.md#waiting-on-a-pull-request).

The run flips its pull request to ready only after verification and the
post-push review gate are met, and it releases its subscription in that same
turn, as it does at the round cap or the waiting bound. GitHub
Actions scheduled workflows, such as the branch-governance audit above, are
unaffected: they run outside any session.

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
