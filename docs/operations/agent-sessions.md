# Agent Sessions

How a Claude Code session starts in this project, the settings file that wires
it, the hooks that run during one, the subagents it can spawn, and the one
setting that cannot be verified from inside a session at all.
[`CLAUDE.md`](../../CLAUDE.md) is the Claude Code entry: it loads `AGENTS.md` and
adds how this host meets the project's gates, which this document does not
restate.

## The Settings File

[`.claude/settings.example.json`](../../.claude/settings.example.json) is the one
settings file this repository commits. It wires the `SessionStart` hook and the
two quality hooks, sets the session's default reasoning effort, tags telemetry,
and pre-approves the two pull request activity subscription tools. A session
reads it as `.claude/settings.json`, which is gitignored, so every checkout
holds its own copy and something has to make that copy:

- **A local session:** copy it once by hand,
  `cp -n .claude/settings.example.json .claude/settings.json`.
- **A cloud session:** the cloud environment's setup script copies it. Add the
  snippet below to the setup script of every environment that runs this
  repository. It copies each repository's `.claude/settings.example.json` to
  `.claude/settings.json` when the target is missing, skips a repository that
  has no example, and exits 0 whatever it finds, because a non-zero exit fails
  the session start. It starts from the directory that holds the checkouts, which
  is where the host runs a setup script.

```bash
for ex in */.claude/settings.example.json; do
  [ -f "$ex" ] || continue
  target="${ex%settings.example.json}settings.json"
  [ -e "$target" ] || cp "$ex" "$target" || echo "could not create $target" >&2
done
```

The template cannot change a consumer's cloud environment, so each maintainer
adds the snippet to their own.

### Where the Copy Takes Effect

Claude Code reads `.claude/settings.json` in a local session and in a cloud
session that has exactly one repository, outside a project's threads. A
multi-repository cloud session reads only its plugin keys, and a project thread
applies none of the repository's permission rules, hooks, or `env`. The settings
file has no effect in either case, and `.claude/settings.local.json` is never
read in a cloud session.

Without the copy, a session runs on Claude Code's defaults: no `SessionStart`
hook, no default effort, no telemetry tagging, no pre-approved subscription
tools, and no quality hooks.

To check, run `ls .claude/settings.json`, or open `/status` and read its setting
sources. To fix a missing copy, run the `cp` command in a local session. In a
cloud session, add the snippet to the environment's setup script and start a new
session.

### Caveats

- **A cached environment.** Claude Code's documentation says the setup script is
  skipped when a cached environment snapshot exists. Whether a copy made while
  the cache was built survives into later sessions' fresh clones, and whether
  Claude Code reads an untracked `settings.json` that a setup script placed, are
  unverified. After you add the snippet, confirm both with two consecutive
  sessions: check the copy in each.
- **A git worktree.** A session started inside a worktree (for example
  `claude --worktree`) lacks the ignored copy unless a `.worktreeinclude` file
  lists `.claude/settings.json`. A subagent that runs in a worktree still runs the
  session's hooks.
- **Drift.** A copy does not follow later changes to the example.
  `cmp .claude/settings.example.json .claude/settings.json` shows the difference.
- **An existing clone.** The change that introduced this layout stopped tracking
  `.claude/settings.json`. Pulling it deletes a clone's unmodified copy, so copy
  the example again. A locally edited copy makes the pull stop; copy it aside
  first and merge its keys into your new copy.
- **User settings.** `~/.claude/settings.json` is a different file and is
  unaffected.

## The Session-Start Hook

In a cloud session, [`.claude/hooks/session-start.sh`](../../.claude/hooks/session-start.sh)
provisions the toolchain, copies `.env.example` to `.env.local` if one does not
exist, installs dependencies, and echoes a pointer to
[`AGENTS.md`](../../AGENTS.md) so every session carries the working agreement
into its context. It runs only where the copy of the settings file exists,
because that file wires it; the hook cannot create the copy it depends on.

It exits immediately unless `CLAUDE_CODE_REMOTE=true`, because a local session
manages its own toolchain and should not have one installed under it. Set that
variable by hand to exercise the hook locally.

The toolchain block activates a version manager only when one is **already**
present. It MUST NOT be changed to install one unconditionally: an image that
already ships a usable runtime does not need one, and a hard `curl | sh` turns
a transient network failure into a failed session start — a failure that
surfaces as every later command missing its tools rather than as an install
error.

The hook is wired in [`.claude/settings.example.json`](../../.claude/settings.example.json),
which also sets the session's default reasoning effort — `effortLevel`, shipped
as `xhigh`. Both are read at session start, so a change to either reaches only
the next session, and only where the copy is made again.

The reminder is a neutral pointer: it tells the session to read `AGENTS.md`,
follow its Response Approach, and load its prerequisites before planning,
delegating, or editing. It deliberately says nothing about how those rules
relate to the instructions a runtime injects — that rule belongs to
`loop-engineering`, and `CLAUDE.md` states how Claude Code meets it — so the
startup echo never has to be edited when that wording moves.

## The Quality Hooks

Format-on-edit and check-before-stop live in
[`.claude/settings.example.json`](../../.claude/settings.example.json), beside
the `SessionStart` wiring, so they apply wherever the copy of that file exists,
unattended cloud sessions included. There, `check.sh` blocks the main agent's
stop on a failing lint or unit test run, and the agent has to fix it before it
can finish. It does not run at a subagent's stop. A project that does not want
the hooks removes their two entries from the example.

That example file also pre-approves exactly two tools: the pull request
activity subscription and its release, `subscribe_pr_activity` and
`unsubscribe_pr_activity` of the Remote MCP server. They are not a convenience:
the run waits for CI and review results through that subscription, and without
the grant each call raises a permission prompt that an unattended session cannot
answer. The grants apply only where the copy is read, so a session without one
meets that prompt. The example grants nothing that schedules a wake; `CLAUDE.md`
lists the scheduling tools its waiting rule covers and states how the run
waits.

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

`reviewer.md` serves all three reviews that `loop-engineering` defines;
[Development Workflow](./development-workflow.md#the-three-reviews) states this
repository's choices for them. Used for plan review or pre-push review it
returns its report to the main agent and posts nothing. Only
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

[`.claude/settings.example.json`](../../.claude/settings.example.json) carries an
`env` block stamping the repository name and the session's launch surface onto
the OpenTelemetry resource attributes Claude Code exports, so this project's
usage separates from every other repository sharing an account or a cloud
environment. The tagging applies only where the copy of the file exists. The
block configures nothing else — no endpoint, no credential, no
`CLAUDE_CODE_ENABLE_TELEMETRY` — so a contributor who has never set telemetry
up sees no behavior change from it.

Verifying a change to that block is the catch: Claude Code does not pass `OTEL_*`
variables to the subprocesses it spawns, so `echo $OTEL_RESOURCE_ATTRIBUTES`
inside a session prints nothing even when the exporter holds the value. Confirm
it in the metrics backend instead, against a session started **after** the
change — an already-running session read its configuration at startup.
