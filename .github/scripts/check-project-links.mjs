import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { extractProse, linkDefinitionLineCount } from '../../.claude/skills/agent-skill-authoring/scripts/commonmark.mjs';

const inlineLink = /\]\([ \t]*(?:<([^<>\n]+)>|([^\s<>)#?]+)([?#][^\s)]*)?)((?:[ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^()\n]*\)))?[ \t]*)\)/g;
const reference = /^ {0,3}\[((?:\\[^\n]|[^\[\]\\]){1,999})\]:[ \t]*(?:\n[ \t]*)?(?:<([^<>\n]+)>|(\S+))/;

function checkTarget(file, destination) {
  const [target] = destination.split(/[?#]/, 1);
  if (!target || /^(?:\/|[a-z][a-z0-9+.-]*:)/i.test(target)) return;
  if (existsSync(resolve(dirname(file), decodeURI(target)))) return;
  console.error(`${file}: broken link to ${target}`);
  process.exitCode = 1;
}

for (const file of new Set(process.argv.slice(2))) {
  if (file.startsWith('./.claude/skills/')) continue;
  const { lines } = extractProse(readFileSync(file, 'utf8'));
  const labels = new Set();
  for (const [index, { line, text }] of lines.entries()) {
    for (const [, angled, bare, suffix, trailing] of text.matchAll(inlineLink)) {
      if (bare?.endsWith('.md') && !trailing && (!suffix || suffix.startsWith('#'))) continue;
      checkTarget(file, angled ?? bare);
    }

    if (!/^ {0,3}\[/.test(text)) continue;
    const next = lines[index + 1];
    const source = next?.line === line + 1 ? `${text}\n${next.text}` : text;
    const match = reference.exec(source);
    if (!match || !linkDefinitionLineCount(source)) continue;
    const [, label, angled, bare] = match;
    const key = label.trim().replace(/\s+/g, ' ').toLowerCase();
    if (labels.has(key)) continue;
    labels.add(key);
    checkTarget(file, angled || bare);
  }
}
