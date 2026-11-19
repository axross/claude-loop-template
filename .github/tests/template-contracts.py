import json
import os
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRATCH = ROOT / '.amp/in/orb-backup'
DOC_GATE = '.github/scripts/check-documentation.sh'
DOC_SCRIPTS = '.claude/skills/living-project-documentation/scripts'
MERGE = '.github/workflows/merge-checks.yaml'
REVIEW = '.github/workflows/claude-review.yaml'
ADAPTED = "steps.adapted.outputs.run == 'true'"


class TemplateContracts(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory(dir=SCRATCH if SCRATCH.is_dir() else None)
        self.addCleanup(directory.cleanup)
        self.fixture = Path(directory.name)
        self.repo = self.fixture / 'consumer'
        self.repo.mkdir()
        for name in ('.claude', '.github', 'docs', '.gitignore', 'AGENTS.md', 'CLAUDE.md',
                     'INIT.md', 'README.md', 'README.template.md', 'REVIEW.md', 'tokens.json',
                     'skills-lock.json', 'init.sh'):
            source = ROOT / name
            if source.is_dir():
                shutil.copytree(source, self.repo / name, ignore=shutil.ignore_patterns('settings.local.json'))
            else:
                shutil.copy2(source, self.repo / name)
        self.exec('git', 'init', '-q', '-b', 'main')
        self.exec('git', 'config', 'user.name', 'Fixture')
        self.exec('git', 'config', 'user.email', 'fixture@example.invalid')
        self.exec('git', 'config', 'commit.gpgsign', 'false')
        hooks = self.fixture / 'empty-hooks'
        hooks.mkdir()
        self.exec('git', 'config', '--local', 'core.hooksPath', str(hooks))

    def exec(self, *args, status=0, env=None, data=None, cwd=None):
        result = subprocess.run(args, cwd=cwd or self.repo, input='' if data is None else data, text=True,
                                capture_output=True, env={**os.environ, **(env or {})}, timeout=30)
        output = result.stdout + result.stderr
        self.assertEqual(result.returncode, status, f'{args}: {output}')
        return output

    def put(self, name, text):
        path = self.repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')
        return path

    def read(self, name):
        return (self.repo / name).read_text(encoding='utf-8')

    def workflow(self, name):
        return json.loads(self.exec('bun', '-e',
                                    'console.log(JSON.stringify(Bun.YAML.parse(await Bun.stdin.text())))',
                                    data=self.read(name)))

    def managed_files(self):
        return {path.relative_to(self.repo): (path.stat().st_mode, path.read_bytes())
                for path in [self.repo / 'skills-lock.json', *(self.repo / '.claude/skills').rglob('*')]
                if path.is_file()}

    def values(self, minimal=False):
        self.exec('./init.sh', 'init')
        config = json.loads(self.read('init.values.json'))
        config.update(PROJECT_NAME='fixture "name"', PROJECT_OVERVIEW=r'CLI at https://example.invalid/a|b \ $',
                      INSTALL_CMD='bash ./checks install', LINT_CMD='bash ./checks lint',
                      UNIT_TEST_CMD='bash ./checks unit', PACKAGE_MANAGER='bash', CODE_FILE_REGEX=r'\.(src|alt)$',
                      CODE_FILE_GLOB='*.src | *.alt', FORMAT_FILE_CMD='bash ./checks format')
        config['omit'] = ['LINT_FIX_CMD', 'LINT_FIX_FILE_GLOB']
        path = '.claude/hooks/format.sh'
        if minimal:
            config['omit'] += ['CODE_FILE_GLOB', 'FORMAT_FILE_CMD', 'UNIT_TEST_CMD']
            for key in config['omit']:
                config[key] = ''
            for omitted_hook in (path, '.claude/hooks/session-start.sh'):
                config['files'].remove(omitted_hook)
                (self.repo / omitted_hook).unlink()
            shared_path = '.claude/settings.json'
            shared = json.loads(self.read(shared_path))
            del shared['hooks']['SessionStart']
            self.put(shared_path, json.dumps(shared))
            settings = json.loads(self.read('.claude/settings.local-example.json'))
            del settings['hooks']['PostToolUse']
            self.put('.claude/settings.local-example.json', json.dumps(settings))
            sessions_path = 'docs/operations/agent-sessions.md'
            sessions = re.sub(r'^- \*\*PostToolUse:.*\n', '', self.read(sessions_path), flags=re.M)
            sessions = re.sub(r'^\[Shared settings\].*\n', 'Shared settings configure effort and telemetry.\n',
                              sessions, flags=re.M)
            self.put(sessions_path, sessions)
            self.put(MERGE, self.read(MERGE).split('\n  test:\n')[0] + '\n')
        else:
            text = re.sub(r'^# INIT:OPTIONAL key=LINT_FIX_CMD.*?^esac\n\n', '', self.read(path), flags=re.M | re.S)
            self.put(path, re.sub(r'^# INIT:OPTIONAL .*\n', '', text, flags=re.M))
        self.put('init.values.json', json.dumps(config))
        self.put('checks', '''case "$1" in
  install|lint|unit) printf '%s\\n' "$1" >> .calls ;;
  format|lint-fix) [ "$#" = 2 ] || exit 1; printf 'repaired\\n' > "$2" ;;
esac
if [ "$1" = lint ] && [ "${FAIL_LINT:-}" = true ]; then
  echo 'fixture lint failure' >&2
  exit 1
fi
''')
        return config

    def adapt(self, minimal=False):
        before = self.managed_files()
        self.values(minimal)
        self.exec('./init.sh', 'apply')
        self.put('docs/operations/setup.md', '# Setup\n\nRequires Bash.\n')
        self.put('docs/index.md', self.read('docs/index.md') + '- [Setup](./operations/setup.md)\n')
        seed = re.sub(r'^<!-- INIT:.*\n', 'Requires Bash. See [Setup](./docs/operations/setup.md).\n',
                      self.read('README.template.md'), flags=re.M)
        self.put('README.md', seed)
        (self.repo / 'README.template.md').unlink()
        self.exec('./init.sh', 'check')
        for hook in (self.repo / '.claude/hooks').glob('*.sh'):
            self.exec('bash', '-n', str(hook))
        self.assertEqual(json.loads(self.read('.claude/settings.json'))['env']['OTEL_RESOURCE_ATTRIBUTES'],
                         'repository=fixture "name"')
        self.assertIn(r'https://example.invalid/a|b \ $', self.read('README.md'))
        for guide in ('./docs/operations/setup.md', './docs/conventions/testing.md'):
            self.assertIn(f']({guide})', self.read('README.md'))
        self.assertEqual(self.managed_files(), before)

    def test_adaptation_preserves_unselected_content(self):
        sentinels = {
            '.claude/settings.local.json': '{{PROJECT_NAME}}',
            '.claude/skills/unit-testing/consumer.json': '{{PROJECT_NAME}}',
            'docs/decisions/existing.md': '# Existing decision\n\n{{PROJECT_NAME}}\n',
            '.github/tests/consumer-test.txt': '{{PROJECT_NAME}}',
        }
        self.put('docs/index.md', self.read('docs/index.md') + '\n[Existing](./decisions/existing.md)\n')
        for name, content in sentinels.items():
            self.put(name, content)
        self.adapt(minimal=True)
        for name in ('INIT.md', 'init.sh', 'tokens.json', 'init.values.json',
                     '.github/workflows/template-checks.yaml', '.github/tests/template-contracts.py'):
            (self.repo / name).unlink()
        self.assertFalse((self.repo / '.claude/hooks/format.sh').exists())
        self.assertFalse((self.repo / '.claude/hooks/session-start.sh').exists())
        self.assertNotIn('SessionStart', json.loads(self.read('.claude/settings.json'))['hooks'])
        self.assertNotIn('Unit Tests', self.read(MERGE))
        for name, content in sentinels.items():
            self.assertEqual(self.read(name), content)
        job = self.workflow(MERGE)['jobs']['docs']
        self.assertNotIn('if', job)
        _, _, validation = job['steps']
        self.assertNotIn('if', validation)
        self.exec('bash', '-e', '-c', validation['run'])
        (self.repo / DOC_SCRIPTS / 'check-references.mjs').unlink()
        output = self.exec('bash', '-e', '-c', validation['run'], status=1)
        self.assertIn('required checker', output)
        self.assertIn('check-references.mjs', output)

    def test_rejects_selection_and_omission_without_substitution(self):
        config = self.values()
        before = self.read('AGENTS.md')
        target = self.fixture / 'outside.md'
        target.write_text('{{PROJECT_NAME}}')
        path = self.repo / 'README.template.md'
        path.unlink()
        path.symlink_to(target)
        self.assertIn('symlink', self.exec('./init.sh', 'apply', status=1))
        self.assertEqual(target.read_text(), '{{PROJECT_NAME}}')
        path.unlink()
        shutil.copy2(ROOT / path.name, path)
        for key, value, expected in (
            ('files', [*config['files'], '../outside.md'], 'select only'),
            ('omit', [*config['omit'], 'PROJECT_NAME'], 'only empty optional'),
            ('omit', ['FORMAT_FILE_CMD'], 'only empty optional'),
            ('UNIT_TEST_CMD', '', 'enter a nonempty'),
            ('CODE_FILE_REGEX', '[', 'expected a valid Bash extended regular expression'),
        ):
            self.put('init.values.json', json.dumps({**config, key: value}))
            self.assertIn(expected, self.exec('./init.sh', 'apply', status=1))
            self.assertEqual(self.read('AGENTS.md'), before)

        private_settings = '.claude/settings.local.json'
        self.put(private_settings, '{{PROJECT_NAME}}')
        manifest = json.loads(self.read('tokens.json'))
        for name, expected in (('../outside.md', 'repository-relative'),
                               (private_settings, 'outside the template substitution scope')):
            self.put('tokens.json', json.dumps({**manifest, 'files': [*manifest['files'], name]}))
            self.put('init.values.json', json.dumps({**config, 'files': [*config['files'], name]}))
            self.assertIn(expected, self.exec('./init.sh', 'apply', status=1))
            self.assertEqual(self.read('AGENTS.md'), before)
        self.assertEqual(self.read(private_settings), '{{PROJECT_NAME}}')
        self.assertEqual(target.read_text(), '{{PROJECT_NAME}}')

    def test_diagnostics_find_independent_failures(self):
        self.adapt()
        review = self.read('REVIEW.md')
        self.assertIn(f'](./{MERGE})', review)
        for prefix, title in (('./', ''), ('', ''), ('./', ' "Merge Checks"'), (' ./', '')):
            self.put('REVIEW.md', review.replace(f'](./{MERGE})', f']({prefix}{MERGE}.missing{title})'))
            self.assertIn(f'{MERGE}.missing', self.exec('./init.sh', 'check', status=1))
            self.assertIn(f'{MERGE}.missing', self.exec('bash', DOC_GATE, status=1))
            self.put('REVIEW.md', review.replace(f'](./{MERGE})', f']({prefix}{MERGE}{title})'))
            self.exec('./init.sh', 'check')
        spaced = '.github/workflows/merge checks.yaml'
        self.put(spaced, self.read(MERGE))
        for target, title in ((MERGE, ''), (spaced, ' "Merge Checks"')):
            self.put('REVIEW.md', review.replace(f'](./{MERGE})', f'](<./{target}>{title})'))
            self.exec('./init.sh', 'check')
            self.put('REVIEW.md', review.replace(f'](./{MERGE})', f'](<./{target}.missing>{title})'))
            self.assertIn(f'{target}.missing', self.exec('bash', DOC_GATE, status=1))
        reference_review = review.replace(f'](./{MERGE})', '][merge-checks]')
        reference_review += '\n[merge-checks]:\n  <./missing-review-workflow.yaml> "Merge Checks"\n'
        self.put('REVIEW.md', reference_review)
        self.assertIn('missing-review-workflow.yaml', self.exec('./init.sh', 'check', status=1))
        self.assertIn('missing-review-workflow.yaml', self.exec('bash', DOC_GATE, status=1))
        self.put('REVIEW.md', reference_review.replace('missing-review-workflow.yaml', MERGE))
        self.exec('bash', DOC_GATE)
        self.put('REVIEW.md', review)
        self.put('README.template.md', '# Unfinished\n')
        self.put('AGENTS.md', self.read('AGENTS.md') + '\n{{PROJECT_NAME}}\n')
        self.put('REVIEW.md', review + '\n[Broken](./missing-policy.md)\n')
        self.put('docs/specs/orphan.md', '# Orphan\n\n[Broken](./missing-spec.md)\n')
        output = self.exec('./init.sh', 'check', status=1)
        for finding in ('README not finalized', 'unresolved token', 'missing-policy.md', 'unindexed',
                        'missing-spec.md', 'glossary.md is missing'):
            self.assertIn(finding, output)
        (self.repo / 'docs/index.md').unlink()
        (self.repo / DOC_SCRIPTS / 'check-glossary.mjs').unlink()
        output = self.exec('bash', DOC_GATE, status=1)
        for finding in ('docs/index.md is missing', 'required checker', 'missing-policy.md'):
            self.assertIn(finding, output)

    def test_unselected_retained_workflow_must_be_reconciled(self):
        self.adapt()
        config = json.loads(self.read('init.values.json'))
        config['files'] = [name for name in config['files'] if name not in (MERGE, 'README.template.md')]
        self.put('init.values.json', json.dumps(config))
        reconciled = self.read(MERGE)
        seed = (ROOT / MERGE).read_text(encoding='utf-8')
        self.put(MERGE, seed)
        self.exec('./init.sh', 'apply')
        self.assertEqual(self.read(MERGE), seed)
        output = self.exec('./init.sh', 'check', status=1)
        self.assertIn(f'{MERGE}:', output)
        self.assertIn('unresolved token', output)
        self.put(MERGE, reconciled)
        self.exec('./init.sh', 'check')

    def test_startup_is_non_clobbering_and_stop_runs_only_lint(self):
        self.adapt()
        self.exec('git', 'add', '.')
        self.exec('git', 'commit', '-qm', 'fixture baseline')
        stop = '.claude/hooks/check.sh'
        self.exec(stop)
        self.assertFalse((self.repo / '.calls').exists())
        settings = '.claude/settings.local.json'
        self.put(settings, '{"private":true}')
        self.put('.env.example', 'EXAMPLE=true')
        start = '.claude/hooks/session-start.sh'
        self.exec(start, env={'CLAUDE_CODE_REMOTE': 'true'})
        self.assertEqual(self.read(settings), '{"private":true}')
        self.assertEqual(self.read('.env.local'), 'EXAMPLE=true')
        (self.repo / settings).unlink()
        self.exec(start, env={'CLAUDE_CODE_REMOTE': 'true'})
        self.assertFalse((self.repo / settings).exists())
        source = self.put('untracked/nested/code.src', 'defective\n')
        self.assertIn('fixture lint failure', self.exec(stop, status=2, env={'FAIL_LINT': 'true'}))
        self.assertEqual(source.read_text(), 'defective\n')
        self.assertEqual(self.read('.calls').splitlines(), ['install', 'install', 'lint'])
        self.exec('git', 'switch', '-qc', 'claude/fixture')
        self.exec('git', 'add', 'untracked')
        self.exec('git', 'commit', '-qm', 'committed without upstream')
        self.exec(stop, status=2, env={'FAIL_LINT': 'true'})
        self.exec('git', 'config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*')
        self.exec('git', 'update-ref', 'refs/remotes/origin/main', 'main')
        self.exec('git', 'update-ref', 'refs/remotes/origin/claude/fixture', 'HEAD')
        self.exec('git', 'branch', '--set-upstream-to=origin/claude/fixture')
        self.assertIn('fixture lint failure', self.exec(stop, status=2, env={'FAIL_LINT': 'true'}))
        worktree = self.fixture / 'other-worktree'
        self.exec('git', 'worktree', 'add', '-q', '--detach', str(worktree), 'HEAD')
        launch = {'CLAUDE_PROJECT_DIR': str(self.repo), 'FAIL_LINT': 'true'}
        self.exec(stop, status=2, env=launch, data=json.dumps({'cwd': str(worktree)}))
        self.assertEqual((worktree / '.calls').read_text(), 'lint\n')
        edited = worktree / 'untracked/nested/code.src'
        self.exec('.claude/hooks/format.sh', env=launch,
                  data=self.edit_event('code.src', edited.parent))
        self.assertEqual(edited.read_text(), 'repaired\n')
        self.assertEqual(source.read_text(), 'defective\n')
        foreign = self.fixture / 'foreign'
        self.exec('git', 'init', '-q', str(foreign))
        target = foreign / 'unrelated.src'
        target.write_text('untouched\n')
        self.exec('.claude/hooks/format.sh', env=launch, data=self.edit_event(str(target), foreign))
        self.assertEqual(target.read_text(), 'untouched\n')
        result = self.exec(stop, env=launch, data=json.dumps({'cwd': str(foreign)}))
        self.assertIn('could not resolve the active project worktree', json.loads(result)['systemMessage'])

    def edit_event(self, path, cwd=None):
        return json.dumps({'cwd': str(cwd or self.repo), 'tool_input': {'file_path': path}})

    def test_stop_reports_missing_toolchain_without_looping(self):
        self.adapt()
        stop = '.claude/hooks/check.sh'
        self.put(stop, self.read(stop).replace('command -v bash', 'command -v nonexistent-fixture-tool'))
        self.exec('git', 'commit', '-q', '--allow-empty', '-m', 'baseline')
        self.put('changed.src', 'source\n')
        event = {'cwd': str(self.repo), 'stop_hook_active': False}
        first = self.exec(stop, status=2, data=json.dumps(event))
        self.assertIn('Lint not run', first)
        resumed = json.loads(self.exec(stop, data=json.dumps({**event, 'stop_hook_active': True})))
        self.assertIn('Lint was not run', resumed['systemMessage'])
        self.assertFalse((self.repo / '.calls').exists())

    def test_stop_reports_invalid_regex(self):
        self.adapt()
        stop = '.claude/hooks/check.sh'
        self.put(stop, re.sub(r"^source_pattern=.*$", "source_pattern='['", self.read(stop), flags=re.M))
        result = self.exec(stop, data=json.dumps({'cwd': str(self.repo)}))
        self.assertIn('invalid CODE_FILE_REGEX', json.loads(result)['systemMessage'])
        self.assertFalse((self.repo / '.calls').exists())

    def test_stop_compares_only_current_work_on_a_custom_default_branch(self):
        self.adapt()
        stop = '.claude/hooks/check.sh'
        lint_fails = {'FAIL_LINT': 'true'}
        self.exec('git', 'branch', '-m', 'trunk')
        self.put('inherited.src', 'inherited source\n')
        self.exec('git', 'add', '.')
        self.exec('git', 'commit', '-qm', 'baseline with source')
        self.exec('git', 'switch', '-qc', 'claude/fixture')
        self.put('notes.md', '# Topic notes\n')
        self.exec('git', 'add', 'notes.md')
        self.exec('git', 'commit', '-qm', 'docs-only change')

        result = json.loads(self.exec(stop, env=lint_fails))
        self.assertIn('Git comparison is unavailable', result['systemMessage'])
        self.exec('git', 'config', 'claude-loop.lintBase', 'refs/heads/trunk')
        self.assertEqual(self.exec(stop, env=lint_fails), '')
        self.assertFalse((self.repo / '.calls').exists())

        self.put('inherited.src', 'changed source\n')
        self.exec('git', 'commit', '-qam', 'topic source change')
        self.assertIn('fixture lint failure', self.exec(stop, status=2, env=lint_fails))
        unrelated = self.exec('git', 'commit-tree', 'HEAD^{tree}', '-m', 'unrelated root').strip()
        self.exec('git', 'config', 'claude-loop.lintBase', unrelated)
        result = json.loads(self.exec(stop, env=lint_fails))
        self.assertIn('Git comparison is unavailable', result['systemMessage'])
        self.assertEqual(self.read('.calls'), 'lint\n')

    def test_format_only_changes_one_eligible_file(self):
        self.adapt()
        hook = '.claude/hooks/format.sh'
        chosen = self.put('src/-edited $(not-a-command).src', 'defective\n')
        control = self.put('src/control.alt', 'defective\n')
        self.exec(hook, data=self.edit_event(str(chosen)))
        self.assertEqual(chosen.read_text(), 'repaired\n')
        self.assertEqual(control.read_text(), 'defective\n')
        self.exec(hook, data=self.edit_event('src/control.alt'))
        self.assertEqual(control.read_text(), 'repaired\n')
        protected = [self.put(name, 'untouched\n') for name in (
            'generated/code.src', '.claude/skills/unit-testing/code.src', 'node_modules/pkg/code.src',
            'ignored/ignored.src', 'src/unsupported.txt', 'nested/code.src',
        )]
        self.exec('git', 'init', '-q', 'nested')
        self.put('.gitignore', self.read('.gitignore') + '\n/ignored/\n')
        outside = self.fixture / 'outside.src'
        outside.write_text('untouched\n')
        alias = self.repo / 'alias.src'
        alias.symlink_to(outside)
        parent = self.repo / 'symlink-parent'
        parent.symlink_to(self.fixture, target_is_directory=True)
        hardlink = self.repo / 'hardlink.src'
        hardlink.hardlink_to(outside)
        for target in [*protected, outside, alias, parent / outside.name, hardlink]:
            self.exec(hook, data=self.edit_event(str(target)))
            self.assertEqual(target.read_text(), 'untouched\n')
        self.exec(hook, data='not-json')

    def test_lint_fix_only_repairs_the_edited_file(self):
        config = self.values()
        config.update(omit=['CODE_FILE_GLOB', 'FORMAT_FILE_CMD'], CODE_FILE_GLOB='', FORMAT_FILE_CMD='',
                      LINT_FIX_CMD='bash ./checks lint-fix', LINT_FIX_FILE_GLOB='*.src')
        self.put('init.values.json', json.dumps(config))
        hook = '.claude/hooks/format.sh'
        seed = (ROOT / hook).read_text(encoding='utf-8')
        without_formatter = re.sub(r'^# INIT:OPTIONAL key=FORMAT_FILE_CMD.*?^esac\n', '', seed, flags=re.M | re.S)
        self.put(hook, re.sub(r'^# INIT:OPTIONAL .*\n', '', without_formatter, flags=re.M))
        self.exec('./init.sh', 'apply')
        selected = self.put('selected.src', 'defective\n')
        control = self.put('control.src', 'defective\n')
        self.exec(hook, data=self.edit_event(str(selected)))
        self.assertEqual(selected.read_text(), 'repaired\n')
        self.assertEqual(control.read_text(), 'defective\n')

    def test_merge_steps_skip_then_run_the_selected_commands(self):
        bash_workflow, replaced = re.subn(
            r'^      (- name: )Setup Node[^\n]*\n((?:        if: [^\n]*\n)?)'
            r'        uses: actions/setup-node@[^\n]*\n        with:\n'
            r'          node-version-file: \.nvmrc\n          cache: npm\n',
            r'      \1Check Bash commands\n\2        run: bash -n ./checks\n',
            self.read(MERGE), flags=re.M,
        )
        self.assertEqual(replaced, 2)
        self.put(MERGE, bash_workflow)
        self.adapt()
        workflow = self.workflow(MERGE)
        for candidate in (workflow, self.workflow('.github/workflows/template-checks.yaml')):
            self.assertEqual(candidate['on'], {'pull_request': None, 'push': {'branches': ['main']}})
        jobs = workflow['jobs']
        self.assertEqual(set(jobs), {'docs', 'lint', 'test'})
        for job, check in [('lint', 'lint'), ('test', 'unit')]:
            _, guard, setup, install, verify = jobs[job]['steps']
            self.assertEqual(guard['id'], 'adapted')
            self.assertNotIn('if', guard)
            self.assertEqual([setup.get('if'), install.get('if'), verify.get('if')], [ADAPTED] * 3)
            self.assertEqual(install['run'].strip(), 'bash ./checks install')
            self.assertEqual(verify['run'].strip(), f'bash ./checks {check}')

        output = self.fixture / 'github-output'
        for adopted in (False, True):
            if adopted:
                (self.repo / 'INIT.md').unlink()
            for name in ('lint', 'test'):
                _, guard, *guarded_steps = jobs[name]['steps']
                output.write_text('')
                notice = self.exec('bash', '-e', '-c', guard['run'], env={'GITHUB_OUTPUT': str(output)})
                self.assertEqual(output.read_text().strip(), f'run={str(adopted).lower()}')
                if output.read_text().strip() == 'run=true':
                    for step in guarded_steps:
                        self.exec('bash', '-e', '-c', step['run'])
                else:
                    self.assertIn('skipping', notice)
            if not adopted:
                self.assertFalse((self.repo / '.calls').exists())
        self.assertEqual(self.read('.calls').splitlines(), ['install', 'lint', 'install', 'unit'])

    def test_optional_review_uses_fixed_base_and_separates_publication(self):
        workflow = self.workflow(REVIEW)
        review, publish = (workflow['jobs'][name] for name in ('review', 'publish'))
        self.assertEqual(workflow['permissions'], {})
        self.assertIn("github.run_attempt == '1' &&", review['if'])
        self.assertEqual(review['permissions'], {'contents': 'read', 'pull-requests': 'read'})
        self.assertEqual(publish['permissions'], {'pull-requests': 'write'})
        self.assertEqual(publish['needs'], 'review')
        snapshot, checkout, policy_check, assessment = review['steps']
        self.assertEqual(checkout['with']['ref'], '${{ steps.snapshot.outputs.base }}')
        self.assertFalse(checkout['with']['persist-credentials'])
        self.assertRegex(assessment['uses'], r'^anthropics/claude-code-action/base-action@[a-f0-9]{40}$')
        self.assertNotIn('github_token', assessment['with'])
        self.assertRegex(assessment['with']['claude_args'], r'(?:^|\s)--setting-sources user(?:\s|$)')
        self.assertTrue(json.loads(assessment['with']['settings'])['disableAllHooks'])
        self.assertEqual(len(publish['steps']), 1)
        publisher, = publish['steps']
        self.assertNotIn('uses', publisher)

        self.exec('git', 'add', 'REVIEW.md')
        self.exec('git', 'commit', '-qm', 'captured policy')
        base = self.exec('git', 'rev-parse', 'HEAD').strip()
        head = 'a' * 40
        self.put('REVIEW.md', '# New default-branch policy\n')
        self.exec('git', 'commit', '-qam', 'advanced policy')
        advanced = self.exec('git', 'rev-parse', 'HEAD').strip()
        policy_env = {'POLICY': base}
        self.exec('bash', '-e', '-c', policy_check['run'], status=1, env=policy_env)
        self.exec('git', 'switch', '-q', '--detach', base)
        self.exec('bash', '-e', '-c', policy_check['run'], env=policy_env)

        api = self.fixture / 'api'
        output = self.fixture / 'github-output'
        event = self.fixture / 'event.json'
        posted = self.fixture / 'posted.json'
        revision = self.fixture / 'merge-base'
        body = 'approved criteria\n'
        pull = {'state': 'open', 'body': body,
                'base': {'sha': base, 'ref': 'main', 'repo': {'full_name': 'fixture/project'}},
                'head': {'sha': head, 'repo': {'full_name': 'fixture/project'}}}
        revision.write_text(base + '\n')
        fake = self.put('fixture-bin/gh', '''#!/usr/bin/env bash
set -eu
case "$1 $2" in
  'api --method')
    test "$3" = POST
    printf 'post\\n' >> "$POST_COUNT"
    cp -- "$6" "$POSTED"
    if [ "${CHANGE_AFTER_POST:-}" = true ]; then
      jq '.body += " changed after publication"' "$API_FIXTURE" > "$API_FIXTURE.next"
      mv "$API_FIXTURE.next" "$API_FIXTURE"
    fi
    printf '7\\n'
    ;;
  'api -H')
    if [ -n "${DIFF_FIXTURE:-}" ]; then cat "$DIFF_FIXTURE"; else printf 'fixture diff\\n'; fi
    ;;
  'api repos/fixture/project/compare/'*) cat "$MERGE_BASE_FILE" ;;
  'api repos/fixture/project/pulls/1') cat "$API_FIXTURE" ;;
  'api repos/fixture/project/pulls/1/reviews/7')
    jq --arg state "${STORED_STATE:-COMMENTED}" '
      {user: {login: "github-actions[bot]"}, state: $state, commit_id, body, html_url: "https://example.invalid/review"}
    ' "$POSTED"
    ;;
  'api --paginate')
    test "$4" = repos/fixture/project/pulls/1/reviews/7/comments
    jq --argjson offset "${ANCHOR_OFFSET:-0}" --argjson review "${INLINE_REVIEW_ID:-7}" \
       --arg author "${INLINE_AUTHOR:-github-actions[bot]}" --arg original "${INLINE_ORIGINAL_COMMIT:-}" \
       --arg legacy "${LEGACY_ANCHOR:-}" '
      .commit_id as $head | [.comments | map(
        .node_id = "fixture-comment" | .commit_id = $head |
        (if $legacy == "true" then del(.line, .side) + {original_position: 2}
         else .original_line = (.line + $offset) | del(.line) end) |
        .user.login = $author | .pull_request_review_id = $review |
        .original_commit_id = (if $original == "" then $head else $original end))]
    ' "$POSTED"
    ;;
  'api graphql')
    test "${LEGACY_ANCHOR:-}" = true
    paginate=false slurp=false query=
    for arg in "$@"; do
      case "$arg" in
        --paginate) paginate=true ;;
        --slurp) slurp=true ;;
        query=*) query=${arg#query=} ;;
      esac
    done
    if ! [[ "$paginate" = true && "$slurp" = true && "$query" == *'$endCursor: String'* &&
            "$query" == *'after: $endCursor'* && "$query" == *'pageInfo { hasNextPage endCursor }'* ]]; then
      echo 'fixture GraphQL pagination requires --paginate, --slurp, and cursor wiring' >&2
      exit 1
    fi
    jq -n --arg comment "${THREAD_COMMENT:-fixture-comment}" --argjson line "${THREAD_LINE:-17}" \
       --arg side "${THREAD_SIDE:-LEFT}" '
      def page($nodes): {data: {repository: {pullRequest: {reviewThreads: {nodes: $nodes}}}}};
      [page([{path: "a.txt", diffSide: "RIGHT", originalLine: 22, comments: {nodes: [{id: "unrelated"}]}}]),
       page([{path: "a.txt", diffSide: $side, originalLine: $line, comments: {nodes: [{id: $comment}]}}])]
    '
    ;;
  *) exit 7 ;;
esac
''')
        fake.chmod(0o755)
        env = {'PATH': f'{fake.parent}:{os.environ["PATH"]}', 'GITHUB_REPOSITORY': 'fixture/project',
               'DEFAULT_BRANCH': 'main', 'PR_NUMBER': '1', 'RUNNER_TEMP': str(self.fixture),
               'API_FIXTURE': str(api), 'GITHUB_OUTPUT': str(output), 'GITHUB_EVENT_PATH': str(event),
               'POSTED': str(posted), 'POST_COUNT': str(self.fixture / 'posts'),
               'MERGE_BASE_FILE': str(revision), 'REQUESTER_IDS': '[47]', 'GITHUB_RUN_ATTEMPT': '1'}
        api.write_text(json.dumps(pull))
        commenter = {'type': 'User', 'id': 47}
        comment = {'body': '@claude review', 'user': commenter, 'author_association': 'MEMBER'}
        for ungranted in ({'body': '@CLAUDE REVIEW'}, {'user': {**commenter, 'id': 48}},
                          {'user': {**commenter, 'type': 'Bot'}}, {'author_association': 'NONE'}):
            event.write_text(json.dumps({'comment': {**comment, **ungranted}}))
            self.exec('bash', '-e', '-o', 'pipefail', '-c', snapshot['run'], status=1, env=env)
            self.assertFalse(output.exists())
        event.write_text(json.dumps({'comment': comment}))
        self.exec('bash', '-e', '-o', 'pipefail', '-c', snapshot['run'], status=1,
                  env={**env, 'REQUESTER_IDS': '[]'})
        self.exec('bash', '-e', '-o', 'pipefail', '-c', snapshot['run'], status=1,
                  env={**env, 'GITHUB_RUN_ATTEMPT': '2'})
        self.assertFalse(output.exists())
        diff = self.fixture / 'fixture.diff'
        for size, reason in ((0, 'empty diff'), (250000, '250000 bytes or more')):
            diff.write_bytes(b'x' * size)
            result = self.exec('bash', '-e', '-o', 'pipefail', '-c', snapshot['run'], status=1,
                               env={**env, 'DIFF_FIXTURE': str(diff)})
            self.assertIn(reason, result)
            self.assertFalse(output.exists())
        diff.write_bytes(b'x' * 249999)
        self.exec('bash', '-e', '-o', 'pipefail', '-c', snapshot['run'],
                  env={**env, 'DIFF_FIXTURE': str(diff)})
        values = dict(line.split('=', 1) for line in output.read_text().splitlines())
        self.assertEqual((values['base'], values['head'], values['merge_base']), (base, head, base))
        finding = {'path': 'a.txt', 'line': 1, 'side': 'RIGHT', 'body': 'Important: fixture'}
        assessment = {'summary': 'Important: 1', 'scope_complete': True, 'comments': [finding]}
        env.update(POLICY=base, HEAD=head, MERGE_BASE=base, BODY_DIGEST=values['body_digest'],
                   ASSESSMENT=json.dumps(assessment))
        for changed in ({'body': body + 'changed'}, {'head': {**pull['head'], 'sha': advanced}},
                        {'base': {**pull['base'], 'sha': advanced}}, {'state': 'closed'},
                        {'head': {**pull['head'], 'repo': {'full_name': 'fixture/fork'}}}):
            api.write_text(json.dumps({**pull, **changed}))
            self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], status=1, env=env)
            self.assertFalse(posted.exists())
        api.write_text(json.dumps(pull))
        self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], env=env)
        payload = json.loads(posted.read_text())
        self.assertEqual((payload['event'], payload['commit_id']), ('COMMENT', head))
        self.assertIn(f'Policy tree: `{base}`', payload['body'])
        self.assertNotIn('Incomplete review', payload['body'])
        self.assertEqual(payload['comments'], [{**finding, 'body': '<!-- agent -->\nImportant: fixture'}])
        legacy = {**env, 'LEGACY_ANCHOR': 'true', 'ASSESSMENT': json.dumps({
            **assessment, 'comments': [{**finding, 'line': 17, 'side': 'LEFT'}],
        })}
        self.assertIn('https://example.invalid/review',
                      self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], env=legacy))
        for mismatch in ({'THREAD_COMMENT': 'other-comment'}, {'THREAD_LINE': '18'}, {'THREAD_SIDE': 'RIGHT'}):
            result = self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], status=1,
                               env={**legacy, **mismatch})
            self.assertIn('publication is unverified (review ID: 7)', result)
        env['ASSESSMENT'] = json.dumps({**assessment, 'scope_complete': False})
        self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], env=env)
        self.assertIn('Incomplete review', json.loads(posted.read_text())['body'])
        for mismatch in ({'STORED_STATE': 'PENDING'}, {'ANCHOR_OFFSET': '1'}, {'INLINE_REVIEW_ID': '8'},
                         {'INLINE_AUTHOR': 'other-bot'}, {'INLINE_ORIGINAL_COMMIT': advanced},
                         {'CHANGE_AFTER_POST': 'true'}):
            posted.unlink()
            api.write_text(json.dumps(pull))
            result = self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], status=1,
                               env={**env, **mismatch})
            self.assertTrue(posted.exists())
            self.assertIn('publication is unverified (review ID: 7)', result)
        api.write_text(json.dumps(pull))
        first_review = posted.read_bytes()
        post_count = Path(env['POST_COUNT']).read_bytes()
        result = self.exec('bash', '-e', '-o', 'pipefail', '-c', publisher['run'], status=1,
                           env={**env, 'GITHUB_RUN_ATTEMPT': '2'})
        self.assertIn('Publication is blocked on reruns.', result)
        self.assertEqual(posted.read_bytes(), first_review)
        self.assertEqual(Path(env['POST_COUNT']).read_bytes(), post_count)


if __name__ == '__main__':
    unittest.main(verbosity=2)
