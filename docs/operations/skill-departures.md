---
type: SkillRegister
title: Skill departures
description: Approved local deviations, gaps in the installed skills, and the conditions for reassessing each entry.
---

# Skill departures

Reviewers use this register to decide whether a departure from an installed
rule has an accepted local resolution. A deviation records a deliberate
collision with an installed rule. A gap records an uncovered concern the
project has encountered. A departure without a matching entry is a review
finding.

[Agent Skill Management](../../.claude/skills/agent-skill-management/SKILL.md)
owns verification against the installed text and the process for proposing an
upstream correction. Publishing a proposal requires the human's go-ahead.

## The Register

An entry records a decision the human accepted, with its reason. A hypothetical
or anticipated collision MUST NOT be entered: a deviation is recorded when it is
accepted, not when it is expected.

<!-- INIT: every entry below ships with the template and is real, not an
example. Keep the three Claude Code entries, the combined plan-gate
confirmation, the explicit request asked again, and watching conditioned on the
human's confirmation, for as long as `CLAUDE.md` keeps the behavior each
records: each travels with the canonical `CLAUDE.md`. Replace each entry's
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
- **What this project does instead:** the [Claude Code plan-gate confirmation](../../CLAUDE.md#confirming-delivery-at-the-plan-gate) asks
  all four in one `AskUserQuestion` call of at most four questions.
- **Why:** the host conditions pull request creation and subagent spawning on
  the user's explicit request, and the plan-approval exchange is where the human
  is already answering. The maintainer approved combining them rather than
  asking again after approval. The entry is permanent because the confirmation
  travels with the canonical `CLAUDE.md`.
- **Scope:** the plan-gate confirmation only. Every other decision a run puts to
  the human follows the installed rule, in dependency order.
- **Adopted by:** the maintainer merged [PR #79](https://github.com/axross/claude-loop-template/pull/79)
  and the revised entry in [PR #80](https://github.com/axross/claude-loop-template/pull/80).
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
- **Adopted by:** the maintainer merged [PR #79](https://github.com/axross/claude-loop-template/pull/79)
  and the revised entry in [PR #80](https://github.com/axross/claude-loop-template/pull/80).
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
  and nothing is scheduled in its place. See the [Claude Code waiting rule](../../CLAUDE.md#waiting-on-a-pull-request) for the exception.
- **Why:** the maintainer's policy makes watching a question put to the human at
  the plan gate, as part of the explicit requests the run collects there.
- **Scope:** the pull request activity subscription. Once watching is confirmed,
  the installed waiting rule applies as installed, including its ban on a
  scheduled check-in beside a subscription.
- **Adopted by:** the maintainer merged [PR #80](https://github.com/axross/claude-loop-template/pull/80).
- **Reassess when:** the installed section changes, or `CLAUDE.md` changes the
  watching question.

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
- **Adopted by:** the maintainer merged [PR #79](https://github.com/axross/claude-loop-template/pull/79)
  and the revised entry in [PR #80](https://github.com/axross/claude-loop-template/pull/80).
- **Reassess when:** the installed `application-security` changes, or a refresh
  installs a skill that states either rule. A proposal upstream follows
  `agent-skill-management` and waits on the human's go-ahead; none is recorded
  here.
