---
type: Procedure
title: Pull request review
description: How to handle an unmet pre-push gate, defer findings and request or troubleshoot the post-push review.
---

# Pull request review

Loop Engineering defines the plan, pre-push and post-push review gates,
including their round limits and the conditions for marking a pull request
ready. Reviewers apply the repository's [review policy](../../REVIEW.md).

## Pre-push findings

This project requires pre-push review. If that review cannot run, the
[authorized-draft procedure](../../.claude/skills/loop-engineering/references/pre-push-review.md)
applies only when the human authorizes publication at the
[plan gate](../../CLAUDE.md#confirming-delivery-at-the-plan-gate). Record the unmet gate in
the draft's risks, request the CI review if selected, and leave the draft for
the human to ready. Address CI review findings in the main session when subagents are
unavailable. If a missing subagent also prevents the selected fallback review,
report that gate unmet. A local-only delivery choice keeps the branch
local.

At the round cap, explain that deferring an open Critical or Major finding
records it on the tracking issue. When the human chooses deferral and authorizes the issue write, post the
ledger there in a comment titled “Deferred pre-push findings” beginning with
the project's agent-comment marker. Use the Deferred Handoff fields from the
pre-push procedure. The pull request body mentions that a record exists on
the tracking issue and omits its contents and link. If the write fails,
retain the ledger in run state and report delivery incomplete.

## Request the post-push review

Before publishing or requesting a review, check the [delivery authorization](./delivery-authorization.md) for this run. If the grant is inert or the effect falls outside its scope, obtain specific authorization before continuing.

Use the route selected in [AGENTS.md](../../AGENTS.md). The template selects
the CI reviewer. If the override is removed, Loop Engineering's fallback
reviewer applies. For the CI route, post the configured trigger phrase in
one top-level pull request comment. Reserve the literal phrase for that
request because the workflow matches it anywhere in a comment body.

If the review does not arrive, verify the following before interpreting its
silence:

- The [review workflow](../../.github/workflows/claude-review.yaml) is active
  on the default branch, and the trigger comment came from an owner, member or
  collaborator.
- The [Claude GitHub App](https://github.com/apps/claude) is installed on the
  repository.
- The repository has a `CLAUDE_CODE_OAUTH_TOKEN` secret. For API billing, use
  an `ANTHROPIC_API_KEY` secret and switch the workflow input to
  `anthropic_api_key`.

## Waiting for review

Use [Claude Code's waiting procedure](../../CLAUDE.md#waiting-on-a-pull-request)
while CI and review are outstanding. Follow Loop Engineering's ready gate
before marking the pull request ready. An unmet pre-push gate under the
authorized-draft exception leaves that transition to the human.
