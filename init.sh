#!/usr/bin/env bash
set -eu
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
case "${1:-}" in
  init|apply|check) ;;
  *) echo 'Usage: ./init.sh {init|apply|check}' >&2; exit 2 ;;
esac

status=0
if command -v python3 >/dev/null; then
  python3 - "$1" <<'PY' || status=1
import json
import re
import subprocess
import sys
from pathlib import Path

MANIFEST = Path('tokens.json')
VALUES = Path('init.values.json')
TOKEN = re.compile(r'\{\{([A-Z][A-Z0-9_]*)\}\}')
MARKER = re.compile(r'<!--\s*INIT\b|\bINIT:OPTIONAL\b')


def read(path):
    if path.is_symlink() or not path.is_file():
        raise ValueError(f'{path}: expected a regular, non-symlink file')
    return path.read_bytes().decode('utf-8')


def owned_path(name):
    path = Path(name)
    if path.is_absolute() or '..' in path.parts or path.as_posix() != name:
        raise ValueError(f'{name}: expected a normalized repository-relative path')
    if (path.parts[0:1] in {('.git',), ('.amp',), ('docs',)}
            or path.parts[0:2] == ('.claude', 'skills')
            or path == Path('.claude/settings.local.json')):
        raise ValueError(f'{name}: path is outside the template substitution scope')
    if any(parent.is_symlink() for parent in (path, *path.parents)):
        raise ValueError(f'{name}: symlink in selected path')
    if path.is_file() and path.stat().st_nlink != 1:
        raise ValueError(f'{name}: multiply linked file')
    return path


def inputs(files, names):
    config = json.loads(read(VALUES))
    if not isinstance(config, dict):
        raise ValueError('expected an object in init.values.json')
    selected = config.get('files')
    omitted = config.get('omit', [])
    for label, items in [('files', selected), ('omit', omitted)]:
        if (not isinstance(items, list) or not all(isinstance(item, str) for item in items)
                or len(set(items)) != len(items)):
            raise ValueError(f'{label}: expected an array of distinct strings')
    if not selected or set(selected) - files:
        raise ValueError('files: select only reconciled template inputs listed in tokens.json')
    unknown = config.keys() - {'files', 'omit'} - names.keys()
    if unknown:
        raise ValueError(f'unknown values: {", ".join(sorted(unknown))}')
    for name in omitted:
        if not names.get(name, {}).get('optional') or config.get(name, '') != '':
            raise ValueError(f'{name}: only empty optional values can be omitted')
    for name in names.keys() - set(omitted):
        value = config.get(name)
        if not isinstance(value, str) or not value.strip() or any(c in value for c in '\r\n\0'):
            raise ValueError(f'{name}: enter a nonempty single-line value, or explicitly omit if optional')
    if 'CODE_FILE_REGEX' in names and 'CODE_FILE_REGEX' not in omitted:
        result = subprocess.run(['bash', '-c', '[[ "" =~ $1 ]]', 'check-regex', config['CODE_FILE_REGEX']])
        if result.returncode not in (0, 1):
            raise ValueError('CODE_FILE_REGEX: expected a valid Bash extended regular expression')
    return config, selected, set(omitted)


def check(files, selected):
    failed = False
    if Path('README.template.md').exists() or Path('README.template.md').is_symlink():
        print('README not finalized: reconcile the seed into README.md first.', file=sys.stderr)
        failed = True
    retained = {name for name in files if Path(name).exists() or Path(name).is_symlink()}
    for name in sorted((retained | set(selected) | {'README.md'}) - {'README.template.md'}):
        try:
            text = read(owned_path(name))
        except ValueError as error:
            print(error, file=sys.stderr)
            failed = True
            continue
        for number, line in enumerate(text.splitlines(), 1):
            if TOKEN.search(line) or MARKER.search(line):
                print(f'{name}:{number}: unresolved token or INIT marker', file=sys.stderr)
                failed = True
    return int(failed)


def main(mode):
    manifest = json.loads(read(MANIFEST))
    names = {row['name']: row for row in manifest['tokens']}
    files = manifest['files']
    if mode == 'init':
        with VALUES.open('x', encoding='utf-8') as out:
            json.dump({'files': files, 'omit': [], **dict.fromkeys(names, '')}, out, indent=2)
            out.write('\n')
        print(f'Wrote {VALUES}. Reconcile files, fill values, and run ./init.sh apply.')
        return 0
    if mode == 'check':
        try:
            _, selected, omitted = inputs(set(files), names)
        except (ValueError, OSError) as error:
            print(f'{VALUES}: {error}', file=sys.stderr)
            check(files, [])
            return 1
        status = check(files, selected)
        if status == 0 and omitted:
            print(f'Not applicable (explicit omissions): {", ".join(sorted(omitted))}.')
        return status

    config, selected, omitted = inputs(set(files), names)
    updates = {}
    for name in selected:
        path = owned_path(name)
        src = read(path)

        def substitute(match):
            key = match.group(1)
            if key not in names or key in omitted:
                raise ValueError(f'{path}: unexpected or omitted token {key} is still present')
            value = config[key]
            if path.suffix == '.json':
                return json.dumps(value, ensure_ascii=False)[1:-1]
            if key == 'CODE_FILE_REGEX' and path.suffix == '.sh':
                return value.replace("'", "'\"'\"'")
            return value

        new = TOKEN.sub(substitute, src)
        if path.suffix == '.json':
            json.loads(new)
        if src != new:
            updates[path] = new
    for path, text in updates.items():
        path.write_bytes(text.encode('utf-8'))
    print(f'Substituted tokens in {len(updates)} files. Run ./init.sh check after reconciliation.')
    return 0


try:
    sys.exit(main(sys.argv[1]))
except (ValueError, OSError) as error:
    sys.exit(str(error))
PY
else
  echo 'Initialization unverified: python3 not found.' >&2
  status=1
fi

if [ "$1" = check ]; then
  if [ ! -f .github/scripts/check-documentation.sh ]; then
    echo 'Documentation unverified: .github/scripts/check-documentation.sh is missing.' >&2
    status=1
  else
    bash .github/scripts/check-documentation.sh || status=1
  fi
fi
exit "$status"
