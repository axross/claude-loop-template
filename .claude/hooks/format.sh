#!/usr/bin/env bash
set -uo pipefail

hooks_dir=$(dirname -- "${BASH_SOURCE[0]}")
source "$hooks_dir/quality-context.sh" || exit 0
quality_context "${CLAUDE_PROJECT_DIR:-$hooks_dir/../..}" || exit 0
root=$PWD

# reject control characters before command substitution can strip trailing newlines.
path=$(jq -er '.tool_input.file_path | strings | select(length > 0 and (test("[[:cntrl:]]") | not))' <<<"$hook_input") || exit 0
if [[ "$path" != /* ]]; then path="$event_cwd/${path#./}"; fi
case "$path" in
  "$root"/*) path=${path#"$root"/} ;;
  *) exit 0 ;;
esac
case "/$path/" in
  *//* | */../* | */./* | */.git/* | */.claude/skills/* | */.claude/settings.local.json/* | */.agents/skills/* | */.amp/* | */node_modules/* | */vendor/* | */.venv/* | */.next/* | */.cache/* | */dist/* | */build/* | */out/* | */coverage/* | */generated/* | */*lock.json/* | */*lock.yaml/* | */*.lock/* | */bun.lockb/*) exit 0 ;;
esac

# reject aliases, including a symlink in an otherwise valid parent directory.
[ -f "$path" ] || exit 0
links=$(stat -c %h -- "$path" 2>/dev/null || stat -f %l "$path" 2>/dev/null) || exit 0
[ "$links" = 1 ] || exit 0
part=$path
while :; do
  [ ! -L "$part" ] || exit 0
  [[ "$part" == */* ]] || break
  part=${part%/*}
done
[ "$(git -C "$(dirname -- "$path")" rev-parse --show-toplevel 2>/dev/null)" = "$root" ] || exit 0
git check-ignore --quiet --no-index -- "./$path" 2>/dev/null
[ "$?" -eq 1 ] || exit 0

export PATH="$HOME/.local/bin:$PATH"
if command -v mise >/dev/null 2>&1; then
  eval "$(mise activate bash)"
fi
command -v {{PACKAGE_MANAGER}} >/dev/null 2>&1 || exit 0

# INIT:OPTIONAL key=LINT_FIX_CMD — remove this case block to omit lint autofix.
case "$path" in
  {{LINT_FIX_FILE_GLOB}}) {{LINT_FIX_CMD}} "./$path" >/dev/null 2>&1 || true ;;
esac

# INIT:OPTIONAL key=FORMAT_FILE_CMD — remove this case block to omit single-file formatting.
case "$path" in
  {{CODE_FILE_GLOB}}) {{FORMAT_FILE_CMD}} "./$path" >/dev/null 2>&1 || true ;;
esac
exit 0
