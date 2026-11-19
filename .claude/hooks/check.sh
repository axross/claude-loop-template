#!/usr/bin/env bash
set -uo pipefail

hooks_dir=$(dirname -- "${BASH_SOURCE[0]}")
lint_not_run() {
  printf '{"systemMessage":"Lint was not run: %s. Run explicit verification before delivery."}\n' "$1"
}
if ! source "$hooks_dir/quality-context.sh" || ! quality_context "${CLAUDE_PROJECT_DIR:-$hooks_dir/../..}"; then
  lint_not_run 'could not resolve the active project worktree'
  exit 0
fi

source_pattern='{{CODE_FILE_REGEX}}'
if [[ '' =~ $source_pattern ]] 2>/dev/null; then
  :
elif [ "$?" -eq 2 ]; then
  lint_not_run 'invalid CODE_FILE_REGEX'
  exit 0
fi
has_source() {
  local path found=1
  while IFS= read -r -d '' path; do
    if [[ "$path" =~ $source_pattern ]]; then found=0; fi
  done
  return "$found"
}

comparison_ref() {
  local explicit origin_default ref
  if explicit=$(git config --local --get claude-loop.lintBase); then
    git rev-parse --verify -q --end-of-options "$explicit^{commit}"
    return
  elif [ "$?" -ne 1 ]; then
    return 1
  fi
  origin_default=$(git symbolic-ref -q refs/remotes/origin/HEAD 2>/dev/null) || origin_default=
  for ref in "$origin_default" refs/remotes/origin/main refs/remotes/origin/master refs/heads/main refs/heads/master '@{upstream}'; do
    if [ -n "$ref" ] && git rev-parse --verify -q --end-of-options "$ref^{commit}" 2>/dev/null; then
      return 0
    fi
  done
  return 1
}

working_paths() {
  git diff --no-renames --name-only -z -- &&
    git diff --cached --no-renames --name-only -z -- &&
    git ls-files --others --exclude-standard -z
}

code_changed() {
  local base
  local -a results
  working_paths 2>/dev/null | has_source
  results=("${PIPESTATUS[@]}")
  [ "${results[0]}" -eq 0 ] || return 2
  [ "${results[1]}" -ne 0 ] || return 0

  base=$(comparison_ref 2>/dev/null) || return 2
  git diff --no-renames --name-only -z "$base...HEAD" -- 2>/dev/null | has_source
  results=("${PIPESTATUS[@]}")
  [ "${results[0]}" -eq 0 ] || return 2
  return "${results[1]}"
}

code_changed || {
  if [ "$?" -eq 2 ]; then
    lint_not_run 'Git comparison is unavailable'
  fi
  exit 0
}
export PATH="$HOME/.local/bin:$PATH"
if command -v mise >/dev/null 2>&1; then
  eval "$(mise activate bash)"
fi
if ! command -v {{PACKAGE_MANAGER}} >/dev/null 2>&1; then
  if jq -e '.stop_hook_active == true' <<<"$hook_input" >/dev/null 2>&1; then
    lint_not_run 'the project toolchain is unavailable'
    exit 0
  fi
  echo 'Lint not run: project toolchain unavailable. Run explicit verification before delivery.' >&2
  exit 2
fi

if ! output=$({{LINT_CMD}} 2>&1); then
  printf 'Pre-completion lint failed. Fix the findings before completing the task.\n%s\n' "$output" >&2
  exit 2
fi
