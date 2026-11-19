# Development Workflow

Use `loop-engineering` for changes: plan → approve → execute → verify → independent review → address → ready. The skill owns the phase contracts. This guide sets this repository's delivery rules. Read-only investigations and reviews do not need a change plan.

## Authorization and ownership

Check three conditions independently: the host exposes and permits the operation; the human authorized its external effect (except for the ready transition described under Independent review); and the current plan revision is approved when the phase requires it. A tool allow rule, subscription, existing schedule, workflow file, or repository policy is not a human grant. Record authorized effects, target repository/issue/PR, route, expiry, and exclusions. Verify standing grants are still applicable. Do not infer permission to push, publish, assign, trigger review, subscribe, schedule, merge, or deploy from plan approval.

Use the channel permitted by the host and `github-operation`; verify targets by resource type as well as number. Never retry an external action after an ambiguous response until you inspect whether it took effect. For each agent-created issue or PR, verify the adopted assignee after creation and again before ready. Missing assignment or write access remains a blocker when assignment is required.

Work on a `claude/` branch, never push to the default branch, and leave merging to the maintainer. The [scheduled audit](../../.github/workflows/branch-governance-audit.yaml) checks pushed `claude/*` branches after its grace period. It does not replace review or prove an open PR is ready.

## Plans and recovery

The tracking issue body is the canonical plan. Give its approved content a stable revision identity, such as the digest of the canonical plan text. Record who approved that exact revision and where. A material change needs a new approval; a continuation, stale approval, or registration of a wake does not approve it.

Append progress to the issue as marked comments. Record phase, approval reference and revision, writer owner, applicable grants and their limits, draft PR, current head and review round, verification and review locators, unresolved findings, resources to release, and the next action or blocker. Do not overwrite earlier observations. Use a dated `Run state` section in the PR only when resuming review of an existing PR with no issue. It is not a replacement for the canonical plan on new work.

On resume, read the current issue and approval record, PR state/head/body, latest check runs and reviewer output. Compare them with the last breadcrumb; actual state wins over the last note. Check for a posted review, comment, or subscription before retrying a request with an unknown outcome. Record stale reviews as stale rather than deleting them. Set a bounded wake or subscribe only if current tools and grants allow it; otherwise hand back the exact pending action.

## Draft and verification

Use the [PR template](../../.github/pull_request_template.md). In `Acceptance criteria`, link the canonical plan, state the approved revision and omitted count, and copy verbatim every applicable diff-inspectable criterion and required external-verification criterion. Label each status. Give external criteria a verifiable evidence locator or mark them `pending`. Document why a criterion was omitted; do not omit inconvenient or unverified applicable criteria. Keep command transcripts in the contributor handoff and name skipped required checks under `Risks and breaking changes`.

Run the documented checks for changed surfaces; report skips and residual risks. Author self-check, non-code deliverable review, advisory pre-flight, and posted independent review are separate checkpoints. The first three never satisfy the fourth.

## Independent review

Prefer a fresh Claude Code session that did not inherit the author's conversation, such as a non-fork child with qualified GitHub tools. Before launching it, confirm access to the diff, neighbouring code, applicable policy, PR body and required artifacts, and confirm it is permitted and able to post line findings and a summary directly. Pass neutral material locators, not the author conversation or pre-flight findings. Use read-only code access where enforceable; state any instruction-only restriction. Apply [REVIEW.md](../../REVIEW.md).

Additional human review is recommended for high-risk changes such as review or CI infrastructure, secret handling, dependencies or the supply chain, public routes and API contracts, the data layer, and large refactors. It neither replaces mandatory independent review nor adds a ready condition.

Verify a reviewer-origin PR result against the requested comparison base, head, exact PR body revision (for example a SHA-256 of the body bytes), policy revision and scope. Absence of findings must be reported, not inferred from silence. End a temporary review session after confirming its posted result, or record the cleanup handoff. Material changes in the diff, criteria or applicable policy require a fresh review. Link fixes to the commits that resolve them and preserve the review history.

Apply the Ready Gate in the [independent review reference](../../.claude/skills/loop-engineering/references/independent-review.md) and verify any required assignee before marking the PR ready. Once satisfied, the gate authorizes that transition alone without a separate grant, subject to host restrictions. Never replace an unavailable route with the author's review or trigger a second route without permission.

### Optional Claude Actions route

Select this route explicitly and only when the captured base tree and diff, together with the PR body, contain all required review material. The captured diff must be non-empty and smaller than 250,000 bytes; otherwise the workflow reports the reason and stops before calling Claude. If correctness depends on unavailable material such as PR-head neighbours, this route is ineligible. If that gap is discovered during review, an `Incomplete review` result can carry findings but cannot satisfy readiness. Do not start another route automatically.

To enable it, configure `CLAUDE_CODE_OAUTH_TOKEN` as an Actions secret (`claude setup-token`; or deliberately change the workflow to the `anthropic_api_key` input for API billing). Set the `CLAUDE_ACTIONS_REVIEW` repository variable to `true` and `CLAUDE_REVIEW_REQUESTER_IDS` to a JSON array of numeric GitHub user IDs. Adding an ID grants that account permission to request a billed assessment and authorize its resulting `COMMENT` publication on an eligible PR. Keep the list empty until the maintainer grants those effects; remove IDs to revoke future requests. Organization membership or collaborator status alone gives no grant.

The pinned standalone Claude Code Action needs neither the Claude GitHub App nor an OIDC grant. It reads the captured base commit with no persisted checkout credential; the base files are review material, not runtime settings. Claude loads only the workflow's user settings, with hooks disabled. Only the separate publisher has pull-request write access. Do not add dynamic plugins, PR-head checkout, or project commands to either job.

Post the exact `@claude review` comment, optionally preceded by the agent marker on its own line, only when the run has a grant to request it. [The workflow](../../.github/workflows/claude-review.yaml) requires an allowlisted owner, member, or collaborator and a same-repository open PR targeting the default branch. It verifies the stored `COMMENT` and rechecks the snapshot after posting. A GitHub rerun neither launches Claude nor publishes. If the outcome is unverified, inspect the PR first; make a new authorized request only if the required review was not posted. Confirm the expected revisions and coverage; a skipped or successful job alone is not a review. The `issue_comment` event uses the default-branch definition, so changing the workflow in a PR does not exercise that version on the PR.
