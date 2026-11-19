# Body Integrity

Apply this reference before replacing a GitHub body, comparing its identity, or diagnosing damaged text. Readability does not establish stored-byte fidelity.

## Protect the Whole Body

A body edit replaces the entire body. A sanitized read can lose content silently through these stages:

1. Tags and HTML comments disappear, including state blocks and `<details>` wrappers. Angle-bracket placeholders can also disappear inside code spans.
2. HTML character references decode, so `&#x27;` and a literal apostrophe become indistinguishable.
3. Five characters are escaped again: `&`, `<`, `>`, `"`, and `'`.

Reversing the last stage improves legibility but cannot recover the first two. A repair based on that text can corrupt a body that was intact all along.

**Guidelines:**

- MUST obtain the full, byte-faithful current body before replacing an existing body, and preserve content outside the intended edit. A narrowed excerpt cannot reconstruct omitted text.
- MUST NOT round-trip a sanitized read. Compose a new body's content directly, or recover the existing body's stored bytes before editing it.
- MUST confirm stored content before reporting or repairing corruption. A rendered page can corroborate visible content, but is not proof of byte identity.
- MAY use [decode-sanitized-read.mjs](../scripts/decode-sanitized-read.mjs) to reverse the five escapes for reading when a faithful re-fetch is unavailable.
- MUST NOT write decoded output back as stored bytes or use it to claim a plan identity survived.
- SHOULD append a comment instead of replacing a body when project delivery permits either; follow its required storage location when it specifies one.

## Obtain and Compare Stored Bytes

If the sanctioned channel cannot supply the needed fidelity, qualify another read route under [channel-selection.md](./channel-selection.md). Candidate routes serve different materials:

| Candidate                              | Material it can serve                                   | Limitation                                                  |
| -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| Repository REST endpoints              | Stored bodies, comments, and titles                     | Current authentication and harness restrictions still apply |
| Git                                    | Refs, commits, trees, and blobs, including PR head refs | No issue bodies, comments, or reviews                       |
| Raw-content or archive host            | A committed file or tree at a ref                       | No uncommitted content or issue bodies                      |
| PR diff or patch URL                   | Diff; patch commit messages and authors                 | Not the PR description                                      |
| Rendered issue page's embedded payload | Stored body and comments when present                   | Undocumented shape; last resort                             |

The original evidence for these candidates was unauthenticated public-repository reads, not private access or writes. A route that worked then is only a candidate now. Git and content hosts can be addressed by a content revision; body endpoints need the comparison discipline below.

An extractor often adds a newline and shell command substitution strips trailing newlines. Comparing either stdout with a stored field can report a false mismatch or hide one. HTML-entity decoding used by a change loop for plan identity is a separate, consumer-owned rule, not transport normalization.

**Guidelines:**

- MUST establish the route's current access and fidelity before relying on it; a past success or failure does not settle this session's case.
- MUST compare exact structured response fields with the intended text, not an extractor's stdout or a shell capture, without whitespace or line-ending normalization.
- MUST re-read the current body before replacement and reconcile any intervening change rather than overwriting another actor's work.
- MUST apply [publication-and-recovery.md](./publication-and-recovery.md) to read back a body write; if fidelity cannot be established, report an unverified result rather than success.

## Attach Images and Videos

An `--attach` write, once [qualified](./channel-selection.md#qualify-attachment-uploads), treats the body by subcommand. `create` takes the body composed directly. `edit` with a body file replaces the body with that file. `edit` without a body flag keeps the stored body and appends the attachments. A visual that belongs beside specific content, such as an acceptance criterion, is written there as a relative reference, which `--attach` rewrites to the uploaded `user-attachments` URL; an attachment with no reference is appended to the end of the body, so leave it to a comment instead.

**Guidelines:**

- MUST build the body file for an `edit` from the byte-faithful stored body, not from a sanitized read.
- SHOULD place a visual that belongs beside specific content as a relative reference in the body, and attach unreferenced visuals in a comment rather than appended to the body.
- MUST NOT attach into a body that holds a canonical plan, whose identity a change loop derives from its stored bytes: a rewrite or append changes the plan. Attach in a comment instead.
- MUST re-read the stored body after any `--attach` write under the comparison rules above, and accept as differences only the relative-reference to `user-attachments` URL rewrites and the appended attachments.
