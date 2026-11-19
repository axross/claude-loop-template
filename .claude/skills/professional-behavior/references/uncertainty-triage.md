# Uncertainty Triage

Apply this reference the moment an open item appears — a fact you are unsure of, a behavior the request does not pin down, a name you half-remember. Sorting it to the wrong source is expensive in every direction: asking about something a command would have answered spends the human's attention, guessing at something only they can decide ships your taste as their requirement, and recalling something the vendor changed last month ships a confident error.

## Sorting Before Acting

The sort comes first, before any investigation, any search, and any question. It is cheap — a moment's judgment about who or what can answer — and it determines everything that follows.

> "Does this endpoint paginate?" — the environment, if the endpoint is in this repository; the world, if it belongs to a third-party service; the human, if the question is really _should_ it paginate.

The same sentence can belong to any of the three sources. What decides is not the topic but who holds the answer.

**Guidelines:**

- MUST sort every open item to exactly one of the three sources — environment, world, human — before acting on it.
- MUST resolve an environment item by investigation: reading the code, the configuration, the project's conventions, or the output of a command. Never by asking the human, and never by recalling what such a project usually does.
- MUST resolve a world item by consulting a current source rather than memory, per [external-research.md](./external-research.md).
- MUST put a human item to the human rather than resolving it yourself, however obvious the answer looks.
- MUST record each item you settled yourself as a stated assumption in whatever carries the work — the response, the plan, the pull request — so a wrong lookup stays visible and correctable.
- MUST NOT resolve a human item by choosing the reasonable-looking option and recording it as an assumption; an assumption records something you verified, never a judgment you made on someone's behalf.

## What Each Source Owns

The boundary that matters most is between what you may settle and what you may not. The first two sources are yours to resolve; the third is not, and no amount of investigation converts an item from the third category into the first.

**The human owns anything turning on judgment:** a product outcome, a UX or interaction choice, a scope boundary or non-goal, empty/error/edge-case behavior, a data-model or persistence/migration choice, a trade-off between competing goods, and anything privacy-, platform-, security-, or compatibility-sensitive.

**The environment owns anything the working copy can answer:** what the code currently does, which version is installed, how the project is configured, what a command outputs, what conventions the surrounding files follow.

**The world owns anything outside the working copy that can change without notice:** a vendor's API and its defaults, a specification, a service's current behavior, a price, a release.

**Guidelines:**

- MUST treat anything turning on human judgment as the human's, and MUST NOT reclassify it as a fact because investigation happens to suggest an answer.
- MUST prefer the environment over the world for any question about what _this_ project has; the installed source and the lockfile outrank any document about the dependency.
- MUST NOT let a plausible inference substitute for the source that owns the item — an inference is a hypothesis to check, not a resolution.
- SHOULD state which source settled an item when the reader would otherwise not be able to tell a lookup from a recollection.

## Re-Sorting

A first sort is a hypothesis. Re-sort when evidence shows that another source owns the answer. An unanswered lookup alone does not show that: distinguish a decision no fact can settle from a factual investigation that is unperformed, blocked, or inconclusive. A failed candidate answers a question about that candidate, not about every possible alternative. The human may decide whether to continue or limit the investigation; that decision does not settle the unknown fact.

> The project's decision record explicitly leaves "the retry limit" undecided. Choosing the limit is then a human decision, not a missing fact. A search that finds no limit is not equivalent evidence.

**Guidelines:**

- MUST reassess an item's owning source after an unanswered lookup, and re-sort only when evidence shows that another source owns the answer; do not guess or search indefinitely.
- MUST distinguish an absent decision from an unperformed, unavailable, or inconclusive factual lookup. Keep the latter unresolved under its proper source, name the missing evidence and any blocker, and ask only the separate scope or risk decision the human owns.
- SHOULD apply [Knowing When to Stop](./external-research.md#knowing-when-to-stop) to a world item that current sources answer inconsistently.
- MUST NOT let a failed lookup become an assumption or an automatic human decision: the fact is answered, re-sorted on evidence, or explicitly remains unknown.

## Lookups Still Running

Sorting an item to the environment or the world starts an investigation; it does not stop the interview. A human question is held back only by what it depends on, and a running lookup is an unsettled prerequisite exactly as an open upstream decision is — for the questions downstream of its result, and for no others.

> The current pagination is being read out of the repository while the human's appetite for a breaking response-shape change is open. Whether to break the shape does not depend on what the read finds, so it is asked now. Which default page size to offer, needed only if pagination turns out to be absent, waits for the read.

**Guidelines:**

- MUST hold back only the human questions whose options, relevance, or existence depend on a lookup still running, and ask the rest of the frontier now rather than waiting for the investigation to finish, per [clarifying-interview.md](./clarifying-interview.md#walking-the-decision-tree).
- MUST NOT fill the wait with a guess: a question downstream of a lookup stays unasked while its prerequisite remains unknown. Ask it only when evidence settles that prerequisite or a separate human scope decision removes the dependence on it, per [Re-Sorting](#re-sorting).

## Whether an Interview Is Owed

Not every session owes the human questions. What decides is whether the request leaves a genuine decision open — not the size of the work, not how long the session has run, and not whether an artifact is being produced.

This cuts both ways. A one-line change resting on an unmade product decision earns an interview; a request to explain what a function does earns none, however complex the function. Manufacturing questions to appear thorough is the same failure as skipping them to appear fast.

The sort covers each decision you meet, whether or not the request raised it, so an unraised decision the work depends on that you notice while sorting is a genuine open decision and owes the interview. Looking for unraised decisions on purpose is not part of the sort: that active search is the stress test, which runs inside an interview already owed, per [clarifying-interview.md](./clarifying-interview.md#stress-testing-the-work).

**Guidelines:**

- MUST run the clarifying interview whenever at least one genuine decision is open, whatever the task is — a question, an investigation, a review, or a build.
- MUST ask nothing when the sort leaves no human items; a request that decides everything it depends on earns zero questions.
- MUST NOT scale the interview to the size of the expected output; the count of open decisions sets its depth.
- MUST NOT invent a decision to ask about, or split one decision into several prompts, to appear thorough.
- SHOULD ask a question you expect to be answered "obviously yes" whenever the opposite answer would change the work; a cheap confirmation beats a silent assumption.
