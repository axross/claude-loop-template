# Pull Request Descriptions

Apply these rules whenever you author or update a pull request body. They govern the description only; the title follows the same header format as a commit — consult the project's Conventional Commits practices when writing it.

## Who the Description Is For

A pull request description is written for the developer who is about to read this diff. What it carries is what that reviewer needs before opening the Files tab: why the change was made, where to start reading, what to watch for, what was verified, and what is risky — and nothing beyond that.

[Why Over What](#why-over-what) below names two more readers: someone who reaches the change through its description long after the thread's participants are gone, and a machine reviewer that consumes it as review context. Both read it for the same thing the developer reviewing the diff does — the why nothing in the diff can show — so writing for that reviewer serves the other two rather than trading against them. What serves none of the three is a second telling of the change.

The diff is the authoritative account of what changed, and it is regenerated on every push. A prose account of the same thing is a second copy that is not regenerated: it goes stale the moment the branch moves, has to be rewritten every round, and buys the reviewer nothing the Files tab does not already show. That gives a test to apply to a specific passage: content a reviewer would have recovered by reading the diff is the redundancy being forbidden; why the change was made, where to begin reading, and what to watch for are not recoverable from the diff, and stay.

Naming a file, module, or symbol as a destination — where to begin reading — is exactly what [Reviewer Guidance](#reviewer-guidance) recommends, and it stays; narrating what that file now does is the second telling. The distinction is what a sentence does, not which nouns it contains: concreteness is never what is wrong with a pull request description, length and repetition are.

This is not the rule that governs a plan or an issue body, which are written from the change's beneficiary's viewpoint and keep implementation vehicles — file and symbol names — out of it. A pull request description is written for a developer, who needs exactly those vehicles to navigate the diff.

**Bad Example:**

> Updated `src/session/refresh.ts` to wrap the refresh call in a mutex. Updated `src/session/index.ts` to export the new mutex helper. Updated `src/session/refresh.test.ts` to cover the new locking path. Tests added.

**Good Example:**

> Two tabs waking from sleep both saw an expired token and raced to refresh it; the loser's refresh invalidated the winner's new token and logged the user out. Start in `src/session/refresh.ts` — it serializes refreshes through a single in-flight promise rather than locking storage, which is the decision worth arguing with. The rest of the diff follows from that choice.

**Guidelines:**

- MUST write the description for the developer about to read this diff: what a reviewer needs before opening the Files tab, and nothing beyond it.
- MUST NOT restate in prose what the diff already shows. Apply the test above to a specific passage: content the reviewer would have recovered by reading the diff is the redundancy; why the change was made, where to begin reading, and what to watch for are not recoverable from the diff and stay.
- MUST NOT read that prohibition as barring a file, module, or symbol name: naming one as a destination to start reading at is [Reviewer Guidance](#reviewer-guidance)'s recommendation, and stays owned there; narrating what that file now does is the second telling.
- MUST NOT read the redundancy prohibition as licence to omit or shorten what [Acceptance Criteria and Residual Risk](#acceptance-criteria-and-residual-risk), [Risk Disclosure](#risk-disclosure), and [Settled Decisions](#settled-decisions) require — those sections are not the redundancy being targeted here.
- SHOULD keep the description's prose — the motivation, the orientation, and the risk notes — to about 200 words, roughly three short paragraphs. Links, per-criterion status lists, and quoted acceptance criteria are not prose and are not counted against that ceiling; they run at whatever length the reviewer needs.
- MUST NOT apply the beneficiary-viewpoint rule that governs a plan or an issue body here: those keep file and symbol names out because they are written for the change's beneficiary; a pull request description is written for a developer, who needs them.

## Why Over What

The diff already shows _what_ changed; the description carries the _why_ — the one thing reviewers consistently name as their biggest obstacle, and the thing no diff can show. It is also a permanent artifact: future readers reach the change through its description long after the thread's participants are gone, and machine reviewers consume it as review context, so a vague body degrades automated review the same way it degrades human review.

**Bad Examples:**

> Fix bug

> Phase 1

> Address feedback

**Good Example:**

> Guard the session refresh against concurrent tab wake-ups. Two tabs waking from sleep both saw an expired token and raced to refresh it; the loser's refresh invalidated the winner's new token and logged the user out. Serialize refreshes through a single in-flight promise instead of locking storage — simpler, and the extra latency on the losing tab is bounded by one request.

**Guidelines:**

- MUST state the problem or motivation and why this approach was chosen, not only what changed.
- MUST NOT restate the diff mechanically; see [Who the Description Is For](#who-the-description-is-for) for the redundancy prohibition, its reason, and the test that applies it.
- SHOULD name known trade-offs, shortcomings, or deliberately deferred work so the reviewer does not rediscover them as findings.
- MUST keep the description self-contained: when linking an external page for context, summarize its load-bearing points inline — links rot and sit behind access walls.

## Template Usage

The repository ships a pull request template (`.github/pull_request_template.md` on the default branch). GitHub pre-fills it only for pull requests opened through the web UI, and only from the copy on the default branch — a body authored programmatically (as an agent's API call does) starts empty, so the structure must be reproduced deliberately.

The template owns the body's skeleton; the rules here own what has to reach the body. Where the two meet, the template decides placement — a required item goes in whichever of its sections already covers that subject. Where the template has no section covering a required item, the body gains one rather than dropping the item.

**Guidelines:**

- MUST structure every pull request body from the template's sections, reproducing them manually when the body is authored programmatically.
- MUST add a section for a required item the template has no home for, rather than omitting the item; the template's shape yields to what a reviewer needs, and only in that direction.
- MUST fill each kept section with real content or delete the section; MUST NOT leave an empty heading, placeholder text, or an unchecked prompt in the submitted body.
- SHOULD delete the template's instructional HTML comments once their section is filled; they never render, but they clutter the raw body that agents and API consumers read.
- MUST keep the Related issues and acceptance-criteria sections even when neither an issue nor a diff-verifiable criterion exists, stating that explicitly instead of deleting them — reviewers otherwise cannot tell "no issue" from "forgot to link", or "no criterion a diff can settle" from a projection nobody wrote.

## Issue Linking

A closing keyword ties the pull request to the work it delivers: merging auto-closes the issue, and a later revert can reopen it so the work is not silently lost.

**Guidelines:**

- MUST link the tracking issue with a closing keyword (e.g. `Closes #123`) in the pull request body when one exists.
- MUST NOT put closing keywords or `@`-mentions in commit messages — every copy, cherry-pick, and fork push of the commit re-fires the automation and re-pings the people.
- SHOULD link related non-tracking context (prior pull requests, discussions, design docs) as plain references without closing keywords.

## Acceptance Criteria and Residual Risk

A review is checked against what the change was supposed to achieve, and for a long time the only copy of that lived in the plan. That works until the reviewer cannot open the plan — a CI reviewer holding no credential for the project's tracker, or a colleague without a seat on it — and then the one thing the review is measured by is the one thing missing. The body is where the criteria have to be, because the body is what every reviewer can read.

Carrying them there is a projection, not a second original. The plan stays canonical and stays where criteria are argued and revised; the body carries criteria a diff can settle and approved criteria designated for out-of-tree verification, quoted rather than paraphrased so that a reader with nothing to compare against is still reading the approved wording. Code review assesses the former; the contributor remains accountable for verification and publication of the latter.

For necessary out-of-tree verification, follow the project's change-loop planning and projection practices where present. Otherwise, agree the verification method and evidence destination in the approved plan, retain its designation verbatim in the body with a published evidence link before claiming readiness, and seek renewed plan approval before changing the designation. Missing required evidence is a delivery gap even when the reviewer reports no finding.

What does **not** belong in the body is the transcript of commands and their results. "Tests pass" was never evidence, but neither is the author's own account of what they ran: the project's checks report against the change independently, and a transcript beside them is a second, staler copy that the author wrote. The reporting obligation is real and is owed to the human in the session. What survives on the body is what those checks cannot produce — a required check that was skipped, and the manual or visual evidence a criterion needs.

The skipped-check rule below reads much like one a code-review capability states for a review's own evidence section. That overlap is deliberate rather than a duplication to resolve: the two govern **different artifacts** — the pull request body an author writes, and the report a reviewer posts — and a code-review capability is authored to reference no other skill, so neither can defer to the other.

**Guidelines:**

- MUST carry the change's acceptance criteria in the body: every criterion a reviewer can confirm or refute from the diff and every criterion the approved plan designates for out-of-tree verification, quoted verbatim including the designation, each with its status; plus the number of criteria not carried, a locator for the plan that holds them, and the plan revision they were copied from, so a later reader can tell a current projection from one the plan has moved past. Include a published evidence link beside each designated criterion before claiming readiness, not merely an issue or pull-request number; follow the project's projection sequencing where present.
- MUST NOT make that obligation conditional on the reviewer being able to reach the plan. A reviewer holding no credential for the project's tracker is the case the body exists to serve.
- MUST place the criteria under whichever template section covers acceptance or verification, and under an `## Acceptance criteria` heading where the template covers neither.
- MUST name every required check that was skipped and why, under the template's risk section, per [verification.md](./verification.md); a skipped check is residual risk, not silence.
- SHOULD include before/after screenshots or a recording for any user-visible change, beside the criteria they bear on.
- MUST NOT put a transcript of verification commands and their observed results in the body. Reporting what ran and what it produced is owed to the human in the session, under whatever reporting practices the project holds you to, and on the body it restates what the project's own checks already report against the change.

## Risk Disclosure

Reviewers allocate scrutiny by risk. A description that flags the dangerous parts gets deeper review where it matters; one that hides them gets uniform, shallower review everywhere.

**Guidelines:**

- MUST call out breaking changes: what breaks, who is affected, and the migration path — and mark the title with the breaking-change marker the project's Conventional Commits practices define.
- SHOULD flag risky or contentious areas of the diff explicitly rather than letting the reviewer discover them.
- SHOULD note rollback considerations when the change is hard to reverse (migrations, config, persisted formats).

## Settled Decisions

A plan often tells the author to explain a choice in the description precisely because the diff makes that choice look like a mistake. The instruction is defensive: it exists so a reviewer does not report a deliberate choice as an oversight. Written with its polarity inverted it does the opposite — it hands a question the author already settled with a stakeholder to a reviewer who was never in that conversation, in a venue that stakeholder is not necessarily watching. The two phrasings read almost alike and behave very differently.

**Bad Example:**

> This sits outside our usual standard. If the reasoning does not hold up, it should go.

**Good Example:**

> This sits outside our usual standard, and it was settled with the maintainer while planning rather than left there by oversight. Overturning it wants a new argument, not a restatement of the standard it is already known to sit outside.

Recording a decision as settled does not place it beyond review. It states what objecting is up against, so an objection arrives as new information rather than as a re-run of a conversation that already happened.

**Guidelines:**

- MUST record a decision already settled with a stakeholder as settled when the description explains it, naming that it was settled and with whom.
- MUST NOT offer a settled decision back to the reviewer as an open question, or invite the reviewer to overturn it; take new information that changes such a decision to the person who settled it instead.
- SHOULD flag such a decision rather than passing over it in silence — keeping a reviewer from reporting a deliberate choice as a defect is why it is mentioned at all.
- SHOULD state what revisiting the decision would take, so the reviewer can weigh the cost of objecting rather than guess at it.

## Reviewer Guidance

The description is the author's one chance to shape the review before it starts. Telling reviewers where to begin and what feedback is wanted measurably improves engagement — and costs two sentences.

**Guidelines:**

- SHOULD name the file or change to start reading from when the diff spans more than a few files — a destination to start at, never a narration of what it now does; see [Who the Description Is For](#who-the-description-is-for) for that distinction.
- SHOULD state the kind of feedback wanted (quick sanity check, deep design critique, copy review) when it is not the default full review.
- SHOULD surface genuinely open questions as explicit questions, not buried caveats — a decision already settled with a stakeholder is not one of them.

## Description Freshness

Review rounds change the diff, and a description written for round one silently mis-frames every later round. The body is re-read by each new reviewer and by automation on every pass — it must describe the pull request as it is, not as it started.

**Guidelines:**

- MUST update the description when review-driven changes alter the scope, approach, or risk profile it describes.
- MUST re-check the description against the final diff before the pull request leaves draft.

## Right-Sizing the Pull Request

Everything above works only on a reviewable diff: review effectiveness drops sharply past a few hundred changed lines, and review latency grows with size. Scope discipline itself is owned by [change-management.md](./change-management.md); the description's job is honesty about size.

**Guidelines:**

- SHOULD split work into small, single-purpose pull requests instead of writing a longer description for an oversized one.
- SHOULD justify the size in the description and point reviewers at the substantive parts when a large diff is unavoidable (e.g. a rename sweep or generated files).
