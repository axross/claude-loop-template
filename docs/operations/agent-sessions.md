# Agent Sessions

How a Claude Code session starts in this project, the hooks that run during
one, the subagents it can spawn, and the one setting that cannot be verified
from inside a session at all. [`CLAUDE.md`](../../CLAUDE.md) is the Claude Code
entry: it loads `AGENTS.md` and adds how this host meets the project's gates,
which this document does not restate.

## The Session-Start Hook

In a cloud session, [`.claude/hooks/session-start.sh`](../../.claude/hooks/session-start.sh)
provisions the toolchain, copies `.env.example` to `.env.local` if one does not
exist, materializes the opt-in quality hooks, installs dependencies, and echoes
a pointer to [`AGENTS.md`](../../AGENTS.md) so every session carries the working
agreement into its context.

It exits immediately unless `CLAUDE_CODE_REMOTE=true`, because a local session
manages its own toolchain and should not have one installed under it. Set that
variable by hand to exercise the hook locally.

The toolchain block activates a version manager only when one is **already**
present. It MUST NOT be changed to install one unconditionally: an image that
already ships a usable runtime does not need one, and a hard `curl | sh` turns
a transient network failure into a failed session start — a failure that
surfaces as every later command missing its tools rather than as an install
error.

The hook is wired in [`.claude/settings.json`](../../.claude/settings.json),
which also sets the session's default reasoning effort — `effortLevel`, shipped
as `xhigh`. Both are read at session start, so a change to either reaches only
the next session.

The reminder is a neutral pointer: it tells the session to read `AGENTS.md`,
follow its Response Approach, and load its prerequisites before planning,
delegating, or editing. It deliberately says nothing about how those rules
relate to the instructions a runtime injects — that rule belongs to
`loop-engineering`, and `CLAUDE.md` states how Claude Code meets it — so the
startup echo never has to be edited when that wording moves.

## The Opt-In Quality Hooks

Format-on-edit and check-before-stop are **opt-in**. They live in
[`.claude/settings.local-example.json`](../../.claude/settings.local-example.json),
which the session-start hook copies to the gitignored `settings.local.json` in a
cloud session; Claude Code hot-reloads them for that session. A local session
skips the hook entirely, so opting in there stays a manual copy.

That example file also pre-approves exactly two tools: the pull request
activity subscription and its release, `subscribe_pr_activity` and
`unsubscribe_pr_activity` of the Remote MCP server. They are not a convenience:
the run waits for CI and review results through that subscription, and without
the grant each call raises a permission prompt that an unattended session cannot
answer. The example grants nothing that schedules a wake; `CLAUDE.md` lists the
scheduling tools its waiting rule covers and states how the run waits.

Format-on-edit fires only for a file changed through `Edit`, `Write`, or
`MultiEdit` — the `PostToolUse` matcher's scope, deliberately not widened — so
a file changed another way (a Bash heredoc, `sed -i`) reaches `Stop`
uncorrected regardless of which check below would have repaired it.

A blocking `Stop` check fires only after the agent believes the task is
finished, so a failure there costs a whole main turn: read the failure,
re-plan, fix, stop again. That cost is why the placement question exists at
all, and it is answered the same way for every check this project runs:
whether a check belongs at `Stop` or earlier at `PostToolUse` turns on whether
its repair needs an authoring decision or is purely mechanical.

- Where the project keeps `format.sh`'s per-file lint-autofix step, the
  linter's violations that the autofix repairs are **non-blocking**, because
  `format.sh` reaches the file first — see
  [`format.sh`](../../.claude/hooks/format.sh). The hook's file filter admits
  the union of the whole-project formatter's own file set and the autofix's
  file set: the formatter takes no file argument and reformats the whole
  project regardless of which file changed, so narrowing the filter to the
  formatter's file set alone would skip the formatter for a file that only
  the autofix cares about. The autofix step itself then runs only for a file
  that also falls in its own file set and lives under the project root,
  before the whole-project formatter runs — its alternative in the filter
  carries that same project-root anchor, while the formatter's alternative
  does not, since the formatter's reach outside the project root is
  pre-existing, unrelated behaviour. Each file set is a shell `case` pattern:
  where one lists alternatives, each needs its own `"$PROJECT_DIR"/` prefix,
  because a `case` pattern does not distribute a prefix across `|`-joined
  alternatives — see [`tokens.json`](../../tokens.json).
- The linter's violations that the autofix cannot repair — or, for a project
  that drops the autofix step, all of the linter's violations — are
  **blocking**, because the correct repair is an authoring decision no hook
  can make.
- Where the project keeps a unit test run, it is **blocking** for the same
  reason: a failing test has no mechanical repair.
- The change-in-flight reminder below is **already non-blocking**, and MUST
  stay so, since a false positive that halts an agent mid-delivery costs more
  than the reminder saves.

[`check.sh`](../../.claude/hooks/check.sh) never attempts a repair itself, by
design rather than oversight: a repair applied at `Stop` can land in the working
tree after the agent has already committed and pushed, so the pushed commit
would keep the violation while the hook reported success. It blocks completion
on a failing lint run and, where the project keeps one, a failing unit test run,
and separately emits a non-blocking reminder when the branch has commits ahead
of the default branch that are **all pushed** and the tree is clean. That state
is what a change loop looks like when it stopped between the push and the pull
request, and the hook's own change gate would otherwise read it as "nothing
pending". The hook cannot ask GitHub whether a pull request exists, so it
reminds rather than blocks.

## Subagents

[`.claude/agents/`](../../.claude/agents/) holds three definitions, and it is
the only home for any of them: an agent definition is not a skill, so the
skills CLI never carries it, and it never appears in `skills-lock.json`. The
three are shared definitions, written to be copied verbatim into any repository
that adopts them: none names a repository, and the marker a posted review
carries is the one `AGENTS.md` declares. `AGENTS.md` carries the standing
request that agents delegate to them; `CLAUDE.md` secures the explicit request
the host asks for.

### Roles

`loop-engineering` owns which work the main agent keeps and which a reader, a
writer, or a reviewer takes, and how a brief and a hand-back are bounded (the
Delegation Matrix). What is this repository's own is which definition serves
which role:

- **Reader: `investigator.md`.** It denies editing and spawning, and sends an
  unresolved judgment call back to whoever asked.
- **Writer: `implementer.md`.** It states its delivery boundary, commits stay
  local and pushing and publishing belong to whoever asked, in its own prose
  rather than by withdrawing a tool.
- **Reviewer: `reviewer.md`**, described next.

Each definition sets its own model, so a worker does not inherit the session's
model at the main actor's cost. The investigator and the implementer run at high
effort and the reviewer at xhigh.

### The Reviewer

`reviewer.md` serves all three reviews that `loop-engineering`
defines, and every round of every review is a fresh instance.
[Development Workflow](./development-workflow.md#the-three-reviews) states this
repository's choices for them. Used for plan review or
pre-push review it returns its report to the main agent and posts nothing. Only
when its prompt assigns it as a round's post-push review of a named pull
request — naming the pull request, the round, the head commit, and the author's
checkout path — does it post, as exactly one COMMENT-type review; a prompt that
does not assign it that way permits no posting. It denies exactly two things,
editing and spawning, and nothing else. Widening that deny-list is the tempting
mistake and MUST be resisted: judging a change means confirming what was asked
and not only what was written, which reaches the issue, the plan's artifacts,
and the documentation behind a factual claim. A reviewer that cannot reach one
of those does not fail to start — it returns a report short by exactly those
checks, and an under-equipped review reads exactly like a clean one.

### When a Definition Is Missing

Deleting any of the three files degrades gracefully rather than breaking the
loop. Without the implementer, the loop delegates to a generic agent or runs
single-agent; without the reviewer, each review gate that routes through it —
plan review, pre-push review, and the fallback post-push review — is reported
unmet rather than performed by the main actor, which is what keeps it from
collapsing into self-review; without the investigator, the main actor reads the payload
itself, per read, paying in its own context what delegating the read would
otherwise have saved.

## Telemetry Tagging

[`.claude/settings.json`](../../.claude/settings.json) carries an `env` block
stamping the repository name and the session's launch surface onto the
OpenTelemetry resource attributes Claude Code exports, so this project's usage
separates from every other repository sharing an account or a cloud
environment. It configures nothing else — no endpoint, no credential, no
`CLAUDE_CODE_ENABLE_TELEMETRY` — so a contributor who has never set telemetry
up sees no behavior change from it.

Verifying a change to that block is the catch: Claude Code does not pass `OTEL_*`
variables to the subprocesses it spawns, so `echo $OTEL_RESOURCE_ATTRIBUTES`
inside a session prints nothing even when the exporter holds the value. Confirm
it in the metrics backend instead, against a session started **after** the
change — an already-running session read its configuration at startup.
