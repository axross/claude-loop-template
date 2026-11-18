import { basename } from "node:path";

import { isAlias, isMap, isScalar, LineCounter, parseDocument } from "yaml";

/** validate actual YAML and required discovery scalars without expanding alias graphs. */
function frontmatter(document, onError) {
  const block = document.frontmatter;
  if (!block) {
    onError({ lineNumber: 1, detail: "Missing or unclosed leading YAML frontmatter block" });
    return;
  }
  const lineCounter = new LineCounter();
  const yaml = parseDocument(block.source, {
    version: "1.2", schema: "core", strict: true, uniqueKeys: true, keepSourceTokens: true, lineCounter,
  });
  const report = (detail, offset = 0) => onError({ lineNumber: lineCounter.linePos(offset).line + 1, detail });
  if (yaml.errors.length) {
    for (const error of yaml.errors) report(`Invalid YAML (${error.code}): ${error.message.split("\n")[0]}`, error.pos[0]);
    return;
  }
  if (!isMap(yaml.contents)) {
    report("Frontmatter must be a mapping");
    return;
  }
  for (const key of ["name", "description"]) {
    const pair = yaml.contents.items.find((pair) => isScalar(pair.key) && pair.key.value === key);
    if (!pair) { report(`Missing required ${key}`); continue; }
    const value = pair.value;
    const offset = value?.range?.[0] ?? pair.key.range[0];
    if (isAlias(value) || value?.anchor || value?.tag) {
      report(`${key}: aliases, anchors and explicit tags are not supported`, offset);
      continue;
    }
    if (!isScalar(value) || typeof value.value !== "string") {
      report(`${key}: must be a nonempty string, not null, numeric, mapping or sequence`, offset);
      continue;
    }
    if (value.type === "BLOCK_LITERAL" || value.type === "BLOCK_FOLDED" || /[\r\n]/.test(value.srcToken?.source ?? "")) {
      report(`${key}: block and multiline scalars are not supported`, offset);
      continue;
    }
    if (value.type === "PLAIN" && value.comment) {
      report(`${key}: inline comment truncates a plain scalar; quote the value`, offset);
      continue;
    }
    if (!value.value.trim()) { report(`${key}: must be a nonempty string`, offset); continue; }
    if (key === "name") {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.value)) report("name: must be kebab-case", offset);
      if (value.value.length > 64) report("name: exceeds 64 characters", offset);
      if (value.value !== basename(document.skillDir)) report(`name: does not match directory ${basename(document.skillDir)}`, offset);
    } else if (Buffer.byteLength(value.value, "utf8") > 1024) {
      report("description: exceeds 1,024 decoded UTF-8 bytes", offset);
    }
  }
}

/** use untouched markdown-it maps under the context's terminal-newline invariant. */
function fences(document, onError) {
  for (const token of document.tokens) {
    if (token.type !== "fence") continue;
    const contentLines = token.content === "" ? 0 : token.content.split("\n").length - 1;
    if (token.map[1] - token.map[0] !== contentLines + 2) {
      onError({ lineNumber: token.map[0] + document.bodyOffset + 1, detail: "Unclosed fenced code block; explicit closing marker required" });
    }
  }
}

/**
 * bind public custom rules to the captured source context, not normalized params.lines.
 * @throws during execution when a document has no explicit context
 */
export function createRules(context) {
  const rule = (id, description, check, applicable) => ({
    names: [id], tags: ["agent-skills"], description, parser: "none",
    function(params, onError) {
      const document = context?.documents?.get(params.name);
      if (!document) throw new Error(`Missing source context: ${params.name}`);
      if (applicable(document)) check(document, onError);
    },
  });
  return [
    rule("AS001", "Agent skill frontmatter", frontmatter, (doc) => doc.kind === "skill"),
    rule("AS010", "Explicit fence closure", fences, (doc) => doc.kind !== "markdown"),
  ];
}

/** create the protected CLI2 options; these are not a guarantee without runner preflight and coverage. */
export function createConfiguration(context) {
  return {
    config: { default: false, AS001: true, AS010: true },
    customRules: createRules(context), frontMatter: "(?!)", noInlineConfig: true,
    fix: false, globs: [], ignores: [], gitignore: false, overrides: [], markdownItPlugins: [],
  };
}
