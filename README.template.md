# {{PROJECT_NAME}}

<!-- INIT: this file is the SEED for the initialized project's README. During
INIT Step 7, finalize it: `git mv -f README.template.md README.md` (replacing
the template's own README; merge instead when the repository already had a
real README — see INIT Step 0), fill every prose gap flagged by an `INIT:` comment
from the Stack Decision Record and the Step-1 interview answers, resolve every
`INIT:OPTIONAL` marker below, and delete all `INIT` comments — including this
one. -->

{{PROJECT_OVERVIEW}}

<!-- INIT: expand the one-liner above into a short paragraph from the Step-1
interview — what the project is, who it serves, and its current goal. -->

## Tech stack

| Area | Tool |
| ---- | ---- |
| Language | {{PRIMARY_LANGUAGE}} |
| App framework / runtime | {{APP_FRAMEWORK}} |
| Package manager | {{PACKAGE_MANAGER}} |
| Linting & formatting | {{LINTER}} / {{FORMATTER}} |
| Unit tests | {{UNIT_TEST_FRAMEWORK}} <!-- INIT:OPTIONAL key=UNIT_TESTS — fill the token OR delete this row if the project has no unit suite. --> |
| E2E tests | {{E2E_TEST_FRAMEWORK}} <!-- INIT:OPTIONAL key=E2E_TESTS — fill the token OR delete this row if the project has no e2e suite. --> |
| Data / content layer | {{CMS_OR_DATA_LAYER}} <!-- INIT:OPTIONAL key=DATA_LAYER — fill the token OR delete this row if the project has no data/content layer. --> |
| Hosting | {{HOSTING_PLATFORM}} <!-- INIT:OPTIONAL key=HOSTING — fill the token OR delete this row if the project has no hosting platform yet. --> |

<!-- INIT: add rows a newcomer needs from the Stack Decision Record (state
management, styling, ORM/db wrapper, error tracker, logger, …); keep the table
to what the project actually uses. -->

## Getting started

1. Install dependencies: `{{INSTALL_CMD}}`
2. Start developing: `{{DEV_CMD}}`
   <!-- INIT: for a project without a dev server (CLI, library), reword this
   step to the project's run/watch equivalent. -->
3. Production build and start: `{{BUILD_CMD}}`, then `{{START_CMD}}`
   <!-- INIT:OPTIONAL key=BUILD_STEP — keep and fill OR delete this step if the project has no build step. -->

<!-- INIT: add the real prerequisites — runtime/toolchain version, `.env.local`
setup, database or services to start — from the project's actual needs (see
`.claude/hooks/session-start.sh` for what cloud sessions provision). -->

## Development workflow

Development in this repository is agent-assisted via
[Claude Code](https://claude.com/claude-code). The working agreement lives in
[`AGENTS.md`](./AGENTS.md) (loaded through `CLAUDE.md`) and routes to the
detailed skills under [`.claude/skills/`](./.claude/skills). Human and agent
contributors follow the same loop: plan → implement → self-review → verify →
report.

<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — Fixed: the independent-review channel and `/address` are fixed infrastructure (INIT.md Step 4), so KEEP the workflow subsections below; just delete this marker (and adapt the copy to the project's stack). -->
### `/address` — deliver a unit of work end-to-end

[`/address`](./.claude/skills/address/SKILL.md) is the main delivery entry point.
It takes one unit of work — a GitHub issue, a pull request, or a free-form
prompt — from intake to a merge-ready pull request in a single continuing
session:

1. **Plan** — reads the issue and its thread, asks you the product and scope
   questions the spec leaves open, and rewrites the issue body into a
   reviewable plan with acceptance criteria. It then **always pauses for your
   approval**: it verifies nothing gets built until you review the plan and
   send `/address continue`.
2. **Code + verify** — implements the approved plan (on a separate worktree
   unless it is running in a Claude Code cloud environment, so it never blocks
   your working copy) on an agent-namespaced branch, runs the checks the
   changed surface requires, and self-reviews the diff.
3. **Independent review** — opens a draft pull request and requests the CI
   reviewer, a separate bot session, so the code's author never certifies its
   own work.
4. **Address** — fixes review findings and CI failures, tying each resolved
   thread to the resolving commit, for up to eight rounds.
5. **Ready** — flips the pull request to ready once CI is green and the review
   is clean. Merging always stays a human decision.

Practical examples:

```text
/address https://github.com/OWNER/REPO/issues/42   # deliver issue #42 end-to-end
/address 57                                        # resume delivery of open PR #57
/address The 404 page should link back home        # no issue yet: files a tracking
                                                   #   issue, then delivers it
/address continue                                  # approve a paused plan, or resume
                                                   #   after you answer a question,
                                                   #   leave PR comments, or start a
                                                   #   fresh session from a /handoff
                                                   #   package
```

Every run pauses after the plan for your approval, and pauses again whenever it
genuinely needs a human — an ambiguous requirement, a judgment call on
conflicting changes — and `/address continue` picks it back up where it
stopped.

### `@claude review` — get findings on any PR

Comment **`@claude review`** on a pull request to run this repository's review
policy ([`REVIEW.md`](./REVIEW.md)) — severity-tagged findings with `file:line`
evidence and concrete fixes, posted as inline comments by the CI reviewer
([`claude-review.yaml`](./.github/workflows/claude-review.yaml)). Use it for a
pre-merge check on a hand-written change or a second opinion before merging; the
same review runs automatically against `/address` pull requests.

<!-- INIT:OPTIONAL key=SESSION_HANDOFF — Fixed: `/handoff` is fixed infrastructure (INIT.md Step 4), so KEEP this subsection; just delete this marker. -->
### `/handoff` — suspend work for another session

[`/handoff`](./.claude/skills/handoff/SKILL.md) packages in-progress work — goal,
current state, remaining to-dos, uncommitted changes — into a downloadable
`handoff-<epoch>.md` (plus an optional zip of supporting files). Use it when a
session is running low on context, or to park work for later; a fresh session
(yours or a teammate's) takes the package over with `/address continue`.

<!-- INIT:OPTIONAL key=PREVIEW_ENVIRONMENTS — keep & adapt this subsection when the project has per-PR preview environments (INIT Step 1d) OR delete it. -->
### Preview environments — review every PR live

Each pull request gets its own preview environment with a **stable per-PR
link** — a preview URL for a web project, an installable build's distribution
link for a mobile app — posted to the PR as a fresh comment on every deploy
(each recording the deployed commit) and torn down when the PR closes. The
pipeline is inert until its hosting/distribution secrets are configured; see
[preview-environments](./.claude/skills/development-guidelines/references/preview-environments.md)
for the setup and rules.

Changes made without an agent follow the same bar: branch, implement, run the
checks below, open a pull request, and get it reviewed before merge.

## Testing

<!-- INIT: describe the testing strategy in a sentence or two — what unit
tests cover versus e2e, and which checks gate a merge. -->

| Check | Command |
| ----- | ------- |
| Format | `{{FORMAT_CMD}}` |
| Lint | `{{LINT_CMD}}` |
| Type-check | `{{TYPECHECK_CMD}}` <!-- INIT:OPTIONAL key=TYPED_LANGUAGE — delete this row for an untyped language. --> |
| Unit tests | `{{UNIT_TEST_CMD}}` <!-- INIT:OPTIONAL key=UNIT_TESTS — delete this row if the project has no unit suite. --> |
| E2E tests | `{{E2E_TEST_CMD}}` <!-- INIT:OPTIONAL key=E2E_TESTS — delete this row if the project has no e2e suite. --> |

Run format + lint after every change, and the suites relevant to the changed
surface before opening a pull request — see the Verification section of
[`AGENTS.md`](./AGENTS.md).

## Related links

<!-- INIT: list the project's real links collected in the Step-1 interview —
docs, issue tracker, deployment dashboard, design files, staging URL — or
delete this section if there are none. -->

- …
