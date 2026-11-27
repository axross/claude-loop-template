# Agent Skills

Installing and refreshing the agent skills this project uses, and what to do
when one of them turns out to be wrong or to collide with this codebase.

Every skill under `.claude/skills/` is **installed**, not written here. All of
them come from the shared [axross/skills](https://github.com/axross/skills)
library and are copied in with the
[vercel-labs/skills](https://github.com/vercel-labs/skills) CLI;
[`skills-lock.json`](../../skills-lock.json) records which skills are installed,
where each came from, and the upstream commit it was installed at. This
project owns no skill of its own — its conventions and operating procedures are
the documents you are reading. Two costs come with that choice. Refreshing
needs Node and network access, because `npx skills` fetches from the library
over the network; the installed skills themselves are plain Markdown, so this
cost falls on refreshing, not on every session. And the library is not this project's own: a
rule that turns out wrong, outdated, or silent on a case here cannot be fixed by
editing the installed copy, because the next install discards the edit while it
poses as a rule the library agrees with — see
[Deviations and Gaps](#deviations-and-gaps) below for how that is handled
instead.

## Install and Refresh

```bash
# refresh exactly the skills this project already manages
npx skills add axross/skills --agent claude-code --yes --copy \
  $(node -p "Object.keys(require('./skills-lock.json').skills).map(s => '--skill ' + s).join(' ')")
```

**Do not use `--skill '*'` here.** Against an external source it installs the
library's *entire* catalogue, not the subset in `skills-lock.json` — today that
would silently adopt the framework, vendor, and UI layers this project has not
chosen. The command above derives the list from the lockfile instead, so it
stays correct as the set changes.

Adopting a new skill means naming it explicitly, and `--skill` takes exactly one
skill per flag: repeat the flag (`--skill a --skill b`) rather than passing a
comma-separated list. A comma-separated value matches nothing, installs nothing,
writes no lockfile, and reports an available-skill list that reads like ordinary
help rather than a failure — so a refresh can appear to succeed while doing
nothing at all.

`npx skills` can also fail to resolve the CLI in a fresh container or against a
stale npx cache, aborting with `npm error could not determine executable to
run`, which reads like a broken command rather than a resolution failure. Retry
that one case with an explicit specifier — `npx --yes skills@latest add …` —
rather than pinning `@latest` on every run, which refetches the newest CLI build
each time.

Every directory under `.claude/skills/` MUST be treated as a generated
artifact. Editing one is pointless — the next install discards it — so a change
to a skill goes upstream to the library as an issue or pull request there. The
regenerated skill directories and `skills-lock.json` MUST be committed together,
and a skill MUST NOT be added to `.claude/skills/` while it is absent from
`skills-lock.json`: the lockfile describes the directory's entire contents, and
that correspondence is what makes drift detectable at all.

Installing a skill does not prove a host loaded it. That is not observable from
inside the session that changed the tree, because skills are read at session
start — so confirm it once in a **fresh** session with `/context`, which is what
proves the installed directories were picked up.

### Versions

`skills-lock.json` records each installed skill's source and, as `commit`, the
upstream revision the last refresh installed.

- Restoring with `npx skills install --agent claude-code` reproduces exactly
  that commit. This was verified with skills 1.9.0, where `install` without a
  source is an alias of `experimental_install`, a command the CLI may change.
- The refresh above takes the latest upstream and rewrites the commit.
- Nothing runs either automatically: an installed skill stays exactly as it was
  copied until someone runs one of them.
- This project's one skill root is `.claude/skills/`. The `.agents/` directory a
  restore may leave is CLI staging; delete it rather than committing it.

The template never chooses or holds a revision of its own: the lockfile only
records what the last refresh installed.

### When Upstream Renames a Skill

The refresh command above breaks on a rename rather than absorbing it: the
lockfile still holds the old name, so the `--skill` list it derives asks the
library for a name that no longer resolves in its catalogue, and the run fails
on that one name instead of refreshing anything. Run the install once by hand
in that case, naming every surviving skill plus the new name explicitly, rather
than deriving the list from the lockfile:

```bash
npx skills add axross/skills --agent claude-code --yes --copy \
  --skill <surviving-skill> --skill <surviving-skill> --skill <new-name>
```

Remove the stale skill with `npx skills remove <old-name>` rather than deleting
its directory by hand — the CLI is what rewrites `skills-lock.json`, and a
directory removed without it leaves the lockfile still claiming a skill that is
no longer on disk.

The rename is not finished at the lockfile. Every repository-side reference to
the old name — a workflow step or script that executes the skill's own scripts
by path, and any prose that names it — is carried in the same change, not left
for later. That includes the `for check in
.claude/skills/<name>/scripts/check-*.mjs` pattern this project uses to run a
skill's validators: pointed at a directory that no longer exists, the glob
expands to nothing, and — without `nullglob` — the shell passes the literal,
unexpanded pattern through, so the command that receives it fails loudly (a
"cannot find module" error, not a silent no-op). A stale path here is caught,
not swallowed, but only once something runs the command; naming the old
directory in `skills-lock.json` and in the affected files is what prevents that
in the first place.

## Deviations and Gaps

A **deviation** is a collision: an installed capability requires one thing, this
project deliberately does another. A **gap** is an installed capability being
silent on a case that comes up here. Either way the installed skill is left
exactly as it is, and this document's register records the resolution.

`agent-skill-management` owns verifying a suspected defect against the installed
text and routing it, including a proposal upstream and the human's go-ahead for
publishing one (Changes to installed rules, in its `installed-rule-changes`
reference). This repository adds one rule of its own: the register below lists
every departure from an installed rule, and a departure that no entry matches is
a finding.

## The Register

An entry records a decision the human accepted, with its reason. A hypothetical
or anticipated collision MUST NOT be entered: a deviation is recorded when it is
accepted, not when it is expected.

<!-- INIT: every entry below ships with the template and is real, not an
example. Keep the four Claude Code entries, the combined plan-gate
confirmation, the explicit request asked again, watching conditioned on the
human's confirmation, and reviewer instances that cannot be closed or checked,
for as long as `CLAUDE.md` keeps the behavior each records: each travels with
the canonical `CLAUDE.md`. Replace each entry's
adoption locator with the pull request in which your maintainer adopted it. Keep
the `application-security` gap while the project has authentication and the gap
is still open at the installed commit. Do not seed the section with anything
else; a register holding only the entries that still apply is the correct
state. -->

Every departure entry names the installed rule by its heading path and the
commit it was checked at, a concrete counterexample, what this project does
instead, why, the scope, the human act that adopted it, and when to reassess it.
A gap entry names the uncovered concern, its scope, its adoption, and when to
reassess it, since there is no installed rule to cite. An entry does not quote
the skill: the installed text changes with each refresh, and a quotation would
go stale the moment it did. An agent-authored comment is not adoption evidence.

### Deviation — combined plan-gate confirmation

- **Installed rule:** `professional-behavior` › Asking the Human › Decisions in
  One Prompt, checked at aa471aa.
- **Counterexample:** the plan-gate confirmation puts plan approval, delivery of
  the draft pull request, the post-push review route, and watching in one
  prompt. The answer "neither" to the delivery question makes the route and
  watching inapplicable, so one answer changes what the others mean.
- **What this project does instead:** `CLAUDE.md`'s plan-gate confirmation asks
  all four in one `AskUserQuestion` call of at most four questions.
- **Why:** the host conditions pull request creation and subagent spawning on
  the user's explicit request, and the plan-approval exchange is where the human
  is already answering. The maintainer approved combining them rather than
  asking again after approval. The entry is permanent because the confirmation
  travels with the canonical `CLAUDE.md`.
- **Scope:** the plan-gate confirmation only. Every other decision a run puts to
  the human follows the installed rule, in dependency order.
- **Adopted by:** the maintainer's merge of #79, and of #80, which rewrote the
  entry.
- **Reassess when:** the installed section changes, or `CLAUDE.md` changes the
  confirmation's questions.

### Deviation — the explicit request is asked again, not carried forward

- **Installed rule:** `loop-engineering` › Run State and Reporting › Scoped
  Operation Grants, checked at aa471aa; it keeps host permission prompts and
  tool usage conditions as boundaries, as does `loop-engineering` › Phase
  Progression › Injected Instructions and Gates.
- **Counterexample:** in each of three cases the installed rule carries the
  matching grant forward and asks only for an absent or expanded effect. The
  human confirmed delivery and the plan is then revised. A fresh session resumes
  the run with the confirmation recorded in run state. The human granted a
  subagent spawn needed before the plan gate, and the roles after the gate need
  the same kind of spawn.
- **What this project does instead:** where the host conditions pull request
  creation or a subagent spawn on the user's explicit request, the run asks it
  again in three cases: with every revised plan; once, before any further
  change, in a fresh session whose own conversation lacks the confirmation; and,
  for a subagent needed before the plan gate, once at that first need and again
  at the plan gate for the roles after it.
- **Why:** the host decides what counts as the user's explicit request, and it
  judges that in the current conversation, so a recorded answer cannot stand in
  for it. The installed section itself keeps that host boundary above any grant.
  An unobtained request leaves the gate it serves reported unmet.
- **Scope:** operations the host conditions on the user's explicit request, that
  is, opening the pull request and spawning a subagent. Every other effect a
  valid grant covers is carried forward as installed.
- **Adopted by:** the maintainer's merge of #79, and of #80, which rewrote the
  entry.
- **Reassess when:** the installed section changes, or the host changes what it
  accepts as the user's explicit request.

### Deviation — watching conditioned on the human's confirmation

- **Installed rule:** `loop-engineering` › Post-Push Review and Readiness ›
  Waiting Bound, checked at aa471aa, which requires using a subscription route
  when one exists.
- **Counterexample:** the human declines watching at the plan gate while the
  host's pull request activity subscription exists. The installed rule requires
  subscribing; this project does not.
- **What this project does instead:** the run subscribes only when watching was
  confirmed. When it was declined, each CI or review result becomes a human wait
  and nothing is scheduled in its place; `CLAUDE.md` states the rule and its
  narrow exception.
- **Why:** the maintainer's policy makes watching a question put to the human at
  the plan gate, as part of the explicit requests the run collects there.
- **Scope:** the pull request activity subscription. Once watching is confirmed,
  the installed waiting rule applies as installed, including its ban on a
  scheduled check-in beside a subscription.
- **Adopted by:** the maintainer's merge of #80.
- **Reassess when:** the installed section changes, or `CLAUDE.md` changes the
  watching question.

### Deviation — reviewer instances that cannot be closed or checked

- **Installed rule:** `loop-engineering` › Selecting Review Workflows › Review
  Session and Thread Cleanup, checked at aa471aa.
- **Counterexample:** the installed rule has the run retain each review child's
  checkable identity and close the child after its result is verified, with a
  concrete host-specific handoff when it cannot. Three cases leave the run no way
  to do either. A finished reviewer in a local session can only have its row
  cleared from the task list, and it stays resumable. For any reviewer in a cloud
  session the host documents no step that ends it, and archiving the session or
  letting its environment expire does not end it. A plan-review or pre-push
  reviewer posts nothing, so its identity is a label, and the host marks the
  agent id that could stand for it as not for user-facing text.
- **What this project does instead:** the run never messages or resumes a
  reviewer instance, and records each one by role, round, reviewed commit and end
  and, for a fallback post-push reviewer, the locator of its posted review. It
  reports each instance it cannot close as unclosed, naming it by that record, and
  still completes and may mark the pull request ready.
- **Why:** the host documents no step that closes a finished reviewer, so a
  handoff with a concrete step cannot be written, and the agent id is not for
  user-facing text, so it cannot serve as the identity the run records and
  reports.
- **Scope:** reviewer subagents on Claude Code. The section's other limbs still
  apply: the run verifies the posted result, records the round and the locator,
  and asks for cleanup permission where a permission boundary prevents closure.
- **Adopted by:** the maintainer's merge of the pull request that closes #83.
- **Reassess when:** the host documents a step that closes a reviewer instance or
  a checkable identity for one, or the installed section changes.

### Gap — `application-security` is silent on authentication lockout and session-cookie ownership

- **Uncovered concern:** `application-security` presents itself as an OWASP Top
  10:2025 lens, and that list's A07 is Authentication Failures, to which the
  installed coverage table routes no reference. At aa471aa its references cover
  secrets, input validation, injection, SSRF, privacy and exposure, and supply
  chain, but not authentication itself. Two rule
  classes any project with a login needs have no home in the installed set:
  - **Lockout thresholds.** A lockout duration below 5 minutes, a max-attempt
    count above 5, or the removal of the lockout configuration block entirely.
    Lockout is the only cost imposed on password guessing, so relaxing it turns
    a login form into a brute-force oracle, and it relaxes in a one-line diff
    that reads like a config tweak.
  - **Session-cookie ownership.** A component or request handler reading or
    writing session cookies directly instead of going through the project's
    authentication system, or implementing its own auth cookie or token beside
    the one that system already provides. Cookie names, flags, and rotation are
    that system's internal details, so a second reader desyncs silently whenever
    it changes them.
- **Adjacent coverage:** none of the installed skills states either rule.
  `next-app-development` covers session-cookie attributes and that a cookie's
  presence is not proof of authentication, but this project does not
  necessarily install it, and the rules apply to any project with a login.
- **Scope:** a project with authentication. Until the gap closes, such a project
  states these thresholds in its own `docs/conventions/security.md` and reviews
  against them there.
- **Adopted by:** the maintainer's merge of #79, and of #80, which rewrote the
  entry.
- **Reassess when:** the installed `application-security` changes, or a refresh
  installs a skill that states either rule. A proposal upstream follows
  `agent-skill-management` and waits on the human's go-ahead; none is recorded
  here.
