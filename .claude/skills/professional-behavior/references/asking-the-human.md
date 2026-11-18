# Asking the Human

Apply this reference whenever you are about to put a decision to the human or return it to a parent — a single question mid-task, or every question in a clarifying interview. The triage decides _that_ a decision is theirs, and [clarifying-interview.md](./clarifying-interview.md) decides _which_ questions to ask and in which round; this covers the question's content, who owns the decision, and which kind of route it goes through — never which tool a given runtime names for that route. The question itself, its options, and their consequences are written in the reply language that `SKILL.md`'s Response Language defines; see [reporting.md](./reporting.md#response-language) for the term-handling rule and its edge cases.

## Presenting a Decision

A decision counts as asked only when the human can see that a decision is being put to them. A question is not answered merely because it appears in a plan's **Open questions** section or in a "let me know if you'd prefer otherwise" appended to a summary. Recording it and proceeding on the recommendation would take the choice away from the human.

The same content can reach a human directly or travel through a parent. A parent carries the question onward; it does not gain authority to answer a decision the triage assigned to the human.

**Bad Example:**

> The plan lists under **Open questions**: "Whether the export includes archived rows is still undecided." The run then implements the inclusive version.

**Good Example:**

> _"Should the export include archived rows?"_ — **Include them (Recommended)** matches the current report, whose query already counts archived rows; **Exclude them** makes a smaller file, but totals no longer reconcile. Another answer is welcome. The human owns this product decision because the requirements do not settle it. Export filtering and its expected totals remain blocked until the human answers.

**Guidelines:**

- MUST supply the question, alternatives and their consequences, why a human decision is needed, affected or blocked work, and the decision owner whenever handing a question to the host or a parent. Ordinary prose suffices; no fixed schema is required.
- MUST frame the decision as 2–4 concrete options, state the **default you would otherwise take** and mark it recommended, and leave room for an answer outside those options without relying on a built-in choice.
- MUST give each option the consequence of choosing it, so the human is choosing between outcomes rather than between labels.
- MUST state, for the recommended option, why it is the one you would take, and cite the evidence it rests on when there is any — what investigation found, the source consulted — so the human can weigh the recommendation instead of taking it on trust.
- MUST NOT bury a decision in prose, in a document section, or in a question appended to the end of a summary — a decision the human has to find is one you took for them.
- MUST NOT silently assume an answer, and MUST NOT record a decision you made on the human's behalf as a stated assumption, per [uncertainty-triage.md](./uncertainty-triage.md).

## Choosing the Route

A runtime's **dedicated question mechanism** presents a decision for the human to answer, through choices or free-form input. It may return the human's answer during the call, or acknowledge a submission and deliver a reply in a later turn. A submission receipt establishes acceptance by the mechanism, not client rendering or human receipt. Keeping those observations separate prevents an unanswered decision from becoming permission to proceed.

The route is chosen by what the session exposes and permits for this question, never by what a host is assumed to provide. Invocation conditions and turn sequencing belong to the actual host contract; this reference requires no particular tool, project-specific adapter, or universal end-of-turn rule. Independent work follows the host's instructions while a required answer is pending. A missing or failed route changes how a question is returned, never who owns the decision.

**Recovery Example:**

> Two independent questions ask whether a surface is public or authenticated and how long exports are kept. Both submissions are accepted. The human answers "authenticated" and reports never seeing the retention question. Keep the matched access decision, recompute the question frontier under [Walking the Decision Tree](./clarifying-interview.md#walking-the-decision-tree), and re-present the still-applicable retention question through an eligible route. Do not ask the access question again or infer a rendering cause from the missing-question report. If permitted delivery keeps failing, put the unresolved question and its options explicitly in chat and report the limitation; retention-dependent work still needs an answer.

**Guidelines:**

- MUST use the runtime's dedicated question mechanism when the session exposes one whose permitted purpose and usage conditions qualify for this question; judge eligibility from the actual tool contract rather than the host's name or the tool's presence alone.
- MUST distinguish submission acceptance, the human's report of seeing or missing a question, and an actual answer matched to that question when reporting delivery outcomes. Apply [Accuracy Discipline](./accuracy-discipline.md#labeling-what-you-know) to those observations; none alone establishes general delivery reliability or a rendering root cause.
- MUST present the same options in the turn output and stop dependent work when no dedicated mechanism is eligible, including when one is present but its usage conditions are unmet. Never bypass those conditions or decide for the human.
- SHOULD use a permitted, more interruptive channel over the turn output when no dedicated mechanism is eligible; where none qualifies, the turn output is the floor and the whole route.
- MUST keep an accepted async submission pending while awaiting its human reply; acceptance without an answer is not itself a retry trigger. Re-present a prompt that was closed, cancelled, errored, reported missing, or ended without an answer rather than routing around the human.
- MUST reconcile received answers and recompute applicable questions under [Walking the Decision Tree](./clarifying-interview.md#walking-the-decision-tree) before recovery. Re-present only unresolved decisions whose prerequisites are settled, in plain text first and then through an eligible mechanism. Preserve options and their order unless established answers changed the question's applicability or meaning.
- MUST use the existing turn-output fallback when permitted delivery continues to fail, reporting the limitation and keeping dependent work blocked. Do not retry a mechanism whose purpose or usage conditions prohibit it. A transient stream closure and a genuinely headless run return the same error, so the error alone does not tell them apart.
- MUST read a bare answer token on a later turn — an option number, a label, or free-form text — as answering the still-open question, reconciled against the options you presented, rather than as a new instruction or a reason to restart.

## Returning a Question You Cannot Ask

A question does not stop being the human's to answer because the actor holding it has no way to reach them. What changes is the direction it travels: back to whoever asked, together with what was already established, so the parent can put it to the human and the work resumes from evidence rather than from a guess.

**Example:**

> A one-shot child has identified the export's current behavior but cannot ask the human. It returns the question above, its verified findings, and the remaining blocked filtering work to the parent. It does not wait for a live answer or claim it can resume itself.

**Guidelines:**

- MUST return the question and any partial results to the parent when a child cannot ask, identifying what remains unresolved and blocked rather than assuming live communication or resumability.
- MUST have the parent integrate returned findings and present unresolved human decisions to the human, without treating the child's recommendation as an answer.
- MUST keep dependent work blocked when delivery fails, is unavailable, or has an unknown outcome; report the limitation and leave the decision unresolved unless an actual answer is established.
- MUST NOT fabricate an answer, attribute an unmade decision to the human, or treat silence, failed delivery, or inability to communicate as approval.
- MUST NOT put to the human, as an open item, an effect already covered by a valid operation grant as the change-loop capability defines one.
- MUST leave plan-approval revision and stop/resume semantics to the change-loop capability; ordinary question delivery or an answer to a narrower question does not substitute for that gate or grant new external-operation authorization.

## Decisions in One Prompt

Batching questions is safe only between decisions that do not touch, regardless of the delivery route. When one answer would delete another question, narrow its options, or change what it means, asking both at once yields an answer to a question that no longer exists — and the human cannot tell you so, because they answered what you showed them. Between decisions that do not touch, batching is not merely safe but the point: the independent decisions of a round share a prompt, so the human answers once instead of once per decision. Which decisions make up a round, and how the next round is derived, is owned by [clarifying-interview.md](./clarifying-interview.md#walking-the-decision-tree).

> Asking _"is this surface public or authenticated?"_ alongside _"what does a stranger see when the list is empty?"_ gets an answer to the second that the first may have just invalidated. Asked in rounds, the second waits for the first's answer and then either becomes "what does a signed-in user with no data see?" or disappears. Asking the first alongside _"how long is exported data kept?"_ costs nothing, because no answer to either touches the other.

A delivery mechanism that caps how many questions one prompt carries may split a round across consecutive prompts. That split is delivery, not dependency ordering: none of the prompts in a split round waits on another's answer, and the round is complete once each has been asked.

**Guidelines:**

- MUST NOT put two decisions in one prompt when the answer to one would change, prune, or reframe the other; hold the dependent one for a later round, in dependency order.
- MUST carry a round's independent decisions in the same prompt, or in consecutive prompts only where a delivery cap requires it; the round's composition and recomputation follow [clarifying-interview.md](./clarifying-interview.md#walking-the-decision-tree).
