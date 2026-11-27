---
type: Guide
title: Development Workflow
description: Routes from the original workflow guide to branch governance, review and delivery authorization.
---

# Development Workflow

These entries lead from the original workflow guide to the rules for each stage of delivery.

## The Change Loop

For the template's entry and approval rules, see
[how a Claude Code session enters the loop and who approves its plan](./branch-governance.md#working-on-a-branch).
[Loop Engineering](../../.claude/skills/loop-engineering/SKILL.md) describes the stages
from intake to ready. The [review procedure](./pull-request-review.md) covers the project's review choices.

## Branches and Merging

[Identify the working branch and who merges](./branch-governance.md#working-on-a-branch).

## What Holds the Loop From Outside

[Respond to a branch governance audit finding](./branch-governance.md#resolving-an-audit-finding)
or [interpret the local delivery reminder](./quality-hooks.md#diagnose-a-stop-check).

## The Three Reviews

[Identify the three review gates](../../.claude/skills/loop-engineering/references/review-workflow.md#review-terms)
and [find the project’s review choices](./pull-request-review.md).

### Pre-Push Review

[Handle an unmet gate or defer a finding](./pull-request-review.md#pre-push-findings).

### Post-Push Review

[Request the post-push review](./pull-request-review.md#request-the-post-push-review).

## Waiting, Ready, and Teardown

[Wait for review and check the ready gate](./pull-request-review.md#waiting-for-review).

## Standing Delivery Grant

[Check the scope and activation of the grant](./delivery-authorization.md).
