# Selecting Review Workflows

Name each review checkpoint once, select the invocation route for each without changing what the checkpoint means, and keep the created review children from outliving their round. Three terms cover every review the loop runs. A different reviewer or tool changes neither a checkpoint's input, finding authority, limits, nor completion conditions.

## Review Terms

This section is the single owner of the three definitions; every other file uses the terms as defined here.

- **Plan review** is review of every pre-approval deliverable (investigation conclusions, plans and design options) by a reviewer in a fresh, non-author context. It runs at most 3 rounds, with no extension. [plan-review.md](./plan-review.md) owns it.
- **Pre-push review** is review of the initial implementation after it is verified and before the first `git push`, and only then. Each round uses a fresh reviewer instance. The autonomous envelope is the initial implementation plus at most 3 rounds, with no extension. Findings return privately to the driver, which triages them. Fixes made once the pull request exists go to post-push re-review. [pre-push-review.md](./pre-push-review.md) owns it.
- **Post-push review** is review of the pull request after it is opened. It is routed as [Post-Push Review Route](#post-push-review-route) states: an explicit override from the project's agent entry files, project documents or an applicable skill when one exists; otherwise the fallback, in which a code-review-capable subagent is given the pull request URL, reviews per the project's `REVIEW.md` (its review policy file) and posts a review with inline comments to the pull request as a COMMENT-type review. Whatever the route, post-push review has these properties:
  - It uses a fresh non-author context: non-fork, not resumed, and given no pre-push findings.
  - The reviewer, or the review service, posts its own result; the posted review is the completion evidence.
  - It allows 4 rounds, and every fix batch gets a fresh round of re-review.
  - It gates the ready transition.
  - An unavailable selected route leaves the gate unmet; no substitute route replaces it.

  [post-push-review.md](./post-push-review.md) owns its rounds, completion evidence, waiting and ready gate.

The earlier terms "independent review", "external review", "advisory pre-flight" and "phase-deliverable review" are retired; read each as the matching term above (plan review for a phase deliverable, pre-push review for pre-flight, post-push review for the others).

## Select Each Checkpoint's Route

An installing project can choose a route in ordinary prose in the project's agent entry files (such as `AGENTS.md`), project documents or an applicable skill. No special configuration file or schema is needed. Resolve instructions through their actual source, scope and priority; a skill does not automatically outrank project instructions or vice versa. [Post-Push Review Route](#post-push-review-route) gives example sentences.

**Guidelines:**

- MUST identify applicable review instructions separately for plan review, pre-push review and post-push review, and record the selected route and its grounds in existing run state.
- MUST follow an explicitly selected route, including one named by a single sentence or an applicable skill; use the post-push fallback below only for what applicable instructions leave unspecified.
- MUST preserve [pre-push review's existing contract](./pre-push-review.md) and the mandatory [post-push review contract](./post-push-review.md). Pre-push review never satisfies the post-push review gate, which follows pull request creation; conflicting timing instructions require resolution, not silently moving or skipping a stage.
- MUST keep pre-push review's existing default and checkpoint qualification when its route is unspecified; the post-push fallback below neither replaces nor disables it.
- MUST NOT silently replace an explicitly selected unavailable or failed route with the fallback or any other substitute. Record the unmet checkpoint and seek resolution through the applicable blocker and human-decision practices.

## Post-Push Review Route

The route is the first of these that applies. An **override** is an explicit instruction in the project's agent entry files, project documents or an applicable skill that says how post-push review is requested. When no override applies, the **fallback** [Review Terms](#review-terms) defines applies; its reviewer works in a fresh context without the author's conversation or accumulated implementation reasoning. A child session or thread can provide this separation even on shared infrastructure or under a shared publishing account. Those arrangements do not establish environment or account independence; a project requiring either retains that stronger condition.

Reviewing the actual pull request can expose author explanations and self-assessment. Their presence does not make them correctness evidence: the reviewer needs the actual material and applicable requirements to judge those claims. Context separation does not require hiding authorship or revision history.

An override of the same kind is stated per host. These examples travel with the skill so an installing project needs no copy of its author's host runbooks. The fallback assumes a pull-request delivery target; a project with another target states its own override. Current host contracts determine which launch, publication and closure operations actually exist and are permitted.

**Example overrides:**

> In Claude Code sessions, use `@claude review` for post-push review.

| Authoring host | Override example                                                                                                                                                       | Completion and cleanup                                                                                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code    | Post a dedicated pull request comment containing `@claude review`, or use the repository's configured equivalent trigger.                                              | Verify the published reviewer result against the request and material. A reaction or service status alone is insufficient. There is no caller-created child session to close for this hosted trigger.                    |
| Codex          | Post a dedicated pull request comment containing `@codex review`, or use the repository's configured equivalent Codex code-review trigger.                             | Verify the published reviewer result against the request and material. A reaction or service status alone is insufficient. There is no caller-created child session to close for this hosted trigger.                    |
| Amp            | Start a fresh review child thread for the pull request. Give it material locators rather than inheriting the implementation conversation, and ask it to post directly. | Verify the posted result, then close or archive that review thread through the supported thread lifecycle operation, preserving its history. Amp handoffs can carry selected author context; a label alone is not fresh. |

Where an override names a hosted trigger, follow the configured review service's completion contract, address findings and obtain fresh re-review after fixes. Do not also run the fallback.

Under the fallback, verify the child's posted result, then end the review child through its supported lifecycle operation as [Review Session and Thread Cleanup](#review-session-and-thread-cleanup) states. Automatic one-shot termination counts when observed; an idle resumable session is not proof of closure.

**Fallback child assignment:**

> Review pull request [URL] from source/workspace [identity], material revisions [identities], per the project's `REVIEW.md` (its review policy file). Inspect the actual change, surrounding code, acceptance-criteria projection and required artifacts [locators]; verify author claims against those materials. Do not edit the implementation or delegate. Post your review directly to the pull request with inline comments as a COMMENT-type review, using the adopted report format, including a no-findings result when appropriate. Report the posted result locator, reviewed material, host-enforced restrictions and any limitations or instruction-only constraints, then finish.

Verified against [Codex's GitHub review documentation](https://developers.openai.com/codex/integrations/github/), [Claude Code's subagent documentation](https://code.claude.com/docs/en/sub-agents), and Amp's [agent-to-agent](https://ampcode.com/docs/orbs/agent-to-agent) and [thread lifecycle](https://ampcode.com/docs/threads) documentation on 2026-11-05. Claude Code forks inherit the parent conversation and do not provide the fresh context the fallback requires. Example documentation is not evidence of a successful live review in the current host.

**Guidelines:**

- MUST use the fallback, through the active host's available, permitted means, when no applicable instruction selects an override.
- MUST, where a host example's mechanism does not match the project's, qualify an equivalent fresh-context route through the active host's available, permitted means rather than copy the example.
- MUST qualify required material access, review purpose, publication capability and authorization before relying on a reviewer route. Shared infrastructure or account identity alone does not disqualify it unless applicable policy requires separation; a new name or model alone does not qualify it.
- MUST give a created reviewer a neutral review assignment identifying the source/workspace, pull request, material revisions and required artifacts and policy, and have it inspect the actual pull request and acceptance-criteria projection; exclude the author's conversation, accumulated implementation reasoning, the implementation receipt and any pre-push findings, and reuse neither the implementation author nor a prior round's review context.
- MUST preserve access to required policy, artifacts and surrounding code, and ground the review in that material and applicable requirements. Treat author explanations, claimed verdicts and self-assessed acceptance-criterion statuses as unverified claims, not evidence of correctness.
- MUST have the reviewer return its posted result's locator. A private child reply or the parent's reposted summary is not the posted reviewer-origin result required for completion. A missing result-publication capability is an unavailable route under the definition above, and a private review cannot substitute for the required published result.
- MUST check the current host's permitted tool contracts and, where needed, official documentation rather than assume an example's tool is installed or a nested publication route is available.
- MUST use available, permitted tool restrictions for a review child while retaining required material access and direct publication through the pull request's review mechanism. Distinguish host-enforced restrictions from instruction-only constraints; a prompt prohibition alone does not establish enforced read-only access.

## Review Session and Thread Cleanup

A review child is a temporary resource for one review round. Close it after its result is posted and verified, rather than keeping it until merge or reusing its context for another round. This cleanup is distinct from releasing a merged or closed change's branch and working copy.

Review validity and cleanup outcome are separate facts. A failed close does not invalidate an already verified posted review, but the failure still requires action and a concrete human handoff.

**Guidelines:**

- MUST retain each created review session/thread's checkable identity, round, posted-result locator and closure status in the existing permitted run record; distinguish a durable identity from a transient worker handle. On recovery, inspect actual posting and closure state before retrying or requesting another assessment.
- MUST close each review child the run created after verifying its posted result, using an available supported end/close/archive operation and preserving review history and posted evidence. Verify closure rather than infer it from the reviewer's final message; record observed automatic termination where the host provides it.
- MUST ask the human for missing cleanup permission when a permission boundary prevents closure, then attempt cleanup if that permission is granted and the operation is permitted. Carry forward existing permission and actual denial evidence rather than repeat an unchanged request or bypass a prohibition.
- MUST tell the human when cleanup cannot be completed for another reason, or permission remains unavailable, identify the exact session/thread and reason, and ask them to close it with concrete host-specific steps. Resolve the operation from current host documentation; do not invent a command or merely say "clean up manually".
- MAY complete the overall change despite failed review-child cleanup once all applicable permission-request, cleanup-attempt and concrete human-handoff obligations above are fulfilled and all other gates are satisfied; report the remaining resource and actual outcome without claiming successful closure.
- MUST preserve incomplete review/publication evidence when a run fails or stops before a result is posted, release its review child when safe through a permitted route, and apply the same failure handoff if closure is impossible. Closing a child supplies no missing review result, and lost publication responses require outcome inspection before retrying.
