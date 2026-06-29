#!/usr/bin/env python3
"""Relative-link integrity check for the AGENTS.md skill template.

Walks every Markdown file in the tree — including dot-directories such as
`.agents/` and `.claude/`, which `glob.glob('**/*.md')` silently skips — and
reports relative links whose target file does not exist.

Why this exists: a naive `glob('**/*.md', recursive=True)` does NOT descend into
directories whose name starts with a dot, so it never sees the skill files where
nearly all of this template's cross-links live. This checker uses `os.walk` so
the `.agents/` and `.claude/` trees are actually examined.

Usage:
    python3 tools/check-links.py          # check the whole tree
    python3 tools/check-links.py PATH ...  # check specific roots

Exit code 0 = all relative links resolve; 1 = one or more broken links.
Only links to `.md` targets are checked; `http(s)://` and pure `#anchor`
links are ignored. Illustrative example links inside fenced code blocks are
skipped so the skill-authoring docs can show `[file.md](./references/file.md)`
without tripping the check.
"""

from __future__ import annotations

import os
import re
import sys

# Directories that never contain authored Markdown worth checking.
SKIP_DIRS = {".git", "node_modules", ".next", "dist", "build", "out", "coverage", ".venv"}

# A Markdown link whose target ends in .md, optionally with a #fragment.
LINK_RE = re.compile(r"\]\(([^)]+?\.md)(#[^)]*)?\)")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
FENCE_RE = re.compile(r"^\s*(```|~~~)")
INLINE_CODE_RE = re.compile(r"`+[^`\n]+?`+")


def iter_markdown_files(roots: list[str]):
    for root in roots:
        if os.path.isfile(root) and root.endswith(".md"):
            yield root
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for name in filenames:
                if name.endswith(".md"):
                    yield os.path.join(dirpath, name)


def strip_uncheckable(text: str) -> str:
    """Drop HTML comments, fenced code blocks, and inline-code spans.

    These hold illustrative example links (the skill-authoring docs show
    `[file.md](./references/file.md)` as a format example) that must not be
    treated as real, resolvable links.
    """
    text = HTML_COMMENT_RE.sub("", text)
    out, in_fence = [], False
    for line in text.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        out.append("" if in_fence else INLINE_CODE_RE.sub("", line))
    return "\n".join(out)


def find_broken(files) -> list[str]:
    broken = []
    for path in files:
        base = os.path.dirname(path)
        with open(path, encoding="utf-8") as fh:
            text = strip_uncheckable(fh.read())
        for match in LINK_RE.finditer(text):
            target = match.group(1)
            if target.startswith(("http://", "https://", "mailto:")):
                continue
            resolved = os.path.normpath(os.path.join(base, target))
            if not os.path.exists(resolved):
                broken.append(f"{path} -> {target}")
    return broken


def main(argv: list[str]) -> int:
    roots = argv[1:] or ["."]
    files = sorted(set(iter_markdown_files(roots)))
    broken = find_broken(files)
    if broken:
        print(f"BROKEN LINKS ({len(broken)}) across {len(files)} files:")
        for entry in broken:
            print("  " + entry)
        return 1
    print(f"links OK ({len(files)} Markdown files checked)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
