# Clarifying Interview

Apply this reference once the triage has separated the items you may settle from the decisions the human owns, and you are holding at least one of the latter. It covers what to do with that bucket. It is one continuous conversation, not a form to fill in: each answer changes which questions are still worth asking, so the question set is derived as you go rather than fixed up front.

The question's content, option framing, and how a round's decisions are carried in prompts are owned by [asking-the-human.md](./asking-the-human.md); dependency, established below, is what its rule on decisions sharing a prompt keys on. The active host owns delivery. An interview may span executions: a child without a question route returns the unresolved question and partial results to its parent under that reference's contract rather than assuming it can conduct the entire conversation itself.

## Walking the Decision Tree

Decisions form a tree, not a list. Some are **upstream**: their answer changes which downstream questions exist, which options those questions may offer, or whether they survive at all. A question set fixed before the first answer arrives therefore asks moot questions, offers options an earlier answer already excluded, and misses the questions that answer exposed.

The tree is walked in rounds. The **frontier** is every open human decision whose prerequisites are settled — no prerequisite is still open, whether a decision or a lookup still running. Each round asks the whole frontier at once, and a decision that depends on one still open in that round waits for a later round, when the answers have settled it. Asking the whole frontier keeps the number of round trips at the depth of the tree rather than its size. How a running lookup holds back only its own dependents is covered in [uncertainty-triage.md](./uncertainty-triage.md#lookups-still-running).

> Round one asks _is this surface public or authenticated?_ together with a decision that touches nothing else, such as how long exported data is kept. The anonymous-rate-limit, empty-state, and unauthorized-redirect questions wait: answering **authenticated** deletes the first, turns the second from "what does a stranger see" into "what does a signed-in user with no data see," and exposes the third. Put in round one beside the upstream question, three of those four would be wrong. Round two asks the survivors, reshaped by the answer.

**Guidelines:**

- MUST identify which open decisions are upstream of others — whose answer changes another's options, relevance, or existence — and ask the upstream decision first, holding its dependents for a later round.
- MUST put every open decision whose prerequisites are settled into the current round, rather than walking one branch at a time; withholding a settled decision to finish another branch first costs the human a round trip for nothing.
- MUST recompute the frontier after each round's answers: drop the questions they made moot, revise the options they narrowed, add the ones they exposed, and ask the next round from the result.
- MUST reopen only the affected branch when a later answer contradicts an earlier one, rather than restarting the interview.
- SHOULD state the dependency when asking a downstream question ("since this is authenticated, …"), so the human can recognize an upstream answer they want to revisit.

## Stress-Testing the Work

An interview that only collects what the request visibly left open misses what it left open without noticing. A request can settle every decision it names and still rest on decisions it never raised, on answers that pull against each other or against what investigation found, and on a direction whose failure modes nobody has examined. So the interview presses on the work as well as asking about it: in every interview the triage owes, without the human asking for it or invoking it, it looks for three things, and what it finds joins the frontier as questions like any other.

> The request settles "cache the list for five minutes" and the human's answers so far say the list is per-user. Pressing surfaces an unraised decision — whether the cache is cleared when the user signs out on a shared device — and a failure mode of the chosen direction: a stale list after a write. Both change what gets built, so both are asked. A probe about what happens on a leap-second would not change the work under any answer, so it is not asked.

What keeps pressing from turning into padding is the boundary on the whole interview: a probe counts only when a different answer would change the work. It presses within an interview the triage owes and never manufactures one; a request that decides everything the work depends on, raised or not, still earns zero questions, per [uncertainty-triage.md](./uncertainty-triage.md#whether-an-interview-is-owed).

**Guidelines:**

- MUST stress-test the work in every interview the triage owes, unasked; the posture is the interview's default, not a mode the human invokes.
- MUST enumerate the decisions the work depends on that the request never raised; noticing an unraised decision is not settling it.
- MUST ask the human, as frontier questions, each of those decisions the triage sorts to them, and settle the rest by investigation, listing what you settled per [Confirming Shared Understanding](#confirming-shared-understanding).
- MUST point out a contradiction between a new answer and an earlier one, or between an answer and what investigation found, naming both sides and the evidence, and put it to the human as a question; a factual premise found wrong is instead reported plainly per [accuracy-discipline.md](./accuracy-discipline.md#checking-the-premise), whereas a contradiction that reopens a decision is the human's to resolve.
- MUST probe the failure modes and edge cases of the direction being chosen, asking the ones whose handling turns on the human's judgment and settling the rest by investigation.
- MUST count a probe only when a different answer would change the work; the ban on inventing a decision to look rigorous is stated in [uncertainty-triage.md](./uncertainty-triage.md#whether-an-interview-is-owed).

## Exhaustive by Default

The interview carries no question budget. What ends it is the tree being walked out — the frontier empty and no decision left waiting on another — never the interview having run long.

It does not scale down for a small-looking piece of work. The cost of an unasked decision is not proportional to the size of what is produced: a one-line change built on a wrong assumption is still wrong, and it surfaces later — in review, or in front of a user — where it costs more to correct. What keeps the interview finite is the triage. Exhaustiveness ranges over the decisions the request leaves open; a request that leaves none earns no questions at all.

**Guidelines:**

- MUST put every decision the request leaves open to the human, stopping only when the tree is walked out.
- MUST NOT end the interview because it has run long, because the human seems impatient, or because the remaining questions feel minor.
- MUST NOT scale the interview down because the work looks small — the count of open decisions sets its depth, never the size of the expected output.
- MUST keep exhaustiveness ranging over decisions only; asking what investigation could answer is a sorting failure, not thoroughness.

## Confirming Shared Understanding

The gate clears on the human's confirmation, not on your judgment that you have asked enough. Restating what you now believe is the cheapest place to catch a misread: correcting a short restatement costs a moment, while correcting finished work costs a careful read to find where the misunderstanding was laundered into detail.

The restatement is not the work. It is short enough to check at a glance, though never by omitting an item — what is being done, each decision and the answer it got, every open item you settled yourself, and what is explicitly out of scope. It comes before the work is produced, so that whatever gate reviews that work reviews something whose premise the human has already agreed to.

**Guidelines:**

- MUST restate the shared understanding compactly once the tree is walked — the scope, each decision and its answer, every open item you settled yourself, and the explicit non-goals — and put it to the human for a confirm-or-adjust before acting on it.
- MUST list every open item you settled yourself in the restatement, not only the ones that would be expensive to have wrong, each with what settled it — a lookup result, a check, or a probe resolved without asking — so nothing reaches the work as a silent assumption and a bad lookup fails here rather than downstream; [uncertainty-triage.md](./uncertainty-triage.md#sorting-before-acting) owns what counts as a settled item and its record, and a file read along the way that shaped no answer is not an item.
- MUST keep the restatement short enough to verify at a glance: one line per item, or one line per group of related items where separate lines would swamp the check, each group naming its members and grouped by kind; it checks alignment and is not a draft of the work.
- MUST let completeness win over brevity: never drop an item to stay short.
- MUST treat an adjustment as reopening the affected branch — ask what the correction newly exposes, then re-confirm — rather than proceeding on a patched understanding.
