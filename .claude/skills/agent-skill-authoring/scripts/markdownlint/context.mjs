import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import MarkdownIt from "markdown-it";

/** split only a leading, explicitly closed YAML block, retaining original offsets. */
function frontmatter(raw) {
  const lines = raw.match(/[^\r\n]*(?:\r\n|\r|\n|$)/g).filter(Boolean);
  if (!/^\uFEFF?---[ \t]*(?:\r\n|\r|\n)$/.test(lines[0] ?? "")) return null;
  let end = lines.findIndex((line, i) => i > 0 && /^---[ \t]*(?:\r\n|\r|\n)?$/.test(line));
  if (end === -1) return null;
  const boundary = lines.slice(0, end + 1).join("").length;
  return {
    source: lines.slice(1, end).join(""),
    body: raw.slice(boundary),
    bodyOffset: end + 1,
  };
}

/**
 * capture explicit skill/collection inputs and optional focused files.
 * files inside declared roots select a partial document set; other files get standard checks only.
 * @throws on empty inputs, missing parents, unreadable files, invalid UTF-8, directory cycles or escaping reference directories
 */
export async function createContext({ skills = [], collections = [], files = [] } = {}) {
  const roots = [...skills.map(resolvePath), ...collections.map(resolvePath)];
  const skillDirs = new Set(skills.map(resolvePath));
  for (const root of collections.map(resolvePath)) {
    const entries = await readdir(root);
    let count = 0;
    for (const entry of entries.sort()) {
      const path = join(root, entry);
      if ((await stat(path)).isDirectory()) {
        skillDirs.add(path);
        count++;
      }
    }
    if (!count) throw new Error(`Empty skill collection: ${root}`);
  }
  const documents = new Map();
  const identities = new Map();
  const parser = new MarkdownIt({ html: true });

  /** capture the bytes once; the parser-only newline prevents loss of empty final container lines. */
  async function add(path, kind, skillDir) {
    if (documents.has(path)) return;
    const identity = await realpath(path);
    const bytes = await readFile(path);
    const raw = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    const block = kind === "skill" ? frontmatter(raw) : null;
    const body = block?.body ?? raw;
    const normalized = body.replace(/\r\n?/g, "\n");
    documents.set(path, {
      path, kind, skillDir, raw, bytes, frontmatter: block,
      bodyOffset: block?.bodyOffset ?? 0,
      tokens: parser.parse(normalized.endsWith("\n") ? normalized : `${normalized}\n`, {}),
    });
    if (!identities.has(identity) || kind === "skill") identities.set(identity, path);
  }

  /** follow internal directory links only; file aliases keep their explicit inventory kind. */
  async function references(dir, skillDir, skillRoot, ancestors = new Set()) {
    const actual = await realpath(dir);
    const target = relative(skillRoot, actual);
    if (target === ".." || target.startsWith(`..${sep}`) || isAbsolute(target)) {
      throw new Error(`Reference directory escapes skill root: ${dir}`);
    }
    if (ancestors.has(actual)) throw new Error(`Reference directory cycle: ${dir}`);
    const next = new Set([...ancestors, actual]);
    for (const name of (await readdir(dir)).sort()) {
      const path = join(dir, name);
      const entry = await stat(path);
      if (entry.isDirectory()) await references(path, skillDir, skillRoot, next);
      else if (entry.isFile() && name.endsWith(".md")) await add(path, "reference", skillDir);
    }
  }

  for (const dir of skillDirs) {
    if (!(await stat(dir)).isDirectory()) throw new Error(`Not a skill directory: ${dir}`);
    await add(join(dir, "SKILL.md"), "skill", dir);
    const refDir = join(dir, "references");
    let info;
    try { info = await stat(refDir); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    if (info) {
      if (!info.isDirectory()) throw new Error(`Not a references directory: ${refDir}`);
      await references(refDir, dir, await realpath(dir));
    }
  }
  const selected = [];
  for (const file of files.map(resolvePath)) {
    const path = documents.has(file) ? file : identities.get(await realpath(file)) ?? file;
    selected.push(path);
    if (!documents.has(path)) {
      if (!path.endsWith(".md")) throw new Error(`Not a Markdown file: ${path}`);
      await add(path, "markdown", null);
    }
  }
  if (selected.length) {
    for (const path of documents.keys()) if (!selected.includes(path)) documents.delete(path);
  }
  if (!documents.size) throw new Error("No documents selected; provide explicit skill or collection roots or files.");
  return { roots, skillDirs: [...skillDirs], documents, partial: selected.length > 0 };
}

const resolvePath = (path) => resolve(path);
