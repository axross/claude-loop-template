#!/bin/bash

# sessionstart hook for cloud / web agent sessions.
# provisions the toolchain, prepares a local env file, materializes the opt-in
# quality hooks, and installs dependencies so linters and tests are runnable as
# soon as the session starts.
#
# TEMPLATE NOTE: this is an example Claude Code harness binding. During INIT,
# replace the {{TOKENS}} below and adapt the toolchain-provisioning block to the
# project's runtime (Node, Python, Go, Ruby, ...), or delete this hook if the
# project does not need session bootstrapping.
set -euo pipefail

# only run in the remote (web/cloud) environment. local sessions manage their
# own toolchain; set CLAUDE_CODE_REMOTE=true to exercise this hook locally.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$PROJECT_DIR"

# provision the toolchain. this example uses mise; replace with the project's
# version manager (asdf, nvm, volta, pyenv, rbenv, ...) or a direct install.
# adapt the runtime-version resolution to wherever the project pins it
# (e.g. a manifest, .tool-versions, .nvmrc).
if ! command -v mise >/dev/null 2>&1; then
  curl -fsSL https://mise.run | sh
fi
export PATH="$HOME/.local/bin:$PATH"
eval "$(mise activate bash)"
mise install || true
eval "$(mise activate bash)"
hash -r 2>/dev/null || true

# keep the toolchain activated for every shell spawned during this session.
if [ -n "${CLAUDE_ENV_FILE:-}" ] && ! grep -q 'mise activate bash' "$CLAUDE_ENV_FILE" 2>/dev/null; then
  echo 'eval "$(mise activate bash)"' >> "$CLAUDE_ENV_FILE"
fi

# provide a local env file for development if one does not exist yet.
if [ -f .env.example ] && [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

# enable the opt-in quality hooks (format on edit, lint + unit tests before
# completion) for cloud sessions by materializing the gitignored local settings
# from the committed example. the harness hot-reloads the new hooks for this
# session. local sessions skip this hook, so opting in stays manual.
if [ -f .claude/settings.local-example.json ]; then
  cp -f .claude/settings.local-example.json .claude/settings.local.json
fi

# install dependencies (a plain install, not a clean/frozen install, so a cached
# container layer can be reused across sessions).
{{INSTALL_CMD}}
