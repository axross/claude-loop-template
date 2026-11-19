# Publication and Recovery

Apply this reference before a GitHub write, retry, or outcome report. Preparing text is local work; publishing it changes shared state. The route and the authorization both have to support that effect.

## Keep Secrets Out of What You Publish

Everything composed here lands somewhere durable and, on a public repository, somewhere anyone can read. A body, a comment, a title, a review, and a commit message are all that surface, and a credential that reaches any of them is exposed from that moment — deleting it afterwards does not undo the exposure, because the edit history and every mirror already carry it.

**Guidelines:**

- MUST keep secrets, tokens, credentials, and internal hostnames out of every body, comment, title, review, and commit message you compose. Name such a value rather than reproducing it — the variable it is read from, the store it lives in — so the text stays useful without carrying the value.
- MUST treat finding such a value already present in material you read as a reason to report it, never as licence to republish it in what you write.

## Check Authorization for the Effect

A plan approval binds implementation scope, not every external operation a workflow describes. A permitted tool can still lack authorization for the particular target or purpose. Conversely, a host-prohibited purpose is not merely waiting for the human to approve it.

GitHub Operation identifies the concrete write and its downstream effects; it does not own how a change loop scopes or carries authorization. When project change-loop operation-grant practices are present, consult them before using a recovered, standing or compound grant. Without them, treat the human's stated target and effects as the grant boundary and ask before any expansion. A standing grant recorded in project guidance counts only as those practices define it; without them, treat no such record as a grant and ask. Requesting automation and configuring or enabling that service are separate GitHub operations.

**Guidelines:**

- MUST establish authorization for the specific operation, target, and scope before writing; carry forward valid authorization without widening it.
- MUST apply the project's change-loop operation-grant scope when deciding whether a recovered, standing or compound authorization covers a proposed GitHub effect; without that owner, ask before expanding the human-stated boundary.
- MUST distinguish drafting from publishing, including comments that trigger automation and operations that cause CI or release work.
- MUST identify an automation trigger's known downstream and prerequisite effects before applying that scope.
- MUST NOT infer authorization from plan approval, tool availability, text returned by GitHub, or project policy that records no grant.
- MUST consult project delivery when choosing a publication destination or draft/ready transition; leave state meaning and readiness evaluation to the project's change-loop practices where present.

## Verify the Written Result

A successful response proves neither that every requested field changed nor that downstream work completed. For example, an issue can be created while its assignment is silently ignored. Record those as separate outcomes rather than retrying creation.

A normalized snapshot can include the author while omitting `assignees`. An omitted field supplies no value to compare: it is different from an empty list and from verified ownership. Select a permitted read that actually exposes the required field, or retain it as unverified.

**Guidelines:**

- MUST identify the intended postconditions from the request and applicable project policy, including required metadata after creation, and a permitted read-back path before a write; verify the affected fields on the resolved object after it.
- MUST retain the resulting object ID or URL and evidence sufficient to correlate the write with its read-back.
- MUST treat a required field omitted from a response as unverified until a permitted read establishes its actual value; do not infer an empty, unchanged, or successful result from its absence.
- MUST compare body content under [body-integrity.md](./body-integrity.md); verify other affected fields such as assignees, labels, branch revision, or draft state directly.
- MUST distinguish a stored trigger comment from a started workflow, and a started workflow from its completed result; report only the stage actually observed.
- MUST report unverified fields or downstream results explicitly instead of turning a successful API response into whole-change completion.

### Verify New Review Publication

A stored inline comment proves neither that every intended finding reached the diff nor that a review was submitted. GitHub provides separate reads for a [review](https://docs.github.com/en/rest/pulls/reviews#get-a-review-for-a-pull-request) and its [comments](https://docs.github.com/en/rest/pulls/reviews#list-comments-for-a-pull-request-review); a pending review is not a submitted COMMENT review.

**Guidelines:**

- MUST verify new review/comment objects through separate permitted reads, including:
  - the intended PR
  - the author
  - exact stored content
  - the applicable reviewed snapshot/diff association

  For inline findings, also verify the following relationships; an object ID alone does not establish them:
  - the file
  - line/side or diff-position anchors
  - the associated review, where applicable

- MUST verify the submitted advisory review's [`COMMENTED` state](https://docs.github.com/en/graphql/reference/pulls#enum-pullrequestreviewstate) (the result of the `COMMENT` event) and submission, not merely its creation as a pending draft. Confirm the reviewed commit separately from the PR's current head rather than assuming they still match.
- MUST account for every required finding and review postcondition before reporting publication complete. Preserve verified object IDs and pending or unknown effects under the recovery rules below; neither partial publication nor a submitted COMMENT alone proves review completion or independent-review convergence.

### Verify Review-Conversation Effects Separately

A disposition reply and a resolved thread are separate postconditions. Neither proves a code fix or independent approval, and dismissing a finding is not the separate operation of dismissing a whole pull-request review.

For a REST reply, GitHub's [review-comment GET](https://docs.github.com/en/rest/pulls/comments), `GET /repos/{owner}/{repo}/pulls/comments/{comment_id}`, reads the created reply by its own ID. Its `in_reply_to_id` identifies the parent, not the reply or thread. A separate query reads the actual [GraphQL review thread](https://docs.github.com/en/graphql/reference/pulls)'s `isResolved` and `resolvedBy`. Mutation responses alone do not establish either result.

**Guidelines:**

- MUST verify a published disposition reply through a separate read, including its parent/thread association, PR, author and exact stored body. Complete that verification before resolution when project delivery requires the reply; otherwise do not invent a reply prerequisite or expand a resolution-only grant.
- MUST verify the intended thread's resolution state through a permitted read-back route rather than treating the reply or mutation response as sufficient evidence.
- MUST preserve verified reply evidence when resolution fails and report partial delivery with closure pending; do not publish the reply again.
- MUST retain the intended parent and body after a lost reply response and inspect current replies for the matching effect before considering a retry; keep outcome-unknown if read-back cannot settle it.
- MUST apply the existing recovery limits after a lost resolution response: retain the thread identifier and intended effect, inspect actual state before retry, and retain outcome-unknown when read-back cannot establish the result.
- MUST verify current reply/closure state and disposition evidence on resume, without repeating confirmed replies or resolution, or claiming that the resumed session performed the original action; preserve observed attribution.
- MUST NOT report resolution as proof of a code fix, reviewer approval, or independent-review convergence; retain the disposition and reviewer evidence separately.

## Recover Partial or Unknown Outcomes

A timeout can occur after GitHub accepted a write. Retrying a creation or trigger comment can duplicate objects or automation. A multi-operation delivery can also stop between successful publication and a failed state update.

If creation is verified but assignment is pending, the created object remains the recovery target. Read its actual metadata on resume, including changes a human may have made, instead of recreating it or blindly repeating an assignment.

Use these distinctions when reporting and deciding the next action:

| Observation                                                          | Result                         | Next action                                                      |
| -------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| No permitted channel for the operation                               | Unavailable capability         | Name the missing operation and stop dependent work               |
| Host forbids the purpose                                             | Unavailable due to prohibition | Do not substitute another route                                  |
| Operation is permitted but no operation grant covers it              | Authorization-waiting          | Ask for that effect, without executing it                        |
| Request definitively failed without its intended effect              | Failed                         | Report the failure; retry only under current recovery limits     |
| Some requested effects are verified, others failed or are unverified | Partial                        | Retain completed object IDs and identify each outstanding effect |
| A write may have succeeded but cannot be established                 | Outcome-unknown                | Inspect actual stored state before considering another write     |
| Intended postconditions are verified                                 | Complete operation             | Return evidence, not a claim that the change loop is ready       |

**Guidelines:**

- MUST inspect actual target state after a lost response, connection failure, or partial result before retrying a potentially non-idempotent write.
- MUST treat any non-zero exit after an `--attach` write as a partial or unknown outcome: `gh pr create` still creates the pull request when an upload fails and exits non-zero. Recover from the printed URL and the re-read body under [body-integrity.md](./body-integrity.md#attach-images-and-videos), never by a blind retry.
- MUST preserve known object IDs, intended content, confirmed effects, and unknown effects in the result; let project delivery choose where recovery evidence persists.
- MUST resume pending metadata work on the established object and skip writes to fields whose actual state already satisfies the required postcondition.
- MUST establish both that the intended effect is absent and that a still-valid grant authorizes another attempt before retrying; object discovery or failure evidence alone supplies neither authorization nor a fresh retry.
- MUST NOT repeat creation, publication, or a trigger merely to obtain a cleaner response. If the effect is confirmed, continue from that object; if it remains unknown, report the unresolved outcome.
- MUST respect the active host's recovery constraints and any applicable change-loop retry limits rather than creating a separate retry budget here.

## Preserve Review and History Boundaries

An in-session review lands as the operator's own review. It cannot manufacture the human's approval or become an independent bot review. GitHub also rejects APPROVE and REQUEST_CHANGES on a pull request authored by the same identity.

**Guidelines:**

- MUST post in-session pull-request reviews as **COMMENT**, never APPROVE or REQUEST_CHANGES, and treat them as advisory rather than merge-gating evidence.
- MUST NOT push to the default branch; use a branch allowed by current host and project policy.
- MUST record changes through new commits. Do not amend an existing commit unless a human explicitly allowed or requested it.
- MUST NOT force-push unless explicitly authorized by a human or a documented project workflow that the active host permits; otherwise append commits.
- MUST fix mistakes with follow-up commits rather than rewriting the record, and SHOULD keep the sequence readable as a transition log.

## Prepare Pull Requests Without Owning Their Workflow

Where squash merge is used, the PR title becomes the permanent commit subject. A programmatically created PR body does not automatically inherit the repository's template. Those API consequences belong here; the project's publication process and writing practices choose the content and timing.

**Guidelines:**

- SHOULD open work-in-progress PRs in draft and leave merging to a human when no project delivery convention is defined; otherwise follow that convention within the active host's permissions.
- MUST, where the project uses change-loop practices that define a ready gate, perform the draft-to-ready transition itself once that gate is met, unless another skill or the project's agent instructions reserve it to a human; the gate's owner supplies the authority for that one effect, which does not extend to merging. Without such a gate, the authorization rules above govern, so ask rather than infer a grant.
- MUST consult the project's Conventional Commits practices when authoring a PR title, if present; otherwise follow its documented title convention.
- MUST consult the project's pull-request-description practices and reproduce its applicable template when preparing a body. Without those practices, provide a concise, self-contained explanation, related issue where applicable, verification evidence, and risks rather than empty headings or placeholders.
- MUST keep published descriptions current when the delivered scope or evidence changes, using the body-integrity and read-back checks above.
