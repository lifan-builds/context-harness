---
name: context-upgrade
description: >
  Plan, implement, validate, and deploy context-harness source upgrades, local
  fleet refreshes, installed skill deployments, or explicit current-v3 layout
  repairs. Use when the user asks to upgrade context-harness itself, repair
  stale or partial context files, package lessons from an upgrade, or verify
  deployment targets.
disable-model-invocation: true
user-invocable: true
---

# Context Upgrade

Upgrade and layout-repair work is a controlled operator workflow. It must be invoked
explicitly by the user when context-harness itself has an update, a local fleet
refresh is requested, installed copies need validation, or a current-v3 layout
needs repair. Do not invoke implicitly just because a repo contains
context-harness files.

Prefer model-led edits, explicit verification, and conservative deployment over
broad rewrites.

## Start

1. Read the target repo's `NOW.md`, then relevant `CONTEXT.md` sections,
   especially `## Operating Constraints`, `## Workflow`,
   `## Relationships`, and `## Learned Patterns`.
2. Read `PLAN.md` when it contains migration findings, decisions, skipped
   repos, or previous verification output.
3. Identify the upgrade scope:
   - canonical source repo only
   - one target project
   - local project fleet refresh
   - installed skill deployment targets
   - current-v3 layout repair
4. Inspect the current worktree before edits. Treat unrelated changes as user
   work and do not revert them.

## Upgrade Principles

- Keep `AGENTS.md` small: activation contract plus generated `CONTEXT.md`
  index. Do not duplicate durable context there.
- Preserve project-specific context. Replace only stale harness boilerplate,
  schema markers, generated index blocks, and runtime scripts that are meant to
  be managed.
- Prefer model-led edits over blanket migration scripts when local conventions
  may matter. Use scripts for detection, dry runs, refreshes, and repeatable
  mechanical changes.
- Skip dirty target repos by default. Include dirty repos only when the user
  explicitly asks, then inspect changes and work with them.
- Keep the preferred skill set small. Add or split a skill only when the
  invocation intent is genuinely different from existing skills.
- Modify canonical skill source in this repository. Treat installed copies and
  symlinked deployments as outputs unless the user explicitly asks for a local
  override.
- Route task-local findings and decisions to `PLAN.md`; durable upgrade lessons
  to `CONTEXT.md`; closeout state to `NOW.md`.

## Source Upgrade

When changing context-harness itself:

1. Define the user-visible behavior and compatibility target before editing.
2. Update the canonical skill files, templates, scripts, README text, and tests
   that directly support the behavior.
3. Keep the supported layout current-v3 only unless the user explicitly chooses
   a new schema.
4. If `CONTEXT.md` changed, run:

```bash
node scripts/context-index.js update
```

5. Verify source changes with:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

## Project Layout Repair

Use this only when the user explicitly asks to repair or refresh an existing
context-harness project. `context-init` is only for repositories with no
context-harness layout.

For a single repo or fleet refresh:

1. Inspect the current files and `git status` first. Treat unrelated changes as
   user work.
2. Preserve project-specific context. Replace only stale harness boilerplate,
   schema markers, generated index blocks, and runtime scripts that are meant to
   be managed.
3. For partial or custom contexts, make model-led edits instead of forcing a
   generated layout.
4. Refresh generated indexes and local runtime scripts when the repair requires
   it.
5. Re-run `node scripts/context-index.js check` in representative targets.

## Fleet Refresh Guardrails

For local fleet refreshes, inspect target repo status first and skip dirty repos by
default unless the user explicitly approves including them. Preserve
project-specific context; refresh only managed harness boilerplate, runtime
scripts, generated indexes, and schema markers that are in scope. Run
`node scripts/context-index.js update` and `node scripts/context-index.js check`
in updated targets or representative batches, track skipped/failed repos in
`PLAN.md`, and do not let fleet refresh work replace the target project's actual
product task.

## Deployment

After canonical source changes that should affect local harnesses:

1. Deploy through the user's normal deployment layer. In this repo, local
   deployment is usually via agent-nexus:

```bash
nexus sync --yes
nexus doctor
```

2. Verify representative installed copies or symlinks when frontmatter,
   invocability, hook behavior, or skill routing changed.
3. Tell the user when IDEs or agent hosts need restarting to pick up new
   frontmatter or skill metadata.

## Closeout

Before finishing:

1. Summarize source files changed, target projects repaired/refreshed, skipped repos, and
   any deployment targets updated.
2. Record remaining fleet cleanup or unsupported targets in `PLAN.md`.
3. Promote only durable lessons to `CONTEXT.md`.
4. Update `NOW.md` with current focus, blockers, next step, timestamp, and
   touched files.
5. If the update made future catch-up materially easier through consolidation,
   use `context-maintain` Dream/Compact rules and log only actual edits.

Never store raw transcripts, secrets, raw API/web output, or bulky migration
logs in context files.
