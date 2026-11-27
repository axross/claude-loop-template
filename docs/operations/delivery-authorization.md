---
type: Policy
title: Standing delivery grant
description: Who can authorize delivery and which targets, effects and limits an adopted grant covers.
---

# Standing delivery grant

<!-- INIT: if the maintainer adopts the grant, fill both placeholders and remove this comment and the inert-template notice. If the maintainer declines, replace the grant text with the requirement to obtain explicit authorization for each delivery effect. Keep the page so delivery procedures still point to the authority. -->

**Template status.** This grant is inert. Until the maintainer adopts it on
the default branch, a run must obtain specific authorization before performing
a delivery effect.

Once adopted, this is the standing delivery authorization that
`@<maintainer>` grants to agent runs in this repository. The maintainer's
merge of `<adopting pull request>` is the evidence of adoption. Read the
version on the default branch when determining the scope of a run's grant.

## Targets

- this repository
- the run's `claude/` working branch
- the run's tracking issue
- the run's draft pull request
- the post-push review route this repository selects

## Covered effects

The adopted grant authorizes these actions on its named targets.

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

## Exclusions

The grant excludes these actions.

- merging
- pushing to the default branch
- force-pushing or amending published commits
- scheduling any wake
- approving or requesting changes in a review
- writing to other people's issues or pull requests
- changing repository settings, secrets, or workflows
- dispatching workflows or publishing releases

## Lifetime and limits

The adopted grant applies across sessions until the maintainer changes or
withdraws it. At the review round cap, stop and obtain specific authority
before requesting another round. Plan approval releases implementation only.
Meet any additional host requirement for an explicit request at the
[Claude Code plan gate](../../CLAUDE.md#confirming-delivery-at-the-plan-gate).
