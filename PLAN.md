# Plan

## Findings
- Codex supports hooks through `~/.codex/config.toml` and project-level `.codex/config.toml`.
- Codex hook events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, and `Stop`.
- Plugin-provided hooks are supported in plugin manifests, but currently require `experimental_use_rmcp_client = true` and `experimental_plugin_hooks = true`.
- Context-harness should prefer hooks for reminders, guardrails, and closeout prompts, while keeping skills as the manual entry points.
- 2026-06-23 local Codex inspection: active hooks are correctly installed in `~/.codex/hooks.json` by agent-nexus and call the JS dispatcher; agent-nexus is the deployment layer. The active cached `lifan-builds/context-harness` dispatcher is older than the working-tree `scripts/codex-context-hook.js`, which has newer v2/v3 schema detection.
- `AGENTS.md` should remain the automatic activation layer, but its durable-context content should be a generated high-level index into `CONTEXT.md`, not a duplicate of full context.
- Research scan for self-improving skills: strongest adjacent patterns are Reflexion-style verbal feedback, Self-Refine/GEPA-style artifact optimization, Voyager/AutoSkill-style skill libraries, Toolformer/LATM-style tool creation, and SkillOps-style lifecycle management.
- For context-harness, the practical direction is not autonomous rewriting of skills after every run; use evidence-gated improvement with telemetry/findings, eval checks, human review for `SKILL.md` changes, and lifecycle states for skill artifacts.
- SkillOpt source-code scan: its trainer uses six stages (`rollout`, `reflect`, `aggregate`, `select`, `update`, `evaluate`) and persists `history.json`, `runtime_state.json`, `best_skill.md`, per-step `candidate_skill.md`, `merged_patch.json`, `ranked_edits.json`, and edit-apply reports.
- SkillOpt represents edits as structured operations (`append`, `insert_after`, `replace`, `delete`) with `target`, `content`, `support_count`, and `source_type`; this maps well to a small context-harness proposal format instead of full-file rewrites.
- SkillOpt's validation gate is intentionally pure: accept only when candidate score beats the current score, track a separate best skill, and let the trainer handle persistence. Context-harness should borrow that separation for user-approved skill updates.
- SkillOpt protects managed regions and tracks rejected edits/failure patterns in a step buffer so the optimizer avoids repeating bad patches; context-harness can approximate this with `PLAN.md` candidate status and rejected-patch notes before adding a script.
- Token scan: the always-read surface is already small; low-risk savings came from compacting generated `AGENTS.md` index text, Codex hook nudges, and repeated prose in `context-maintain` rather than weakening behavioral rules.
- Claude/Anthropic public memory docs emphasize a layered memory hierarchy: enterprise policy, project memory, user memory, local project memory, and imported files, with more-specific memories taking precedence and `CLAUDE.md` kept concise and human-editable.
- Claude Code's documented auto-memory flow updates `CLAUDE.md` in the background by default and asks for approval when configured, but the useful transferable pattern is evidence-gated consolidation, not automatic unrestricted rewriting.
- Managed Agents "Dreams" describe an asynchronous post-task consolidation pass over session data that writes concise, verifiable memory updates to memory stores; this maps to context-harness session closeout better than live prompt-time memory mutation.
- Managed Agents memory guidance favors a small set of structured markdown memory files, explicit task instructions about when/how to search and update memory, no secrets, and periodic cleanup of stale or duplicate entries.
- For context-harness, the strongest applicable pattern is a `context-maintain` dream/compact pass: after substantial work, review session findings, propose durable `CONTEXT.md` deltas or task-local `PLAN.md` deltas, refresh `AGENTS.md` index, and update `NOW.md`.
- For indexing, context-harness already has the right primitive in `scripts/context-index.js`; the likely next improvement is richer section metadata and queryable summaries, not vector search or hidden memory stores.
- Follow-up research boundary: do not inspect leaked proprietary Claude Code source directly even with user permission; use official docs plus public commentary/videos/posts and clearly label secondary evidence.
- Public commentary around Claude Code's auto memory describes a two-tier project memory: a concise root index and topic/detail files, with the agent deciding when to search deeper. This reinforces `AGENTS.md` as a startup index and argues against loading all durable context by default.
- For context-harness skill design, the high-leverage patch candidate is adding a `Dream Mode` subsection to `context-maintain`: trigger, inputs, consolidation rubric, output routing, verification, and explicit no-secrets/no-raw-transcripts guardrails.
- 2026-06-09 research scan: AGENTS.md best practice is converging on concise, repo-local instructions with setup/test/security commands, not broad process frameworks; context-harness already matches this with a small AGENTS contract and generated CONTEXT index.
- Recent AGENTS.md efficiency research is mixed: helpful instructions can lower exploration and cost, while verbose or generic repository context can increase cost. This argues for pruning generic Objectives/eval-loop surface instead of adding more default rules.
- The current eval-loop is wired into the public surface: README, root SKILL.md, context-init, install-project.js, scripts/eval-loop.js, and tests. Deprecating it should remove it from default generation/install/docs while leaving a migration path for existing users.
- Keep verification as a first-class habit, but route it to task-local done criteria and project workflow checks rather than persistent "3 Objectives" in every CONTEXT.md.
- 2026-06-23 local adoption scan found 24 root project context footprints under `/Users/lfan/Project`: 10 schema v3, 9 schema v2, 1 legacy marker, and 4 partial/non-harness contexts.
- The strongest local uses are continuity-heavy projects where `NOW.md` carries the live resume state, `CONTEXT.md` captures durable rules/relationships, and `PLAN.md` carries task-local evidence and decisions across multi-session work.
- The weakest local uses are oversized `NOW.md` files (`seasonal-arpg-engine`, `baby`, `sellbig`, `awareness`) and archive-like `PLAN.md` files (`moonshot`, `agent-guild`, `awareness`, `flyingpig`, `wishlist`) where agents must read too much before acting.
- Several high-stakes or personal-operation repos (`baby`, `seasonal-arpg-engine`, `xianyu`, `nitan-pod`, `self-promoting`) skip `PLAN.md`, which makes `NOW.md` absorb detailed evidence, blockers, and next actions that should be split into current-state vs support notes.
- Recent local git history shows context files are genuinely used, not just installed: since 2026-06-01, context commits appeared in `baby`, `credit-card-tracker`, `moonshot`, `mychart-cli`, `seasonal-arpg-engine`, and `context-harness`; multiple other repos carry uncommitted context updates.
- Online research scan: public practice around `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` is converging on concise repo instructions plus separate task/memory files, lifecycle hooks for enforcement, reusable skills for workflows, subagents for isolated exploration, and explicit compaction/retrospective steps for long sessions.
- Public community discussion shows a recurring taxonomy gap: users confuse project instructions, memory files, skills, hooks, plugins, and subagents. Context-harness should make these boundaries explicit in its own docs and generated comments.
- GitHub search on 2026-06-23 shows fast growth of `AGENTS.md` utilities, generators, rule kits, and portable cross-agent config repos, but many appear template-heavy; context-harness should differentiate by staying evidence-driven and health-checkable rather than becoming another rules dump.
- 2026-06-23 dream-mechanism follow-up: public Claude Code docs describe Auto Memory as model-decided, future-usefulness-based memory consolidation, stored in visible markdown under `~/.claude/projects/<project>/memory/` with a concise `MEMORY.md` entrypoint and topic files loaded on demand.
- Public reporting/analysis around Anthropic "dreaming" frames it as asynchronous post-task learning/consolidation: agents review past work, extract reusable lessons, and improve future behavior without being in the critical path of task execution.
- The useful context-harness adaptation is soft automatic consolidation inside `context-maintain`: after context updates or closeout, decide whether a dream pass is useful from semantic signals such as completed work, stale blockers, repeated findings, conflicts, or overloaded active state. Avoid hard line-count triggers as the primary mechanism.
- Research boundary: do not inspect leaked/proprietary Claude Code source for dream internals; rely on public docs, public reporting, and community commentary.

## Decisions
- Recommendation candidate: deprecate the 3 Objectives/eval-loop framework from the preferred context-harness path. Replace it with a lean `Verification` note in `CONTEXT.md#Workflow` and task-specific done criteria in `PLAN.md` or `context-launch`.
- Recommendation candidate: keep `AGENTS.md` as contract plus index only; avoid adding auto-loaded summaries, vector stores, or hidden memory. Add richer context-index metadata only if it helps agents choose which section to open.
- Recommendation candidate: make optional scripts truly optional in default install. `eval-loop.js` should become legacy/optional; consider whether `adr.js` should also stop installing by default because ADRs are not required for ordinary capture.
- 2026-06-09 deeper scan: Anthropic's "Building Effective Agents" reinforces simple composable patterns over framework complexity; for context-harness this supports improving `context-maintain` and install profiles instead of adding new companion skills.
- 2026-06-09 deeper scan: Claude Code memory docs support a hierarchy of concise human-editable memory files and imports; context-harness should keep `CONTEXT.md` as durable truth and add optional detail maps only when a single file becomes ambiguous.
- 2026-06-09 deeper scan: OpenAI agent-eval guidance and agent-harness research support traceable verification evidence, but they do not support a generic project-wide 3-objective loop as a default context primitive.
- 2026-06-09 deeper repo scan: root `SKILL.md` is 299 lines, default install copies 11 scripts, and the docs still present `eval-loop.js` and `adr.js` as normal companion scripts despite the repo's lean/default-optional direction.
- Recommendation candidate: add a small harness-health check, preferably as `context-index.js check` rather than a new script, to validate schema marker, stale AGENTS index, `NOW.md` length, and oversized `PLAN.md`.
- Recommendation candidate: add `Done Criteria` and `Verification` to the optional `PLAN.md` template so eval discipline moves into task-local state instead of durable project Objectives.
- Recommendation candidate: keep Dream/Compact mode inside `context-maintain`, focused on post-task consolidation: prune stale task notes, propose durable deltas, record verification evidence, and avoid secrets/raw transcripts.
- 2026-06-23 decision: deprecate `context-grill` as a separate workflow; keep a non-invocable compatibility stub and move plan pressure-testing into `context-maintain` Plan Stress-Test.
- Recommendation candidate: add a `context-index.js audit --root <dir>` report for local fleets that classifies schema, stale indexes, missing files, oversized `NOW.md` / `PLAN.md`, and pending migrations without modifying repos.
- Recommendation candidate: add explicit size and routing guidance to `context-maintain`: `NOW.md` should stay a short resume packet, `PLAN.md` should be active evidence not a historical archive, and detailed dossiers should move into domain docs with links from `CONTEXT.md`.
- Recommendation candidate: document the taxonomy boundary plainly: `AGENTS.md` = activation contract and index, `CONTEXT.md` = durable project memory, `NOW.md` = current resume state, `PLAN.md` = active task evidence/decisions, hooks = nudges/enforcement, skills = reusable workflows.
- Recommendation candidate: revise Dream/Compact Mode to be automatic-by-default inside `context-maintain`, but explain that "automatic" means model judgment after maintenance events, not a script-backed counter or fixed threshold.
- 2026-06-23 Dream design decision: implement Dream as an automatic semantic check inside every `context-maintain` run; if useful, edit context directly and log a short intent entry to lazily created `.context-harness/DREAM.md`.
- 2026-06-23 Dream log decision: `.context-harness/DREAM.md` is audit-only, non-operational, intended to be tracked, and must never be read during normal catch-up or task work.

## Progress
- [x] Implemented schema v3 defaults: no generated Objectives, task-local Done Criteria, Workflow Verification, and schema v3 templates.
- [x] Soft-deprecated `eval-loop.js`: legacy profile only, kept tests for existing Objective repos.
- [x] Added `context-index.js check` and `scripts/migrate-project.js` for batch schema v2 migration.
- [x] Added Dream/Compact mode to `context-maintain`.
- [x] Deprecated `context-grill` and moved useful pressure-testing behavior into `context-maintain`.
- [x] Batch migrated 7 clean local project repos under `/Users/lfan/Project`: `agent`, `awareness`, `credit-card-tracker`, `ergatta`, `med-context`, `self-promoting`, and `xianyu`.
- [x] Deployed local context-harness v3 patch with agent-nexus to Claude, Cursor, Antigravity, and Codex.
- [x] Re-deployed the local working tree through agent-nexus; managed `context-grill` symlinks now resolve to `/Users/lfan/Project/context-harness/context-grill`.
- [x] Completed 2026-06-23 local-plus-online research pass on real project usage and current public context-harness-adjacent patterns.
- [x] Implemented automatic Dream/Compact guidance in `context-maintain`, root docs, README, generator prompt text, and line-count warning behavior.

## Follow-Ups
- Dirty repos were skipped by default and still have pending v3 migrations: `agent-guild`, `agent-nexus`, `baby`, `flyingpig`, `hoa-assessment-challenge`, `moonshot`, `resume`, `seasonal-arpg-engine`, and `wishlist`.
- Unsupported or legacy-marker-missing repos were skipped: `deal`, `nitan-pod`, `sellbig`, and `snow-plan`.
- Post-migration checks found pre-existing cleanup needs: `agent` is missing `Language` and `Flagged Ambiguities`; `awareness`, `ergatta`, `med-context`, and `xianyu` have oversized `NOW.md` or `PLAN.md`.
- Restart AI IDEs to pick up the redeployed skill frontmatter.
- Consider a fleet cleanup pass for dirty/pending repos and a separate compaction pass for oversized `NOW.md` / `PLAN.md` files before adding new harness features.

## Verification
- `tests/run-all.sh` exits 0: 173 passed, 0 failed.
- `node scripts/context-index.js check` exits 0.
- `node scripts/migrate-project.js --root /Users/lfan/Project --include-dirty` confirms the migrated repos and `context-harness` are up to date; remaining dirty repos are pending by policy.
- `nexus sync --yes` exits 0 and deploys 14 skills to Claude, Cursor, Antigravity, and Codex.
- `nexus doctor` exits 0; all four targets report 14 skill symlinks and Codex has 3 hook entries.
- Installed `context-grill` frontmatter under `/Users/lfan/.codex/skills/context-grill/SKILL.md` has `user-invocable: false`, and all four managed `context-grill` symlinks resolve to `/Users/lfan/Project/context-harness/context-grill`.
- 2026-06-23 research verification: local scan used read-only filesystem inventory and git history; online scan used `agent-reach doctor`, GitHub search, Reddit search, and official/web sources. Twitter search failed with an HTTP 404 and was not used as evidence.
- 2026-06-23 Dream patch verification: `node scripts/context-index.js check` exits 0; `tests/run-all.sh` exits 0 with 178 passed, 0 failed.
