#!/usr/bin/env bash
#
# check-links.sh — relative-link integrity check for a skill tree's Markdown links.
#
# Walks every Markdown file under the given roots — including the `.claude/`
# dot-directory, which `glob('**/*.md')` sweeps silently skip — and reports
# relative links whose target file does not exist.
#
# Ships with the agent-skills-best-practices skill (see
# ../references/cross-referencing.md) so link verification survives template
# adaptation and stays runnable in any project that keeps the skill.
#
# Usage:
#   .claude/skills/agent-skills-best-practices/scripts/check-links.sh           # check the whole tree
#   .claude/skills/agent-skills-best-practices/scripts/check-links.sh PATH ...  # check specific roots
#
# Exit code 0 = all relative links resolve; 1 = one or more broken links.
# Only links to `.md` targets are checked; `http(s)://`, `mailto:`, and pure
# `#anchor` links are ignored. Illustrative example links inside fenced code
# blocks, inline code spans, and HTML comments are skipped so the
# skill-authoring docs can show `[file.md](./references/file.md)` without
# tripping the check.
#
set -euo pipefail

# Emit every candidate .md link target in one Markdown file, one per line.
# HTML comments, fenced code blocks, and inline code spans are stripped first;
# http(s):// and mailto: targets are dropped. POSIX awk — no gawk extensions.
AWK_EXTRACT='
{ content = content $0 "\n" }

END {
  gsub(/\r/, "", content)

  # Drop HTML comments: each "<!--" up to its next "-->", newlines included.
  # A dangling unclosed "<!--" is kept, matching a non-greedy regex that
  # simply would not match it.
  stripped = ""
  rest = content
  while ((open_at = index(rest, "<!--")) > 0) {
    close_off = index(substr(rest, open_at + 4), "-->")
    if (close_off == 0) break
    stripped = stripped substr(rest, 1, open_at - 1)
    rest = substr(rest, open_at + close_off + 6)
  }
  content = stripped rest

  # Fence-delimiter lines toggle skipping and are themselves skipped; inline
  # code spans are erased from the surviving lines before link extraction.
  n = split(content, lines, "\n")
  in_fence = 0
  for (i = 1; i <= n; i++) {
    line = lines[i]
    if (line ~ /^[ \t]*(```|~~~)/) { in_fence = 1 - in_fence; continue }
    if (in_fence) continue
    gsub(/`+[^`]+`+/, "", line)
    while (match(line, /\]\([^)]*\.md(#[^)]*)?\)/)) {
      inside = substr(line, RSTART + 2, RLENGTH - 3)
      line = substr(line, RSTART + RLENGTH)
      target = link_target(inside)
      if (target !~ /^(https?:\/\/|mailto:)/) print target
    }
  }
}

# Split "target#fragment" at the fragment: the target is the prefix up to the
# first ".md" that is followed by "#" or ends the parenthesised text.
function link_target(inside,   pos, next_off, after) {
  pos = index(inside, ".md")
  while (pos > 0) {
    after = substr(inside, pos + 3)
    if (after == "" || substr(after, 1, 1) == "#") return substr(inside, 1, pos + 2)
    next_off = index(after, ".md")
    if (next_off == 0) break
    pos = pos + 2 + next_off
  }
  return inside
}
'

# Markdown files under the roots, sorted and deduplicated: file arguments are
# taken as-is, directory arguments are walked while pruning directories that
# never contain authored Markdown worth checking.
list_markdown_files() {
  local root
  for root in "$@"; do
    if [ -f "$root" ]; then
      case "$root" in *.md) printf '%s\n' "$root" ;; esac
    elif [ -d "$root" ]; then
      find "$root" -type d \( -name .git -o -name node_modules -o -name .next \
        -o -name dist -o -name build -o -name out -o -name coverage \
        -o -name .venv \) -prune -o -type f -name '*.md' -print
    fi
  done | LC_ALL=C sort -u
}

checked=0
broken_count=0
broken_list=""

while IFS= read -r file; do
  checked=$((checked + 1))
  case "$file" in */*) base="${file%/*}" ;; *) base=. ;; esac
  while IFS= read -r target; do
    case "$target" in /*) resolved="$target" ;; *) resolved="$base/$target" ;; esac
    if [ ! -e "$resolved" ]; then
      broken_list="${broken_list}  ${file} -> ${target}
"
      broken_count=$((broken_count + 1))
    fi
  done < <(awk "$AWK_EXTRACT" < "$file")
done < <(list_markdown_files "${@:-.}")

if [ "$broken_count" -gt 0 ]; then
  printf 'BROKEN LINKS (%d) across %d files:\n' "$broken_count" "$checked"
  printf '%s' "$broken_list"
  exit 1
fi
printf 'links OK (%d Markdown files checked)\n' "$checked"
