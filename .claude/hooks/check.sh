#!/bin/bash

# stop hook: before the task completes, run the unit tests and lint whenever
# code changed in this session. failures block completion and are reported back
# on stderr so the agent addresses them before finishing.
set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$PROJECT_DIR"

# make the project's toolchain available if a version manager is installed
# (e.g. mise, asdf, nvm, volta). adapt or remove to match the project.
export PATH="$HOME/.local/bin:$PATH"
if command -v mise >/dev/null 2>&1; then
  eval "$(mise activate bash)"
fi

# nothing to verify without the package manager.
command -v npm >/dev/null 2>&1 || exit 0

# only run when this session has pending code changes, either uncommitted or
# committed but not yet on the upstream branch. avoids checking on plain
# conversational turns. \.(ts|tsx|css)$: an extended-regex of source
# extensions, e.g. '\.(ts|tsx|js|css)$'.
CODE_GLOB='\.(ts|tsx|css)$'
code_changed() {
  if git status --porcelain 2>/dev/null | grep -qE "$CODE_GLOB"; then
    return 0
  fi
  local upstream
  upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"
  if [ -n "$upstream" ] && git diff --name-only "$upstream...HEAD" 2>/dev/null | grep -qE "$CODE_GLOB"; then
    return 0
  fi
  return 1
}
code_changed || exit 0

# run both checks, collecting output for the failure report.
OUTPUT="$(mktemp)"
STATUS=0
if ! npm run test:unit >>"$OUTPUT" 2>&1; then STATUS=1; fi
if ! npm run lint >>"$OUTPUT" 2>&1; then STATUS=1; fi

if [ "$STATUS" -ne 0 ]; then
  {
    echo "Pre-completion checks failed (npm run test:unit / npm run lint)."
    echo "Fix the errors below before completing the task:"
    echo
    tail -n 100 "$OUTPUT"
  } >&2
  rm -f "$OUTPUT"
  exit 2
fi

rm -f "$OUTPUT"
exit 0
