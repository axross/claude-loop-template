---
type: Procedure
title: Deliver a change
description: Take an approved change from its working branch through review to a ready pull request, including the authorized-draft exception.
---

# Deliver a change

Use this procedure when contributing a code or documentation change through
Claude Code. Before publishing, check which effects the run's
[delivery authorization](../governance/delivery-authorization.md) covers.
[Loop Engineering](../../.claude/skills/loop-engineering/SKILL.md) owns the stages
and round limits. The [review terms](../../.claude/skills/loop-engineering/references/review-workflow.md#review-terms)
distinguish plan review, pre-push review and post-push review.
Independent reviewers apply [the repository's review policy](../../REVIEW.md).

## Start a change

Describe the change to Claude Code to start the loop. Record the plan on the
tracking issue and obtain human approval before implementation. Follow the
[Claude Code plan gate](../../CLAUDE.md#confirming-delivery-at-the-plan-gate)
for the operator's delivery and watching choices.

Work on a `claude/`-prefixed branch. Never push to the default branch.
The [hourly audit](../operations/branch-audit.md) uses the prefix to detect
a pushed change that has no open pull request.

## When pre-push review cannot run

Pre-push review is required. If the reviewer is unavailable or the operator
selects “pull request without subagents”, use the
[authorized-draft exception](../../.claude/skills/loop-engineering/references/pre-push-review.md#checkpoint-qualification)
only if the operator authorized publication at the plan gate.

1. Record the unmet pre-push gate under risks in the draft pull request.
2. Request the selected post-push review if its route is available. The CI
   reviewer can run without a subagent. Address its findings in the main
   session. If the selected fallback reviewer needs an unavailable subagent,
   report the post-push gate unmet too.
3. Leave the pull request in draft. Only the human can mark it ready under
   this exception.

If the operator selects “neither”, keep the branch local. This choice narrows
the [covered effects](../governance/delivery-authorization.md#covered-effects)
for this run. The human decides whether to push.

## Handle a pre-push finding

At the round cap, take each open Critical or Major finding to the human. Tell
them that deferring it records it on the tracking issue. If the human chooses
deferral and authorizes the issue write, post a comment beginning with the
project's agent-comment marker. Title it “Deferred pre-push findings” and
include the fields in the [deferred handoff](../../.claude/skills/loop-engineering/references/pre-push-review.md#deferred-handoff).

In the pull request body, state only that a record exists on the tracking
issue. Omit the link and the contents. If the issue write fails, retain the
ledger in run state and report delivery incomplete.

## Request post-push review

After opening the authorized draft, check the route selected in
[AGENTS.md](../../AGENTS.md). The template selects the continuous integration
(CI) reviewer. If the override is removed, use Loop Engineering's fallback
reviewer. If the standing grant is inert or excludes the request, obtain
specific authorization before posting.

For the CI route, post the configured review trigger phrase in one top-level
pull request comment. Reserve the literal phrase for that request because the
workflow matches it anywhere in a comment body. If no review arrives, the run
MUST [check the CI reviewer setup](../operations/review-automation.md#diagnose-a-missing-review)
before interpreting its silence.

## Wait for review and mark ready

Use [Claude Code's waiting procedure](../../CLAUDE.md#waiting-on-a-pull-request)
while CI and review are outstanding. The [waiting bound](../../.claude/skills/loop-engineering/references/post-push-review.md#waiting-bound)
sets the conditions for ending the wait. Apply the [ready gate](../../.claude/skills/loop-engineering/references/post-push-review.md#ready-gate)
before marking the pull request ready. If pre-push review was unavailable,
the [authorized-draft exception](#when-pre-push-review-cannot-run) still applies.
A successful delivery run ends at ready. Only the maintainer merges.
