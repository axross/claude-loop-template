quality_context() {
  local launch_dir=$1 session_cwd launch_git active_git
  command -v jq >/dev/null 2>&1 || return 1
  hook_input=$(cat) || return 1
  if [ -z "$hook_input" ] && [ -z "${CLAUDE_PROJECT_DIR:-}" ]; then
    hook_input='{}'
    session_cwd=$launch_dir
  else
    session_cwd=$(jq -ser 'select(length == 1) | .[0].cwd | strings |
      select(startswith("/") and (test("[[:cntrl:]]") | not))' <<<"$hook_input" 2>/dev/null) || return 1
  fi
  launch_git=$(git -C "$launch_dir" rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || return 1
  active_git=$(git -C "$session_cwd" rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || return 1
  [ "$launch_git" -ef "$active_git" ] || return 1
  event_cwd=$(cd -P -- "$session_cwd" && pwd -P) || return 1
  local root
  root=$(git -C "$event_cwd" rev-parse --show-toplevel 2>/dev/null) || return 1
  cd -P -- "$root"
}
