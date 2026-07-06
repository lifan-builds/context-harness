---
name: context-upgrade
description: >
  Plan, implement, validate, and deploy context-harness upgrades or migrations
  across the canonical source repo, installed skill copies, or a local fleet of
  project contexts. Use when the user asks to upgrade context-harness itself,
  migrate projects between schema versions, package lessons from a migration,
  harden compatibility behavior, or repeat a previous context-harness
  upgrade/migration safely.
disable-model-invocation: true
user-invocable: true
---

# Context Upgrade

Upgrade/migration work is a controlled operator workflow. It must be invoked
explicitly by the user when context-harness itself has an update, a schema
migration is needed, or a local fleet migration is requested. Do not invoke
implicitly just because a repo contains context-harness files.

Prefer model-led edits, schema-aware scripts, explicit verification, and
conservative deployment over broad rewrites.

## Start

1. Read the target repo's `NOW.md`, then relevant `CONTEXT.md` sections,
   especially `## Operating Constraints` (or legacy `## Rules`), `## Workflow`,
   `## Relationships`, and `## Learned Patterns`.
2. Read `PLAN.md` when it contains migration findings, decisions, skipped
   repos, or previous verification output.
3. Identify the upgrade scope:
   - canonical source repo only
   - one target project
   - local project fleet
   - installed skill deployment targets
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
3. Preserve backward compatibility for older schemas where reasonable.
   Prefer explicit schema markers and compatibility branches over guessing.
4. Keep legacy tooling available only when it has existing users, and mark it
   as legacy instead of leaving it on the preferred path.
5. If `CONTEXT.md` changed, run:

```bash
node scripts/context-index.js update
```

6. Verify source changes with:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

## Project Migration

Use this for all context-harness migration work: legacy v1 files, schema v2 to
v3, partial layouts, custom local contexts, and fleet migrations. `context-init`
is only for fresh repositories.

For a single repo or fleet migration:

1. Run a dry-run inventory first:

```bash
node scripts/migrate-project.js --root <path>
```

2. Classify each target as clean, dirty, unsupported, partial, or already
   current.
3. For dirty repos, skip unless requested. If included, inspect `git status`
   and avoid overwriting unrelated user changes.
4. For partial or custom contexts, inspect files and make model-led edits
   instead of forcing a generated layout.
5. For legacy v1 layouts without `CONTEXT.md`, model-led migrate durable
   learned patterns, active plan/findings state, user rules, workflow checks,
   and old agent instructions into the v3 `AGENTS.md`, `CONTEXT.md`, `NOW.md`,
   and optional `PLAN.md` shape.
6. Apply the migration only after the dry-run result is understood:

```bash
node scripts/migrate-project.js --root <path> --write
```

7. Use `--include-dirty` only after explicit user direction.
8. In each migrated repo, refresh the generated index and install/update local
   runtime scripts when the migration requires it.
9. Re-run dry-run with the same root to confirm remaining skips are expected:

```bash
node scripts/migrate-project.js --root <path> --include-dirty
```

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

1. Summarize source files changed, target projects migrated, skipped repos, and
   any deployment targets updated.
2. Record remaining fleet cleanup or unsupported targets in `PLAN.md`.
3. Promote only durable lessons to `CONTEXT.md`.
4. Update `NOW.md` with current focus, blockers, next step, timestamp, and
   touched files.
5. If the update made future catch-up materially easier through consolidation,
   use `context-maintain` Dream/Compact rules and log only actual edits.

Never store raw transcripts, secrets, raw API/web output, or bulky migration
logs in context files.
