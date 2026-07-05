# INIT Instantiation Practice — Findings

Practice run: the template was instantiated as a **Next.js 16 todo app**
(TypeScript, npm, ESLint + Prettier added, Vitest added, Playwright added,
scenario coverage skipped, error tracker dormant, logger skipped, no data
layer, no auth, Vercel, GitHub operations + independent review kept).
Every INIT step (0–7) was executed for real on this branch; all gates pass
(`format`, `lint`, `typecheck`, 7 unit tests, `build`, 4 e2e tests,
link check, token gate).

## Template defects found

1. **Invalid import specifier from `{{E2E_TEST_FRAMEWORK}}`** —
   `e2e-testing-guidelines/references/conventions.md` used the framework
   _display name_ token as an import source: after substitution the examples
   read `import { test } from "Playwright"`, which is wrong for every possible
   token value (the package is `@playwright/test`). Occurred in 4 code blocks.
2. **Double slash from `{{TEST_DIR}}`'s trailing slash** — `tokens.json`
   itself suggests `e2e/` as the example value, while the docs write
   `{{TEST_DIR}}/tests/...` and `@/{{TEST_DIR}}/helpers/...`; substitution
   yields `e2e//tests/` across `structure.md` and `conventions.md`. Either the
   example value must drop the trailing slash or the templates must not append
   one.
3. **INIT Step-4 data-layer removal list is incomplete** — it names
   `development-guidelines`, `application-security-requirements`, and
   `performance-and-reliability-requirements`, but `maintainable-code-guidelines`
   also carries a `key=DATA_LAYER` marked section (`abstraction-boundaries.md`)
   plus **unmarked** `{{CMS_OR_DATA_LAYER}}` occurrences
   (`abstraction-boundaries.md` top section, `naming-and-organization.md`
   tier table and bullets). Only the token gate catches these; the marker walk
   does not.
4. **Unmarked optional-token occurrences in general** — `{{CMS_OR_DATA_LAYER}}`
   / `{{ERROR_TRACKER}}` / `{{LOGGER}}` appear outside any `INIT:OPTIONAL`
   section: `current-docs.md` (table rows + MUST bullets), `verification.md`
   (output-surface table row), the `application-security` SKILL.md intro, and
   the (now deleted) `data-access-efficiency.md` intro. Each required ad-hoc
   judgment with no deletion guidance. Suggestion: every occurrence of an
   optional token should sit inside a marked section, or the capability
   bullets in Step 4 should enumerate these stragglers the way the
   INDEPENDENT_REVIEW bullet does.
5. **`dev-commands.md` omits the unit-test and typecheck commands** — the
   Quality Commands table listed only format/lint/e2e even though
   `{{UNIT_TEST_CMD}}` and `{{TYPECHECK_CMD}}` are tokenized and `check.sh`
   runs the unit suite. Added during instantiation.
6. **Conditional hedges exist outside `AGENTS.md`** — "when the project has an
   e2e suite / build step" clauses live in `dev-commands.md`,
   `code-quality.md` (check-sequence step 5), `verification.md`, and
   `unit-test-guidelines/review-checklist.md`, but the completion checklist
   only instructs resolving the hedges in `AGENTS.md`'s Verification section.
7. **Token substitution inside template-note prose yields nonsense** —
   examples after `apply`:
   - `code-quality.md`: "_If TypeScript has no static type system, delete this
     section during INIT._"
   - `structure.md`/`conventions.md`: "Code examples below use Playwright APIs…
     Translate them to `Playwright`'s equivalents during INIT." (circular)
   - `format.sh`/`check.sh` comments: "rest. *.ts | *.tsx | *.css: a
     case-pattern of extensions, e.g. …"
     Notes that mention a token should be phrased to survive substitution (use
     neutral wording) since `apply` rewrites them before the notes are deleted.
8. **Copy-paste marker artifacts in the performance skill** — the streaming
   section is marked `key=REVIEW` (clearly mislabeled), and the
   REVIEW/COMPILER/RENDERING/LOCALE markers all say "keep & fill the token"
   although those sections contain no token.
9. **Stale toolchain claim in `code-quality.md`** — "`lint` enforces both lint
   rules and format rules; some format violations are only caught by the lint
   step" is inherited from the source project's toolchain and is false for
   ESLint + `eslint-config-prettier`. Fixed during instantiation, but the
   template states it unconditionally.
10. **`init.values.json` comment stripping is fragile** — `apply` strips
    `(^|\s)//…` line comments, so any _value_ containing a space followed by
    `//` would be corrupted. Unlikely but silent.

## Interaction traps hit during the practice

11. **`create-next-app` now generates `AGENTS.md` + `CLAUDE.md`** — Step 0's
    warning is accurate and necessary; the scaffold's `AGENTS.md` carries a
    load-bearing rule (Next.js 16: read `node_modules/next/dist/docs/`), which
    was folded into the Project Overview and `current-docs.md`. Worth naming
    this concrete example in Step 0.
12. **Scaffold `.gitignore` vs the session-start hook** — `create-next-app`
    ignores `.env*`, which would also ignore the `.env.example` that
    `session-start.sh` copies from. A naive Step-0 gitignore merge breaks the
    hook's env bootstrapping; the merge guidance doesn't warn about it.
13. **No path for the "no auth" project** — `auth-and-session.md` (whole file)
    and `access-control.md` presume an authentication system and a data layer;
    only their tracker/analytics subsections are marked optional. For a
    client-only app both files had to be deleted wholesale, with the inbound
    links (skill SKILL.md sections, cross-references) discovered manually via
    the link checker. An `AUTH`-keyed marker (or a Step-4 bullet like the
    data-layer one) would make this a listed path.
14. **`react-hooks/set-state-in-effect` rejects the classic localStorage-load
    pattern** — Next.js 16's ESLint preset (react-hooks v6) flags
    `setTodos(loadTodos())` in a mount effect, which is exactly the shape the
    observability skill's root-call-site examples steer toward for client
    persistence. Resolved with `useSyncExternalStore`; the component-skill
    archetype could mention this for client-persisted state.
15. **Ordering friction between Steps 2/3/4** — the Project Overview contains
    tokens, so running `apply` first produces redundant prose ("**todo-app**
    is a web app. A minimal todo web app: …") that Step 2 then hand-fixes; and
    `apply` refuses to run until the optional-token rows for _skipped_
    capabilities are deleted from `tokens.json`/`init.values.json`, forcing
    Step-4 decisions to be made (at least implicitly) before Step 3 can
    complete. Reordering INIT as "interview → prune manifest → apply →
    overview" would match the real flow.
16. **Step 4 is the bulk of the work** — ~40 markers across ~25 files, several
    needing judgment beyond the marker text (trim vs delete vs dormant vs
    adapt, e.g. logger-skip-but-tracker-dormant inside one skill). Authoritative
    per-capability site lists (as INDEPENDENT_REVIEW already has) for
    DATA_LAYER, LOGGER, and ERROR_TRACKER would make the walk mechanical.
17. **Step 1 interview vs autonomous runs** — the interview is a MUST, but an
    unattended agent session cannot ask. This practice emulated answers and
    documented them; INIT could define a sanctioned fallback (infer from the
    scaffold/manifest, record the assumed answers, flag them for review).
18. **First `npm run format` reformats the entire skill core** — Prettier
    rewrote `.claude/**` markdown tables, `settings.json` (tabs → spaces), and
    workflow YAML in a single huge diff mixed in with real changes. A note to
    run the formatter once immediately after INIT (as its own commit) would
    keep instantiation diffs reviewable.
19. **Sandboxed-environment e2e** — the cloud session ships pre-provisioned
    Playwright browsers that didn't match the freshly installed
    `@playwright/test`; the run needed an `executablePath` override (now
    supported via `PLAYWRIGHT_CHROMIUM_PATH` in `playwright.config.ts`). The
    e2e commands reference could mention this class of environment.

## What worked well

- `init.sh apply`'s literal substitution handled the metacharacter tokens
  (`CODE_FILE_GLOB`, `CODE_FILE_REGEX`) exactly as advertised; the token gate
  and `tools/check-links.py` caught every straggler and dangling link the
  manual walk missed (notably after deleting `access-control.md`,
  `logging.md`, `data-access-efficiency.md`).
- The INDEPENDENT_REVIEW capability's authoritative deletion/keep list is the
  best-documented path in Step 4 — every site was where the list said.
- The `merge-checks.yaml` INIT.md-guard design (self-skip until adaptation)
  and the `.nvmrc` warning were both accurate and actionable.
- The dormant-banner mechanism worked naturally for the error tracker: the
  rules read correctly with neutral prose and self-document their
  reactivation condition.

## Residual risk

- `merge-checks.yaml` is now armed (INIT.md deleted) but its first real run
  happens on push/PR — verify the Lint and Unit Tests jobs execute (not skip)
  on this branch's PR.
- `claude-review.yaml` only fires once merged to the default branch, so the
  review trigger could not be exercised in this practice.
- `session-start.sh` (mise bootstrap + `npm install`) was not executed by a
  fresh session in this run.
