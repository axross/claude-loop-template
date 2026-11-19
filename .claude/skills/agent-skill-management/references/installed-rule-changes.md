# Changes to installed rules

Use this reference when a loaded skill appears wrong, outdated, or silent
on the case in front of you, or conflicts with a project's chosen behavior.
For a distributable skill, feedback to the installation-source repository is
the preferred first step for a generalizable finding. A proposal can improve the
shared rule; a local exception addresses only the bounded case the human
actually accepted. Neither requires changing a generated installed copy.

## Route the finding, not an immediate edit

Establish the actual host-selected source using [active-loading.md](./active-loading.md)
before choosing a correction destination. A project lockfile cannot identify
another same-name skill selected by the host. If the selected source cannot be
established, report it as unknown rather than infer it from the project copy.

For a repository-local skill, [Repository-Local Skills](../SKILL.md#repository-local-skills)
owns the direct-edit workflow under applicable change gates; there is no install
lockfile or generated copy. For a distributable skill, resolve the source from
that installation's `skills-lock.json` or exposed source metadata and verify
whether you control it: an owned source is first-party; an outside source is
third-party. Its installed copy is generated, and the next install replaces a
direct edit. Ownership chooses where a correction belongs, not permission to
make it during the task that exposed the problem.

**Guidelines:**

- MUST verify a suspected defect against the selected skill's actual text before routing it; a rule already covering the case is not a missing rule.
- MUST route a verified finding by tier and source ownership rather than discard it or hand-edit a generated installed copy; when the source cannot be established, report that routing is blocked rather than choose a different same-name source.
- SHOULD recommend feedback to the installation-source repository first for a generalizable defect, using an existing matching request rather than duplicating it.
- MUST follow applicable change and approval gates before correcting an owned source; ownership alone does not require an immediate edit or authorize one. Once a distributable correction is approved, edit the source and regenerate the installation and lockfile under [Install and Refresh](../SKILL.md#distributable-skills-install-and-refresh).
- SHOULD record a project-only addition as a local convention, and treat a conflicting choice as a proposed deviation requiring the separate validity check below.
- MUST continue the exposing task under the applicable installed rules and any separately valid deviation, subject to the actual host's priority and tool restrictions. Filing a proposal alone never puts its proposed rule into force; if those constraints prevent continuing, report the blocker rather than assume an exception.
- SHOULD name filed or pending proposals in the completion report, keeping unresolved feedback visible without making publication a prerequisite for otherwise permitted work.

## Distinguish addition, exception, and proposal

These are different kinds of authority, not stages every finding must pass:

| Kind               | Meaning                                                                                      | What it does not establish                                       |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Local convention   | An additive, nonconflicting project rule                                                     | An exception to a conflicting installed rule                     |
| Approved deviation | A human-adopted, currently applicable exception to an identified rule within a bounded scope | A source change, host override, or permission outside that scope |
| Upstream proposal  | A source-change request not yet adopted into the applicable installed rules                  | Approval to act as though the proposed rule already applied      |

A pending proposal may coexist with a separately valid deviation. For example,
a human-approved exception in AGENTS.md can cover one component's measured
constraint while a general correction is proposed upstream. A draft paragraph
describing the same exception without human adoption does not authorize it.
An additional naming convention that conflicts with no rule needs no deviation.

**Guidelines:**

- MAY state a bounded exception in AGENTS.md or an existing governing project document; a dedicated register is not required.
- MUST identify the installed rule and its source/revision, concrete counterexample, alternative behavior, rationale, human adoption evidence, scope, and reassessment conditions in the exception record.
- MUST verify adoption from the actual human decision and its locator, including what was accepted and for which scope; the record's existence, an agent-authored assertion, or an upstream proposal is not adoption evidence by itself.
- MUST check the exception against the actual host's priority and tool restrictions using its entry or operations guidance. This skill defines no host precedence and cannot make a lower-priority exception override a host prohibition.
- MUST apply a deviation only while its adoption, scope, and assumptions remain valid. Unapproved, hypothetical, out-of-scope, expired, or resolved exceptions do not authorize departures.
- MUST reassess a deviation when installed rules, relevant assumptions, or its stated reassessment conditions change; stop relying on it when the conflict is resolved or its basis no longer holds.
- MUST keep exception adoption separate from authorization to post feedback or perform other effects. No exception record supplies that grant or waives applicable change, verification, or independent-review gates.

## Publish a third-party proposal only with permission

The third-party maintainer needs a request they can act on without access to
your project. Drafting that request is not publishing it under the human's
identity, and approval of a local exception is not approval of a public write.

**Guidelines:**

- MUST resolve the upstream repository from the installation source and search its issue tracker before filing; use an existing request that covers the finding rather than opening a duplicate.
- MUST obtain the human's go-ahead on a new issue's drafted title and body, or on the drafted comment body when adding feedback to an existing issue; a valid scoped grant covering that publication is sufficient. Apply the same public-write authorization check when the installation-source repository is first-party.
- MUST describe the skill and rule, the exposing situation, current and desired behavior, and why the defect generalizes beyond the project.
- MUST keep a third-party upstream proposal to an issue, not an upstream pull request.
- MUST report the finding and drafted request to the human when no reachable issue tracker resolves; never silently drop it or edit the installed copy instead.
- MUST pull an accepted upstream correction through installation or upgrade against its source, not by editing files under the skill root.
