# Identity and Targets

Apply this reference when attributing GitHub content or preparing a write. The authenticated operator, the object being changed, and the endpoint family are separate facts.

## Attribute Comments Without Inventing a Bot

A session shares the operator's identity, so author login alone cannot distinguish its comments from the human's. The project's fixed marker supplies that distinction. A CI reviewer posting under its own bot login is identified by that login instead.

**Guidelines:**

- MUST treat every in-session write as acting as the authenticated operator, whichever route carries it.
- MUST begin each agent comment with the project's one fixed HTML marker line. When no marker is defined, use `<!-- ai-agent -->` consistently across sessions.
- MUST classify operator-shared comments carrying that marker as agent output and unmarked comments as human input; recognize any retired markers the project explicitly retains for historical reads.
- MUST identify a separate bot by its author login rather than applying the shared-operator marker test to it.
- MUST NOT include another automation's trigger phrase in status, summary, or breadcrumb comments; reserve it for the comment intended to invoke that automation.

## Resolve the Object Before the Endpoint

Issues and pull requests share a numbering space, but a linked issue and pull request have different numbers. A pull-request label or assignment uses the issues endpoint family **against the pull request's number**. Choosing an issues endpoint does not make the tracking issue the target.

Project delivery decides where plans, state, and review evidence belong. This reference checks the resulting operation's object; it does not choose those storage locations.

**Guidelines:**

- MUST identify the repository, operation, and target kind before a write; resolve a bare number to issue or pull request rather than guessing from a link between them.
- MUST send changes to an issue's own body or metadata to that issue, and changes to a pull request's body, metadata, draft status, or review to that pull request.
- MUST identify the actual comment or review thread when editing, replying to, or resolving it; an issue/PR number alone is not that object's identity.
- MUST preserve unrelated labels when an authorized label operation replaces the whole list. GitHub's set-labels semantics replace, rather than append to, that list.

### Identify Review-Conversation API Targets

The [REST reply operation](https://docs.github.com/en/rest/pulls/comments#create-a-reply-for-a-review-comment), `POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies`, takes a top-level review-comment ID. Replies to replies are unsupported. The [GraphQL resolution operation](https://docs.github.com/en/graphql/reference/pulls), `resolveReviewThread`, instead takes the review thread's node ID as `threadId`; a comment's node ID is not the thread ID.

**Guidelines:**

- MUST verify the REST reply's top-level parent comment and its intended repository/PR relationship; when the supplied comment is a reply, locate and verify its top-level parent rather than chaining replies.
- MUST establish the actual thread node ID and its association with the finding before GraphQL resolution; do not substitute a PR number or comment ID.

### Match Closure to Current Discussion

A correct thread identifier does not prove that an earlier disposition covers the thread's current discussion. Closing a thread marks its outstanding matters resolved, including substantive content added since the original finding.

**Guidelines:**

- MUST establish the repository, pull request, thread, and relevant finding relationship before closure, and inspect the current substantive discussion to confirm the authorized disposition covers all outstanding matters closure would mark resolved.
- MUST reassess that coverage after reopening, new substantive content, or a changed human decision; do not automatically re-resolve or assume every original grant has expired.

## Verify Assignment Separately From Creation

Authorship is not assignment. Ownership views filter assignees, not authors. The REST pull-request create/update operations carry no `assignees` field; assignment uses the issues route with the pull request's number. A high-level tool may combine those operations, but their outcomes remain separate.

Assignments can be silently ignored when the caller lacks push access or the named user is not assignable. Eligible users include the acting user, commenters on the target, users with write access, and organization members with read access on an organization-owned repository. The route caps assignment at 10 assignees. A success response alone therefore does not prove ownership was set.

These API facts were verified against [GitHub's issue-assignee reference](https://docs.github.com/en/rest/issues/assignees), [pull-request reference](https://docs.github.com/en/rest/pulls/pulls), and [assignment guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/assigning-issues-and-pull-requests-to-other-github-users) on **2026-08-06**.

**Guidelines:**

- SHOULD assign the authenticated operator to issues and pull requests the session creates, within the authorization for those operations.
- MUST apply the human's or project's required ownership and explicit exceptions; the portable default does not override them.
- MUST resolve that login from the selected authenticated channel's identity operation, never from a commit author, branch name, or repository owner.
- MUST preserve existing assignees when adding the authenticated operator unless the human has authorized replacing or removing them.
- MUST assign a pull request through the issues route against its own number when using the API, and read back its assignees before reporting assignment as complete.
