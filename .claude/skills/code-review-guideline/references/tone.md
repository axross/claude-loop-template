# Review Tone

Apply these rules to every line of every review the agent emits.

## Constructive Language

Feedback aimed at a person invites defensiveness and pulls the discussion away from the work; feedback aimed at the code stays actionable.

**Guidelines:**

- MUST address the **code**, not the **author**. Write "this function does X" not "you wrote a function that does X".
- MUST NOT use blame-laden phrasing such as "you forgot", "you should have", "obviously", "as everyone knows", or "this is wrong because you".
- MUST NOT use sarcasm, exclamation marks for emphasis, or rhetorical questions ("really?", "seriously?").
- SHOULD frame concerns as questions or observations when the reviewer is uncertain, and as direct statements only when the violation is clearly documented in a guideline.

## Stating the "Why"

An author weighing whether to act on a finding needs to see the cost of leaving it, not just which rule it cites.

**Guidelines:**

- MUST include a "Risk:" or "Why:" line for every Critical and Major finding so the author understands the cost of leaving the issue, not just the rule cited.
- SHOULD prefer concrete failure modes ("a non-string `id` would bypass the filter and return unauthorized records") over abstract appeals ("violates principle X").

## Acknowledging Strengths

A review that lists only faults reads as an attack and leaves the author no signal about what is working and worth preserving.

**Guidelines:**

- MUST include at least one item in the **Strengths** section of every review unless the diff is trivially small (≤ 5 changed lines and no new files).
- SHOULD name specific things — "extracts the cache-key derivation into a helper, which makes the call site readable" — not generic praise like "good code".

## Handling Style and Preference

Blocking a merge over taste erodes trust in the severity labels that real defects depend on.

**Guidelines:**

- MUST NOT report personal-style preferences as Major or Critical. If a rule is not in the guidelines and not a clear correctness/security/perf issue, label it Nit and prefix with "Optional:".
- SHOULD propose, not impose, when the codebase has not chosen a convention. Use phrasing like "consider …" rather than "must …".

## Flagging Assumptions

An unstated assumption can silently invert whether a finding is even valid; naming it lets the author confirm or correct it instead of dismissing the whole finding.

**Guidelines:**

- MUST state assumptions explicitly when the reviewer cannot verify a fact from the diff alone (e.g., "Assuming `STORAGE_TOKEN` is set in production; if not, this branch will never run.").
- MUST ask the user a clarifying question rather than guess when an assumption would change the severity classification.

## Human-Authored Content

Copy and translations belong to their authors; a reviewer editing them spends review attention on work that sits outside code review's remit.

**Guidelines:**

- MUST NOT correct or comment on the wording, copy, or translations of human-authored content. Content correctness is a separate responsibility, not code review. From the code review perspective, SHOULD only flag rendering, escaping, or localization-handling bugs in the surrounding code.
