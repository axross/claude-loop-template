import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";
import parseLicense from "spdx-expression-parse";
import { parseFragment } from "parse5";
import { parseDocument, isAlias, isMap, LineCounter } from "yaml";

const markdown = new MarkdownIt({ html: true }).use(footnote);
const external = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** collect concept path fields and the root license file with their YAML use sites. */
function readPathFields(meta, syntax, lineCounter, markerKey, wholeRoot) {
  const links = [];
  /** retain local path fields separately from links that an index can use for navigation. */
  function add(keys, target, error) {
    if (typeof target !== "string") return;
    if (!error && (!target || external.test(target))) return;
    // §5.1 also permits a human-readable population descriptor here.
    // spaces in a URI reference must be percent-encoded.
    if (keys[0] === "sources" && /\s/.test(target)) return;
    // an alias of an entire source list has one use site for all its paths.
    let node = syntax;
    for (const key of keys) {
      if (isAlias(node)) break;
      const child = node.get?.(key, true);
      if (!child) break;
      node = child;
    }
    const line = 1 + lineCounter.linePos(node.range[0]).line;
    links.push({ target, line, field: keys.join("."), error });
  }
  const license = meta.get("license");
  if (markerKey === "okf_version" && typeof license === "string") {
    try {
      parseLicense(license);
    } catch {
      const error =
        !license.trim() || external.test(license.trim())
          ? "must name an SPDX expression or a file in the bundle"
          : undefined;
      add(["license"], license, error);
    }
  }
  if (markerKey !== "type" || (!wholeRoot && !meta.has("type"))) return links;
  for (const key of ["resource", "computation", "superseded_by"])
    add([key], meta.get(key));
  for (const key of ["executor", "attester"])
    add([key, "resource"], meta.get(key)?.get?.("resource"));
  const sources = meta.get("sources");
  if (Array.isArray(sources)) {
    sources.forEach((source, i) =>
      add(["sources", i, "resource"], source?.get?.("resource")),
    );
  } else if (sources instanceof Map) {
    add(["sources", "resource"], sources.get("resource"));
  }
  return links;
}

/**
 * collect rendered anchors, including generated footnotes, and map active
 * authored links back to their Markdown or HTML source lines.
 */
function collectNavigation(tokens, env, fragments, anchors, links) {
  const sources = new Map();
  let shift = 0;
  const rendered = markdown.renderer.render(tokens, markdown.options, env);
  const html = rendered.replace(/\0(\d+)\0/g, (marker, id, position) => {
    const fragment = fragments[id];
    let line = fragment.line;
    for (const match of fragment.content.matchAll(/[<\n]/g)) {
      if (match[0] === "\n") line++;
      else
        sources.set(position + shift + match.index, {
          line,
          html: fragment.html,
        });
    }
    shift += fragment.content.length - marker.length;
    return fragment.content;
  });

  const pending = [parseFragment(html, { sourceCodeLocationInfo: true })];
  while (pending.length) {
    const element = pending.pop();
    const source = sources.get(
      element.sourceCodeLocation?.startTag?.startOffset,
    );
    for (const { name, value } of element.attrs ?? []) {
      if (name === "id" || (element.tagName === "a" && name === "name"))
        anchors.add(value);
      const image = element.tagName === "img" && name === "src";
      if (source && (image || (element.tagName === "a" && name === "href"))) {
        const target = value.trim();
        if (target && !external.test(target))
          links.push({ target, ...source, image });
      }
    }
    for (const child of element.childNodes ?? []) pending.push(child);
  }
}

/**
 * read OKF metadata, navigation targets and anchor IDs from one Markdown page.
 * malformed frontmatter is returned as a diagnostic alongside the rendered body.
 */
export function readMarkdown(text, markerKey, { wholeRoot = false } = {}) {
  const header = text.match(/^---\r?\n([\s\S]*?)^---\r?$(?:\n|$)/m);
  let meta, metadataError;
  let links = [];
  const lineCounter = new LineCounter();
  let body = text;
  if (header?.index === 0) {
    const yaml = parseDocument(header[1], { schema: "core", lineCounter });
    metadataError = yaml.errors[0]?.message ?? yaml.warnings[0]?.message;
    if (!isMap(yaml.contents))
      metadataError ??= "frontmatter must be a mapping";
    if (isMap(yaml.contents) && !metadataError) {
      try {
        meta = yaml.toJS({ mapAsMap: true, maxAliasCount: 100 });
        links = readPathFields(
          meta,
          yaml.contents,
          lineCounter,
          markerKey,
          wholeRoot,
        );
      } catch (error) {
        metadataError = error.message;
      }
    }
    body = text.slice(header[0].length);
  } else if (/^---[ \t]*\r?\n/.test(text)) {
    metadataError = "frontmatter requires exact --- opening and closing lines";
  }
  const offset =
    text.slice(0, text.length - body.length).split("\n").length - 1;
  const env = {};
  const tokens = markdown.parse(body, env);
  const headings = [],
    anchors = new Set();
  const fragments = [];
  let tableRowStart;
  for (const [i, token] of tokens.entries()) {
    if (token.type === "heading_open") {
      const label = tokens[i + 1].children
        .filter((t) =>
          ["text", "code_inline", "image", "softbreak"].includes(t.type),
        )
        .map((t) => (t.type === "softbreak" ? " " : t.content))
        .join("");
      headings.push({ level: Number(token.tag.slice(1)), text: label });
      // GitHub-style heading IDs preserve underscores, hyphens and Unicode letters.
      const base = label
        .toLowerCase()
        .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, "")
        .replace(/ /g, "-");
      let anchor = base,
        suffix = 0;
      while (anchors.has(anchor)) anchor = base + "-" + ++suffix;
      anchors.add(anchor);
    }
    // markdown-it maps table rows to source lines but omits maps on their cells.
    if (token.type === "tr_open") tableRowStart = token.map[0];
    if (token.type === "tr_close") tableRowStart = undefined;
    let line = offset + (token.map?.[0] ?? tableRowStart ?? 0) + 1;
    for (const child of token.children ?? [token]) {
      const html = child.type === "html_inline" || child.type === "html_block";
      if (html || child.type === "link_open" || child.type === "image") {
        // each placeholder stands for one unmodified source tag/block or the
        // exact tag markdown-it would render for this link/image. input NULs
        // are normalized by markdown-it, so authors cannot forge a marker.
        const content = html
          ? child.content
          : markdown.renderer.renderInline([child], markdown.options, env);
        if (!html) child.type = "html_inline";
        child.content = `\0${fragments.length}\0`;
        fragments.push({ content, line, html });
        if (html) line += content.split("\n").length - 1;
      } else if (child.type === "softbreak" || child.type === "hardbreak") {
        line++;
      }
    }
  }
  collectNavigation(tokens, env, fragments, anchors, links);
  return {
    meta,
    metadataError,
    links,
    anchors,
    headings,
  };
}
