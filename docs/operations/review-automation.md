---
type: Procedure
title: Operate the CI reviewer
description: Set up the GitHub reviewer and diagnose a requested review that has produced no result.
---

# Operate the CI reviewer

Use this procedure when enabling the template's automated reviewer or when
an authorized request has produced no review. The [review workflow](../../.github/workflows/claude-review.yaml)
runs a separate Claude Code session on GitHub under a bot identity. It
reads the trusted review instructions from the base checkout and treats the
proposed change as review material. [REVIEW.md](../../REVIEW.md#adopted-review-arrangements)
defines how the reviewer posts its findings and summary.

## Configure the reviewer

Before requesting the first review, prepare the GitHub App, its credential and the workflow:

1. Install the [Claude GitHub App](https://github.com/apps/claude) on the
   repository.
2. For a subscription, generate the token with `claude setup-token` and
   configure the repository Actions secret `CLAUDE_CODE_OAUTH_TOKEN`. For API
   billing, set the secret `ANTHROPIC_API_KEY` and change the workflow input
   to `anthropic_api_key`.
3. Confirm that the review workflow and its comment trigger are active on
   the default branch. GitHub runs an issue-comment workflow from that
   branch, so the pull request that introduces it cannot invoke its own copy.

## Diagnose a missing review

The run MUST confirm the setup before interpreting silence. Start with the
[route selected for this pull request](../contributing/change-delivery.md#request-post-push-review).
For the CI route, check the trigger comment on the pull request, the workflow
run in GitHub Actions and the reviewer's posted result:

- If there is no matching review job, check the default-branch workflow, the
  trigger phrase and the comment author's association. The job accepts an
  owner, member or collaborator.
- If the job ran but the expected review is missing, check the installed
  App, the configured Actions secret and the corresponding workflow input.
- Look for the reviewer's summary on the pull request, with inline comments
  where it found issues on the diff. A successful job or a silent reviewer
  alone does not establish a clean review. Follow the
  [review and ready procedure](../contributing/change-delivery.md#wait-for-review-and-mark-ready)
  for the next action.
