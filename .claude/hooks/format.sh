#!/bin/bash

# posttooluse hook: formats the project after a code change so written files
# stay consistent. fires on edit/write tools.
set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# read the edited file path from the tool payload on stdin.
FILE_PATH="$(jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

# only format when a source file the formatter understands changed; skip the
# rest.
case "$FILE_PATH" in
  *.ts | *.tsx | *.css) ;;
  *) exit 0 ;;
esac

cd "$PROJECT_DIR"

# make the project's toolchain available if a version manager is installed
# (e.g. mise, asdf, nvm, volta). adapt or remove to match the project.
export PATH="$HOME/.local/bin:$PATH"
if command -v mise >/dev/null 2>&1; then
  eval "$(mise activate bash)"
fi

# skip silently when the package manager is unavailable (e.g. a local shell
# without the toolchain provisioned).
command -v npm >/dev/null 2>&1 || exit 0

npm run format >/dev/null 2>&1 || true
exit 0
