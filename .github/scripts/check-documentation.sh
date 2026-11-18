#!/usr/bin/env bash
set -uo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." || exit 1

if ! command -v node >/dev/null; then
  echo 'Documentation unverified: Node.js not found.' >&2
  exit 1
fi

status=0
run_check() {
  local script=$1
  shift
  if [ ! -f "$script" ]; then
    echo "Unverified: required checker $script is missing." >&2
    status=1
  else
    node "$script" "$@" || status=1
  fi
}

skill=.claude/skills/living-project-documentation/scripts
if ! git ls-files -z --cached --others --exclude-standard -- '*.md' ':(top,exclude).amp/**' | (
  files=()
  while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then files+=("./$file"); fi
  done
  if [ "${#files[@]}" -eq 0 ]; then
    echo 'Links unverified: no repository Markdown found.' >&2
    exit 1
  fi
  run_check .claude/skills/agent-skill-authoring/scripts/check-links.mjs "${files[@]}"
  run_check .github/scripts/check-project-links.mjs "${files[@]}"
  exit "$status"
); then
  status=1
fi
if [ ! -f docs/index.md ]; then
  echo 'Documentation unverified: docs/index.md is missing.' >&2
  status=1
fi
for check in index references glossary; do
  run_check "$skill/check-$check.mjs" docs
done
if [ -f docs/index.md ] && ! find docs/specs -type f -name '*.md' 2>/dev/null | grep -q .; then
  echo 'Glossary pairing: not applicable (no product specs).'
fi
exit "$status"
